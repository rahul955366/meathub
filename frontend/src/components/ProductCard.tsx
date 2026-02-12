"use client";

import { ShoppingBag, Check, MapPin, Star, ArrowRight } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
    item: any;
    variant?: 'default' | 'portrait';
    buttonLabel?: string;
    showButchersLink?: boolean;
}

export default function ProductCard({
    item,
    variant = 'default',
    buttonLabel = 'ADD TO BAG',
    showButchersLink = true
}: ProductCardProps) {
    const { addToCart } = useAppContext();
    const [isAdded, setIsAdded] = useState(false);
    const router = useRouter();

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(item);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleNavigate = () => {
        router.push(`/butchers?q=${encodeURIComponent(item.name)}`);
    };

    if (variant === 'portrait') {
        return (
            <div className="group cursor-pointer" onClick={handleNavigate}>
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-200 relative shadow-sm group-hover:shadow-2xl transition-all duration-700">
                    <img
                        src={item.image_url || 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                        <button
                            onClick={handleAdd}
                            className={`w-full h-12 backdrop-blur rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all shadow-xl ${isAdded ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-900 hover:bg-rose-600 hover:text-white'}`}
                        >
                            {isAdded ? <Check className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                            {isAdded ? 'ADDED' : buttonLabel}
                        </button>
                    </div>
                </div>
                <div className="mt-6 text-center space-y-1">
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">{item.name}</h3>
                    <p className="text-rose-600 font-black italic">₹{item.price}</p>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={handleNavigate}
            className="bg-white p-5 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-rose-100 group cursor-pointer"
        >
            <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 mb-6 relative">
                <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-slate-900" />
                </div>
            </div>
            <div className="space-y-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.category}</p>
                    <h4 className="font-black text-slate-900 text-base uppercase tracking-tight line-clamp-1">{item.name}</h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Starts At</p>
                        <p className="text-lg font-black text-rose-600 italic">₹{item.price}</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-90 ${isAdded ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-rose-600'}`}
                    >
                        {isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                    </button>
                </div>

                {showButchersLink && (
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-600 transition-colors">
                        <MapPin className="w-3 h-3" />
                        <span>View 4+ Local Butchers</span>
                    </div>
                )}
            </div>
        </div>
    );
}
