"use client";

import AuthForm from '@/components/AuthForm';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

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
                        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mt-2 ml-1">Butcher Portal</div>
                    </Link>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12 border border-slate-50">
                    <AuthForm onSuccess={() => router.push('/')} />
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/"
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 hover:text-rose-600 transition-colors"
                    >
                        ← Back to Hub
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
