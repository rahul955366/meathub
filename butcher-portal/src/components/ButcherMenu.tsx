"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, CheckCircle, ArrowRight, Store, Sparkles, MapPin, Shell, Tv } from 'lucide-react';
import Link from 'next/link';
import { getMeatItems, getReviews } from '@/lib/api';
import MenuItemList from './MenuItemList';
import ShopMenuPad from './ShopMenuPad';
import { useAppContext } from '@/context/AppContext';
import { Butcher, MeatItem, VillageSource } from '@/types';

// Simple X icon for closing modals
const X = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

interface ButcherMenuProps {
    butcher: Butcher;
    items: MeatItem[];
    allItems?: MeatItem[];
    allButchers?: Butcher[];
    defaultCategory?: string;
    villageSources?: VillageSource[];
}

export default function ButcherMenu({
    butcher,
    items: initialItems,
    allItems = [],
    allButchers = [],
    defaultCategory = 'Recommended',
    villageSources = [],
}: ButcherMenuProps) {
    const [selectedItem, setSelectedItem] = useState<MeatItem | null>(null);
    const [activeCategory, setActiveCategory] = useState(defaultCategory);
    const [reviews, setReviews] = useState<any[]>([]);
    const [localSearch, setLocalSearch] = useState('');
    const [items, setItems] = useState<MeatItem[]>(initialItems);

    useEffect(() => {
        getReviews(butcher.id).then(setReviews);
    }, [butcher.id]);

    // C2: Real-time stock polling every 60 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const freshItems = await getMeatItems();
                const butcherItems = freshItems.filter((i: MeatItem) => i.butcher === butcher.id);
                if (butcherItems.length > 0) setItems(butcherItems);
            } catch { /* silently ignore polling errors */ }
        }, 60000);
        return () => clearInterval(interval);
    }, [butcher.id]);

    const { totalAmount, addToCart } = useAppContext();

    // Group items by category (Current Shop)
    const shopCategories = React.useMemo(() =>
        Array.from(new Set(items.map((i) => i.category || 'Other'))),
        [items]);
    const menuCategories = ['Recommended', ...shopCategories];

    // Filter Logic for Main Product Feed
    const filteredItems = React.useMemo(() => {
        const baseFiltered = activeCategory === 'Recommended'
            ? items.filter((i) => parseFloat(i.price) > 0)
            : items.filter((i) => (i.category || 'Other').toUpperCase() === activeCategory.toUpperCase());

        return baseFiltered.filter((i) =>
            i.name.toLowerCase().includes(localSearch.toLowerCase())
        );
    }, [items, activeCategory, localSearch]);

    // Cross-Shop Stock Logic
    const nearbyShopsWithStock = (itemName: string): Butcher[] => {
        if (!allItems || !allButchers) return [];
        const matchingItems = allItems.filter(
            (it: MeatItem) => it.name.toLowerCase() === itemName.toLowerCase() && it.butcher !== butcher.id
        );
        const uniqueButcherIds = Array.from(new Set(matchingItems.map(it => it.butcher)));
        return allButchers.filter(b => uniqueButcherIds.includes(b.id)).slice(0, 6);
    };

    const handleUniversalItemClick = (itemName: string) => {
        const itemInCurrentShop = items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
        if (itemInCurrentShop) {
            // Switch to category and open modal
            if (itemInCurrentShop.category) setActiveCategory(itemInCurrentShop.category);
            setSelectedItem(itemInCurrentShop);
        }
    };

    // Priority Category Logic - Handle Item Search -> Category Mapping
    useEffect(() => {
        if (defaultCategory && defaultCategory !== 'Recommended') {
            const isDirectMatch = shopCategories.some(c => c.toUpperCase() === defaultCategory.toUpperCase());
            if (isDirectMatch) {
                setActiveCategory(defaultCategory);
            } else {
                const matchingItem = items.find(i => i.name.toLowerCase().includes(defaultCategory.toLowerCase()));
                if (matchingItem && matchingItem.category) {
                    setActiveCategory(matchingItem.category);
                    setSelectedItem(matchingItem);
                }
            }
        }
    }, [defaultCategory, items, shopCategories]);

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* 1. CLEAN SHOP HEADER (Replaced large banner) */}
            <div className="bg-slate-950 text-white py-12">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <Link href="/butchers" className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-rose-600 transition-all border border-white/10 group">
                            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
                                    {butcher.shop_name}
                                </h1>
                                <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
                                    <Store className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
                                </div>
                            </div>
                            <p className="text-rose-400 font-black text-xs uppercase tracking-[0.3em]">
                                Certified Meathub Partner • ID: MEATHUB-{butcher.id < 10 ? '0' : ''}{butcher.id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* COL 1: SHOP PROFILE (LEFT) */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Shop Information</h3>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                    {butcher.description || "Certified premium partner providing farm-fresh meat cuts processed with 100% cold-chain integrity."}
                                </p>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Store className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Working Hours</p>
                                        <p className="text-xs font-black text-slate-700">{butcher.opening_time || '06:00 AM'} - {butcher.closing_time || '09:00 PM'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Shell className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Hygiene Score</p>
                                        <div className="flex gap-0.5 mt-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Shell key={i} size={10} className={i < (butcher.hygiene_score || 5) ? 'fill-blue-600' : 'text-blue-200'} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                                <div className="flex items-center gap-3 text-rose-600 mb-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Sunday Special</span>
                                </div>
                                <p className="text-[11px] font-bold text-rose-800/70 leading-relaxed">
                                    Pre-order Mutton Paya or Special Chicken Curry Cut by Sat night for 7 AM delivery.
                                </p>
                            </div>

                            {butcher.village_source && (
                                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Farm Sourced</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                                            {typeof butcher.village_source === 'object' ? (butcher.village_source as any).name : 'Partner Village Farms'}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-1 italic uppercase">Traceable Farm-to-Fork</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COL 2: MAIN PRODUCTS (CENTER) */}
                    <div className="lg:col-span-6 space-y-8">
                        {/* Flagship Live Stream Feed (Vision USP) - Restricted to ONLY official stores */}
                        {butcher.is_official && butcher.live_stream_url && (
                            <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
                                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-rose-600 rounded-full animate-pulse" />
                                        <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Official Transparency Feed</h3>
                                    </div>
                                    <div className="flex items-center gap-2 bg-rose-600/20 px-3 py-1 rounded-full">
                                        <Tv className="w-3 h-3 text-rose-500" />
                                        <span className="text-rose-500 text-[8px] font-black uppercase tracking-widest">Live from Cutting Floor</span>
                                    </div>
                                </div>
                                <div className="aspect-video relative bg-black">
                                    <iframe
                                        src={butcher.live_stream_url}
                                        className="absolute inset-0 w-full h-full"
                                        title="MeatHub Flagship Live Feed"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <div className="p-4 bg-white/5 backdrop-blur-md">
                                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest text-center italic">
                                        Witness our hyper-hygienic processing standards in real-time.
                                    </p>
                                </div>
                            </div>
                        )}
                        {/* Mobile Category Tab (Visible only on mobile) */}
                        <div className="lg:hidden flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                            {menuCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-rose-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
                            <div className="p-8 border-b border-slate-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-black uppercase text-slate-900 italic tracking-tighter">
                                        {activeCategory} <span className="text-rose-600 not-italic font-black">Collection</span>
                                    </h2>
                                    <span className="bg-slate-100 text-slate-900 text-[10px] font-black px-4 py-2 rounded-xl border border-slate-200 uppercase tracking-widest">
                                        {filteredItems.length} Products
                                    </span>
                                </div>

                                {/* Shop-Specific Search Bar */}
                                <div className="relative group">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder={`Search for items in ${activeCategory}...`}
                                        value={localSearch}
                                        onChange={(e) => setLocalSearch(e.target.value)}
                                        className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <MenuItemList
                                            key={item.id}
                                            item={item}
                                            onItemClick={(i) => setSelectedItem(i)}
                                        />
                                    ))
                                ) : (
                                    <div className="p-20 text-center">
                                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                                            <Search className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-300 uppercase italic tracking-tight">Empty Inventory</h3>
                                        <p className="text-slate-400 text-sm mt-3 font-medium">This shop currently doesn't stock {activeCategory}.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COL 3: UNIVERSAL TABLE OF CONTENTS (RIGHT) */}
                    <div className="hidden lg:block lg:col-span-3">
                        <ShopMenuPad
                            currentShopItems={items}
                            onItemClick={handleUniversalItemClick}
                            nearbyShopsWithStock={nearbyShopsWithStock}
                        />
                    </div>

                </div>
            </div>

            {/* ITEM DETAILS MODAL */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative h-72">
                                <img
                                    src={selectedItem.image_url || require('@/utils/imageHelpers').getAccurateImage(selectedItem.name, selectedItem.category || '')}
                                    className="w-full h-full object-cover"
                                    alt={selectedItem.name}
                                />
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all border border-white/20"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-10 space-y-6 overflow-y-auto no-scrollbar">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-rose-600 shadow-lg shadow-rose-600/50" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600">Premium Butcher Selection</span>
                                    </div>
                                    <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">
                                        {selectedItem.name}
                                    </h2>
                                    {selectedItem.village_source && (() => {
                                        const vsId = typeof selectedItem.village_source === 'number'
                                            ? selectedItem.village_source
                                            : parseInt(String(selectedItem.village_source));
                                        const sourceName = villageSources.find(v => v.id === vsId)?.name
                                            || selectedItem.village_source;
                                        return (
                                            <div className="mt-4 inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl">
                                                <MapPin className="w-4 h-4 text-rose-600" />
                                                <span className="text-xs font-black uppercase tracking-widest text-rose-900">Source: {sourceName}</span>
                                            </div>
                                        );
                                    })()}
                                </div>
                                <p className="text-slate-500 font-medium text-base leading-relaxed">
                                    {selectedItem.description || "Freshly sourced from our verified bio-secure partners. Expertly cut and vacuum sealed for maximum freshness."}
                                </p>

                                <div className="pt-8 flex items-center justify-between border-t border-slate-100">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Price</p>
                                        <div className="text-4xl font-black text-slate-900 italic">₹{selectedItem.price}</div>
                                    </div>
                                    <button
                                        className="bg-slate-900 hover:bg-rose-600 text-white h-16 px-10 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all flex items-center gap-3"
                                        onClick={() => {
                                            addToCart(selectedItem);
                                            setSelectedItem(null);
                                        }}
                                    >
                                        Add to Bag
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CART BAR */}
            <AnimatePresence>
                {totalAmount > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-6 left-6 right-6 z-50 md:left-1/2 md:-translate-x-1/2 md:w-[600px]"
                    >
                        <Link href="/checkout">
                            <div className="bg-rose-600 text-white p-5 rounded-[2.5rem] shadow-2xl flex items-center justify-between cursor-pointer hover:bg-rose-700 transition-all hover:scale-[1.02] shadow-rose-500/30">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-1">Items in bag</span>
                                    <span className="text-2xl font-black italic">₹{totalAmount}</span>
                                </div>
                                <div className="flex items-center gap-4 bg-white/20 px-8 py-4 rounded-[1.5rem] backdrop-blur-md">
                                    <span className="text-sm font-black uppercase tracking-widest leading-none">Checkout</span>
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
