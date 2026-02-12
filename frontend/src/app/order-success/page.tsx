"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Clock, Package, ArrowRight, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
    const [orderNumber] = useState(`MH${Date.now().toString().slice(-8)}`);

    useEffect(() => {
        // Celebration confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const colors = ['#e11d48', '#0f172a', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-32 pb-24 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100 opacity-20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 opacity-20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto space-y-12">

                    {/* Success Animation */}
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

                    {/* Success Message */}
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

                    {/* Order Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-xl border border-slate-100"
                    >
                        <div className="flex items-center justify-between mb-8 pb-8 border-b-2 border-slate-50">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Order Number</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter italic">#{orderNumber}</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center">
                                    <Download className="w-5 h-5" />
                                </button>
                                <button className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-rose-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Estimated Delivery</p>
                                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight">45-60 Minutes</p>
                                    <p className="text-xs text-slate-400 font-bold mt-1">Bio-Secure Cold-Chain Active</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                    <Package className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Packaging Status</p>
                                    <p className="text-lg font-black text-emerald-600 uppercase tracking-tight">Preparing Fresh</p>
                                    <p className="text-xs text-slate-400 font-bold mt-1">Hygienic Vacuum Sealed</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Delivery Location</p>
                                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight">KPHB Phase 3</p>
                                    <p className="text-xs text-slate-400 font-bold mt-1">Auto-Dispatch Enabled</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Live Tracking Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-4 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Live Updates</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">Track Your Order in Real-Time</h3>
                                <p className="text-white/60 text-sm font-bold uppercase tracking-wide">SMS + WhatsApp notifications enabled</p>
                            </div>
                            <button className="h-16 px-10 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 hover:text-white transition-all shadow-2xl flex items-center gap-3">
                                Track Now <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex flex-col md:flex-row gap-4"
                    >
                        <Link href="/butchers" className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all shadow-xl flex items-center justify-center gap-3">
                            Order Again <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/dashboard/subscriptions" className="flex-1 h-16 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
                            My Orders
                        </Link>
                    </motion.div>

                    {/* Artisan Seal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.1 }}
                        className="text-center py-8 space-y-4"
                    >
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                            <div className="h-px w-12 bg-slate-200" />
                            Certified Fresh
                            <div className="h-px w-12 bg-slate-200" />
                        </div>
                        <p className="text-slate-400 text-xs font-bold italic">Prepared by FSSAI Certified Master Butchers</p>
                    </motion.div>

                </div>
            </div>
        </main>
    );
}
