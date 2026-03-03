'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getOrders, updateOrderStatus, uploadOrderVideo } from '@/lib/api';
import { CheckCircle, XCircle, Truck, RefreshCw, Video, Upload, Search, Filter, ShieldCheck, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-300',
    CONFIRMED: 'bg-blue-500/20 text-blue-300',
    PROCESSING: 'bg-purple-500/20 text-purple-300',
    SHIPPED: 'bg-sky-500/20 text-sky-300',
    DELIVERED: 'bg-green-500/20 text-green-300',
    CANCELLED: 'bg-red-500/20 text-red-300',
};

export default function AdminOrders() {
    const { token, user } = useAppContext();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [updating, setUpdating] = useState<number | null>(null);

    const loadOrders = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await getOrders(token);
            setOrders(data);
        } catch { toast.error('Failed to load system orders'); }
        setLoading(false);
    }, [token]);

    useEffect(() => {
        if (token) loadOrders();
    }, [token, loadOrders]);

    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        if (!token) return;
        setUpdating(orderId);
        const success = await updateOrderStatus(token, orderId, newStatus);
        if (success) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Order #${orderId} updated to ${newStatus}`);
        } else {
            toast.error('Update failed');
        }
        setUpdating(null);
    };

    const handleUploadVideo = async (orderId: number, file: File) => {
        if (!token) return;
        setUpdating(orderId);

        // In a real app, you'd upload to S3/Cloudinary and get a URL.
        // For Meathub Beta, we'll simulate the URL for now or use the backend endpoint if it handles files.
        // The backend endpoint 'upload-video' expected a 'video_url' in JSON in api.ts, 
        // but the butcher portal used FormData. Let's stick to the butcher portal's logic if possible.

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const formData = new FormData();
        formData.append('video', file);

        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}/upload-video/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, cutting_video_url: data.video_url } : o));
                toast.success('Cutting proof uploaded successfully!');
            } else {
                toast.error('Upload failed');
            }
        } catch { toast.error('Network error during upload'); }
        setUpdating(null);
    };

    const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    const filteredOrders = orders.filter(o => {
        const matchesFilter = filter === 'ALL' || o.status === filter;
        const matchesSearch = o.id.toString().includes(search) ||
            o.user_email?.toLowerCase().includes(search.toLowerCase()) ||
            o.butcher_name?.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (!user || (!user.is_staff && !user.is_superuser)) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <ShieldCheck className="w-16 h-16 text-rose-600 mx-auto" />
                    <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Access Denied</h1>
                    <p className="text-slate-500 font-medium">This terminal is restricted to Meathub Administrators.</p>
                    <Link href="/" className="inline-block px-8 py-3 bg-white text-slate-950 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                        Return to Safety
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-900/20">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Command <span className="text-rose-600">Center</span></h1>
                        </div>
                        <p className="text-slate-500 font-medium italic">Global order management & cutting proof verification.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-rose-600 transition-all" />
                            <input
                                type="text"
                                placeholder="Search orders, emails, shops..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-14 pl-12 pr-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:border-rose-600 transition-all w-64 md:w-80"
                            />
                        </div>
                        <button onClick={loadOrders} className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all">
                            <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin text-rose-600' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Filter Grid */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${filter === f ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Orders Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="h-32 bg-white/5 border border-white/10 rounded-3xl animate-pulse" />
                        ))
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                            <p className="text-slate-500 font-black uppercase tracking-widest text-sm italic">No system matches found in current sector.</p>
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <div key={order.id} className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 hover:bg-white/[0.04] hover:border-rose-600/30 transition-all duration-500">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                    {/* Order ID & Status */}
                                    <div className="lg:w-48 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black italic tracking-tighter">#{order.id}</span>
                                            {order.is_sunday_special && (
                                                <span className="px-2 py-0.5 bg-rose-600/20 text-rose-500 text-[8px] font-black uppercase tracking-widest rounded-md">SUNDAY</span>
                                            )}
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block ${STATUS_COLORS[order.status]}`}>
                                            {order.status}
                                        </div>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(order.created_at).toLocaleString()}</p>
                                    </div>

                                    {/* Customer & Butcher */}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Customer</p>
                                            <p className="text-sm font-bold text-white truncate">{order.user_email}</p>
                                            <p className="text-[10px] text-slate-600 font-bold uppercase truncate">{order.delivery_address}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Butcher Shop</p>
                                            <p className="text-sm font-bold text-white uppercase italic tracking-tight">{order.butcher_name}</p>
                                            <p className="text-xl font-black text-rose-600 italic mt-1">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="hidden xl:block w-48">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Manifest</p>
                                        <div className="space-y-1 max-h-12 overflow-y-auto scrollbar-hide">
                                            {order.items?.slice(0, 2).map((item: any) => (
                                                <p key={item.id} className="text-[10px] text-slate-400 font-bold uppercase truncate">
                                                    {item.meat_item_name} × {item.quantity}
                                                </p>
                                            ))}
                                            {order.items?.length > 2 && <p className="text-[8px] text-rose-600 font-black italic">+ {order.items.length - 2} more</p>}
                                        </div>
                                    </div>

                                    {/* Admin Actions */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="relative group/upload">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                className="hidden"
                                                id={`admin-video-${order.id}`}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleUploadVideo(order.id, file);
                                                }}
                                            />
                                            <label
                                                htmlFor={`admin-video-${order.id}`}
                                                className={`h-14 px-6 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg ${order.cutting_video_url ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/20'}`}
                                            >
                                                <Video className="w-4 h-4" /> {order.cutting_video_url ? 'Replace Video' : 'Upload Proof'}
                                            </label>
                                        </div>

                                        {order.cutting_video_url && (
                                            <a
                                                href={order.cutting_video_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="h-14 px-6 bg-white/5 text-rose-600 border border-rose-600/30 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-xl shadow-rose-900/10"
                                            >
                                                <Upload className="w-4 h-4" /> View Verified Proof
                                            </a>
                                        )}

                                        <div className="h-14 w-px bg-white/10 mx-2 hidden lg:block" />

                                        <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                            className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 focus:outline-none focus:border-rose-600 cursor-pointer hover:bg-white/10 transition-all appearance-none text-center min-w-[140px]"
                                        >
                                            {FILTERS.slice(1).map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
