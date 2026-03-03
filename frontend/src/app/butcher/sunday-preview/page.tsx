'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getOrders } from '@/lib/api';
import { Calendar, Truck, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SundayPreview() {
    const { token } = useAppContext();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadSundayOrders = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const allOrders = await getOrders(token);
            // Filter for is_sunday_special orders or orders created for a Sunday
            const sundayOrders = allOrders.filter(o => o.is_sunday_special === true);
            setOrders(sundayOrders);
        } catch {
            toast.error('Failed to load Sunday pre-orders');
        }
        setLoading(false);
    }, [token]);

    useEffect(() => {
        loadSundayOrders();
    }, [loadSundayOrders]);

    const totalVolume = orders.reduce((acc, order) => {
        const orderQty = order.items?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 1;
        return acc + orderQty;
    }, 0);

    // C3: Aggregate demand by item name
    const demandSummary = orders.reduce((acc: Record<string, number>, order) => {
        order.items?.forEach((item: any) => {
            const name = item.meat_item_name || 'Item';
            acc[name] = (acc[name] || 0) + (item.quantity || 1);
        });
        return acc;
    }, {});

    return (
        <div className="space-y-10">
            {/* Legend / Status Card */}
            <div className="bg-rose-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Calendar size={120} />
                </div>
                <div className="relative z-10 max-w-2xl space-y-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/20 px-4 py-2 rounded-full backdrop-blur">Sunday Hub Preview</span>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        Weekly <br /> <span className="text-slate-900 not-italic">Potlam Demand.</span>
                    </h1>
                    <p className="text-rose-100 text-lg font-medium italic">
                        Real-time visualization of upcoming Sunday morning pre-orders. Prepare your livestock and inventory accordingly for the 5 AM rush.
                    </p>
                </div>
            </div>

            {/* Demand Summary (C3) */}
            {Object.keys(demandSummary).length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tight px-2">Aggregated Prep List</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Object.entries(demandSummary).map(([name, qty]) => (
                            <div key={name} className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-center space-y-1">
                                <p className="text-emerald-400 font-black text-3xl tracking-tighter">{qty}</p>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest line-clamp-1">{name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] space-y-4">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Confirmed Pre-orders</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black italic text-white tracking-tighter">{orders.length}</span>
                        <span className="text-xs font-bold text-rose-500">Active</span>
                    </div>
                </div>
                <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] space-y-4">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Estimated Volume</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black italic text-white tracking-tighter">{totalVolume}</span>
                        <span className="text-xs font-bold text-rose-500">Packs/Items</span>
                    </div>
                </div>
                <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] space-y-4">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Prep Status</p>
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xl font-black italic text-white tracking-tighter uppercase">Ready for Prep</span>
                    </div>
                </div>
            </div>

            {/* Sunday Specific Orders Table */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black italic text-white uppercase tracking-tight">Sunday Morning Queue</h2>
                    <button onClick={loadSundayOrders} className="p-3 rounded-2xl bg-white/5 hover:bg-rose-600 transition-all text-white">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                {loading ? (
                    <div className="p-20 text-center opacity-30 uppercase font-black italic">Syncing Sunday logistics...</div>
                ) : orders.length === 0 ? (
                    <div className="p-20 text-center bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
                        <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-sm italic">No pre-orders scheduled for this Sunday yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {orders.map(order => (
                            <div key={order.id} className="p-6 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-3xl transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest">Sunday Pre-order</p>
                                        <h3 className="text-white font-black text-xl italic tracking-tighter uppercase">Order #{order.id}</h3>
                                    </div>
                                    <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/50">
                                        Confirmed
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {order.items?.map((item: any) => (
                                            <span key={item.id} className="px-3 py-1 bg-slate-900 rounded-xl text-white/80 text-xs font-bold border border-white/5">
                                                {item.meat_item_name} (×{item.quantity})
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-white/40 text-xs italic line-clamp-1">{order.delivery_address}</p>
                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-white font-black text-lg italic">₹{parseFloat(order.total_amount)}</span>
                                        <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                            Prepare Cut <Truck size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
