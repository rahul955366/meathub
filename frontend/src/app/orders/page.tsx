"use client";

import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getOrders } from '@/lib/api';
import { Order } from '@/types';
import { Package, ShieldCheck, MessageSquare, Clock, MapPin, Video, Play } from 'lucide-react';
import OrderStatusTimeline from '@/components/OrderStatusTimeline';
import ReviewForm from '@/components/ReviewForm';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const LiveOrderMap = dynamic(() => import('@/components/LiveOrderMap'), {
    ssr: false,
    loading: () => <div className="h-[240px] rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm">Loading map…</div>,
});

export default function OrdersPage() {
    const { token, user } = useAppContext();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showReviewFor, setShowReviewFor] = useState<Order | null>(null);

    useEffect(() => {
        if (token) {
            loadOrders();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadOrders = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        const data = await getOrders(token || '');
        if (data && Array.isArray(data)) {
            setOrders(data);

            // If we have a selected order, update it from the new data
            if (selectedOrder) {
                const updated = data.find(o => o.id === selectedOrder.id);
                if (updated) setSelectedOrder(updated);
            }
        }
        if (showLoading) setLoading(false);
    };

    // Real-time polling for active orders
    useEffect(() => {
        if (!token || orders.length === 0) return;

        // Check if there are any active orders
        const hasActiveOrders = orders.some(o =>
            !['DELIVERED', 'CANCELLED'].includes(o.status)
        );

        if (!hasActiveOrders) return;

        const interval = setInterval(() => {
            loadOrders(false); // Refresh without showing the full-page loader
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, [token, orders, selectedOrder?.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-32">
                <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-32">
                <div className="text-center p-12 bg-white rounded-[3rem] shadow-sm border border-slate-100 max-w-md mx-4">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic italic mb-2">My Orders</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8">Please sign in to view your order history</p>
                    <a href="/login?redirect=orders" className="block w-full h-14 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center">Sign In</a>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter italic text-slate-900">My Orders</h1>
                        <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-2 italic">Tracking your meat from slaughter to doorstep</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <Clock className="w-5 h-5 text-rose-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Orders: </span>
                        <span className="font-black text-slate-900">{orders.length}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Orders List */}
                    <div className="lg:col-span-1 space-y-4">
                        {orders.length === 0 ? (
                            <div className="p-12 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">No orders yet</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    layoutId={`order-${order.id}`}
                                    onClick={() => setSelectedOrder(order)}
                                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${selectedOrder?.id === order.id
                                        ? 'bg-rose-50 border-rose-600 shadow-xl scale-[1.02]'
                                        : 'bg-white border-transparent shadow-sm hover:border-slate-100'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-[10px]">
                                                #{order.id}
                                            </div>
                                            {order.butcher_is_official && (
                                                <div className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[8px] font-black uppercase tracking-widest">Official</div>
                                            )}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-600' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {order.status}
                                        </div>
                                    </div>

                                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 truncate">{order.butcher_name}</h4>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-[10px] font-bold text-slate-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                        <p className="font-black text-rose-600 italic">₹{order.total_amount}</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Order Details */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {selectedOrder ? (
                                <motion.div
                                    key={selectedOrder.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 h-full"
                                >
                                    <div className="flex justify-between items-start mb-12">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center">
                                                <Package className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Details</h2>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Order ID: #{selectedOrder.id}</p>
                                            </div>
                                        </div>
                                        {selectedOrder.status === 'DELIVERED' && (
                                            <button
                                                onClick={() => setShowReviewFor(selectedOrder)}
                                                className="h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <MessageSquare className="w-4 h-4" /> Review Shop
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        {/* Tracking */}
                                        <div className="space-y-6">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-rose-600" />
                                                Live Status History
                                            </h3>
                                            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                                <OrderStatusTimeline
                                                    history={selectedOrder.status_history}
                                                    currentStatus={selectedOrder.status}
                                                />
                                            </div>

                                            {selectedOrder.cutting_video_url && (
                                                <div className="mt-6 space-y-3">
                                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                        <Video className="w-4 h-4 text-emerald-600" />
                                                        Cutting Proof (Transparency)
                                                    </h3>
                                                    <a
                                                        href={selectedOrder.cutting_video_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block group relative rounded-[2rem] overflow-hidden border-2 border-emerald-100 aspect-video bg-slate-900"
                                                    >
                                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 group-hover:bg-slate-950/20 transition-all z-10">
                                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                                <Play className="w-8 h-8 text-white fill-white" />
                                                            </div>
                                                        </div>
                                                        <div className="absolute bottom-6 left-6 z-20">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">Watch Proof of Hygiene</p>
                                                        </div>
                                                    </a>
                                                </div>
                                            )}

                                            {/* Live Tracking Map — only for active orders */}
                                            {!['DELIVERED', 'CANCELLED', 'PENDING'].includes(selectedOrder.status) && (
                                                <div className="space-y-3">
                                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-rose-600" />
                                                        Live Delivery Tracking
                                                    </h3>
                                                    <LiveOrderMap order={selectedOrder} />
                                                    <p className="text-[10px] text-slate-400 text-center font-medium">
                                                        🔴 Butcher · 🟡 Delivery Agent · — Route
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info & Items */}
                                        <div className="space-y-8">
                                            <div className="space-y-6">
                                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Items Purchased</h3>
                                                <div className="space-y-4">
                                                    {selectedOrder.items.map((item) => (
                                                        <div key={item.id} className="flex justify-between items-center py-3 border-b border-slate-50">
                                                            <div>
                                                                <p className="text-xs font-black uppercase tracking-tight">{item.meat_item_name}</p>
                                                                <p className="text-[10px] text-slate-400 font-bold">₹{item.price_at_order} x {item.quantity}</p>
                                                            </div>
                                                            <p className="text-sm font-black text-rose-600 italic">₹{item.subtotal}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900">
                                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Paid</span>
                                                    <span className="text-2xl font-black text-slate-900 italic">₹{selectedOrder.total_amount}</span>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-3">
                                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Delivery Address</h3>
                                                <p className="text-xs font-bold text-slate-600 leading-relaxed">{selectedOrder.delivery_address}</p>
                                                <p className="text-xs font-black text-slate-900">{selectedOrder.delivery_phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 h-full flex items-center justify-center p-12 text-center">
                                    <div className="max-w-xs space-y-4">
                                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
                                            <Package className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase italic text-slate-400">Select an order</h3>
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">View real-time status and delivery details</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {showReviewFor && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowReviewFor(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden p-8"
                        >
                            <ReviewForm
                                orderId={showReviewFor.id}
                                butcherId={showReviewFor.butcher}
                                onSuccess={() => {
                                    setShowReviewFor(null);
                                    loadOrders();
                                }}
                                onClose={() => setShowReviewFor(null)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
