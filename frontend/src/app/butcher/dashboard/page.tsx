'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { TrendingUp, ShoppingBag, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { getOrders } from '@/lib/api';
import toast from 'react-hot-toast';

interface Stats {
    todayOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
}

export default function ButcherDashboard() {
    const { token } = useAppContext();
    const [stats, setStats] = useState<Stats>({ todayOrders: 0, pendingOrders: 0, completedOrders: 0, totalRevenue: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const orders = await getOrders(token);
            const today = new Date().toDateString();
            const todayOrders = orders.filter((o: any) => new Date(o.created_at).toDateString() === today);
            const pending = orders.filter((o: any) => ['PENDING', 'CONFIRMED'].includes(o.status));
            const completed = orders.filter((o: any) => o.status === 'DELIVERED');
            const revenue = orders.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount), 0);
            setStats({ todayOrders: todayOrders.length, pendingOrders: pending.length, completedOrders: completed.length, totalRevenue: revenue });
            setRecentOrders(orders.slice(0, 6));
        } catch { }
        setLoading(false);
    }, [token]);

    useEffect(() => { loadData(); }, [loadData]);

    const STATUS_COLORS: Record<string, string> = {
        PENDING: 'bg-yellow-500/20 text-yellow-300',
        CONFIRMED: 'bg-blue-500/20 text-blue-300',
        PROCESSING: 'bg-purple-500/20 text-purple-300',
        DELIVERED: 'bg-green-500/20 text-green-300',
        CANCELLED: 'bg-red-500/20 text-red-300',
    };

    const STAT_CARDS = [
        { label: "Today's Orders", value: stats.todayOrders, Icon: ShoppingBag, color: 'from-blue-600/20 to-blue-500/5', icon_color: 'text-blue-400' },
        { label: "Pending / Active", value: stats.pendingOrders, Icon: AlertCircle, color: 'from-yellow-600/20 to-yellow-500/5', icon_color: 'text-yellow-400' },
        { label: "Delivered", value: stats.completedOrders, Icon: PackageCheck, color: 'from-green-600/20 to-green-500/5', icon_color: 'text-green-400' },
        { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, Icon: TrendingUp, color: 'from-rose-600/20 to-rose-500/5', icon_color: 'text-rose-400' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-white/40 text-sm mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={async () => {
                            if (!token) return;
                            const res = await fetch(`/api/proxy/butcher-reset-stock`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                            if (res.ok) {
                                toast.success("Stock reset for the morning!");
                                loadData();
                            } else {
                                toast.error("Reset failed");
                            }
                        }}
                        className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-black uppercase tracking-widest border border-emerald-500/20 transition-all"
                    >
                        Morning Reset
                    </button>
                    <button onClick={loadData} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STAT_CARDS.map(({ label, value, Icon, color, icon_color }) => (
                    <div key={label} className={`p-5 rounded-2xl bg-gradient-to-br ${color} border border-white/5`}>
                        <Icon size={22} className={`${icon_color} mb-3`} />
                        <p className="text-2xl font-bold text-white">{loading ? '—' : value}</p>
                        <p className="text-white/50 text-xs mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5">
                    <h2 className="text-white font-semibold text-sm">Recent Orders</h2>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-white/40 text-sm">Loading…</div>
                ) : recentOrders.length === 0 ? (
                    <div className="p-8 text-center text-white/40 text-sm">No orders yet.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-white/30 text-xs border-b border-white/5">
                                <th className="px-5 py-3 text-left font-medium">Order</th>
                                <th className="px-5 py-3 text-left font-medium">Customer</th>
                                <th className="px-5 py-3 text-left font-medium">Amount</th>
                                <th className="px-5 py-3 text-left font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((o, i) => (
                                <tr key={o.id} className={`border-b border-white/[0.03] ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                                    <td className="px-5 py-3 text-white/70 font-mono">#{o.id}</td>
                                    <td className="px-5 py-3 text-white/70">{o.user_email?.split('@')[0] ?? '—'}</td>
                                    <td className="px-5 py-3 text-white font-medium">₹{parseFloat(o.total_amount).toLocaleString('en-IN')}</td>
                                    <td className="px-5 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] ?? 'bg-white/10 text-white/50'}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
