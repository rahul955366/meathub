"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Weight, Zap, Flame } from 'lucide-react';

export default function ProteinCalculator() {
    const [weight, setWeight] = useState<number>(70);
    const [activity, setActivity] = useState<number>(1.6); // Multiplier: 1.2 to 2.2
    const [protein, setProtein] = useState<number>(0);
    const [meatReq, setMeatReq] = useState<number>(0);

    useEffect(() => {
        const p = weight * activity;
        setProtein(Math.round(p));
        // Assuming 25g protein per 100g lean meat
        setMeatReq(Math.round((p / 25) * 100));
    }, [weight, activity]);

    return (
        <section className="py-24 bg-slate-900 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-600 to-transparent opacity-20" />

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Input Controls */}
                    <div className="flex-1 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-black text-white leading-tight tracking-tighter uppercase italic">
                                Calculate Your <br /> <span className="text-rose-600 not-italic">Muscle Fuel.</span>
                            </h2>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Precision nutrition for peak performance</p>
                        </div>

                        <div className="space-y-8 bg-slate-950/50 p-8 rounded-[3rem] border border-slate-800 backdrop-blur-xl">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Body Weight (KG)</label>
                                    <span className="text-2xl font-black text-white italic underline decoration-rose-600 underline-offset-4">{weight} KG</span>
                                </div>
                                <input
                                    type="range"
                                    min="40"
                                    max="150"
                                    value={weight}
                                    onChange={(e) => setWeight(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-600"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Activity Level</label>
                                    <span className="text-2xl font-black text-white italic text-right">
                                        {activity <= 1.2 ? 'Sedentary' : activity <= 1.6 ? 'Moderate' : 'Elite'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Base', val: 1.2, icon: Target },
                                        { label: 'Active', val: 1.6, icon: Zap },
                                        { label: 'Elite', val: 2.2, icon: Flame }
                                    ].map((opt) => (
                                        <button
                                            key={opt.val}
                                            onClick={() => setActivity(opt.val)}
                                            className={`py-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${activity === opt.val ? 'border-rose-600 bg-rose-600/10 text-rose-500' : 'border-slate-800 hover:border-slate-700 text-slate-500'}`}
                                        >
                                            <opt.icon className="w-5 h-5" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Output Cards */}
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <motion.div
                            key={`DEBUG-PROT-${protein}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-10 bg-white rounded-[3.5rem] flex flex-col items-center text-center space-y-4 shadow-2xl shadow-rose-900/20"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-2">
                                <Weight className="w-8 h-8 text-rose-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Protein</p>
                                <p className="text-6xl font-black text-slate-900 tracking-tighter italic">{protein}G</p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Daily Intake</p>
                            </div>
                        </motion.div>

                        <motion.div
                            key={`DEBUG-MEAT-${meatReq}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="p-10 bg-rose-600 rounded-[3.5rem] flex flex-col items-center text-center space-y-4 shadow-2xl shadow-rose-600/40"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-2">
                                <Target className="w-8 h-8 text-rose-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-200">Meat Required</p>
                                <p className="text-6xl font-black text-white tracking-tighter italic">{meatReq}G</p>
                                <p className="text-[10px] text-rose-100 font-black uppercase tracking-widest mt-2">Lean Premium Cut</p>
                            </div>
                        </motion.div>

                        <div className="sm:col-span-2 bg-slate-950 p-8 rounded-[3rem] border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Scientific Model Based on Leucic Activation</p>
                            </div>
                            <button className="text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-all">
                                VIEW DATA SHEET
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
