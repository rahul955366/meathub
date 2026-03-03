"use client";

import React from 'react';
import { Check, Clock, Truck, ShieldCheck, Package } from 'lucide-react';
import { OrderStatusEntry } from '@/types';

interface OrderStatusTimelineProps {
    history: OrderStatusEntry[];
    currentStatus: string;
}

const statusMap: Record<string, { icon: any, label: string, color: string }> = {
    'PENDING': { icon: Clock, label: 'Order Placed', color: 'slate' },
    'CONFIRMED': { icon: ShieldCheck, label: 'Confirmed', color: 'blue' },
    'PROCESSING': { icon: Package, label: 'Processing', color: 'amber' },
    'SHIPPED': { icon: Truck, label: 'In Transit', color: 'indigo' },
    'DELIVERED': { icon: Check, label: 'Delivered', color: 'emerald' },
    'CANCELLED': { icon: Clock, label: 'Cancelled', color: 'red' }
};

export default function OrderStatusTimeline({ history, currentStatus }: OrderStatusTimelineProps) {
    return (
        <div className="space-y-8 py-4">
            {history.map((entry, index) => {
                const config = statusMap[entry.status] || statusMap.PENDING;
                const Icon = config.icon;
                const isLast = index === history.length - 1;

                return (
                    <div key={index} className="flex gap-8 relative group">
                        {/* Line */}
                        {!isLast && (
                            <div className="absolute left-[23px] top-12 w-[2px] h-16 bg-slate-100 group-hover:bg-rose-100 transition-colors" />
                        )}

                        {/* Icon Container */}
                        <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg transition-all duration-500 ${entry.status === currentStatus
                                ? 'bg-rose-600 text-white scale-110 shadow-rose-200'
                                : 'bg-white text-slate-400 border border-slate-100 group-hover:border-rose-200'
                                }`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            {entry.status === currentStatus && (
                                <div className="absolute inset-0 rounded-[1.25rem] bg-rose-600 animate-ping opacity-20" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="pt-1 pb-8 flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className={`text-sm font-black uppercase tracking-tight transition-colors ${entry.status === currentStatus ? 'text-rose-600' : 'text-slate-900 group-hover:text-rose-500'
                                    }`}>
                                    {config.label}
                                </h4>
                                <span className="text-[9px] font-black tabular-nums text-slate-300">
                                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                {new Date(entry.timestamp).toLocaleDateString()}
                            </p>
                            <div className={`mt-3 p-4 rounded-2xl text-xs font-medium border transition-all ${entry.status === currentStatus
                                ? 'bg-rose-50 border-rose-100 text-rose-900'
                                : 'bg-slate-50 border-transparent text-slate-500'
                                }`}>
                                {entry.message}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
