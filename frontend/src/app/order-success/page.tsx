"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Clock, Package, ArrowRight, Download, Share2, Video, Store, Truck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const isOfficial = searchParams.get('official') === 'true';
    const orderId = searchParams.get('orderId');

    // Use authentic order ID if available, else generated for demo
    const orderNumber = orderId || useMemo(() => `MH${Date.now().toString().slice(-8)}`, []);

    const arrivalTime = useMemo(() => {
        const d = new Date(Date.now() + 45 * 60000);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(' AM', '').replace(' PM', '');
    }, []);

    const arrivalPeriod = useMemo(() => {
        const d = new Date(Date.now() + 45 * 60000);
        return d.getHours() >= 12 ? 'PM' : 'AM';
    }, []);

    useEffect(() => {
        // Celebration confetti effect
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const colors = ['#e11d48', '#0f172a', '#ffffff'];

        const runAnimation = () => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) return;

            const particleCount = 2 * (timeLeft / duration);

            confetti({
                particleCount,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            requestAnimationFrame(runAnimation);
        };

        runAnimation();
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-32 pb-24 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100 opacity-20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 opacity-20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto space-y-12">

                    {/* Success Animation Logo */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
                        className="text-center"
                    >
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40">
                            <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={3} />
                        </div>
                    </motion.div>

                    {/* Success Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center space-y-4"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight">
                            Order <br />
                            <span className="text-rose-600 not-italic">Confirmed!</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                            Your premium cuts are being prepared by our master butchers
                        </p>
                    </motion.div>

                    {/* Order Details Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-xl border border-slate-100"
                    >
                        <div className="flex items-center justify-between mb-8 pb-8 border-b-2 border-slate-50">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Order Reference</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter italic">#{orderNumber}</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center" aria-label="Download Receipt">
                                    <Download className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => {
                                        const text = `I just ordered premium cuts from MeatHub! Order #${orderNumber}. Check them out: ${window.location.origin}`;
                                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                    }}
                                    className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all flex items-center justify-center"
                                    aria-label="Share via WhatsApp"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-rose-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ETA</p>
                                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight">45-60 Mins</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Cold-Chain Active</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                    <Package className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                                    <p className="text-lg font-black text-emerald-600 uppercase tracking-tight">Preparing</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Vacuum Sealed</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zone</p>
                                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight">Local</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Auto-Dispatch</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Live Tracking & ETA Simulator (Issue #15) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />

                        <div className="relative z-10 space-y-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-4 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Active Tracking</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">Driver <span className="text-rose-600">En Route</span></h3>
                                    <p className="text-white/60 text-sm font-bold uppercase tracking-wide">Cold-Chain Monitor: -2°C (STABLE)</p>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Estimated Arrival</p>
                                    <p className="text-4xl font-black text-white italic tracking-tighter">{arrivalTime} <span className="text-sm not-italic text-rose-500">{arrivalPeriod}</span></p>
                                </div>
                            </div>

                            {/* Tracking Progress Bar */}
                            <div className="relative pt-12">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full" />
                                <motion.div
                                    initial={{ width: '0%' }}
                                    animate={{ width: '65%' }}
                                    transition={{ duration: 3, delay: 1 }}
                                    className="absolute top-1/2 left-0 h-1 bg-rose-600 -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.5)]"
                                />

                                <div className="relative flex justify-between">
                                    {[
                                        { icon: Store, label: 'Shop', active: true },
                                        { icon: Package, label: 'Picked', active: true },
                                        { icon: Truck, label: 'Transit', active: true },
                                        { icon: MapPin, label: 'Final', active: false }
                                    ].map((step, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step.active ? 'bg-rose-600' : 'bg-slate-800 text-slate-600'}`}>
                                                <step.icon className="w-5 h-5" />
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${step.active ? 'text-white' : 'text-slate-600'}`}>{step.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* USP: Video Proof Section - ONLY FOR OFFICIAL STORE */}
                    {isOfficial ? (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-rose-50 border-2 border-rose-100 rounded-[3rem] p-8 md:p-12 space-y-8 shadow-xl shadow-rose-100/50"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                                        <Video className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Live Cutting <span className="text-rose-600">Proof</span></h3>
                                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mt-1">Official MeatHub Verification</p>
                                    </div>
                                </div>
                                <div className="hidden md:flex bg-white px-4 py-2 rounded-xl border border-rose-100 items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Official Store USP</span>
                                </div>
                            </div>

                            <div className="aspect-video bg-slate-900 rounded-[2.5rem] relative overflow-hidden group border-4 border-white shadow-2xl">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                                    title="MeatHub Cutting Proof"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                                <div className="absolute top-4 right-4 z-20">
                                    <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl border-2 border-white">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">LIVE VERIFIED</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-2xl border border-rose-100 space-y-1">
                                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Transparency</p>
                                    <p className="text-xs font-bold text-slate-700">100% Real Video Proof</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-rose-100 space-y-1">
                                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Verification</p>
                                    <p className="text-xs font-bold text-slate-700">Scan QR on Delivery</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* Marketplace Quality Banner */
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-slate-50 border-2 border-slate-100 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-lg border border-slate-100 flex-shrink-0">
                                <Package className="w-10 h-10 text-slate-300" />
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h3 className="text-xl font-black uppercase tracking-tighter italic">Marketplace Quality Assured</h3>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">Every butcher on MeatHub is hand-verified for hygiene and quality standards.</p>
                            </div>
                            <div className="px-6 py-3 bg-white rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Standard Delivery
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex flex-col md:flex-row gap-4"
                    >
                        <Link href="/butchers" className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all shadow-xl flex items-center justify-center gap-3">
                            Order More <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/orders" className="flex-1 h-16 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
                            My Orders
                        </Link>
                    </motion.div>

                    {/* Quality Assurance Footer */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.1 }}
                        className="text-center py-8 space-y-4"
                    >
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                            <div className="h-px w-12 bg-slate-200" />
                            Authentic & Certified
                            <div className="h-px w-12 bg-slate-200" />
                        </div>
                        <p className="text-slate-400 text-xs font-bold italic">Prepared in bio-secure facilities by master artisans.</p>
                    </motion.div>

                </div>
            </div>
        </main>
    );
}
