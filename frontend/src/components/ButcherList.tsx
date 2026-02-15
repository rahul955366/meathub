"use client";

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Star, Clock, ArrowRight, Navigation, Award, TrendingUp, Zap, ShieldCheck, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface ButcherListProps {
    initialButchers: any[];
    initialItems: any[];
}

export default function ButcherList({ initialButchers, initialItems }: ButcherListProps) {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    const getDistance = (bLat: number, bLng: number) => {
        if (!userLocation) return 0;
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
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setIsLocating(false);
            },
            () => setIsLocating(false)
        );
    };

    const filteredAndSortedButchers = useMemo(() => {
        let result = initialButchers;

        if (query) {
            const matchingItemIds = initialItems
                .filter(item =>
                    item.name?.toLowerCase().includes(query.toLowerCase()) ||
                    item.category?.toLowerCase().includes(query.toLowerCase())
                )
                .map(item => item.butcher);

            result = initialButchers.filter(butcher =>
                matchingItemIds.includes(butcher.id) ||
                butcher.name?.toLowerCase().includes(query.toLowerCase()) ||
                butcher.location?.toLowerCase().includes(query.toLowerCase())
            );
        }

        const withDetails = result.map((butcher: any) => {
            const butcherItems = initialItems.filter((item: any) => item.butcher === butcher.id);
            const distance = getDistance(parseFloat(butcher.latitude) || 17.4944, parseFloat(butcher.longitude) || 78.3908);

            return {
                ...butcher,
                itemCount: butcherItems.length,
                distance: distance,
                rating: (4.2 + (Number(butcher.id) % 5) * 0.1).toFixed(1),
                deliveryTime: 25 + (Number(butcher.id) % 20),
                offer: (Number(butcher.id) % 3 === 0) ? `${10 + (Number(butcher.id) % 20)}% OFF` : null
            };
        });

        return withDetails.sort((a, b) => a.distance - b.distance);
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
                                    value={query || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const params = new URLSearchParams(window.location.search);
                                        if (val) params.set('q', val);
                                        else params.delete('q');
                                        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
                                        // The query variable is from useSearchParams, which reflects URL changes
                                    }}
                                    className="flex-1 bg-transparent px-6 text-lg font-black placeholder:text-slate-300 outline-none uppercase tracking-tight text-slate-900 italic"
                                />
                                {query && (
                                    <button
                                        onClick={() => {
                                            window.history.replaceState({}, '', window.location.pathname);
                                        }}
                                        className="h-12 w-12 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors mr-2"
                                    >
                                        <Zap className="w-5 h-5 fill-current" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={filteredAndSortedButchers.length + (query || '')}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredAndSortedButchers.map((butcher: any, index: number) => (
                            <motion.div
                                key={butcher.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, type: "spring" }}
                            >
                                <Link href={`/butchers/${butcher.id}${query ? `?q=${encodeURIComponent(query)}` : ''}`} className="block group">
                                    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

                                        {/* Image Section with Badges */}
                                        <div className="relative h-56 overflow-hidden bg-slate-100">
                                            <motion.img
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.6 }}
                                                src={butcher.image_url || 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80&sig=fallback_butcher'}
                                                alt={butcher.name}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Offer Badge */}
                                            {butcher.offer && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-xl font-black text-sm shadow-2xl"
                                                >
                                                    {butcher.offer}
                                                </motion.div>
                                            )}

                                            {/* Trending Badge */}
                                            {index < 3 && (
                                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-lg px-3 py-2 rounded-full flex items-center gap-2 shadow-xl">
                                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                    <span className="text-xs font-black uppercase text-slate-900">Trending</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 space-y-4">

                                            {/* Shop Name & Rating */}
                                            <div className="space-y-3">
                                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-rose-600 transition-colors">
                                                    {butcher.shop_name || butcher.name}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-lg">
                                                        <Star className="w-4 h-4 fill-white" />
                                                        <span className="font-black text-sm">{butcher.rating}</span>
                                                    </div>
                                                    <span className="text-slate-500 font-bold text-sm">
                                                        ({100 + (Number(butcher.id) * 7) % 500}+ orders)
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
                                                <motion.div
                                                    className="flex items-center gap-2 text-rose-600 group-hover:gap-3 transition-all"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <span className="text-xs font-black uppercase tracking-widest">View Menu</span>
                                                    <ArrowRight className="w-5 h-5" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

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
