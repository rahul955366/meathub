"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Hash, Info, Bone } from 'lucide-react';

export default function PetCalculator() {
    const [petWeight, setPetWeight] = useState<number>(10);
    const [ageGroup, setAgeGroup] = useState<'PUP' | 'ADULT' | 'SENIOR'>('ADULT');
    const [dailyMeat, setDailyMeat] = useState<number>(0);
    const [monthlyCost, setMonthlyCost] = useState<number>(0);

    useEffect(() => {
        let multiplier = 0.03; // 3% of body weight for adult
        if (ageGroup === 'PUP') multiplier = 0.05;
        if (ageGroup === 'SENIOR') multiplier = 0.02;

        const daily = (petWeight * multiplier * 1000);
        setDailyMeat(Math.round(daily));

        // Approx cost check: ₹300 per kg average
        setMonthlyCost(Math.round((daily / 1000) * 300 * 30));
    }, [petWeight, ageGroup]);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Calculator Form */}
                    <div className="flex-1 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter">
                                Bio-Correct <br /> <span className="text-rose-600 not-italic">Feeding Math.</span>
                            </h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] italic">Expert-led calculations for raw meat transition</p>
                        </div>

                        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-10">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pet Weight (KG)</label>
                                    <span className="text-3xl font-black text-slate-900 italic tracking-tighter decoration-rose-600 underline underline-offset-8">{petWeight} KG</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="60"
                                    value={petWeight}
                                    onChange={(e) => setPetWeight(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Life Stage</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Growth', id: 'PUP' as const },
                                        { label: 'Active', id: 'ADULT' as const },
                                        { label: 'Senior', id: 'SENIOR' as const }
                                    ].map((stage) => (
                                        <button
                                            key={stage.id}
                                            onClick={() => setAgeGroup(stage.id)}
                                            className={`py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] transition-all ${ageGroup === stage.id ? 'border-rose-600 bg-white text-rose-600 shadow-lg' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'}`}
                                        >
                                            {stage.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Result Output */}
                    <div className="flex-1 w-full relative">
                        {/* Decorative circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-50 rounded-full blur-3xl opacity-50" />

                        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <motion.div
                                key={dailyMeat}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-6 text-center"
                            >
                                <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center mx-auto">
                                    <Bone className="w-8 h-8 text-rose-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Daily Quota</p>
                                    <p className="text-5xl font-black text-slate-900 tracking-tighter italic">{dailyMeat}G</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-2 italic">Pure Ancestral Diet</p>
                                </div>
                            </motion.div>

                            <motion.div
                                key={monthlyCost}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl space-y-6 text-center text-white"
                            >
                                <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mx-auto">
                                    <Hash className="w-8 h-8 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Monthly Cost</p>
                                    <p className="text-5xl font-black text-rose-500 tracking-tighter italic">₹{monthlyCost}</p>
                                    <p className="text-[10px] font-bold text-white/40 mt-2 italic">Subscription Savings Included</p>
                                </div>
                            </motion.div>

                            <div className="sm:col-span-2 bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                    <Info className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-xs font-bold text-emerald-800 leading-relaxed italic">
                                    This calculation is based on the BARF (Biologically Appropriate Raw Food) model for healthy companions.
                                    Consult our vet partners for specific medical conditions.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
