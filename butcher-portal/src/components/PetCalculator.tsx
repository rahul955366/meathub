"use client";
// Last Updated: 2026-02-18T15:03:00Z

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Hash, Info, Bone, ArrowRight } from 'lucide-react';

export default function PetCalculator() {
    const [petWeight, setPetWeight] = useState<number>(10);
    const [ageGroup, setAgeGroup] = useState<'PUP' | 'ADULT' | 'SENIOR'>('ADULT');
    const [breedGroup, setBreedGroup] = useState<'SMALL' | 'MEDIUM' | 'LARGE_WORKING'>('MEDIUM');
    const [dailyMeat, setDailyMeat] = useState<number>(0);
    const [monthlyCost, setMonthlyCost] = useState<number>(0);

    const BREEDS = [
        { id: 'SMALL', label: 'Toy/Small', multiplier: 0.035, note: 'High metabolism, needs small frequent meals.' },
        { id: 'MEDIUM', label: 'Standard/Medium', multiplier: 0.03, note: 'Balanced protein-to-fat ratio recommended.' },
        { id: 'LARGE_WORKING', label: 'Large/Working', multiplier: 0.04, note: 'High caloric demand, requires joint-support organs.' }
    ];

    useEffect(() => {
        const breed = BREEDS.find(b => b.id === breedGroup) || BREEDS[1];
        let ageMultiplier = breed.multiplier;

        if (ageGroup === 'PUP') ageMultiplier *= 1.5;
        if (ageGroup === 'SENIOR') ageMultiplier *= 0.8;

        const daily = (petWeight * ageMultiplier * 1000);
        setDailyMeat(Math.round(daily));

        // Approx cost check: ₹300 per kg average
        setMonthlyCost(Math.round((daily / 1000) * 300 * 30));
    }, [petWeight, ageGroup, breedGroup]);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Calculator Form */}
                    <div className="flex-1 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter">
                                Breed-Specific <br /> <span className="text-rose-600 not-italic">Nutrition AI.</span>
                            </h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] italic">Precision ancestral diet mapping for your specific companion</p>
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
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Breed Profile</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {BREEDS.map((breed) => (
                                        <button
                                            key={breed.id}
                                            onClick={() => setBreedGroup(breed.id as any)}
                                            className={`p-4 rounded-2xl border-2 transition-all text-left ${breedGroup === breed.id ? 'border-rose-600 bg-white shadow-lg' : 'border-slate-200 bg-white opacity-60 hover:opacity-100'}`}
                                        >
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">{breed.label}</p>
                                            <p className="text-[8px] font-bold text-slate-400 mt-1 leading-tight">{breed.note}</p>
                                        </button>
                                    ))}
                                </div>
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
                                key={`DEBUG-DAILY-${dailyMeat}-${breedGroup}`}
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
                                key={`DEBUG-COST-${monthlyCost}-${ageGroup}`}
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

                            <div className="sm:col-span-2 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ancestral Ratio (BARF Model)</h4>
                                    <span className="text-[8px] font-black uppercase tracking-widest bg-slate-900 text-white px-3 py-1 rounded-full">Biological Correctness</span>
                                </div>
                                
                                <div className="flex w-full h-8 rounded-full overflow-hidden shadow-inner border border-white">
                                    <div className="h-full bg-rose-600 transition-all duration-1000" style={{ width: '80%' }} title="80% Muscle Meat" />
                                    <div className="h-full bg-slate-300 transition-all duration-1000" style={{ width: '10%' }} title="10% Edible Bone" />
                                    <div className="h-full bg-rose-900 transition-all duration-1000" style={{ width: '5%' }} title="5% Liver" />
                                    <div className="h-full bg-amber-600 transition-all duration-1000" style={{ width: '5%' }} title="5% Other Organs" />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Muscle', val: '80%', color: 'bg-rose-600' },
                                        { label: 'Bone', val: '10%', color: 'bg-slate-300' },
                                        { label: 'Liver', val: '5%', color: 'bg-rose-900' },
                                        { label: 'Secretory', val: '5%', color: 'bg-amber-600' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                            <div>
                                                <p className="text-[8px] font-black text-slate-400 uppercase leading-none">{item.label}</p>
                                                <p className="text-xs font-black text-slate-900 mt-0.5">{item.val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="sm:col-span-2 bg-rose-600 p-8 rounded-[2.5rem] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 group cursor-pointer hover:bg-rose-700 transition-all"
                                onClick={() => window.location.href = '/pet'}
                            >
                                <div className="space-y-1 text-center sm:text-left">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Ready to feed?</p>
                                    <h3 className="text-2xl font-black text-white italic">Source Approved Meat</h3>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white group-hover:translate-x-2 transition-transform">
                                    <ArrowRight className="w-6 h-6" />
                                </div>
                            </motion.div>

                            <div className="sm:col-span-2 bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                    <Info className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-xs font-bold text-emerald-800 leading-relaxed italic">
                                    This calculation uses standard metabolic rates for {BREEDS.find(b => b.id === breedGroup)?.label} breeds.
                                    The 80/10/5/5 BARF model is applied for optimal nutrient density.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
