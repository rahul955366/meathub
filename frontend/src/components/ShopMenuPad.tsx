"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, MapPin, ArrowRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Exhaustive Universal Product List - EXACTLY as requested by user
const UNIVERSAL_MENU = [
    {
        category: "Chicken",
        label: "Poultry Classics",
        page: 1,
        items: [
            "Whole Chicken", "Chicken Curry Cut", "Boneless Chicken", "Chicken Breast",
            "Chicken Thighs", "Chicken Drumsticks", "Chicken Wings", "Chicken Liver",
            "Chicken Gizzard", "Chicken Heart", "Chicken Neck", "Chicken Feet",
            "Chicken Keema", "Marinated Chicken"
        ]
    },
    {
        category: "Mutton",
        label: "Royal Mutton",
        page: 2,
        items: [
            "Mutton Curry Cut", "Boneless Mutton", "Mutton Chops", "Mutton Ribs",
            "Mutton Leg Pieces", "Mutton Liver", "Mutton Kidney", "Mutton Brain",
            "Mutton Heart", "Mutton Trotters (Paya)", "Mutton Keema", "Marinated Mutton"
        ]
    },
    {
        category: "Fish",
        label: "Daily Catch",
        page: 3,
        items: [
            "Rohu", "Catla", "Seer Fish", "Tilapia", "Basa", "Pomfret", "King Fish",
            "Sardines", "Mackerel", "Whole Cleaned Fish", "Fish Steaks", "Fish Fillets",
            "Boneless Fish Cubes"
        ]
    },
    {
        category: "Prawns & Seafood",
        label: "Ocean Delights",
        page: 4,
        items: [
            "Small Prawns", "Medium Prawns", "Jumbo Prawns", "Tiger Prawns",
            "Peeled & Deveined Prawns", "Crab", "Squid", "Lobster", "Clams", "Mussels"
        ]
    }
];

interface ShopMenuPadProps {
    currentShopItems: any[];
    onItemClick: (itemName: string) => void;
    nearbyShopsWithStock?: (itemName: string) => any[];
}

export default function ShopMenuPad({ currentShopItems = [], onItemClick, nearbyShopsWithStock }: ShopMenuPadProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isPageTurning, setIsPageTurning] = useState(false);

    const totalPages = UNIVERSAL_MENU.length;

    const filteredItemsOnCurrentPage = useMemo(() => {
        const pageData = UNIVERSAL_MENU.find(p => p.page === currentPage);
        if (!pageData) return [];

        if (!searchTerm) return pageData.items;

        const lowerSearch = searchTerm.toLowerCase();
        return pageData.items.filter(item =>
            item.toLowerCase().includes(lowerSearch)
        );
    }, [searchTerm, currentPage]);

    // Handle Search Jumping to Page
    useEffect(() => {
        if (searchTerm) {
            const resultPage = UNIVERSAL_MENU.find(page =>
                page.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            if (resultPage && resultPage.page !== currentPage) {
                setCurrentPage(resultPage.page);
            }
        }
    }, [searchTerm]);

    const checkInStock = (itemName: string) => {
        return currentShopItems.some(i => i.name.toLowerCase() === itemName.toLowerCase());
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setIsPageTurning(true);
            setTimeout(() => {
                setCurrentPage(prev => prev + 1);
                setIsPageTurning(false);
            }, 300);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setIsPageTurning(true);
            setTimeout(() => {
                setCurrentPage(prev => prev - 1);
                setIsPageTurning(false);
            }, 300);
        }
    };

    const currentCategory = UNIVERSAL_MENU.find(p => p.page === currentPage);

    return (
        <div className="w-full bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[750px] sticky top-24 transform perspective-1000">
            {/* Book Spine Detail */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-slate-900 z-50 rounded-l-2xl shadow-inner border-r border-white/10" />

            {/* Header / Search */}
            <div className="p-8 pl-10 bg-slate-950 text-white relative">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-rose-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Menu Book</h3>
                    </div>
                    <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20">
                        <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search meat cuts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Page Content */}
            <div className="flex-1 bg-[#fffdf9] p-8 pl-10 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ rotateY: isPageTurning ? -90 : 0, opacity: 0, x: 20 }}
                        animate={{ rotateY: 0, opacity: 1, x: 0 }}
                        exit={{ rotateY: 90, opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="h-full flex flex-col"
                    >
                        {/* Page Header */}
                        <div className="mb-8 border-b-2 border-slate-100 pb-4">
                            <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter leading-none mb-2">
                                {currentCategory?.label}
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600">
                                Fresh {currentCategory?.category} Selection
                            </p>
                        </div>

                        {/* Item List */}
                        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-2">
                            {filteredItemsOnCurrentPage.length > 0 ? (
                                filteredItemsOnCurrentPage.map(item => {
                                    const inStock = checkInStock(item);
                                    const alternatives = !inStock && nearbyShopsWithStock ? nearbyShopsWithStock(item) : [];

                                    return (
                                        <div key={item} className="group">
                                            <button
                                                onClick={() => inStock && onItemClick(item)}
                                                className={`w-full text-left p-3 rounded-xl text-[10px] font-bold transition-all flex items-center justify-between gap-3 ${inStock
                                                    ? 'hover:bg-rose-600 hover:text-white text-slate-700 hover:shadow-lg'
                                                    : 'opacity-40 cursor-not-allowed text-slate-400'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="w-4 h-px bg-slate-200 group-hover:bg-white/30" />
                                                    <span className="truncate">{item}</span>
                                                </div>
                                                {inStock ? (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                ) : (
                                                    <div className="text-[8px] font-black uppercase text-slate-300">Out</div>
                                                )}
                                            </button>

                                            {/* Find Elsewhere Suggestion */}
                                            {!inStock && alternatives.length > 0 && (
                                                <div className="mt-1 ml-6 pl-4 border-l-2 border-rose-100 animate-in fade-in slide-in-from-left-2">
                                                    <p className="text-[8px] font-black uppercase text-rose-500 mb-1 flex items-center gap-1">
                                                        <MapPin className="w-2 h-2" /> Find it Elsewhere
                                                    </p>
                                                    {alternatives.slice(0, 1).map((shop: any) => (
                                                        <div key={shop.id} className="flex items-center justify-between text-[9px] bg-white p-2.5 rounded-xl shadow-sm border border-rose-50">
                                                            <span className="font-bold text-slate-700 truncate">{shop.shop_name}</span>
                                                            <ArrowRight className="w-3 h-3 text-rose-500" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-20 text-center opacity-30">
                                    <Search className="w-10 h-10 mx-auto mb-4" />
                                    <p className="text-xs font-black uppercase tracking-widest">No results on this page</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between z-10">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 group disabled:opacity-20"
                >
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Prev</span>
                </button>

                <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(n => (
                        <div
                            key={n}
                            onClick={() => setCurrentPage(n)}
                            className={`w-2 h-2 rounded-full cursor-pointer transition-all ${currentPage === n ? 'w-6 bg-rose-600' : 'bg-slate-300 hover:bg-slate-400'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 group disabled:opacity-20 text-right"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest">Next</span>
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </button>
            </div>
        </div>
    );
}
