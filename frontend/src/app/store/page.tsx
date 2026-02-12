"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ShieldCheck, MapPin, Youtube, ShoppingBag, Clock, ChevronRight, Video, Target, Heart } from 'lucide-react';
import Link from 'next/link';

export default function StorePage() {
    const [activeTab, setActiveTab] = useState('LIVE'); // LIVE, PRODUCTS, ABOUT

    const STOCKS = [
        { name: 'Country Chicken (Natu Kodi)', price: '₹650', weight: '1kg+', img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80', status: 'In Stock' },
        { name: 'Potlam Mutton', price: '₹950', weight: '500g', img: 'https://images.unsplash.com/photo-1603048297172-c923170e2801?auto=format&fit=crop&w=800&q=80', status: 'Premium' },
        { name: 'Standard Broiler', price: '₹280', weight: '1kg', img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80', status: 'Fresh' },
        { name: 'Artisanal Mutton', price: '₹880', weight: '1kg', img: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=800&q=80', status: 'Hygienic' },
    ];

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            {/* DOMINATING HERO SECTION */}
            <section className="h-[90vh] relative overflow-hidden flex items-end">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80"
                        className="w-full h-full object-cover opacity-50 contrast-125 saturate-150"
                        alt="Flagship Store"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                <div className="container mx-auto px-4 pb-20 relative z-10">
                    <div className="max-w-6xl space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-4 bg-rose-600 px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.4em] shadow-2xl"
                        >
                            <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                            The Meathub Flagship
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: 'circOut' }}
                            className="text-8xl md:text-[14rem] font-black leading-[0.75] tracking-tighter uppercase italic"
                        >
                            HYPER <br />
                            <span className="text-rose-600 not-italic">REAL.</span>
                        </motion.h1>

                        <div className="flex flex-wrap items-center gap-10">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Official Location</p>
                                <p className="text-xl font-black uppercase italic flex items-center gap-2 tracking-tight">
                                    <MapPin className="w-5 h-5 text-rose-600" /> KPHB Phase 3, Main Road
                                </p>
                            </div>
                            <div className="h-12 w-px bg-white/10 hidden md:block" />
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Status</p>
                                <p className="text-xl font-black uppercase italic flex items-center gap-2 tracking-tight">
                                    <Video className="w-5 h-5 text-emerald-500" /> 24/7 Monitoring Active
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* EXPERIENCE NAVIGATION */}
            <div className="sticky top-20 z-[100] bg-slate-950/80 backdrop-blur-3xl border-b border-white/5">
                <div className="container mx-auto px-4 flex items-center justify-center gap-2 md:gap-12 py-6">
                    {['LIVE', 'CATALOG', 'STANDARDS'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all ${activeTab === tab ? 'bg-white text-slate-950 shadow-2xl scale-110' : 'text-slate-500 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* TAB CONTENT */}
            <section className="py-32 bg-slate-950">
                <div className="container mx-auto px-4">
                    <AnimatePresence mode="wait">
                        {activeTab === 'LIVE' && (
                            <motion.div
                                key="live"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-20 text-center"
                            >
                                <div className="space-y-6 max-w-4xl mx-auto">
                                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
                                        Transparency <br />
                                        <span className="text-rose-600">Re-imagined.</span>
                                    </h2>
                                    <p className="text-slate-400 text-lg font-medium italic leading-relaxed">
                                        Witness the gold standard of livestock hygiene and artisanal butchery through our live flagship streams. Certified birds, ethical sourcing, precision cleaning.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Bird Yard Stream */}
                                    <div className="group relative aspect-video rounded-[3.5rem] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
                                        <div className="absolute inset-0 bg-slate-950/20 z-10" />
                                        <img
                                            src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            alt="Live Bird Yard"
                                        />
                                        <div className="absolute top-10 left-10 z-20 flex items-center gap-3">
                                            <span className="h-3 w-3 rounded-full bg-rose-600 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl bg-slate-950/80 px-4 py-2 rounded-full backdrop-blur">Yard Cam 01</span>
                                        </div>
                                        <div className="absolute bottom-10 right-10 z-20">
                                            <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-2xl shadow-rose-900/40">
                                                <Play className="w-6 h-6 fill-white ml-1" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Butchery Stream */}
                                    <div className="group relative aspect-video rounded-[3.5rem] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
                                        <div className="absolute inset-0 bg-slate-950/20 z-10" />
                                        <img
                                            src="https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=1200"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            alt="Artisanal Butchery"
                                        />
                                        <div className="absolute top-10 left-10 z-20 flex items-center gap-3">
                                            <span className="h-3 w-3 rounded-full bg-rose-600 animate-ping" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl bg-slate-950/80 px-4 py-2 rounded-full backdrop-blur">Cutting Cam 04</span>
                                        </div>
                                        <div className="absolute bottom-10 right-10 z-20">
                                            <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-2xl shadow-rose-900/40">
                                                <Play className="w-6 h-6 fill-white ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'CATALOG' && (
                            <motion.div
                                key="catalog"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-16"
                            >
                                <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-10">
                                    <div className="space-y-4">
                                        <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.4em]">Flagship Inventory</span>
                                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Meathub Special <br /> Stock.</h2>
                                    </div>
                                    <div className="flex gap-4">
                                        {['ALL', 'CHICKEN', 'MUTTON', 'POTLAM'].map(f => (
                                            <button key={f} className="px-6 py-3 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all">{f}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {STOCKS.map((item, i) => (
                                        <div key={i} className="group bg-white/5 rounded-[2.5rem] p-8 border border-white/5 hover:border-rose-600/50 transition-all duration-500 shadow-xl space-y-6">
                                            <div className="aspect-square rounded-3xl overflow-hidden relative">
                                                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                                <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500">
                                                    {item.status}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-black uppercase italic tracking-tight">{item.name}</h3>
                                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Selected Breed Source</p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-2xl font-black text-rose-600 italic leading-none">{item.price}</p>
                                                    <button className="w-12 h-12 bg-white text-slate-950 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-2xl active:scale-90">
                                                        <ShoppingBag className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'STANDARDS' && (
                            <motion.div
                                key="standards"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-16"
                            >
                                <div className="space-y-8 p-12 bg-white/5 rounded-[3rem] border border-white/5">
                                    <ShieldCheck className="w-12 h-12 text-rose-600" />
                                    <h4 className="text-3xl font-black uppercase tracking-tighter italic">Bio-Secure <br /> Sourcing.</h4>
                                    <p className="text-slate-400 text-sm font-medium italic leading-relaxed">Every bird is scanned and certified before entry into our flagship yard.</p>
                                </div>
                                <div className="space-y-8 p-12 bg-white/5 rounded-[3rem] border border-white/5">
                                    <Target className="w-12 h-12 text-rose-600" />
                                    <h4 className="text-3xl font-black uppercase tracking-tighter italic">Artisanal <br /> Precision.</h4>
                                    <p className="text-slate-400 text-sm font-medium italic leading-relaxed">Cuts performed by senior master butchers with 15+ years experience.</p>
                                </div>
                                <div className="space-y-8 p-12 bg-white/5 rounded-[3rem] border border-white/5">
                                    <Heart className="w-12 h-12 text-rose-600" />
                                    <h4 className="text-3xl font-black uppercase tracking-tighter italic">Halal <br /> Integrated.</h4>
                                    <p className="text-slate-400 text-sm font-medium italic leading-relaxed">Traditional methods meets high-tech hygienic machinery for the purist result.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-40 relative">
                <div className="container mx-auto px-4">
                    <div className="bg-rose-600 rounded-[4rem] p-16 md:p-32 text-center space-y-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full" />
                        <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] relative z-10">
                            The Ultimate <br /> Experience.
                        </h2>
                        <div className="flex flex-wrap justify-center gap-8 relative z-10">
                            <button className="h-20 px-12 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] flex items-center gap-4 hover:scale-105 transition-all shadow-2xl">
                                BOOK A CUSTOM CUT <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
