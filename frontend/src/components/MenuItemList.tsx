"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Star, Award, Flame } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface MenuItemProps {
    item: any;
    onItemClick?: (item: any) => void;
}

export default function MenuItemList({ item, onItemClick }: MenuItemProps) {
    const { addToCart, removeFromCart, cart } = useAppContext();
    const [isHovered, setIsHovered] = useState(false);

    // Find quantity in cart
    const cartItem = cart.find((i: any) => i.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(item);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        removeFromCart(item.id);
    };

    const handleItemClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onItemClick) {
            onItemClick(item);
        }
    };

    // Use deterministic logic for flags instead of random
    const isBestseller = (item.id * 7) % 3 === 0;
    const isSpicy = (item.id * 13) % 4 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex gap-4 md:gap-6 p-4 md:p-6 bg-white border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleItemClick}
        >
            {/* Image Thumbnail - Zomato Style Square */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80&sig=fallback_menu'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Non-Veg Badge */}
                <div className="absolute top-2 right-2 w-5 h-5 border border-rose-600 flex items-center justify-center bg-white/90 backdrop-blur rounded-[4px]">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                </div>

                {/* Add Button Overlay */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-[85%] transition-transform duration-300 ${quantity > 0 ? 'translate-y-0' : 'translate-y-12 group-hover:translate-y-0'}`}
                >
                    {quantity === 0 ? (
                        <button
                            onClick={handleAdd}
                            className="w-full bg-white text-rose-600 font-black text-xs uppercase py-2.5 rounded-lg shadow-lg border border-slate-100 hover:bg-rose-50 transition-colors active:scale-95"
                        >
                            ADD
                        </button>
                    ) : (
                        <div className="w-full flex items-center justify-between bg-rose-600 text-white rounded-lg p-1 shadow-lg">
                            <button onClick={handleRemove} className="p-1.5 hover:bg-rose-700 rounded transition-colors flex-1 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-black px-2">{quantity}</span>
                            <button onClick={handleAdd} className="p-1.5 hover:bg-rose-700 rounded transition-colors flex-1 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Info */}
            <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {isBestseller && (
                            <div className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                <Star className="w-3 h-3 fill-amber-500" /> Bestseller
                            </div>
                        )}
                        {isSpicy && (
                            <div className="flex items-center gap-1 text-[10px] font-black uppercase text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                                <Flame className="w-3 h-3 fill-rose-500" /> Spicy
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-1 group-hover:text-rose-600 transition-colors">
                    {item.name}
                </h3>

                <p className="text-base font-black text-slate-900 mb-2">₹{item.price}</p>

                <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed line-clamp-2 md:line-clamp-3 mb-4">
                    {item.description || "Fresh cut, premium quality meat sourced directly from certified farms. Vacuum packed for freshness and delivered in temperature controlled packs."}
                </p>

                <div className="mt-auto flex items-center gap-4 border-t border-dashed border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        <Award className="w-3 h-3" /> Bio-Secure
                    </div>
                    <div className="text-[10px] font-bold text-slate-400">
                        {Math.floor((item.id * 11) % 50) + 10} bought today
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
