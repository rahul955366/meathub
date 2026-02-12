"use client";

import React from 'react';
import Hero from '@/components/Hero';
import ProteinSelection from '@/components/ProteinSelection';
import TrendingMeats from '@/components/TrendingMeats';
import MarqueeBanner from '@/components/MarqueeBanner';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HomeContent({ initialItems = [] }: { initialButchers: any[], initialItems: any[] }) {
    return (
        <main className="min-h-screen bg-white">
            {/* 1. HERO */}
            <Hero />

            {/* 2. REPLACED STATIC BANNER WITH MOVING MARQUEE */}
            <MarqueeBanner />

            {/* 3. CATEGORY SELECTION - PREMIUM WITH REALISTIC IMAGES */}

            {/* 3. CATEGORY SELECTION - PREMIUM WITH CLEAR PURPOSE */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-4">
                    {/* Clear Instruction Header */}
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-2 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-rose-600" />
                            <span className="text-rose-600 text-xs font-black uppercase tracking-widest">Step 1: Choose Your Protein</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-[1.1] mb-6">
                            What Are You <br />
                            <span className="text-rose-600 not-italic">Cooking Today?</span>
                        </h2>
                        <p className="text-xl text-slate-600 font-medium leading-relaxed">
                            Click any category below to browse certified butcher shops specializing in that meat
                        </p>
                    </div>

                    <ProteinSelection />
                </div>
            </section>

            {/* 4. TRENDING - PREMIUM */}
            <section className="py-24 bg-gradient-to-br from-slate-50 to-white border-t border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full mb-4">
                            <span className="text-emerald-600 text-xs font-black uppercase tracking-widest">Most Ordered</span>
                        </div>
                        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-slate-900 mb-3">
                            Trending <span className="text-rose-600 not-italic">This Week</span>
                        </h3>
                        <p className="text-slate-600 text-lg font-medium">Best-selling cuts across Hyderabad</p>
                    </div>
                    <TrendingMeats items={initialItems} />
                </div>
            </section>

            {/* 5. SUBSCRIPTION CTA - PREMIUM */}
            <section className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1920&q=80&sig=50')] bg-cover bg-center opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-2 rounded-full">
                            <Clock className="w-4 h-4 text-rose-400" />
                            <span className="text-white text-xs font-black uppercase tracking-widest">Save 30% Every Order</span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-[1.1]">
                            Never Run Out <br />
                            <span className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Of Fresh Protein</span>
                        </h2>

                        <p className="text-2xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
                            Subscribe for daily, weekly, or monthly deliveries. <br className="hidden md:block" />
                            <span className="font-black text-white">Fresh meat on autopilot.</span>
                        </p>

                        <Link
                            href="/subscriptions"
                            className="inline-flex items-center gap-3 h-16 px-12 bg-gradient-to-r from-rose-600 to-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:scale-105 transition-all shadow-xl group"
                        >
                            Explore Subscription Plans
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>

                        <div className="flex items-center justify-center gap-8 pt-8 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span>Cancel Anytime</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span>Free Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span>Priority Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
