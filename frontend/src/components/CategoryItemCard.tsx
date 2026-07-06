"use client";

import { ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MeatItem } from '@/types';

interface CategoryItemCardProps {
    name: string;
    category: string;
    items: MeatItem[]; // All items with this same name from different butchers
}

const PRODUCT_IMAGE_MAP: { key: string; url: string }[] = [
    { key: 'COUNTRY CHICKEN', url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80&fit=crop' },
    { key: 'NATU KODI', url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80&fit=crop' },
    { key: 'TANDOORI', url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80&fit=crop' },
    { key: 'CHICKEN BREAST', url: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&q=80&fit=crop' },
    { key: 'CHICKEN THIGH', url: 'https://images.unsplash.com/photo-1602491673980-928929e46a75?w=600&q=80&fit=crop' },
    { key: 'CHICKEN WING', url: 'https://images.unsplash.com/photo-1527477396000-e27163b4bff0?w=600&q=80&fit=crop' },
    { key: 'DRUMSTICK', url: 'https://images.unsplash.com/photo-1594950195709-a14f66c242d7?w=600&q=80&fit=crop' },
    { key: 'CHICKEN KEEMA', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80&fit=crop' },
    { key: 'CHICKEN MINCE', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80&fit=crop' },
    { key: 'CHICKEN STRIP', url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80&fit=crop' },
    { key: 'CHICKEN LIVER', url: 'https://images.unsplash.com/photo-1607116665636-2506534bf0fe?w=600&q=80&fit=crop' },
    { key: 'CHICKEN BONELESS', url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&q=80&fit=crop' },
    { key: 'CHICKEN CURRY', url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80&fit=crop' },
    { key: 'MUTTON LIVER', url: 'https://images.unsplash.com/photo-1624174503860-478de0ae2c09?w=600&q=80&fit=crop' },
    { key: 'MUTTON KEEMA', url: 'https://images.unsplash.com/photo-1603048588661-83ae09942a33?w=600&q=80&fit=crop' },
    { key: 'MUTTON BONELESS', url: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=600&q=80&fit=crop' },
    { key: 'MUTTON RIB', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80&fit=crop' },
    { key: 'MUTTON CHOP', url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80&fit=crop' },
    { key: 'MUTTON CURRY', url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&q=80&fit=crop' },
];

const CATEGORY_FALLBACKS: Record<string, string> = {
    CHICKEN: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80&fit=crop',
    MUTTON: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&q=80&fit=crop',
    FISH: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=600&q=80&fit=crop',
    PRAWNS: 'https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?w=600&q=80&fit=crop',
    GYM: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80&fit=crop',
    PET: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80&fit=crop',
    DEFAULT: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80&fit=crop',
};

const getAccurateImage = (name: string, category: string): string => {
    const upper = name.toUpperCase();
    const match = PRODUCT_IMAGE_MAP.find(({ key }) => upper.includes(key));
    if (match) return match.url;
    return CATEGORY_FALLBACKS[category.toUpperCase()] || CATEGORY_FALLBACKS.DEFAULT;
};

export default function CategoryItemCard({ name, category, items }: CategoryItemCardProps) {
    const router = useRouter();

    // Find the item with a valid image_url
    const itemWithImage = items.find(item => item.image_url && item.image_url.length > 10);
    const keywordFallback = getAccurateImage(name, category);
    const initialSrc = itemWithImage ? itemWithImage.image_url : keywordFallback;
    const [imgSrc, setImgSrc] = useState(initialSrc);

    const handleError = () => setImgSrc(keywordFallback);

    // Calculate starting price (minimum price among all butchers selling this item)
    const minPrice = items.reduce((min, item) => {
        const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        return itemPrice < min ? itemPrice : min;
    }, Infinity);

    // Slugify the item name for routing
    const slug = encodeURIComponent(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));

    const handleClick = () => {
        // Navigate to item detail page, passing name as query param to be robust
        router.push(`/item/${slug}?name=${encodeURIComponent(name)}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white p-5 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-rose-100 group cursor-pointer"
        >
            <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 mb-6 relative">
                <img
                    src={imgSrc}
                    alt={name}
                    onError={handleError}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-100 shadow-sm flex items-center gap-1.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-slate-900">Premium Quality</span>
                    </div>
                </div>
                <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-slate-900" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{category}</p>
                    <h4 className="font-black text-slate-900 text-base uppercase tracking-tight line-clamp-1">
                        {name}
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-600/70 mt-1">
                        Available at {items.length} {items.length === 1 ? 'shop' : 'shops'} nearby
                    </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Starting From</p>
                        <p className="text-lg font-black text-rose-600 italic">₹{minPrice.toLocaleString('en-IN')}</p>
                    </div>
                    <button
                        className="h-10 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors"
                    >
                        View Shops
                    </button>
                </div>
            </div>
        </div>
    );
}
