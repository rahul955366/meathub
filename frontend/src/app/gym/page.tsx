"use client";

import React, { useState } from 'react';
import { getMeatItems } from '@/lib/api';
import { Zap, Target, Award } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import SubscriptionForm from '@/components/SubscriptionForm';
import NutritionAssistant from '@/components/NutritionAssistant';
import ProteinCalculator from '@/components/ProteinCalculator';
import { MeatItem } from '@/types';

export default function GymPage() {
    const [items, setItems] = useState<MeatItem[]>([]);
    const [activeSubscriptionType, setActiveSubscriptionType] = useState<'GYM' | null>(null);
    const [selectedPlan, setSelectedPlan] = useState('Maintenance');

    React.useEffect(() => {
        getMeatItems().then(setItems);
    }, []);

    const handleStartProtocol = (planName: string) => {
        setSelectedPlan(planName);
        setActiveSubscriptionType('GYM');
    };

    // Curated high-quality fitness/meat images
    // Curated high-quality fitness/meat images - Expanded for variety
    const GYM_IMAGES = [
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80', // Steak
        'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80', // Chicken Breast
        'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=800&q=80', // Lean Beef
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', // Salad with Meat
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', // Healthy Bowl
        'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=800&q=80', // Steak Plate
        'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80', // Raw Meat
        'https://images.unsplash.com/photo-1551024601-56455b245a61?auto=format&fit=crop&w=800&q=80', // Grilled Chicken
        'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80', // Turkey Breast
        'https://images.unsplash.com/photo-1533777857419-3746f8ec1021?auto=format&fit=crop&w=800&q=80'  // Salmon Fillet (Prot)
    ];

    // Filter for protein-heavy items and ensure UNIQUE product names across multiple butchers
    const nameMap = new Map<string, MeatItem>();
    items.forEach(item => {
        const categoryMatch = item.category?.toUpperCase() === 'GYM' || item.category?.toUpperCase() === 'CHICKEN';
        const nameMatch = ['breast', 'lean', 'steak', 'thigh', 'salad', 'salmon'].some(keyword =>
            item.name.toLowerCase().includes(keyword)
        );

        if (categoryMatch || nameMatch) {
            const normalizedName = item.name.toLowerCase().trim();
            // Only keep the first encounter or the cheapest one (better UX)
            if (!nameMap.has(normalizedName)) {
                nameMap.set(normalizedName, item);
            } else {
                const existing = nameMap.get(normalizedName)!;
                if (parseFloat(item.price) < parseFloat(existing.price)) {
                    nameMap.set(normalizedName, item);
                }
            }
        }
    });

    const proteinProducts = Array.from(nameMap.values())
        .slice(0, 15) // Limit to top 15 variety cuts
        .map((item, index) => {
            // Enhanced deterministic visual assignment using modulo on ID and index
            const imageIndex = (Number(item.id) + index) % GYM_IMAGES.length;
            return {
                ...item,
                image_url: item.image_url && item.image_url.length > 10 ? item.image_url : GYM_IMAGES[imageIndex]
            };
        });

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1920&sig=gym_hero"
                        className="w-full h-full object-cover opacity-30"
                        alt="Performance Fitness"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl space-y-8">
                        <span className="text-rose-500 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                            <Zap className="w-4 h-4 fill-rose-500" /> PERFORMANCE FUEL
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
                            Daily 250g <br /> <span className="text-rose-600 not-italic underline decoration-white underline-offset-8">Protein Target.</span>
                        </h1>
                        <p className="text-lg text-slate-400 font-medium italic leading-relaxed">
                            Precision-cut lean meats for the dedicated athlete. Zero prep, maximum gains.
                            Subscribed, sliced, and delivered fresh to your post-workout window.
                        </p>
                        <div className="flex gap-10">
                            {[
                                { val: "250g", label: "Daily Serving" },
                                { val: "Lean", label: "Pure Protein" },
                                { val: "Fresh", label: "Never Frozen" }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <span className="text-white font-black text-3xl tracking-tighter italic">{stat.val}</span>
                                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <ProteinCalculator />

            {/* Plans Section */}
            <section className="py-24 bg-white text-slate-900 border-y border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                        <h2 className="text-5xl font-black tracking-tighter uppercase italic">The Protocol.</h2>
                        <p className="text-slate-500 font-medium italic">Choose the plan that matches your training intensity.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Maintenance", qty: "250g", price: "4,499", icon: Target },
                            { name: "Bulk Phase", qty: "500g", price: "8,299", icon: Award },
                            { name: "Elite Athlete", qty: "1kg", price: "15,499", icon: Zap }
                        ].map((plan, i) => (
                            <div key={i} className={`p-10 rounded-[3rem] border-2 transition-all duration-500 group ${i === 1 ? 'border-rose-600 bg-slate-950 text-white shadow-2xl scale-105 z-10' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${i === 1 ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'}`}>
                                    <plan.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-2 mb-8">
                                    <span className="text-4xl font-black tracking-tighter italic">₹{plan.price}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">/ Month</span>
                                </div>
                                <ul className="space-y-4 mb-10 text-sm font-bold uppercase tracking-tight opacity-70">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-current" /> {plan.qty} Daily Serving</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-current" /> 6 AM Door-Step Delivery</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-current" /> Pre-sliced for Cooking</li>
                                </ul>
                                <button
                                    onClick={() => handleStartProtocol(plan.name)}
                                    className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${i === 1 ? 'bg-rose-600 text-white hover:bg-white hover:text-rose-600' : 'bg-slate-900 text-white hover:bg-rose-600'}`}>
                                    Start Protocol
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sub Modal */}
                {activeSubscriptionType && (
                    <SubscriptionForm
                        type={activeSubscriptionType}
                        planId={selectedPlan}
                        onClose={() => setActiveSubscriptionType(null)}
                    />
                )}

                <NutritionAssistant context="GYM" />

                {/* Products Grid */}
                <div className="container mx-auto px-4 mt-24">
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Power Cuts</h2>
                            <div className="h-1.5 w-16 bg-rose-600 mt-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                        {proteinProducts.length > 0 ? (
                            proteinProducts.map((item: MeatItem) => (
                                <ProductCard key={item.id} item={item} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">Muscle fuel arriving soon from our village sources...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
