"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Settings, Package, Heart, CreditCard, Share2,
    Gift, Star, ArrowRight, ShieldCheck, Clock, CheckCircle2,
    LogOut, Clipboard
} from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { getUserProfile, getOrders } from '@/lib/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const { user, token, logout } = useAppContext();
    const [profile, setProfile] = useState<any>(null);
    const [orderCount, setOrderCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                const [prof, ords] = await Promise.all([
                    getUserProfile(token),
                    getOrders(token)
                ]);
                setProfile(prof);
                setOrderCount(ords.length);
            } catch (err) {
                console.error("Dashboard Load Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const copyReferral = () => {
        if (profile?.referral_code) {
            navigator.clipboard.writeText(profile.referral_code);
            toast.success("Referral code copied!");
        }
    };

    if (loading) return (
        <div className="min-h-screen pt-32 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="space-y-2">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl font-black tracking-tighter uppercase italic text-slate-900"
                        >
                            Chef's <span className="text-rose-600">Quarter</span>
                        </motion.h1>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Manage your artisanal meat journey</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white px-6 py-4 rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                                <Star className="w-5 h-5 fill-rose-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loyalty Balance</p>
                                <p className="text-xl font-black italic text-slate-900">{profile?.loyalty_points || 0} <span className="text-[10px] not-italic">CFP</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Sidebar / Profile Card */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600 rounded-full blur-[80px] opacity-30 -translate-y-10 translate-x-10" />

                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                        <User className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tighter uppercase italic">{profile?.full_name || user?.username}</h3>
                                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{profile?.user?.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/10">
                                    <Link href="/dashboard/subscriptions" className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <Package className="w-4 h-4 text-rose-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">My Subscriptions</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                    <Link href="/orders" className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-rose-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">Order History</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                </div>

                                <button
                                    onClick={logout}
                                    className="w-full h-14 bg-white/5 hover:bg-rose-600 rounded-2xl flex items-center justify-center gap-3 transition-all text-[10px] font-black uppercase tracking-widest border border-white/10"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        </motion.div>

                        {/* Refer-a-Chef Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6"
                        >
                            <div className="flex items-center gap-3 text-rose-600">
                                <Gift className="w-6 h-6" />
                                <h3 className="text-sm font-black uppercase tracking-widest">Refer-a-Chef</h3>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                Give friends 100 points, get 50 points when they make their first artisanal purchase.
                            </p>

                            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-between gap-4">
                                <code className="text-xs font-black tracking-[0.2em] text-slate-900 uppercase">
                                    {profile?.referral_code || 'LOADING...'}
                                </code>
                                <button
                                    onClick={copyReferral}
                                    className="w-10 h-10 rounded-xl bg-white hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-slate-100 flex items-center justify-center"
                                >
                                    <Clipboard className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    if (!profile?.referral_code) return;
                                    const text = `Join me on MeatHub and use my referral code ${profile.referral_code} to get 100 points! Check it out: ${window.location.origin}`;
                                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                }}
                                className="w-full h-14 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-200 flex items-center justify-center gap-3 hover:bg-rose-700 transition-all"
                            >
                                <Share2 className="w-4 h-4" /> Share Referral Link
                            </button>
                        </motion.div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Stats / Highlight Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/30 flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black italic text-slate-900 tracking-tighter">Gold Tier</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Transparency Certified Buyer</p>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/30 flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center">
                                    <Heart className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black italic text-slate-900 tracking-tighter">{orderCount} {orderCount === 1 ? 'Order' : 'Orders'}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Artisanal Support Index</p>
                                </div>
                            </div>
                        </div>

                        {/* Rewards Progress Section */}
                        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">Your Rewards</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unlock premium perks through artisanal community growth</p>
                                </div>
                                <div className="px-6 py-2 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">
                                    Phase 1 Active
                                </div>
                            </div>

                            <div className="space-y-10">
                                {[
                                    { title: "Free Delivery Forever", points: 500, current: profile?.loyalty_points || 0, icon: Package },
                                    { title: "Exclusive Dry-Age Access", points: 1500, current: profile?.loyalty_points || 0, icon: Star },
                                    { title: "Flagship Store VVIP", points: 5000, current: profile?.loyalty_points || 0, icon: ShieldCheck }
                                ].map((reward, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center gap-3">
                                                <reward.icon className="w-5 h-5 text-rose-600" />
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black uppercase tracking-widest text-slate-700">{reward.title}</span>
                                                    {reward.current >= reward.points && (
                                                        <button 
                                                            onClick={async () => {
                                                                if (!token) return;
                                                                const api = await import('@/lib/api');
                                                                const success = await api.redeemLoyaltyPoints(token, reward.points);
                                                                if (success) {
                                                                    toast.success(`Redeemed ${reward.points} points for ${reward.title}!`);
                                                                    // Refresh profile
                                                                    const prof = await api.getUserProfile(token);
                                                                    setProfile(prof);
                                                                } else {
                                                                    toast.error("Redemption failed.");
                                                                }
                                                            }}
                                                            className="text-[8px] font-black uppercase tracking-[0.2em] text-rose-600 hover:text-rose-800 transition-colors bg-rose-50 px-2 py-1 rounded-md w-fit mt-1"
                                                        >
                                                            Redeem Now
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {reward.current >= reward.points ? "UNLOCKED" : `${reward.points - reward.current} points to go`}
                                            </span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, (reward.current / reward.points) * 100)}%` }}
                                                className="h-full bg-rose-600"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
