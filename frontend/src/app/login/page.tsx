"use client";

import AuthForm from '@/components/AuthForm';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    return (
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12 border border-slate-50">
            <AuthForm onSuccess={() => router.push(redirectTo)} />
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 pt-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo wrapper for standalone page */}
                <div className="mb-12 text-center">
                    <Link href="/" className="inline-block">
                        <span className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
                            MEAT<span className="text-rose-600 not-italic">HUB</span>
                        </span>
                    </Link>
                </div>

                <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" /></div>}>
                    <LoginContent />
                </Suspense>

                <div className="mt-12 text-center">
                    <Link
                        href="/"
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 hover:text-rose-600 transition-colors"
                    >
                        ← Back to the Hub
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
