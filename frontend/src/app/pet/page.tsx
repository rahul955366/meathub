"use client";

import React, { useState } from 'react';
import { getMeatItems } from '@/lib/api';
import { Heart, ShieldCheck, Recycle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import SubscriptionForm from '@/components/SubscriptionForm';
import NutritionAssistant from '@/components/NutritionAssistant';
import PetCalculator from '@/components/PetCalculator';
import { MeatItem } from '@/types';

export default function PetPage() {
    const [items, setItems] = useState<MeatItem[]>([]);
    const [activeSubscriptionType, setActiveSubscriptionType] = useState<'PET' | null>(null);

    React.useEffect(() => {
        getMeatItems().then(setItems);
    }, []);

    const handleSubscribe = () => {
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
        .slice(0, 12)
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

            {/* Products Selection */}
            <section className="py-24 container mx-auto px-4">
                <div className="flex items-center justify-between mb-16">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Daily Essentials</h2>
                        <div className="h-1.5 w-16 bg-rose-600 mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {petProducts.length > 0 ? (
                        petProducts.map((item: MeatItem) => (
                            <ProductCard
                                key={item.id}
                                item={item}
                                variant="portrait"
                                buttonLabel="SUBSCRIBE"
                                onAction={handleSubscribe}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">Our master butchers are preparing fresh pet cuts...</p>
                        </div>
                    )}
                </div>
            </section>

            <NutritionAssistant context="PET" />

            {/* Sub Modal */}
            {activeSubscriptionType && (
                <SubscriptionForm
                    type={activeSubscriptionType}
                    planId="Zero Waste"
                    onClose={() => setActiveSubscriptionType(null)}
                />
            )}
        </main>
    );
}
