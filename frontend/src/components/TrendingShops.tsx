"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, ArrowRight, TrendingUp } from 'lucide-react';
import { Butcher } from '@/types';

interface TrendingShopsProps {
    butchers: Butcher[];
}

const FALLBACK_BUTCHER_IMG = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80';

export default function TrendingShops({ butchers = [] }: TrendingShopsProps) {
    // Take top 6 butchers
    const trendingButchers = Array.isArray(butchers) ? butchers.slice(0, 6) : [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingButchers.map((butcher, index) => (
                <motion.div
                    key={butcher.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link href={`/butchers/${butcher.id}`} className="block group">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100">
                            {/* Image Section */}
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                <img
                                    src={butcher.image_url || FALLBACK_BUTCHER_IMG}
                                    onError={(e) => e.currentTarget.src = FALLBACK_BUTCHER_IMG}
                                    alt={butcher.shop_name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {butcher.is_official ? (
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                        <div className="bg-rose-600 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl animate-pulse">
                                            <TrendingUp className="w-3 h-3" />
                                            <span className="text-[10px] font-black uppercase tracking-wider">Official Flagship</span>
                                        </div>
                                        <div className="bg-white/95 backdrop-blur-lg w-10 h-10 rounded-full flex items-center justify-center shadow-xl border border-rose-100">
                                            <span className="text-lg">📹</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-lg px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
                                        <TrendingUp className="w-3 h-3 text-rose-500" />
                                        <span className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Trending</span>
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-rose-600 transition-colors line-clamp-1">
                                        {butcher.shop_name}
                                    </h3>

                                    {butcher.is_official && (
                                        <div className="flex flex-wrap gap-2 py-1">
                                            {['Video Verified', 'Artisanal Selection', 'Priority Logistics'].map(usp => (
                                                <span key={usp} className="text-[8px] font-black uppercase tracking-tighter bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md border border-rose-100">
                                                    {usp}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-1 rounded-md shadow-md">
                                            <Star className="w-3 h-3 fill-white" />
                                            <span className="font-black text-xs">
                                                {(butcher as any).average_rating ? (butcher as any).average_rating.toFixed(1) : `4.${8 - index}`}
                                            </span>
                                        </div>
                                        <span className="text-slate-400 font-bold text-xs uppercase tracking-wide">
                                            {(butcher as any).active_orders || (Number(butcher.id) * 123) % 500 + 50} Orders
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-slate-500 font-bold text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>25 min</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{(1.2 + index * 0.5).toFixed(1)} km</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-rose-600">
                                    <span className="text-[10px] font-black uppercase tracking-widest">View Shop</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
