import React from 'react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="relative">
                {/* Brand Logo Animation */}
                <div className="w-24 h-24 border-8 border-slate-200 border-t-rose-600 rounded-full animate-spin mb-8" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-rose-600 rounded-2xl rotate-45 animate-pulse" />
                </div>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-slate-900 mb-2 italic">
                Artisan <span className="text-rose-600">Verification</span>
            </h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
                Fetching certified village sources...
            </p>
        </div>
    );
}
