'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getOrders, updateOrderStatus, uploadOrderVideo } from '@/lib/api';
import { CheckCircle, XCircle, Truck, RefreshCw, Video, Link as LinkIcon, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-300',
    CONFIRMED: 'bg-blue-500/20 text-blue-300',
    PROCESSING: 'bg-purple-500/20 text-purple-300',
    SHIPPED: 'bg-sky-500/20 text-sky-300',
    DELIVERED: 'bg-green-500/20 text-green-300',
    CANCELLED: 'bg-red-500/20 text-red-300',
};

const TRANSITIONS: Record<string, { label: string; next: string; icon: React.ReactNode; color: string }[]> = {
    PENDING: [{ label: 'Confirm', next: 'CONFIRMED', icon: <CheckCircle size={14} />, color: 'bg-blue-600 hover:bg-blue-500' }],
    CONFIRMED: [{ label: 'Start Prep', next: 'PROCESSING', icon: <Truck size={14} />, color: 'bg-purple-600 hover:bg-purple-500' }],
    PROCESSING: [{ label: 'Ship', next: 'SHIPPED', icon: <Truck size={14} />, color: 'bg-sky-600 hover:bg-sky-500' }],
    SHIPPED: [{ label: 'Delivered', next: 'DELIVERED', icon: <CheckCircle size={14} />, color: 'bg-green-600 hover:bg-green-500' }],
};

export default function ButcherOrders() {
    const { token } = useAppContext();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [updating, setUpdating] = useState<number | null>(null);
    const [videoUrls, setVideoUrls] = useState<Record<number, string>>({});

    const loadOrders = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await getOrders(token);
            setOrders(data);
        } catch { toast.error('Failed to load orders'); }
        setLoading(false);
    }, [token]);

    useEffect(() => { loadOrders(); }, [loadOrders]);

    // C1: Poll for new pending orders every 15 seconds
    useEffect(() => {
        const interval = setInterval(loadOrders, 15000);
        return () => clearInterval(interval);
    }, [loadOrders]);

    // W3/A1: Use the shared api.ts function (now uses PATCH)
    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        if (!token) return;

        let reason = '';
        if (newStatus === 'CANCELLED') {
            const input = window.prompt("Reason for cancellation (e.g., Item out of stock):");
            if (input === null) return; // Cancelled the prompt
            reason = input || 'Butcher cancelled the order';
        }

        setUpdating(orderId);
        const success = await updateOrderStatus(token, orderId, newStatus, reason);
        if (success) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, cancellation_reason: reason } : o));
            toast.success(`Order #${orderId} → ${newStatus}`);
        } else {
            toast.error('Update failed. Please try again.');
        }
        setUpdating(null);
    };

    // B2: URL-based video upload using the shared api.ts function
    const handleUploadVideoUrl = async (orderId: number) => {
        if (!token) return;
        const url = videoUrls[orderId]?.trim();
        if (!url) { toast.error('Please paste a video URL first.'); return; }
        setUpdating(orderId);
        const success = await uploadOrderVideo(token, orderId, url);
        if (success) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, cutting_video_url: url } : o));
            setVideoUrls(prev => { const n = { ...prev }; delete n[orderId]; return n; });
            toast.success('Cutting proof uploaded!');
        } else {
            toast.error('Upload failed. Check the URL and try again.');
        }
        setUpdating(null);
    };

    const pendingOrders = orders.filter(o => o.status === 'PENDING');
    const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const visible = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Orders</h1>
                <button onClick={loadOrders} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* C1: New order alert banner */}
            {pendingOrders.length > 0 && (
                <div className="bg-rose-600 text-white p-4 rounded-2xl animate-pulse flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell size={18} />
                        <span className="font-black">{pendingOrders.length} new order{pendingOrders.length > 1 ? 's' : ''} waiting for confirmation!</span>
                    </div>
                    <button
                        onClick={() => setFilter('PENDING')}
                        className="bg-white text-rose-600 text-xs font-black px-4 py-1.5 rounded-full hover:bg-rose-50 transition-all"
                    >
                        View Now →
                    </button>
                </div>
            )}

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {FILTERS.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === f ? 'bg-rose-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                    >
                        {f}
                        {f === 'PENDING' && pendingOrders.length > 0 && (
                            <span className="ml-1.5 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{pendingOrders.length}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Orders list */}
            {loading ? (
                <div className="p-12 text-center text-white/40">Loading orders…</div>
            ) : visible.length === 0 ? (
                <div className="p-12 text-center text-white/40 rounded-2xl border border-white/5 bg-white/[0.02]">No orders matching "{filter}".</div>
            ) : (
                <div className="space-y-3">
                    {visible.map(order => (
                        <div key={order.id} className={`p-4 rounded-2xl border transition-all ${order.status === 'PENDING' ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/5 bg-white/[0.02] hover:border-white/10'}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="text-white font-mono font-medium text-sm">#{order.id}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? 'bg-white/10 text-white/50'}`}>
                                            {order.status}
                                        </span>
                                        {order.is_sunday_special && (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300">☀ Sunday Special</span>
                                        )}
                                        <span className="text-white/30 text-xs">{new Date(order.created_at).toLocaleString('en-IN')}</span>
                                    </div>
                                    <p className="text-white/60 text-xs mt-1 truncate">{order.delivery_address}</p>
                                    <p className="text-white font-bold mt-1">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</p>

                                    {/* Items */}
                                    {order.items?.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {order.items.map((item: any) => (
                                                <span key={item.id} className="px-2 py-1 bg-white/5 rounded-lg text-white/60 text-xs">
                                                    {item.meat_item_name} × {item.quantity}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* B2: URL paste video upload */}
                                    {['CONFIRMED', 'PROCESSING'].includes(order.status) && !order.cutting_video_url && (
                                        <div className="flex gap-2 mt-3">
                                            <input
                                                type="url"
                                                placeholder="Paste YouTube/Drive video URL..."
                                                value={videoUrls[order.id] || ''}
                                                onChange={(e) => setVideoUrls(prev => ({ ...prev, [order.id]: e.target.value }))}
                                                className="flex-1 h-9 px-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/50"
                                            />
                                            <button
                                                onClick={() => handleUploadVideoUrl(order.id)}
                                                disabled={updating === order.id || !videoUrls[order.id]?.trim()}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50"
                                            >
                                                <Video size={14} /> Save Proof
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 shrink-0">
                                    {(TRANSITIONS[order.status] ?? []).map(({ label, next, icon, color }) => (
                                        <button
                                            key={next}
                                            onClick={() => handleUpdateStatus(order.id, next)}
                                            disabled={updating === order.id}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all ${color} disabled:opacity-50`}
                                        >
                                            {icon}{label}
                                        </button>
                                    ))}

                                    {order.cutting_video_url && (
                                        <a
                                            href={order.cutting_video_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-white/10 hover:bg-white/20 transition-all"
                                        >
                                            <LinkIcon size={14} /> View Proof
                                        </a>
                                    )}

                                    {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                        <button
                                            onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                                            disabled={updating === order.id}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-red-900/50 hover:bg-red-700 transition-all disabled:opacity-50"
                                        >
                                            <XCircle size={14} />Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
