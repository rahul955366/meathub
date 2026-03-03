"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/password-reset/request/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setSubmitted(true);
                toast.success('Recovery instructions sent!');
            } else {
                const data = await res.json();
                toast.error(data.detail || 'Failed to request reset. Is the email correct?');
            }
        } catch (err) {
            toast.error('Connection failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-32 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
            >
                <div className="p-10 md:p-14">
                    <Link href="/login" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors mb-10">
                        <ArrowLeft className="w-4 h-4" /> Return to Login
                    </Link>

                    {!submitted ? (
                        <>
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-2">
                                Access Recovery
                            </h2>
                            <p className="text-slate-500 font-medium italic text-sm mb-10">
                                Enter your verified email to receive a secure bypass link.
                            </p>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                        <input
                                            required
                                            type="email"
                                            className="w-full h-18 pl-16 pr-8 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none"
                                            placeholder="chef@meathub.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isLoading}
                                    className="w-full h-18 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs mt-10 hover:bg-rose-600 transition-all shadow-xl shadow-slate-950/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {isLoading ? 'SEARCHING ARCHIVES...' : <><Send className="w-4 h-4" /> Send Bypass Link</>}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                                <Send className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic">Dispatch Successful</h2>
                            <p className="text-slate-500 font-medium italic text-sm">
                                If an account exists for <span className="text-slate-900 font-bold">{email}</span>, you will receive instructions shortly.
                            </p>
                            <Link href="/login" className="block w-full h-18 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center transition-all hover:bg-rose-600">
                                Acknowledgement Received
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </main>
    );
}
