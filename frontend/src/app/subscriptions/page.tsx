"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Zap,
    ShieldCheck,
    ArrowRight,
    Clock,
    RefreshCcw,
    Target,
    CheckCircle2,
    Crown
} from 'lucide-react';
import SubscriptionForm from '../../components/SubscriptionForm';

export default function SubscriptionsPage() {
    const [selectedPlan, setSelectedPlan] = useState('MONTHLY');
    const [activeSubscriptionType, setActiveSubscriptionType] = useState<'GENERAL' | 'GYM' | 'PET' | null>(null);

    const PLANS = [
        {
            id: 'WEEKLY',
            name: 'Artisan Weekly',
            price: '₹2,400',
            period: 'per month',
            desc: '4 Deliveries / Month',
            features: ['Select preferred Sunday slot', 'Master Butcher priority', 'Standard Broiler or Mutton', 'Free Delivery']
        },
        {
            id: 'MONTHLY',
            name: 'Concierge Monthly',
            price: '₹8,500',
            period: 'per month',
            desc: 'Daily or Custom Schedule',
            features: ['Early 6AM Priority Drops', 'Sunday Auto-Dispatch (No check-in)', 'Potlam Mutton Access', 'Natu Kodi (Flagship) Included', 'Live Video Verification']
        },
        {
            id: 'YEARLY',
            name: 'Elite Annual',
            price: '₹95,000',
            period: 'per year',
            desc: 'Ultimate Price Protection',
            features: ['Locked-in rates for 12 months', 'Exclusive Festival Cuts', '24/7 Concierge Support', 'Flagship Private Events', 'Bio-Secure Farm Access']
        }
    ];

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);
        setActiveSubscriptionType('GENERAL');
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            {/* HERO */}
            <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-rose-600/10 blur-[120px] rounded-full translate-x-1/2" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="h-[2px] w-12 bg-rose-600" />
                            <span className="text-rose-500 text-xs font-black uppercase tracking-[0.4em]">Automate Your Nutrition</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
                            Meathub <br />
                            <span className="text-rose-600 not-italic">Subscriptions.</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl border-l-4 border-slate-800 pl-8">
                            Experience the luxury of never running out. Fresh, artisanal cuts from KPHB master butchers, delivered on your schedule like clockwork.
                            <br /><span className="text-rose-400">Now featuring 6AM Early Morning Drops & Sunday Auto-Dispatch.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* PLAN SELECTION */}
            <section className="py-24 container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {PLANS.map((plan) => (
                        <motion.div
                            key={plan.id}
                            whileHover={{ y: -10 }}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`relative cursor-pointer group rounded-[3.5rem] p-12 transition-all duration-500 flex flex-col ${selectedPlan === plan.id
                                ? 'bg-slate-900 text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]'
                                : 'bg-white text-slate-900 border border-slate-100 hover:border-rose-100'
                                }`}
                        >
                            {plan.id === 'MONTHLY' && (
                                <div className="absolute top-10 right-10 flex items-center gap-2 bg-rose-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                                    <Crown className="w-3 h-3" /> Most Popular
                                </div>
                            )}

                            <div className="mb-12 space-y-4">
                                <h3 className={`text-sm font-black uppercase tracking-widest ${selectedPlan === plan.id ? 'text-rose-500' : 'text-slate-400'}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black italic tracking-tighter">{plan.price}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPlan === plan.id ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {plan.period}
                                    </span>
                                </div>
                                <p className={`text-xs font-bold uppercase tracking-widest italic ${selectedPlan === plan.id ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {plan.desc}
                                </p>
                            </div>

                            <div className="space-y-6 mb-12 flex-1">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${selectedPlan === plan.id ? 'text-rose-600' : 'text-emerald-500'}`} />
                                        <span className={`text-xs font-black uppercase tracking-wide leading-tight ${selectedPlan === plan.id ? 'text-slate-300' : 'text-slate-500'}`}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectPlan(plan.id);
                                }}
                                className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${selectedPlan === plan.id
                                    ? 'bg-rose-600 text-white shadow-2xl hover:bg-rose-700'
                                    : 'bg-slate-950 text-white hover:bg-rose-600'
                                    }`}>
                                {selectedPlan === plan.id ? 'Subscribe Now' : 'Select Plan'}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* SPECIALIZED PORTALS */}
            <section className="py-24 bg-slate-900 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-white">Specialized <span className="text-rose-600 not-italic">Portals.</span></h2>
                        <p className="text-slate-400 font-medium italic">Precision nutrition for your specific lifestyle goals.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Gym Portal */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] p-10 border border-white/5 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-10 -mt-10" />
                            <div className="space-y-6 relative z-10">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/20 transition-all">
                                    <Zap className="w-8 h-8 text-emerald-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Gym Portal</h3>
                                    <p className="text-slate-400 text-sm font-medium italic leading-relaxed">Protein-optimized subscriptions tailored for bodybuilding, maintenance, or weight loss.</p>
                                </div>
                                <button
                                    onClick={() => setActiveSubscriptionType('GYM')}
                                    className="h-14 px-8 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 hover:text-white transition-all shadow-2xl"
                                >
                                    Activate Gym Cycle
                                </button>
                            </div>
                        </motion.div>

                        {/* Pet Portal */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] p-10 border border-white/5 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 blur-3xl -mr-10 -mt-10" />
                            <div className="space-y-6 relative z-10">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-rose-600/20 transition-all">
                                    <Zap className="w-8 h-8 text-rose-600" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Pet Portal</h3>
                                    <p className="text-slate-400 text-sm font-medium italic leading-relaxed">Grade-A raw feeding plans for pets. Science-backed, master butcher prepared.</p>
                                </div>
                                <button
                                    onClick={() => setActiveSubscriptionType('PET')}
                                    className="h-14 px-8 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 hover:text-white transition-all shadow-2xl"
                                >
                                    Activate Pet Cycle
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* TRUST SIGNAL GRID */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="space-y-6 text-center md:text-left">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto md:mx-0">
                                <RefreshCcw className="w-6 h-6 text-rose-600" />
                            </div>
                            <h4 className="text-xl font-black uppercase italic tracking-tighter">Skip Anytime</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Going on vacation? Pause or reschedule deliveries with one tap in your portal.</p>
                        </div>
                        <div className="space-y-6 text-center md:text-left">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto md:mx-0">
                                <ShieldCheck className="w-6 h-6 text-rose-600" />
                            </div>
                            <h4 className="text-xl font-black uppercase italic tracking-tighter">Bio-Secure Fresh</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Subscription items are sourced from our 'Gold Tier' bio-secure partners.</p>
                        </div>
                        <div className="space-y-6 text-center md:text-left">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto md:mx-0">
                                <Clock className="w-6 h-6 text-rose-600" />
                            </div>
                            <h4 className="text-xl font-black uppercase italic tracking-tighter">Priority Slot</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Subscribers get the first 6:00 AM delivery slots, before the general marketplace opens.</p>
                        </div>
                        <div className="space-y-6 text-center md:text-left">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto md:mx-0">
                                <Target className="w-6 h-6 text-rose-600" />
                            </div>
                            <h4 className="text-xl font-black uppercase italic tracking-tighter">Auto-Dispatch Protocol</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">KPHB Pilot: Leveraging Auto-Rickshaw logistics for high-volume, on-time Sunday gated community deliveries.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-40">
                <div className="container mx-auto px-4">
                    <div className="bg-rose-600 rounded-[4rem] p-16 md:p-32 text-center space-y-12 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(225,29,72,0.4)]">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80&sig=scorched_earth_sub_hero')] bg-cover opacity-10" />
                        <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] relative z-10 text-white">
                            The Pure <br /> Lifestyle.
                        </h2>
                        <div className="flex justify-center relative z-10">
                            <button
                                onClick={() => setActiveSubscriptionType('GENERAL')}
                                className="h-20 px-12 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] flex items-center gap-4 hover:scale-105 transition-all shadow-2xl"
                            >
                                BEGIN YOUR CYCLE <ArrowRight className="w-6 h-6 text-rose-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subscription Configuration Modal */}
            {activeSubscriptionType && (
                <SubscriptionForm
                    type={activeSubscriptionType}
                    planId={selectedPlan}
                    onClose={() => setActiveSubscriptionType(null)}
                />
            )}
        </main>
    );
}
