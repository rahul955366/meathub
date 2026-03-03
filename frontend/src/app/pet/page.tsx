"use client";

import React, { useState, useEffect } from 'react';
import { getMeatItems, fetchPetFoodProducts, fetchWasteCollections } from '@/lib/api';
import { Heart, ShieldCheck, Recycle, CheckCircle, Scissors } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from '@/components/ProductCard';
import SubscriptionForm from '@/components/SubscriptionForm';
import NutritionAssistant from '@/components/NutritionAssistant';
import PetCalculator from '@/components/PetCalculator';
import PetProfileForm from '@/components/PetProfileForm';
import { MeatItem } from '@/types';

export default function PetPage() {
    const [showPetForm, setShowPetForm] = useState(false);
    const [items, setItems] = useState<MeatItem[]>([]);
    const [petFoodProducts, setPetFoodProducts] = useState<any[]>([]);
    const [wasteCollections, setWasteCollections] = useState<any[]>([]);
    const [activeSubscriptionType, setActiveSubscriptionType] = useState<'PET' | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

    useEffect(() => {
        getMeatItems().then(setItems);
        fetchPetFoodProducts().then(setPetFoodProducts);
        fetchWasteCollections().then(setWasteCollections);
    }, []);

    const handleSubscribe = (itemId?: number) => {
        if (itemId) setSelectedItemId(itemId);
        setActiveSubscriptionType('PET');
    };

    // Curated high-quality pet nutrition images
    const PET_IMAGES = [
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80', // Dog meat
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80', // Bone
        'https://images.unsplash.com/photo-1603513335552-32903511b850?auto=format&fit=crop&w=800&q=80', // Raw organ
        'https://images.unsplash.com/photo-1610471675124-954955f01344?auto=format&fit=crop&w=800&q=80', // Chicken frame
        'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=800&q=80', // Raw liver
        'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=800&q=80'  // Meat blocks
    ];

    // Filter for pet-appropriate items and ensure UNIQUE product names
    const petMap = new Map<string, MeatItem>();
    items.forEach((item: MeatItem) => {
        const categoryMatch = item.category?.toUpperCase() === 'PET';
        const nameMatch = ['dog', 'cat', 'raw', 'organ', 'bone', 'liver', 'frame'].some(keyword =>
            item.name.toLowerCase().includes(keyword)
        );

        if ((categoryMatch || nameMatch) && item.status === 'AVAILABLE') {
            const normalizedName = item.name.toLowerCase().trim();
            if (!petMap.has(normalizedName)) {
                petMap.set(normalizedName, item);
            }
        }
    });

    const petProducts = Array.from(petMap.values())
        .map((item, index) => {
            const imageIndex = (item.id + index) % PET_IMAGES.length;
            return {
                ...item,
                image_url: item.image_url && item.image_url.length > 10 ? item.image_url : PET_IMAGES[imageIndex]
            };
        });

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center overflow-hidden bg-rose-950">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1920&sig=pet_hero"
                        className="w-full h-full object-cover opacity-50"
                        alt="Companion Care"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-950 via-rose-950/60 to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl space-y-8">
                        <span className="text-rose-400 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                            <Heart className="w-4 h-4" /> COMPANION CARE
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
                            Zero-Waste <br /> <span className="text-rose-500 not-italic">Pet Nutrition.</span>
                        </h1>
                        <p className="text-lg text-slate-300 font-medium italic leading-relaxed">
                            Ethically sourced organ meats and fresh bones. Pure, natural, and nutrient-dense
                            meat that respects the whole animal and your pet's health.
                        </p>
                        <div className="flex gap-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-white font-black text-2xl tracking-tighter italic">100%</span>
                                <span className="text-rose-400 text-[10px] font-black uppercase tracking-widest">Natural Meat</span>
                            </div>
                            <div className="w-px h-12 bg-rose-800" />
                            <div className="flex flex-col gap-1">
                                <span className="text-white font-black text-2xl tracking-tighter italic">Zero</span>
                                <span className="text-rose-400 text-[10px] font-black uppercase tracking-widest">Preservatives</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: ShieldCheck, title: "Ancillary Cuts", desc: "Healthy organ meats that usually go to waste." },
                            { icon: Heart, title: "High Protein", desc: "Lean muscle meat specifically for pet growth." },
                            { icon: Recycle, title: "Zero Waste", desc: "Sustainable sourcing that utilizes every part." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 items-start text-slate-900">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center flex-shrink-0 text-rose-500">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-black uppercase tracking-tighter">{item.title}</h4>
                                    <p className="text-slate-500 text-sm font-medium italic">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <PetCalculator />

            {/* Pet Profile Form (W12) */}
            <section className="py-20 bg-white border-b border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-16 px-4">
                        <div>
                            <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.4em]">Personalization</span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase italic">Your Pet's Profile.</h2>
                        </div>
                    </div>
                    {showPetForm ? (
                        <div className="flex justify-center">
                            <PetProfileForm 
                                onSave={(data) => {
                                    console.log('Saved pet profile:', data);
                                    setShowPetForm(false);
                                    toast.success("Pet profile saved for premium tailoring!");
                                }} 
                                onCancel={() => setShowPetForm(false)} 
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 space-y-8 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-xl">
                                <Heart className="w-10 h-10" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic">No <span className="text-rose-600">Profiles</span> Found.</h3>
                                <p className="text-sm font-medium text-slate-400 mt-2 uppercase tracking-widest italic">Create a profile to unlock personalized nutrition.</p>
                            </div>
                            <button 
                                onClick={() => setShowPetForm(true)}
                                className="h-16 px-10 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all shadow-xl active:scale-95"
                            >
                                + Add New Pet Profile
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Products Selection */}
            <section className="py-24 container mx-auto px-4 bg-white">
                <div className="flex items-center justify-between mb-16 px-4">
                    <div>
                        <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.4em]">Curated Cuts</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase italic">Daily Essentials.</h2>
                    </div>
                    <div className="w-1/3 h-px bg-slate-100" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {petProducts.length > 0 ? (
                        petProducts.map((item: any) => (
                            <ProductCard
                                key={item.id}
                                item={item}
                                variant="portrait"
                                buttonLabel="ACTIVATE"
                                onAction={() => handleSubscribe(item.id)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">Sourcing fresh organ meats from village artisans...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Butcher Waste Collections (Phase 18) ── */}
            {(Array.isArray(wasteCollections) ? wasteCollections : []).filter((w: any) => w.is_available).length > 0 && (
                <section className="py-16 bg-slate-100">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                                <Scissors className="w-5 h-5 text-rose-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">Available Waste Cuts</h2>
                                <p className="text-slate-500 text-sm mt-0.5">Fresh ancillary cuts from certified butchers — ethically sourced</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(Array.isArray(wasteCollections) ? wasteCollections : []).filter((w: any) => w.is_available).map((wc: any) => (
                                <div key={wc.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:border-rose-300 hover:shadow-md transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                                        <Recycle className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-900 text-sm capitalize">{wc.waste_type?.replace(/_/g, ' ') || 'Cut'}</p>
                                        <p className="text-slate-400 text-xs">{wc.quantity_kg} kg available</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-black text-rose-600 text-lg">₹{parseFloat(wc.price_per_kg).toFixed(0)}</p>
                                        <p className="text-slate-400 text-[10px] font-bold">per kg</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Vet-Approved Pet Food Products (Phase 18 — from backend) ── */}
            {Array.isArray(petFoodProducts) && petFoodProducts.length > 0 && (
                <section className="py-20 bg-rose-950">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-3 mb-10">
                            <CheckCircle className="text-green-400 w-6 h-6" />
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Vet-Approved Blends</h2>
                                <p className="text-rose-300 text-sm mt-1">Formulated by veterinary nutritionists. 100% organ-based.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {petFoodProducts.map((pf: any) => (
                                <div key={pf.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 hover:border-rose-500/40 transition-all">
                                    {pf.image_url && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={pf.image_url} alt={pf.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-white text-sm">{pf.name}</span>
                                            {pf.is_vet_approved && (
                                                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold">
                                                    <CheckCircle size={10} /> VET OK
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-white/50 text-xs mb-2 line-clamp-2">{pf.description}</p>
                                        <p className="text-white/40 text-xs mb-3 italic">{pf.ingredients}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-rose-400 font-black text-lg">₹{pf.price}</span>
                                            <button onClick={() => handleSubscribe(pf.id)} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-all">
                                                SUBSCRIBE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <NutritionAssistant context="PET" />

            {/* Sub Modal */}
            {activeSubscriptionType && (
                <SubscriptionForm
                    type={activeSubscriptionType}
                    planId="Zero Waste"
                    initialItemId={selectedItemId || undefined}
                    onClose={() => {
                        setActiveSubscriptionType(null);
                        setSelectedItemId(null);
                    }}
                />
            )}
        </main>
    );
}
