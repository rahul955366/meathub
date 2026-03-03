"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Suspense } from 'react';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    useEffect(() => {
        if (!token) {
            toast.error('Invalid or missing reset token.');
            router.push('/login');
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/password-reset/confirm/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, new_password: password })
            });

            if (res.ok) {
                setIsSuccess(true);
                toast.success('Security credentials updated!');
            } else {
                const data = await res.json();
                toast.error(data.detail || 'Reset failed. Link may be expired.');
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
                    <div className="flex justify-center mb-10">
                        <span className="text-3xl font-black tracking-tighter uppercase italic">
                            MEAT<span className="text-rose-600 not-italic">HUB</span>
                        </span>
                    </div>

                    {!isSuccess ? (
                        <>
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic text-center mb-2">
                                Secure Protocol
                            </h2>
                            <p className="text-slate-500 font-medium italic text-sm text-center mb-10">
                                Override detected. Please establish new security credentials.
                            </p>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">New Secret Key (Password)</label>
                                    <div className="relative">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                        <input
                                            required
                                            type="password"
                                            className="w-full h-18 pl-16 pr-8 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Confirm New Key</label>
                                    <div className="relative">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                        <input
                                            required
                                            type="password"
                                            className="w-full h-18 pl-16 pr-8 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isLoading}
                                    className="w-full h-18 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs mt-10 hover:bg-rose-600 transition-all shadow-xl shadow-slate-950/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {isLoading ? 'ESTABLISHING SECURE CONNECTION...' : <><ShieldCheck className="w-4 h-4" /> Finalize Reset</>}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic">Access Restored</h2>
                            <p className="text-slate-500 font-medium italic text-sm">
                                Your new security credentials have been accepted by the MeatHub mainframe.
                            </p>
                            <Link href="/login" className="block w-full h-18 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center transition-all hover:bg-rose-600 gap-3">
                                Return to Hub <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" /></div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
