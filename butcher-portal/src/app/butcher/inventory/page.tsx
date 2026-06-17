'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { fetchButcherItems, updateMeatItem } from '@/lib/api';
import { Plus, Edit2, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
type Status = 'AVAILABLE' | 'SOLD_OUT' | 'HIDDEN';

export default function ButcherInventory() {
    const { token } = useAppContext();
    const [items, setItems] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        category: 'MUTTON',
        price: '',
        quantity: '',
        image_url: '',
        village_source: '',
        description: ''
    });

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<any | null>(null);
    const [savingId, setSavingId] = useState<number | null>(null);

    const load = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await fetchButcherItems(token);
            setItems(data);
        } catch { toast.error('Failed to load inventory'); }
        setLoading(false);
    }, [token]);

    useEffect(() => { load(); }, [load]);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setSavingId(-1); // dummy id for adding
        try {
            const api = await import('@/lib/api');
            const success = await api.createMeatItem(token, {
                ...newItem,
                price: parseFloat(newItem.price),
                quantity: parseInt(newItem.quantity)
            });
            if (success) {
                toast.success(`${newItem.name} added to inventory`);
                setIsAdding(false);
                setNewItem({ name: '', category: 'MUTTON', price: '', quantity: '', image_url: '', village_source: '', description: '' });
                load();
            } else {
                toast.error('Failed to add item. Check if all fields are valid.');
            }
        } catch {
            toast.error('An error occurred');
        }
        setSavingId(null);
    };

    const saveEdit = async (item: any) => {
        if (!token) return;
        setSavingId(item.id);
        const patchData = {
            price: item.price,
            quantity: item.quantity,
            status: item.status,
            village_source: item.village_source
        };
        const success = await updateMeatItem(token, item.id, patchData);
        if (success) {
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, ...item } : i));
            setEditing(null);
            toast.success(`${item.name} updated`);
        } else {
            toast.error('Update failed. Please check the data.');
        }
        setSavingId(null);
    };

    const STATUS_ICON: Record<Status, React.ReactNode> = {
        AVAILABLE: <CheckCircle size={14} className="text-green-400" />,
        SOLD_OUT: <AlertTriangle size={14} className="text-yellow-400" />,
        HIDDEN: <AlertTriangle size={14} className="text-white/20" />,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Inventory <span className="text-rose-500 not-italic">Stock</span></h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black uppercase tracking-widest text-[10px] ${isAdding ? 'bg-white/10 text-white' : 'bg-rose-600 text-white shadow-lg shadow-rose-900/20 hover:bg-rose-700'}`}
                    >
                        {isAdding ? 'Close Panel' : <><Plus size={14} /> Add New Item</>}
                    </button>
                    <button
                        onClick={async () => {
                            if (!token) return;
                            if (window.confirm("Reset all items to 'AVAILABLE' for the morning?")) {
                                const success = await (await import('@/lib/api')).performMorningReset(token);
                                if (success) {
                                    toast.success("Morning stock reset complete!");
                                    load();
                                } else {
                                    toast.error("Reset failed.");
                                }
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                        <RefreshCw size={14} />
                        Morning Reset
                    </button>
                    <button onClick={load} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Add Panel */}
            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 space-y-6"
                >
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-4">New Product Details</h2>
                    <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Item Name</label>
                            <input required type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-xs font-bold uppercase italic outline-none focus:border-rose-500" placeholder="e.g. Premium Goat Ribs" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Category</label>
                            <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-xs font-black uppercase tracking-widest outline-none focus:border-rose-500">
                                <option value="MUTTON">MUTTON</option>
                                <option value="CHICKEN">CHICKEN</option>
                                <option value="FISH">FISH</option>
                                <option value="EGGS">EGGS</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Price (₹)</label>
                            <input required type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-xs font-bold outline-none focus:border-rose-500" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Stock (KG)</label>
                            <input required type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })}
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-xs font-bold outline-none focus:border-rose-500" placeholder="0" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Image URL</label>
                            <input type="text" value={newItem.image_url} onChange={e => setNewItem({ ...newItem, image_url: e.target.value })}
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-xs font-medium outline-none focus:border-rose-500" placeholder="https://..." />
                        </div>
                        <div className="md:col-span-1 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Provenance</label>
                            <input type="text" value={newItem.village_source} onChange={e => setNewItem({ ...newItem, village_source: e.target.value })}
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-xs font-bold uppercase outline-none focus:border-rose-500" placeholder="Village Source" />
                        </div>
                        <div className="flex items-end">
                            <button type="submit" disabled={savingId === -1}
                                className="w-full h-12 bg-rose-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-700 transition-all shadow-xl disabled:opacity-50">
                                {savingId === -1 ? 'PUBLISHING...' : 'PUBLISH ITEM'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Summary badges */}
            <div className="flex gap-3 flex-wrap text-xs">
                {(['AVAILABLE', 'SOLD_OUT', 'HIDDEN'] as Status[]).map(s => {
                    const count = items.filter(i => i.status === s).length;
                    const colors: Record<string, string> = { AVAILABLE: 'bg-green-500/15 text-green-400', SOLD_OUT: 'bg-yellow-500/15 text-yellow-400', HIDDEN: 'bg-white/5 text-white/30' };
                    return (
                        <span key={s} className={`px-3 py-1.5 rounded-full font-black uppercase tracking-widest text-[9px] ${colors[s]}`}>
                            {s}: {count}
                        </span>
                    );
                })}
            </div>

            {/* Inventory table */}
            {loading ? (
                <div className="p-20 text-center">
                    <RefreshCw className="w-10 h-10 text-white/10 animate-spin mx-auto mb-4" />
                    <p className="text-white/20 uppercase font-black italic tracking-widest">Scanning Catalog...</p>
                </div>
            ) : (
                <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 text-white/30 text-xs">
                                <th className="px-4 py-3 text-left font-medium">Item</th>
                                <th className="px-4 py-3 text-left font-medium">Category</th>
                                <th className="px-4 py-3 text-left font-medium">Price (₹)</th>
                                <th className="px-4 py-3 text-left font-medium">Stock</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Provenance</th>
                                <th className="px-4 py-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => {
                                const isEditing = editing?.id === item.id;
                                const cur = isEditing ? editing : item;
                                return (
                                    <tr key={item.id} className={`border-b border-white/[0.04] ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                {item.image_url && <img src={item.image_url} alt={item.name} className="w-8 h-8 rounded-lg object-cover opacity-80" />}
                                                <span className="text-white/80 font-medium text-xs">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-white/40 text-xs">{item.category}</td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <input type="number" value={cur.price} onChange={e => setEditing({ ...cur, price: e.target.value })}
                                                    className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none" />
                                            ) : (
                                                <span className="text-white text-xs font-medium">₹{item.price}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <input type="number" value={cur.quantity} onChange={e => setEditing({ ...cur, quantity: parseInt(e.target.value) })}
                                                    className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none" />
                                            ) : (
                                                <span className={`text-xs font-medium ${item.quantity === 0 ? 'text-red-400' : item.quantity < 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                                                    {item.quantity}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <select value={cur.status} onChange={e => setEditing({ ...cur, status: e.target.value })}
                                                    className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none">
                                                    <option value="AVAILABLE">AVAILABLE</option>
                                                    <option value="SOLD_OUT">SOLD_OUT</option>
                                                    <option value="HIDDEN">HIDDEN</option>
                                                </select>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-xs text-white/50">
                                                    {STATUS_ICON[item.status as Status]}
                                                    {item.status}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <input type="text" value={cur.village_source || ''} onChange={e => setEditing({ ...cur, village_source: e.target.value })}
                                                    placeholder="Village Name"
                                                    className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none" />
                                            ) : (
                                                <span className="text-white/40 text-xs italic">{item.village_source || 'Not Set'}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => saveEdit(cur)} disabled={savingId === item.id}
                                                        className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs transition-all disabled:opacity-50">Save</button>
                                                    <button onClick={() => setEditing(null)} className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-all">Cancel</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setEditing({ ...item })}
                                                    className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded text-xs transition-all">
                                                    <Edit2 size={12} />Edit
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
