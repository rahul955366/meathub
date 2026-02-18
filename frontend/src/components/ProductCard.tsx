"use client";

import { ShoppingBag, Check, MapPin, ArrowRight } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MeatItem } from '@/types';

interface ProductCardProps {
    item: MeatItem;
    variant?: 'default' | 'portrait';
    buttonLabel?: string;
    showButchersLink?: boolean;
    onAction?: () => void;
}

const CATEGORY_FALLBACKS: Record<string, string[]> = {
    CHICKEN: [
        'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1598103353842-f050f776dec5?auto=format&fit=crop&w=400&q=80'
    ],
    MUTTON: [
        'https://images.unsplash.com/photo-1628102431502-990710609653?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400&q=80'
    ],
    FISH: [
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1534083236319-756f7093bc2f?auto=format&fit=crop&w=400&q=80'
    ],
    PRAWNS: [
        'https://images.unsplash.com/photo-1565689157206-0fddef7502cd?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1590244634358-00fc497818e6?auto=format&fit=crop&w=400&q=80'
    ],
    GYM: [
        'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1551024601-56455b245a61?auto=format&fit=crop&w=400&q=80'
    ],
    PET: [
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80'
    ],
    DEFAULT: ['https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80']
};

const CUT_IMAGES: Record<string, string[]> = {
    'MINCE': [
        'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80'
    ],
    'STEAK': [
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1546241072-48010ad28abb?auto=format&fit=crop&w=400&q=80'
    ],
    'BONE': [
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1598103353842-f050f776dec5?auto=format&fit=crop&w=400&q=80'
    ],
    'LIVER': [
        'https://images.unsplash.com/photo-1603513335552-32903511b850?auto=format&fit=crop&w=400&q=80'
    ],
    'WINGS': [
        'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=400&q=80'
    ],
    'CURRY': [
        'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1598103353842-f050f776dec5?auto=format&fit=crop&w=400&q=80'
    ]
};

const getAccurateImage = (name: string, category: string, id: number) => {
    const uppercaseName = name.toUpperCase();

    // Check for specific keywords first for maximum accuracy
    if (uppercaseName.includes('MINCE') || uppercaseName.includes('KEEMA')) return CUT_IMAGES.MINCE[id % CUT_IMAGES.MINCE.length];
    if (uppercaseName.includes('STEAK') || uppercaseName.includes('RIBEYE')) return CUT_IMAGES.STEAK[id % CUT_IMAGES.STEAK.length];
    if (uppercaseName.includes('BONE') || uppercaseName.includes('FRAME')) return CUT_IMAGES.BONE[id % CUT_IMAGES.BONE.length];
    if (uppercaseName.includes('LIVER') || uppercaseName.includes('ORGAN')) return CUT_IMAGES.LIVER[id % CUT_IMAGES.LIVER.length];
    if (uppercaseName.includes('WINGS') || uppercaseName.includes('LOLLIPOP')) return CUT_IMAGES.WINGS[id % CUT_IMAGES.WINGS.length];
    if (uppercaseName.includes('CURRY') || uppercaseName.includes('PIECES')) return CUT_IMAGES.CURRY[id % CUT_IMAGES.CURRY.length];

    // Fallback to category logic if no keyword matches
    const images = CATEGORY_FALLBACKS[category.toUpperCase()] || CATEGORY_FALLBACKS.DEFAULT;
    return images[id % images.length];
};

export default function ProductCard({
    item,
    variant = 'default',
    buttonLabel = 'ADD TO BAG',
    showButchersLink = true,
    onAction
}: ProductCardProps) {
    const { addToCart } = useAppContext();
    const [isAdded, setIsAdded] = useState(false);

    // Use keyword-aware accurate image mapping
    const initialFallback = getAccurateImage(item.name, item.category, item.id);
    const [imgSrc, setImgSrc] = useState(item.image_url && item.image_url.length > 10 ? item.image_url : initialFallback);

    const router = useRouter();

    const handleError = () => {
        setImgSrc(initialFallback);
    };

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAction) {
            onAction();
            return;
        }
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
                        src={imgSrc}
                        alt={item.name}
                        onError={handleError}
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
                    src={imgSrc}
                    alt={item.name}
                    onError={handleError}
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
                        <span>View Local Butchers</span>
                    </div>
                )}
            </div>
        </div>
    );
}
