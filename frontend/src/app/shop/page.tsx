"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, ShoppingBag, Zap, Heart, Target } from 'lucide-react';
import { getMeatItems } from '@/lib/api';
import { MeatItem } from '@/types';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';

function ShopContent() {
    const searchParams = useSearchParams();
    const queryParam = searchParams.get('q') || '';

    const [items, setItems] = useState<MeatItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        setSearchQuery(queryParam);
    }, [queryParam]);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                // Get User Location
                navigator.geolocation.getCurrentPosition(
                    (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                    () => setUserLocation({ lat: 17.4483, lng: 78.3915 }) // Default to KPHB, Hyderabad
                );

                const data = await getMeatItems();
                if (data) setItems(data);
                else setItems([]);
            } catch (err) {
                console.error("Failed to fetch shop items", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const filteredItems = items
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.butcher_name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'ALL' || item.category?.toUpperCase() === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (!userLocation) return 0;

            const distA = a.butcher_lat && a.butcher_lng ? calculateDistance(userLocation.lat, userLocation.lng, a.butcher_lat, a.butcher_lng) : 999;
            const distB = b.butcher_lat && b.butcher_lng ? calculateDistance(userLocation.lat, userLocation.lng, b.butcher_lat, b.butcher_lng) : 999;

            // Hybrid Sorting Protocol
            const NEARBY_THRESHOLD = 5; // 5km radius for 'Current Neighborhood'
            const isNearA = distA <= NEARBY_THRESHOLD;
            const isNearB = distB <= NEARBY_THRESHOLD;

            // 0. Load Balancing Distance Penalty (+0.5km logical distance if busy)
            const trafficPenaltyA = a.butcher_is_busy ? 0.5 : 0;
            const trafficPenaltyB = b.butcher_is_busy ? 0.5 : 0;
            const effectiveDistA = distA + trafficPenaltyA;
            const effectiveDistB = distB + trafficPenaltyB;

            // 1. Group by Proximity (Nearby first)
            if (isNearA && !isNearB) return -1;
            if (!isNearA && isNearB) return 1;

            if (isNearA && isNearB) {
                // 2. Sort by Effective Distance (closer or less busy wins)
                return effectiveDistA - effectiveDistB;
            }

            // Outside neighborhood - just sort by distance
            return distA - distB;
        });

    const categories = ['ALL', 'CHICKEN', 'MUTTON', 'FISH', 'PRAWNS', 'GYM', 'PET'];

    return (
        <div className="container mx-auto px-4">
            {/* Header & Search */}
            <div className="max-w-4xl mx-auto text-center space-y-8 mb-16">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
                    The Master <span className="text-rose-600 not-italic">Catalog.</span>
                </h1>

                <div className="relative group max-w-2xl mx-auto">
                    <div className="absolute inset-0 bg-rose-600/5 blur-2xl group-hover:bg-rose-600/10 transition-all rounded-full" />
                    <div className="relative flex items-center">
                        <Search className="absolute left-6 w-6 h-6 text-slate-300 group-hover:text-rose-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for cuts, categories, or butchers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-16 pl-16 pr-6 bg-white border-2 border-slate-100 rounded-full text-sm font-bold shadow-xl focus:ring-4 focus:ring-rose-600/10 focus:border-rose-600 outline-none transition-all italic"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white text-slate-400 border border-slate-100 hover:border-rose-600 hover:text-rose-600'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {loading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="bg-white p-5 rounded-[3rem] shadow-sm border border-slate-100 animate-pulse">
                            <div className="aspect-square bg-slate-100 rounded-[2.5rem] mb-6" />
                            <div className="h-4 bg-slate-100 rounded-full w-2/3 mb-2" />
                            <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                        </div>
                    ))
                ) : filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={item.id}
                        >
                            <ProductCard item={item} />
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-sm italic">No matching cuts found in our village sources.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MeatCatalog() {
    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24 text-slate-900">
            <Suspense fallback={<div className="container mx-auto px-4 text-center py-20 font-black uppercase tracking-widest text-slate-400">Loading Catalog Logistics...</div>}>
                <ShopContent />
            </Suspense>
        </main>
    );
}
