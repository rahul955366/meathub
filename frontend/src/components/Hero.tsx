"use client";

import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <div className="relative bg-slate-900 text-white overflow-hidden min-h-[85vh] flex items-center">
            {/* Background with Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                    className="w-full h-full"
                >
                    <img
                        src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1920&q=80&sig=50"
                        alt="Fresh Meat"
                        className="w-full h-full object-cover opacity-30"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 py-20">
                <div className="max-w-4xl space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600/20 border border-rose-600/30 backdrop-blur-md rounded-full mb-6">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-rose-400 text-xs font-black uppercase tracking-widest">100% Bio-Secure Certified</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6">
                            Master <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Butchers.</span> <br />
                            <span className="text-rose-600 italic">Direct to You.</span>
                        </h1>
                        <p className="text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed mb-8">
                            Premium cuts from local artisans, delivered in <span className="text-white font-bold">45 minutes</span>.
                        </p>
                    </motion.div>

                    {/* Global Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-2xl"
                    >
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                                if (query) window.location.href = `/butchers?q=${encodeURIComponent(query)}`;
                            }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-rose-600/20 blur-2xl group-focus-within:bg-rose-600/40 transition-all rounded-3xl" />
                            <div className="relative flex items-center bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-2 h-20 shadow-2xl group-focus-within:border-white/40 transition-all">
                                <div className="pl-6 pr-4 border-r border-white/10 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50 whitespace-nowrap">Global Search</span>
                                </div>
                                <input
                                    name="search"
                                    type="text"
                                    placeholder="Search for Mutton Brain, Chicken Liver, etc..."
                                    className="flex-1 bg-transparent px-6 text-lg font-black placeholder:text-white/20 outline-none uppercase tracking-tight text-white italic"
                                />
                                <button
                                    type="submit"
                                    className="h-16 px-8 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all active:scale-95 flex items-center gap-2"
                                >
                                    Find Meat <Search className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link
                            href="/butchers"
                            className="h-16 px-10 bg-slate-900/50 hover:bg-slate-900 border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105"
                        >
                            Browse All Shops <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/store"
                            className="h-16 px-10 bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-colors hover:border-white/30"
                        >
                            Watch Live
                        </Link>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap gap-8 pt-8 border-t border-white/10"
                    >
                        {[
                            { label: 'Cold Chain Verified', color: 'bg-emerald-500' },
                            { label: 'FSSAI Certified', color: 'bg-emerald-500' },
                            { label: 'Antibiotic Free', color: 'bg-emerald-500' }
                        ].map((badge, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 ${badge.color} rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]`} />
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{badge.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
