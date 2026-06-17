"use client";

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { MapPin, Star, Clock, ArrowRight, Navigation, Award, TrendingUp, Zap, ShieldCheck, Search, Map, Shell, Tv } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Butcher, MeatItem } from '@/types';
import toast from 'react-hot-toast';

const ButcherMap = dynamic(() => import('@/components/ButcherMap'), { ssr: false, loading: () => <div className="w-full h-[400px] rounded-2xl bg-white/5 flex items-center justify-center text-white/30 text-sm">Loading map…</div> });

interface ButcherListProps {
    initialButchers: Butcher[];
    initialItems: MeatItem[];
}

interface EnrichedButcher extends Butcher {
    itemCount: number;
    distance: number;
    rating: string;
    deliveryTime: number;
    offer: string | null;
    is_busy?: boolean;
    active_orders?: number;
    hygiene_score?: number;
    average_rating?: number;
}

const FALLBACK_BUTCHER_IMG = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80';

export default function ButcherList({ initialButchers, initialItems }: ButcherListProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const query = searchParams.get('q');
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [selectedButcherId, setSelectedButcherId] = useState<number | null>(null);

    const getDistance = (bLat: number = 17.4944, bLng: number = 78.3908) => {
        if (!userLocation) return 999; // Unknown location — treat as very far
        const rad = Math.PI / 180;
        const dLat = (bLat - userLocation.lat) * rad;
        const dLng = (bLng - userLocation.lng) * rad;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(userLocation.lat * rad) * Math.cos(bLat * rad) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371 * c;
    };

    const handleLocate = () => {
        setIsLocating(true);
        if ('geolocation' in navigator) {
            const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 };

            const success = (pos: GeolocationPosition) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setIsLocating(false);
                toast.success("Location detected! Showing nearest shops.");
            };

            const error = (err: GeolocationPositionError) => {
                if (err.code === 3 && options.enableHighAccuracy) {
                    // If high accuracy times out, try one more time without it
                    console.log("High accuracy timeout, trying low accuracy...");
                    navigator.geolocation.getCurrentPosition(success, (secondErr) => {
                        console.error("Geolocation error (low accuracy):", secondErr);
                        setIsLocating(false);
                        toast.error("Could not detect precise location. Using default view.");
                    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
                } else {
                    console.error("Geolocation error:", err);
                    setIsLocating(false);
                    toast.error("Could not detect location. Using default view.");
                }
            };

            navigator.geolocation.getCurrentPosition(success, error, options);
        } else {
            setIsLocating(false);
            toast.error("Geolocation not supported by your browser.");
        }
    };

    React.useEffect(() => {
        // Automatically try to locate on mount
        handleLocate();
    }, []);

    const updateSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const filteredAndSortedButchers = useMemo(() => {
        let result = initialButchers;

        if (query) {
            const lowerQuery = query.toLowerCase();
            const matchingItemIds = initialItems
                .filter(item =>
                    item.name?.toLowerCase().includes(lowerQuery) ||
                    item.category?.toLowerCase().includes(lowerQuery)
                )
                .map(item => item.butcher);

            result = initialButchers.filter(butcher =>
                matchingItemIds.includes(butcher.id) ||
                butcher.shop_name?.toLowerCase().includes(lowerQuery) ||
                butcher.address?.toLowerCase().includes(lowerQuery)
            );
        }

        const withDetails: EnrichedButcher[] = result.map((butcher) => {
            const butcherItems = initialItems.filter(item => item.butcher === butcher.id);
            const lat = butcher.latitude || 17.4944;
            const lng = butcher.longitude || 78.3908;
            const distance = getDistance(lat, lng);

            return {
                ...butcher,
                itemCount: butcherItems.length,
                distance: distance,
                rating: butcher.average_rating ? butcher.average_rating.toFixed(1) : (butcher.is_official ? "4.8" : (4.2 + (Number(butcher.id) % 5) * 0.1).toFixed(1)),
                deliveryTime: butcher.is_official ? 20 : 25 + (Number(butcher.id) % 20),
                offer: butcher.is_official ? "EXTCLUSIVE" : ((Number(butcher.id) % 3 === 0) ? `${10 + (Number(butcher.id) % 20)}% OFF` : null),
                is_busy: butcher.is_busy,
                active_orders: butcher.active_orders,
                hygiene_score: butcher.hygiene_score
            };
        });

        return withDetails.sort((a, b) => {
            // When no location yet: sort by busy status (non-busy first), then official first
            if (!userLocation) {
                if (a.is_official && !b.is_official) return -1;
                if (!a.is_official && b.is_official) return 1;
                if (a.is_busy && !b.is_busy) return 1;
                if (!a.is_busy && b.is_busy) return -1;
                return 0;
            }

            const NEAREST_THRESHOLD = 5.0; // 5km neighborhood radius

            // Load Balancing: Add +0.5km logical penalty for busy shops
            // This makes a 1.95km-away busy shop appear "2.45km" effectively
            // So a 2.4km non-busy shop comes BEFORE it — correct behavior!
            const effectiveDistA = a.distance + (a.is_busy ? 0.5 : 0);
            const effectiveDistB = b.distance + (b.is_busy ? 0.5 : 0);

            const aIsNearest = a.distance <= NEAREST_THRESHOLD;
            const bIsNearest = b.distance <= NEAREST_THRESHOLD;

            // Group 1: Neighborhood shops first
            if (aIsNearest && !bIsNearest) return -1;
            if (!aIsNearest && bIsNearest) return 1;

            if (aIsNearest && bIsNearest) {
                // Within neighborhood: sort by effective distance (busy penalty applied)
                return effectiveDistA - effectiveDistB;
            }

            // Group 2: Farther shops — just sort by real distance
            return a.distance - b.distance;
        });
    }, [query, initialButchers, initialItems, userLocation]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Premium Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1920&q=80&sig=list_hero')] bg-cover bg-center opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl space-y-8">
                        {/* Clear Navigation Breadcrumb */}
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <span>→</span>
                            <span className="text-white font-bold">{query || 'All Shops'}</span>
                        </div>

                        {/* Main Heading with Clear Instruction */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-2 rounded-full">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span className="text-white text-xs font-black uppercase tracking-widest">
                                    Step 2: Choose Your Shop
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]">
                                {query ? (
                                    <>
                                        <span className="italic text-rose-500">{query}</span> Shops <br />
                                        Near You
                                    </>
                                ) : (
                                    <>Certified <br />Meat Shops</>
                                )}
                            </h1>

                            <p className="text-2xl text-slate-300 font-medium leading-relaxed">
                                {filteredAndSortedButchers.length} shops found. Click any card below to see their full menu.
                            </p>
                        </div>

                        {/* Location Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLocate}
                            disabled={isLocating}
                            className="inline-flex items-center gap-3 h-14 px-8 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 hover:text-white transition-all shadow-2xl disabled:opacity-50 group"
                        >
                            <Navigation className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                            {isLocating ? 'LOCATING...' : 'SORT BY DISTANCE'}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Shop Cards Grid - Premium with Animations */}
            <div className="container mx-auto px-4 py-16">

                {/* Controls row: Categories + Map Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex flex-wrap justify-center gap-3">
                        {['ALL', 'CHICKEN', 'MUTTON', 'FISH', 'PET', 'GYM'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => updateSearch(cat === 'ALL' ? '' : cat)}
                                className={`h-12 px-8 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all uppercase ${(query === cat || (cat === 'ALL' && !query))
                                    ? 'bg-rose-600 text-white shadow-xl shadow-rose-200'
                                    : 'bg-white text-slate-400 border border-slate-100 hover:border-rose-200 hover:text-rose-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Map toggle button */}
                    <button
                        onClick={() => setShowMap(v => !v)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${showMap ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600'
                            }`}
                    >
                        <Map size={14} />{showMap ? 'Hide Map' : 'Show Map'}
                    </button>
                </div>

                {/* Map Panel (Phase 17) */}
                {showMap && (
                    <div className="mb-10">
                        <ButcherMap
                            butchers={filteredAndSortedButchers}
                            selectedId={selectedButcherId}
                            onSelect={setSelectedButcherId}
                        />
                    </div>
                )}

                {/* Search & Filter Bar */}
                <div className="mb-12">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-rose-600/5 blur-3xl group-focus-within:bg-rose-600/10 transition-all rounded-full" />
                            <div className="relative flex items-center bg-white border border-slate-200 rounded-[2rem] p-2 h-20 shadow-xl group-focus-within:border-rose-500/50 transition-all">
                                <div className="pl-6 pr-4 border-r border-slate-100 flex items-center gap-3">
                                    <Search className="w-5 h-5 text-slate-400 group-focus-within:text-rose-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Filter Shops</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for Chicken, Mutton, Fish or Shop Name..."
                                    defaultValue={query || ''}
                                    onChange={(e) => updateSearch(e.target.value)}
                                    className="flex-1 bg-transparent px-6 text-lg font-black placeholder:text-slate-300 outline-none uppercase tracking-tight text-slate-900 italic"
                                />
                                {query && (
                                    <button
                                        onClick={() => updateSearch('')}
                                        className="h-12 w-12 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors mr-2"
                                    >
                                        <Zap className="w-5 h-5 fill-current" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAndSortedButchers.map((butcher, index) => (
                        <div key={butcher.id}>
                            <Link href={`/butchers/${butcher.id}${query ? `?q=${encodeURIComponent(query)}` : ''}`} className="block group">
                                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

                                    {/* Image Section with Badges */}
                                    <div className="relative h-56 overflow-hidden bg-slate-100">
                                        <img
                                            src={butcher.image_url || FALLBACK_BUTCHER_IMG}
                                            onError={(e) => e.currentTarget.src = FALLBACK_BUTCHER_IMG}
                                            alt={butcher.shop_name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />

                                        {/* Offer Badge */}
                                        {butcher.offer && (
                                            <div className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-xl font-black text-sm shadow-2xl">
                                                {butcher.offer}
                                            </div>
                                        )}

                                        {/* Trending Badge */}
                                        {index < 3 && !butcher.is_official && (
                                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-lg px-3 py-2 rounded-full flex items-center gap-2 shadow-xl">
                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                <span className="text-xs font-black uppercase text-slate-900">Trending</span>
                                            </div>
                                        )}

                                        {/* Official Badge */}
                                        {butcher.is_official && (
                                            <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                                <div className="bg-slate-900 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl border border-white/20">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">MeatHub Official</span>
                                                </div>
                                                <div className="bg-rose-600 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl animate-pulse">
                                                    <Tv className="w-3 h-3" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Live Stream</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 space-y-4">

                                        {/* Shop Name & Rating */}
                                        <div className="space-y-3">
                                            <h3 className={`text-2xl font-black uppercase tracking-tight group-hover:text-rose-600 transition-colors ${butcher.is_official ? 'text-rose-600' : 'text-slate-900'}`}>
                                                {butcher.shop_name} {butcher.is_official && <span className="not-italic text-sm font-black text-rose-400 align-top ml-1">★</span>}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-lg">
                                                    <Star className="w-4 h-4 fill-white" />
                                                    <span className="font-black text-sm">{butcher.rating}</span>
                                                </div>

                                                {/* B5: Busy Status Badge */}
                                                {butcher.is_busy && (
                                                    <div className="flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1.5 rounded-lg animate-pulse shadow-lg">
                                                        <Clock className="w-4 h-4" />
                                                        <span className="font-black text-[10px] uppercase">Busy</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Shell key={i} size={10} className={i < (butcher.hygiene_score || 5) ? 'fill-blue-600' : 'text-blue-200'} />
                                                    ))}
                                                    <span className="text-[8px] font-black uppercase ml-1">Hygiene</span>
                                                </div>
                                                <span className="text-slate-500 font-bold text-sm">
                                                    ({100 + (butcher.active_orders || (Number(butcher.id) * 7) % 500)}+ orders)
                                                </span>
                                            </div>
                                        </div>

                                        {/* Key Info */}
                                        <div className="flex items-center gap-4 text-slate-600 font-bold">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm">{butcher.deliveryTime} mins</span>
                                            </div>
                                            {userLocation && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm">{butcher.distance.toFixed(1)} km</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            {['HALAL', 'HYGIENIC', 'BIO-SECURE'].map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${tag === 'BIO-SECURE'
                                                        ? 'bg-rose-50 text-rose-600 border border-rose-100 group-hover:bg-rose-600 group-hover:text-white'
                                                        : 'bg-slate-50 text-slate-500 border border-slate-100'
                                                        }`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Footer CTA */}
                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4 text-emerald-500" />
                                                <span className="text-xs font-black uppercase text-slate-400 tracking-widest">98% Cold-Chain</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-rose-600 group-hover:gap-3 transition-all">
                                                <span className="text-xs font-black uppercase tracking-widest">View Menu</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {filteredAndSortedButchers.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                            <Zap className="w-16 h-16 text-slate-300" />
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight italic">No Shops Found</h3>
                        <p className="text-slate-600 text-lg font-medium mb-8">Try searching for a different category</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-rose-700 transition-colors"
                        >
                            <ArrowRight className="w-5 h-5 rotate-180" />
                            Back to Categories
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
