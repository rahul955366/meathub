"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, MapPin, Phone, Mail, FileText, CheckCircle2, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ButcherRegistrationPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirm_password: '',
        first_name: '', // was owner_name
        email: '',
        phone: '',
        address: '',
        shop_name: '',
        specialization: 'MUTTON'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password !== formData.confirm_password) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_URL}/api/auth/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    role: 'BUTCHER'
                })
            });

            const data = await res.json();

            if (res.ok) {
                setIsSubmitted(true);
                toast.success("Registration successful! Welcome to the network.");
            } else {
                const errorMsg = data.details ? Object.values(data.details).flat().join(', ') : (data.message || "Registration failed");
                toast.error(errorMsg);
            }
        } catch (error) {
            toast.error("Connection error. Is the server running?");
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-white pt-40 pb-20 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-slate-50 rounded-[3rem] p-12 text-center space-y-8 border-2 border-slate-100 shadow-2xl shadow-slate-200/50"
                >
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-200">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">Application <br /><span className="text-rose-600">Received!</span></h1>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Our quality team will contact you within 24 hours for a bio-security audit.</p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all flex items-center justify-center gap-3"
                    >
                        Return Home <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24 relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-100/30 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-200/50 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Brand Section */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-3 bg-rose-600 text-white px-5 py-2 rounded-full shadow-xl shadow-rose-900/20"
                            >
                                <Star className="w-4 h-4 fill-white" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Join the Elite</span>
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase italic leading-none"
                            >
                                Elevate <br />
                                <span className="text-rose-600 not-italic">Your Craft.</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-slate-500 font-bold uppercase tracking-widest text-sm max-w-md leading-relaxed"
                            >
                                Become a MeatHub partner and connect with thousands of premium meat seekers in your city.
                            </motion.p>
                        </div>

                        {/* USP Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { icon: ShieldCheck, title: "Standardized Pricing", desc: "No more bargaining. Get paid fairly for quality." },
                                { icon: MapPin, title: "Local Dominance", desc: "We manage the delivery; you focus on the cuts." }
                            ].map((usp, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + idx * 0.1 }}
                                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg space-y-3"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                                        <usp.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">{usp.title}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">{usp.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Registration Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl border border-slate-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-rose-600" />

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-black uppercase text-slate-900 tracking-tighter italic">Partner Enrollment</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Shop Name</label>
                                        <div className="relative">
                                            <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input
                                                required
                                                type="text"
                                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                                                placeholder="e.g. Royal Meat Shop"
                                                value={formData.shop_name}
                                                onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Owner Name</label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input
                                                required
                                                type="text"
                                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                                                placeholder="Full Name"
                                                value={formData.first_name}
                                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input
                                                required
                                                type="email"
                                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                                                placeholder="partner@meathub.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Contact Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input
                                                required
                                                type="tel"
                                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                                                placeholder="+91 99999 99999"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Shop Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            required
                                            type="text"
                                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                                            placeholder="Enter full address for radius check"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2">Choose Username</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs font-black focus:outline-none"
                                            placeholder="e.g. royal_mutton"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2">Set Password</label>
                                        <input
                                            required
                                            type="password"
                                            className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs font-black focus:outline-none"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Meat Specialization</label>
                                    <select
                                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all cursor-pointer"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                    >
                                        <option value="MUTTON">Mutton Specialist</option>
                                        <option value="CHICKEN">Poultry Expert</option>
                                        <option value="FISH">Seafood specialist</option>
                                        <option value="ALL">Full Marketplace</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-18 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-rose-600 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 group"
                            >
                                {loading ? 'Submitting...' : (
                                    <>Submit Application <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></>
                                )}
                            </button>

                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                                By submitting, you agree to MeatHub's strict bio-security and hygiene standards for 2026.
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
