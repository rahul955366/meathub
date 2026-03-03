"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
        if (query) router.push(`/shop?q=${encodeURIComponent(query)}`);
    };

    return (
        <div className="relative bg-slate-900 text-white overflow-hidden min-h-[90vh] flex items-center">
            {/* High-Fidelity Video/Image Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1628102431502-990710609653?auto=format&fit=crop&w=1920&q=80"
                    alt="Artisanal Meat Cutting"
                    className="w-full h-full object-cover opacity-40 scale-105"
                />
            </div>

            <div className="relative container mx-auto px-4 py-20 z-20">
                <div className="max-w-4xl space-y-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <span className="text-rose-500 text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3">
                            <span className="w-8 h-px bg-rose-500" /> DIRECT FROM LOCAL BUTCHERS
                        </span>
                        <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter uppercase italic">
                            Fresh Meat. <br />
                            <span className="text-rose-600 not-italic">No Compromise.</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-medium italic max-w-xl">
                            The transparency you deserve. Watch your meat being cut, know your source, and get it delivered in 45 minutes.
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
                            onSubmit={handleSearch}
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
                            className="h-16 px-10 bg-rose-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-rose-700 hover:scale-105 transition-all shadow-xl shadow-rose-900/40 group"
                        >
                            Start Sourcing <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <Link
                            href="/store"
                            className="h-16 px-10 bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-colors hover:border-white/30 group"
                        >
                            <Play className="w-5 h-5 fill-white" /> Cutting Video Proof
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
