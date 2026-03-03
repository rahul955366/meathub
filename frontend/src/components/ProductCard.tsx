"use client";

import { ShoppingBag, Check, MapPin, ArrowRight, Minus, Plus, Scissors, Info, ShieldCheck } from 'lucide-react';
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

// ── ACCURATE FALLBACK IMAGES ─────────────────────────────────
// Used when backend image_url fails. Maps product name keywords
// to the exact product type image — zero mismatches.
const PRODUCT_IMAGE_MAP: { key: string; url: string }[] = [
    // Chicken
    { key: 'COUNTRY CHICKEN', url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80&fit=crop' },
    { key: 'NATU KODI', url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80&fit=crop' },
    { key: 'CHICKEN BREAST', url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80&fit=crop' },
    { key: 'CHICKEN THIGH', url: 'https://images.unsplash.com/photo-1598103442097-8b74394b99c6?w=600&q=80&fit=crop' },
    { key: 'DRUMSTICK', url: 'https://images.unsplash.com/photo-1603048588661-83ae09942a33?w=600&q=80&fit=crop' },
    { key: 'CHICKEN WING', url: 'https://images.unsplash.com/photo-1527477396000-e27163b4bff0?w=600&q=80&fit=crop' },
    { key: 'CHICKEN LIVER', url: 'https://images.unsplash.com/photo-1607116665636-2506534bf0fe?w=600&q=80&fit=crop' },
    { key: 'CHICKEN KEEMA', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80&fit=crop' },
    { key: 'CHICKEN MINCE', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80&fit=crop' },
    { key: 'SEEKH KABAB', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80&fit=crop' },
    { key: 'TIKKA', url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80&fit=crop' },
    { key: 'TANDOORI', url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80&fit=crop' },
    { key: 'MARINATED', url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80&fit=crop' },
    { key: 'BONELESS CHICKEN', url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&q=80&fit=crop' },
    { key: 'CHICKEN CURRY', url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80&fit=crop' },
    { key: 'WHOLE CHICKEN', url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80&fit=crop' },
    // Mutton
    { key: 'PAYA', url: 'https://images.unsplash.com/photo-1601050690438-47c764de4f7c?w=600&q=80&fit=crop' },
    { key: 'TROTTER', url: 'https://images.unsplash.com/photo-1601050690438-47c764de4f7c?w=600&q=80&fit=crop' },
    { key: 'BHEJA', url: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=600&q=80&fit=crop' },
    { key: 'BRAIN', url: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=600&q=80&fit=crop' },
    { key: 'MUTTON CHOP', url: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=600&q=80&fit=crop' },
    { key: 'MUTTON RIB', url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80&fit=crop' },
    { key: 'MUTTON LEG', url: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=600&q=80&fit=crop' },
    { key: 'MUTTON LIVER', url: 'https://images.unsplash.com/photo-1624174503860-478de0ae2c09?w=600&q=80&fit=crop' },
    { key: 'MUTTON KEEMA', url: 'https://images.unsplash.com/photo-1603048588661-83ae09942a33?w=600&q=80&fit=crop' },
    { key: 'BIRYANI', url: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=600&q=80&fit=crop' },
    { key: 'MUTTON CURRY', url: 'https://images.unsplash.com/photo-1602491675983-c42bcf9a1a31?w=600&q=80&fit=crop' },
    { key: 'BONELESS MUTTON', url: 'https://images.unsplash.com/photo-1616659000060-7e7c3d4b7e19?w=600&q=80&fit=crop' },
    { key: 'LEAN MUTTON', url: 'https://images.unsplash.com/photo-1616659000060-7e7c3d4b7e19?w=600&q=80&fit=crop' },
    // Fish
    { key: 'SEER FISH', url: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&q=80&fit=crop' },
    { key: 'VANJARAM', url: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&q=80&fit=crop' },
    { key: 'POMFRET', url: 'https://images.unsplash.com/photo-1513267048331-5611cad62e41?w=600&q=80&fit=crop' },
    { key: 'MACKEREL', url: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=600&q=80&fit=crop' },
    { key: 'BANGDA', url: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=600&q=80&fit=crop' },
    { key: 'TILAPIA', url: 'https://images.unsplash.com/photo-1524704659695-9f52f440ee2d?w=600&q=80&fit=crop' },
    { key: 'BASA', url: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&q=80&fit=crop' },
    { key: 'SARDINE', url: 'https://images.unsplash.com/photo-1611171838489-f44f7264ccfd?w=600&q=80&fit=crop' },
    { key: 'KING FISH', url: 'https://images.unsplash.com/photo-1535398082218-038289bc9514?w=600&q=80&fit=crop' },
    { key: 'FISH STEAK', url: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600&q=80&fit=crop' },
    { key: 'FISH FILLET', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80&fit=crop' },
    { key: 'FISH CUBE', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80&fit=crop' },
    { key: 'FISH FINGER', url: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600&q=80&fit=crop' },
    { key: 'ROHU', url: 'https://images.unsplash.com/photo-1521503332462-8511790bf7e5?w=600&q=80&fit=crop' },
    { key: 'CATLA', url: 'https://images.unsplash.com/photo-1521503332462-8511790bf7e5?w=600&q=80&fit=crop' },
    // Seafood
    { key: 'LOBSTER', url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80&fit=crop' },
    { key: 'SQUID', url: 'https://images.unsplash.com/photo-1553744399-460b0f553051?w=600&q=80&fit=crop' },
    { key: 'CALAMARI', url: 'https://images.unsplash.com/photo-1553744399-460b0f553051?w=600&q=80&fit=crop' },
    { key: 'MUSSEL', url: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=600&q=80&fit=crop' },
    { key: 'CRAB', url: 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=600&q=80&fit=crop' },
    { key: 'TIGER PRAWN', url: 'https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?w=600&q=80&fit=crop' },
    { key: 'JUMBO PRAWN', url: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&q=80&fit=crop' },
    { key: 'MEDIUM PRAWN', url: 'https://images.unsplash.com/photo-1590759223965-d41fd464b7af?w=600&q=80&fit=crop' },
    { key: 'SMALL PRAWN', url: 'https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?w=600&q=80&fit=crop' },
    { key: 'PRAWN', url: 'https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?w=600&q=80&fit=crop' },
    // Gym
    { key: 'EGG WHITE', url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80&fit=crop' },
    { key: 'TURKEY', url: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=600&q=80&fit=crop' },
    { key: 'OMEGA', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80&fit=crop' },
    // Pet
    { key: 'CHICKEN FRAME', url: 'https://images.unsplash.com/photo-1610057099443-fde6c90db253?w=600&q=80&fit=crop' },
    { key: 'CHICKEN NECK', url: 'https://images.unsplash.com/photo-1610057099443-fde6c90db253?w=600&q=80&fit=crop' },
    { key: 'BONE BROTH', url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80&fit=crop' },
    { key: 'ORGAN MIX', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80&fit=crop' },
    { key: 'RAW FISH', url: 'https://images.unsplash.com/photo-1521503332462-8511790bf7e5?w=600&q=80&fit=crop' },
    { key: 'PET LIVER', url: 'https://images.unsplash.com/photo-1607116665636-2506534bf0fe?w=600&q=80&fit=crop' },
];

const CATEGORY_FALLBACKS: Record<string, string> = {
    CHICKEN: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80&fit=crop',
    MUTTON: 'https://images.unsplash.com/photo-1602491675983-c42bcf9a1a31?w=600&q=80&fit=crop',
    FISH: 'https://images.unsplash.com/photo-1521503332462-8511790bf7e5?w=600&q=80&fit=crop',
    PRAWNS: 'https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?w=600&q=80&fit=crop',
    GYM: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80&fit=crop',
    PET: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80&fit=crop',
    DEFAULT: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80&fit=crop',
};

// Looks up most specific keyword first, then category
const getAccurateImage = (name: string, category: string) => {
    const upper = name.toUpperCase();
    const match = PRODUCT_IMAGE_MAP.find(({ key }) => upper.includes(key));
    if (match) return match.url;
    return CATEGORY_FALLBACKS[category.toUpperCase()] || CATEGORY_FALLBACKS.DEFAULT;
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
    const keywordFallback = getAccurateImage(item.name, item.category);
    const initialFallback = item.image_url && item.image_url.length > 10 ? item.image_url : keywordFallback;
    const [imgSrc, setImgSrc] = useState(initialFallback);

    const router = useRouter();

    const handleError = () => {
        setImgSrc(initialFallback);
    };

    const [showSelector, setShowSelector] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedCut, setSelectedCut] = useState('Curry Cut');

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAction) {
            onAction();
            return;
        }
        setShowSelector(true);
    };

    const confirmAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Add to cart with quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(item, selectedCut);
        }
        setIsAdded(true);
        setShowSelector(false);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleNavigate = () => {
        router.push(`/butchers?q=${encodeURIComponent(item.name)}`);
    };

    const CUTS = ['Curry Cut', 'Biryani Cut', 'Boneless', 'Tandoori Cut', 'Minced'];

    const SelectorModal = () => (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setShowSelector(false); }}>
            <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                <div className="relative h-48 bg-slate-100">
                    <img src={imgSrc} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">{item.name}</h3>
                            <p className="text-xl font-black text-rose-600 italic">₹{item.price}</p>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Direct from local master butchers</p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Cut Style</label>
                        <div className="flex flex-wrap gap-2">
                            {CUTS.map(cut => (
                                <button
                                    key={cut}
                                    onClick={() => setSelectedCut(cut)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedCut === cut ? 'border-rose-600 bg-rose-50 text-rose-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                >
                                    {cut}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-4 border-y border-slate-50">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quantity (Units)</span>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-rose-100 transition-colors"><Minus className="w-4 h-4" /></button>
                                <span className="text-xl font-black italic w-8 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-rose-100 transition-colors"><Plus className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Price</span>
                            <p className="text-3xl font-black italic text-slate-900">₹{(Number(item.price) * quantity).toFixed(2)}</p>
                        </div>
                    </div>

                    <button
                        onClick={confirmAdd}
                        className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-xl"
                    >
                        Confirm Selection <ShoppingBag className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    if (variant === 'portrait') {
        return (
            <div className="group cursor-pointer" onClick={handleNavigate}>
                {showSelector && <SelectorModal />}
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
            {showSelector && <SelectorModal />}
            <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 mb-6 relative">
                <img
                    src={imgSrc}
                    alt={item.name}
                    onError={handleError}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-100 shadow-sm flex items-center gap-1.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-slate-900">Halal Certified</span>
                    </div>
                    <div className="bg-rose-600 px-2 py-1 rounded-lg shadow-sm flex items-center gap-1.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                        <ShieldCheck className="w-2.5 h-2.5 text-white" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-white">Bio-Secure</span>
                    </div>
                </div>
                <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-slate-900" />
                </div>
            </div>
            <div className="space-y-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.category}</p>
                    <h4 className="font-black text-slate-900 text-base uppercase tracking-tight line-clamp-1">{item.name}</h4>
                    {/* B7: Small Macro Indicator */}
                    {(item.protein_g || item.fat_g || item.calories) && (
                        <div className="flex gap-2 mt-2">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[7px] font-black text-slate-300 uppercase">Prot</span>
                                <div className="w-6 h-1 bg-blue-500 rounded-full" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[7px] font-black text-slate-300 uppercase">Fat</span>
                                <div className="w-6 h-1 bg-amber-500 rounded-full" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[7px] font-black text-slate-300 uppercase">Cal</span>
                                <div className="w-6 h-1 bg-rose-500 rounded-full" />
                            </div>
                        </div>
                    )}
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
