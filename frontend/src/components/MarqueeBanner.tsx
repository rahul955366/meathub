"use client";

import React from 'react';
import { motion } from 'framer-motion';

const messages = [
    "KPHB PILOT: 45 DELIVERIES/HOUR CAPACITY ACTIVE",
    "FREE DELIVERY ON ORDERS ABOVE ₹499",
    "SUNDAY SPECIAL: AUTO-DISPATCH PROTOCOL",
    "100% BIO-SECURE & HALAL CERTIFIED",
    "COLD-CHAIN MAINTAINED TILL DOORSTEP",
    "MEATHUB: HYDERABAD'S NO.1 MEAT AGGREGATOR",
    "HYGIENICALLY CUT & VACUUM PACKED"
];

export default function MarqueeBanner() {
    return (
        <div className="bg-rose-600 py-3 flex overflow-hidden select-none border-y border-rose-500 shadow-2xl relative z-40">
            <motion.div
                className="flex whitespace-nowrap gap-12"
                animate={{ x: [0, -1000] }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {[...messages, ...messages].map((msg, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                        <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">
                            {msg}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
