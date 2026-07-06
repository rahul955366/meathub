"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Star, Clock, ArrowRight, Navigation, ShieldCheck, Store, Tv } from 'lucide-react';
import { motion } from 'framer-motion';
import { Butcher, MeatItem } from '@/types';
import toast from 'react-hot-toast';

interface ShopsForItemProps {
    itemName: string;
    categoryName: string;
    items: MeatItem[]; // Items from different butchers matching this name
    butchers: Butcher[];
}

interface EnrichedShopItem {
    item: MeatItem;
    butcher: Butcher;
    distance: number;
    rating: string;
    deliveryTime: number;
}

const FALLBACK_SHOP_IMG = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80';

export default function ShopsForItem({ itemName, categoryName, items, butchers }: ShopsForItemProps) {
    const router = useRouter();
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    const getDistance = (bLat: number = 17.4944, bLng: number = 78.3908) => {
        if (!userLocation) return 999;
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
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setIsLocating(false);
                    toast.success("Location updated! Nearest shops shown first.");
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    setIsLocating(false);
                    toast.error("Could not detect location. Using default view.");
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            setIsLocating(false);
            toast.error("Geolocation not supported by your browser.");
        }
    };

    useEffect(() => {
        handleLocate();
    }, []);

    const sortedShops = useMemo(() => {
        const enriched: EnrichedShopItem[] = items.map((item) => {
            const butcher = butchers.find(b => b.id === item.butcher);
            const lat = butcher?.latitude || 17.4944;
            const lng = butcher?.longitude || 78.3908;
            const distance = getDistance(lat, lng);
            const rating = butcher?.average_rating ? butcher.average_rating.toFixed(1) : "4.5";
            const deliveryTime = butcher?.is_official ? 20 : 25 + (Number(butcher?.id || 0) % 20);

            return {
                item,
                butcher: butcher || {
                    id: item.butcher,
                    shop_name: item.butcher_name,
                    address: "Hyderabad",
                    phone_number: "",
                    description: "",
                    service_radius_km: 5,
                    is_available: true,
                    is_official: false,
                    status: 'APPROVED',
                },
                distance,
                rating,
                deliveryTime,
            };
        });

        return enriched.sort((a, b) => {
            if (!userLocation) {
                if (a.butcher.is_official && !b.butcher.is_official) return -1;
                if (!a.butcher.is_official && b.butcher.is_official) return 1;
                if (a.butcher.is_busy && !b.butcher.is_busy) return 1;
                if (!a.butcher.is_busy && b.butcher.is_busy) return -1;
                return 0;
            }

            const NEAREST_THRESHOLD = 5.0; // 5km neighborhood

            // Load Balancing: Logical penalty for busy shops
            const effectiveDistA = a.distance + (a.butcher.is_busy ? 0.5 : 0);
            const effectiveDistB = b.distance + (b.butcher.is_busy ? 0.5 : 0);

            const aIsNearest = a.distance <= NEAREST_THRESHOLD;
            const bIsNearest = b.distance <= NEAREST_THRESHOLD;

            if (aIsNearest && !bIsNearest) return -1;
            if (!aIsNearest && bIsNearest) return 1;

            if (aIsNearest && bIsNearest) {
                return effectiveDistA - effectiveDistB;
            }

            return a.distance - b.distance;
        });
    }, [items, butchers, userLocation]);

    const handleSelectShop = (butcherId: number) => {
        router.push(`/butchers/${butcherId}`);
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                    <h2 className="text-3xl font-black uppercase text-slate-900 italic tracking-tighter">
                        Available At <span className="text-rose-600 not-italic">{sortedShops.length} Shops</span>
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">
                        Find the nearest butcher shops with fresh {itemName} in stock.
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLocate}
                    disabled={isLocating}
                    className="inline-flex items-center gap-3 h-12 px-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all shadow-xl disabled:opacity-50 group shrink-0"
                >
                    <Navigation className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                    {isLocating ? 'LOCATING...' : 'SORT BY DISTANCE'}
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedShops.map(({ item, butcher, distance, rating, deliveryTime }) => (
                    <div
                        key={butcher.id}
                        onClick={() => handleSelectShop(butcher.id)}
                        className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group border border-slate-100 hover:border-rose-100"
                    >
                        {/* Shop Image */}
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                            <img
                                src={butcher.image_url || FALLBACK_SHOP_IMG}
                                alt={butcher.shop_name}
                                onError={(e) => e.currentTarget.src = FALLBACK_SHOP_IMG}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {butcher.is_official && (
                                <div className="absolute top-4 right-4 bg-slate-900 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-2xl border border-white/20">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Official Partner</span>
                                </div>
                            )}
                        </div>

                        {/* Shop details */}
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                                        {butcher.shop_name}
                                    </h3>
                                    <p className="text-xl font-black text-rose-600 italic shrink-0">
                                        ₹{parseFloat(item.price).toLocaleString('en-IN')}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-black">
                                        <Star className="w-3.5 h-3.5 fill-white" />
                                        <span>{rating}</span>
                                    </div>
                                    {butcher.is_busy && (
                                        <div className="flex items-center gap-1 bg-amber-500 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase animate-pulse">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Busy</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-slate-400 text-xs font-bold line-clamp-1">
                                {butcher.address}
                            </p>

                            <div className="flex items-center gap-4 text-slate-600 font-bold text-xs pt-2 border-t border-slate-50">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span>{deliveryTime} mins</span>
                                </div>
                                {userLocation && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span>{distance.toFixed(1)} km</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {item.quantity} units left
                                </span>
                                <div className="flex items-center gap-2 text-rose-600 group-hover:gap-3 transition-all">
                                    <span className="text-xs font-black uppercase tracking-widest">Shop Here</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
