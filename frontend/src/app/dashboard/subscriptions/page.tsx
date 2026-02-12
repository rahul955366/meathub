"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Clock,
    Pause,
    Play,
    Settings,
    ChevronRight,
    Package,
    CheckCircle2,
    AlertCircle,
    Plus
} from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionDashboard() {
    const [activeTab, setActiveTab] = useState('UPCOMING'); // UPCOMING, HISTORY, SETTINGS
    const [subscriptions, setSubscriptions] = useState([
        {
            id: 1,
            name: 'Sunday Natu Kodi Special',
            status: 'ACTIVE',
            nextDelivery: 'Sunday, Feb 8',
            slot: '06:00 AM - 08:00 AM',
            butcher: 'KPHB Master Butcher',
            item: '1.5kg Country Chicken (Bone-in)',
            price: '₹950',
            img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 2,
            name: 'Gym Maintenance Protocol',
            status: 'ACTIVE',
            nextDelivery: 'Tomorrow, Feb 7',
            slot: '05:30 AM - 06:30 AM',
            butcher: 'Meathub Flagship',
            item: '500g Chicken Breast (Clean Cut)',
            price: '₹220',
            img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 3,
            name: 'Artisan Mutton (Pet Care)',
            status: 'PAUSED',
            nextDelivery: 'Paused',
            slot: 'N/A',
            butcher: 'Hyderabadi Halal Master',
            item: '500g Organ Meat Mix',
            price: '₹180',
            img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400&q=80'
        }
    ]);

    const toggleStatus = (id: number) => {
        setSubscriptions(prev => prev.map(sub => {
            if (sub.id === id) {
                return { ...sub, status: sub.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' };
            }
            return sub;
        }));
    };

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto space-y-12">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="h-[2px] w-12 bg-rose-600" />
                                <span className="text-rose-500 text-xs font-black uppercase tracking-[0.4em]">Personal Logistics Hub</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                                My <br />
                                <span className="text-rose-600 not-italic">Subscriptions.</span>
                            </h1>
                        </div>
                        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                            {['UPCOMING', 'HISTORY', 'SETTINGS'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subscription Grid */}
                    <div className="grid grid-cols-1 gap-8">
                        <AnimatePresence mode="popLayout">
                            {subscriptions.map((sub, i) => (
                                <motion.div
                                    key={sub.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-10 items-center hover:shadow-2xl transition-all duration-700 relative overflow-hidden group"
                                >
                                    {/* Status Badge */}
                                    <div className={`absolute top-0 right-12 px-6 py-3 rounded-b-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl ${sub.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}>
                                        {sub.status}
                                    </div>

                                    <div className="w-full md:w-56 aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 flex-shrink-0 relative">
                                        <img src={sub.img} alt={sub.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        <div className="absolute inset-0 bg-black/10" />
                                    </div>

                                    <div className="flex-1 space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">{sub.name}</h3>
                                            <p className="text-slate-400 text-xs font-bold uppercase italic">{sub.item} • {sub.butcher}</p>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-rose-600">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Next Run</span>
                                                </div>
                                                <p className="text-sm font-black text-slate-900 uppercase">{sub.nextDelivery}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-rose-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Reserved Slot</span>
                                                </div>
                                                <p className="text-sm font-black text-slate-900 uppercase">{sub.slot}</p>
                                            </div>
                                            {sub.name.includes('Sunday') && (
                                                <div className="col-span-2 md:col-span-1 space-y-1">
                                                    <div className="flex items-center gap-2 text-emerald-500">
                                                        <span className="text-lg">🛺</span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Sunday Auto-Dispatch</span>
                                                    </div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">KPHB Pilot Active</p>
                                                </div>
                                            )}
                                            <div className="space-y-1 hidden md:block text-right">
                                                <div className="flex items-center justify-end gap-2 text-rose-600">
                                                    <Package className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Cycle Cost</span>
                                                </div>
                                                <p className="text-xl font-black text-slate-900 italic tracking-tighter">{sub.price}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-4 w-full md:w-auto">
                                        <button
                                            onClick={() => toggleStatus(sub.id)}
                                            className={`flex-1 md:w-48 h-16 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${sub.status === 'ACTIVE' ? 'bg-slate-100 text-slate-900 hover:bg-rose-100 hover:text-rose-600' : 'bg-slate-900 text-white hover:bg-rose-600'}`}
                                        >
                                            {sub.status === 'ACTIVE' ? <><Pause className="w-4 h-4" /> Pause Cycle</> : <><Play className="w-4 h-4" /> Resume Cycle</>}
                                        </button>
                                        <button className="h-16 w-16 md:w-48 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-white hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm">
                                            <Settings className="w-5 h-5" />
                                            <span className="hidden md:block ml-2 text-[10px] font-black uppercase tracking-widest">Modify Plan</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Add New Hook */}
                        <Link href="/subscriptions" className="group bg-slate-50 rounded-[3.5rem] p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 hover:border-rose-300 hover:bg-rose-50/30 transition-all duration-500">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-rose-600 group-hover:shadow-xl transition-all">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-rose-600 transition-colors">Initiate New Protein Cycle</span>
                        </Link>
                    </div>

                    {/* Sunday Prep Notice */}
                    <div className="bg-rose-600 rounded-[3rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-full bg-slate-950/10 skew-x-12 translate-x-1/2" />
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center flex-shrink-0 animate-bounce">
                                <AlertCircle className="w-10 h-10 text-rose-600" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-3xl font-black uppercase tracking-tighter italic">Sunday Morning War Prep</h4>
                                <p className="text-rose-100 text-sm font-bold uppercase tracking-widest leading-relaxed">System Lock-in: You have 18 hours until the Sunday 6AM slot window closes.</p>
                            </div>
                        </div>
                        <button className="h-16 px-10 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-slate-950 transition-all shadow-2xl relative z-10">
                            Pre-Verify My Slots
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}
