"use client";

import React, { useState } from 'react';
import { ShoppingBag, ChevronDown, Plus, Minus, Check } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

import { MeatItem } from '@/types';

export default function ProductDetailClient({ item }: { item: MeatItem }) {
    const { addToCart } = useAppContext();
    const [quantity, setQuantity] = useState(1);
    const [cutType, setCutType] = useState('Curry Cut');
    const [isAdding, setIsAdding] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const CUT_TYPES = ['Curry Cut', 'Fry Cut', 'Whole', 'Biryani Cut', 'Skinless'];

    const handleAddToCart = () => {
        setIsAdding(true);
        // Add multiple quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(item, cutType);
        }

        setTimeout(() => {
            setIsAdding(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        }, 800);
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-wrap gap-10 items-end">
                {/* Quantity Control */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Quantity</p>
                    <div className="flex items-center gap-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xl font-black w-8 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Pricing Display */}
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Estimated Total</p>
                    <p className="text-5xl font-black text-rose-600 italic tracking-tighter">
                        ₹{parseFloat(item.price) * quantity}
                    </p>
                </div>
            </div>

            {/* Cut Selection */}
            <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Specification Type</p>
                <div className="flex flex-wrap gap-3">
                    {CUT_TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => setCutType(type)}
                            className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${cutType === type
                                ? 'bg-slate-900 text-white shadow-xl scale-105'
                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Combo Recommendations */}
            <div className="space-y-6 pt-10 border-t border-slate-50">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Frequently Paired (Recommended Combos)</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { name: 'Masala Pack', price: '₹45', desc: 'Hand-ground spices' },
                        { name: 'Cold Pressed Oil', price: '₹120', desc: '500ml Sesame' }
                    ].map((combo) => (
                        <div key={combo.name} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-rose-200 transition-colors cursor-pointer">
                            <div>
                                <h5 className="text-sm font-black uppercase text-slate-900">{combo.name}</h5>
                                <p className="text-[10px] font-bold text-slate-400 italic">{combo.desc}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-rose-600 italic">{combo.price}</p>
                                <Plus className="w-4 h-4 text-slate-300 mt-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-2xl relative overflow-hidden ${isSuccess ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-rose-600'}`}
                >
                    <AnimatePresence mode="wait">
                        {isAdding ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"
                            />
                        ) : isSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex items-center gap-3"
                            >
                                <Check className="w-6 h-6" /> SECURED IN BAG
                            </motion.div>
                        ) : (
                            <motion.div
                                key="initial"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex items-center gap-3"
                            >
                                <ShoppingBag className="w-6 h-6" /> INITIATE ORDER
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    );
}
