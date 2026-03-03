"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { MeatItem } from '@/types';

export default function TrendingMeats({ items }: { items: MeatItem[] }) {
    // Intelligent Trending: Pick 1 from each main category first, then fill
    const categories = ['CHICKEN', 'MUTTON', 'FISH', 'PRAWNS'];
    const diverseTrending: MeatItem[] = [];
    const usedIds = new Set<number>();
    const cleanItems = (items || []).filter(item => !['PET', 'GYM'].includes(item.category.toUpperCase()));

    // 1. Pick one from each category
    categories.forEach(cat => {
        const item = cleanItems.find(i => i.category.toUpperCase() === cat && !usedIds.has(i.id));
        if (item) {
            diverseTrending.push(item);
            usedIds.add(item.id);
        }
    });

    // 2. Fill the rest to reach 12 items
    const fillers = cleanItems.filter(i => !usedIds.has(i.id)).slice(0, 12 - diverseTrending.length);
    const trending = [...diverseTrending, ...fillers];

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-200">
                            <Flame className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                                Today's <span className="text-rose-600 not-italic">Trending</span>
                            </h2>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Best-selling cuts near you</p>
                        </div>
                    </div>
                    <Link href="/butchers" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-2 group">
                        Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="flex overflow-x-auto pb-10 gap-8 scrollbar-hide px-2">
                    {trending.map((item, i) => (
                        <motion.div
                            key={item.id}
                            className="min-w-[320px]"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <ProductCard item={item} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
