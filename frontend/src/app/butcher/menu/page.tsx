'use client';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getMeatItems, updateMeatItem } from '@/lib/api';
import { MeatItem } from '@/types';
import { CheckCircle2, XCircle, ShoppingBag, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ButcherMenuManager() {
    const { token, user } = useAppContext();
    const [items, setItems] = useState<MeatItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number[]>([]);

    useEffect(() => {
        async function load() {
            if (!token) return;
            setLoading(true);
            try {
                const all = await getMeatItems();
                // Filter for this butcher's items (using user.butcher_id if available)
                // Note: api.ts fetchButcherItems doesn't exist yet, we use getMeatItems + filter
                const butcherId = (user as any)?.butcher_id;
                const mine = all.filter((i: MeatItem) => i.butcher === butcherId);
                setItems(mine);
            } catch { toast.error('Failed to load menu items'); }
            setLoading(false);
        }
        load();
    }, [token, user]);

    const toggleStatus = async (item: MeatItem) => {
        if (!token) return;
        const newStatus = item.status === 'AVAILABLE' ? 'SOLD_OUT' : 'AVAILABLE';
        
        // Optimistic update
        setUpdating(prev => [...prev, item.id]);
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: newStatus } : i));

        const success = await updateMeatItem(token, item.id, { status: newStatus });
        
        if (!success) {
            // Revert on failure
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: item.status } : i));
            toast.error(`Failed to update ${item.name}`);
        } else {
            toast.success(`${item.name} is now ${newStatus === 'AVAILABLE' ? 'in stock' : 'sold out'}`);
        }
        setUpdating(prev => prev.filter(id => id !== item.id));
    };

    if (loading) return <div className="p-12 text-center text-white/40 font-black italic">LOADING MENU...</div>;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="bg-rose-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShoppingBag size={120} />
                </div>
                <div className="relative z-10 max-w-2xl space-y-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/20 px-4 py-2 rounded-full backdrop-blur">Morning Stock Setup</span>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        Today's <br /> <span className="text-slate-900 not-italic">Potlam Menu.</span>
                    </h1>
                    <p className="text-rose-100 text-lg font-medium italic">
                        Quickly toggle your inventory status for the daily rush. Sold-out items are hidden from the store immediately.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.length === 0 ? (
                    <div className="col-span-full p-20 text-center bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
                        <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-sm italic">No items found in your inventory.</p>
                    </div>
                ) : (
                    items.map(item => (
                        <div 
                            key={item.id} 
                            className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer select-none group ${
                                item.status === 'AVAILABLE' 
                                ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40' 
                                : 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40'
                            }`}
                            onClick={() => !updating.includes(item.id) && toggleStatus(item)}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                                    item.status === 'AVAILABLE' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                                }`}>
                                    <ShoppingBag size={24} />
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    item.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                                }`}>
                                    {item.status}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white tracking-tight uppercase italic group-hover:text-rose-500 transition-colors">
                                    {item.name}
                                </h3>
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider">
                                    <Clock size={14} />
                                    <span>₹{parseFloat(item.price as any)} / KG</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                                    {updating.includes(item.id) ? 'UPDATING...' : 'CLICK TO TOGGLE'}
                                </span>
                                {item.status === 'AVAILABLE' ? (
                                    <CheckCircle2 className="text-emerald-500" size={24} />
                                ) : (
                                    <XCircle className="text-rose-500" size={24} />
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
