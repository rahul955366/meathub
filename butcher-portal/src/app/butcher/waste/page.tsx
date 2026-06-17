"use client";

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { fetchWasteCollections, request } from '@/lib/api';
import { Plus, Trash2, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WasteManagementPage() {
    const { token, user } = useAppContext();
    const [wasteItems, setWasteItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // New item form
    const [newItem, setNewItem] = useState({
        waste_type: '',
        quantity_kg: '',
        price_per_kg: '',
        is_available: true
    });

    const loadWaste = async () => {
        if (!token) return;
        setLoading(true);
        try {
            // Fetch only this butcher's waste collections using authenticated endpoint
            const data = await request('/waste-collection/?mine=true', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const items = Array.isArray(data) ? data : (data as any)?.results || [];
            setWasteItems(items);
        } catch (error) {
            toast.error("Failed to load waste listings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWaste();
    }, [token]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setIsSaving(true);
        try {
            await request('/waste-collection/', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newItem)
            });
            toast.success("Listing added successfully!");
            setNewItem({ waste_type: '', quantity_kg: '', price_per_kg: '', is_available: true });
            loadWaste();
        } catch (error) {
            toast.error("Failed to add listing. Ensure all fields are valid.");
        } finally {
            setIsSaving(true); // Wait, should be false
            setIsSaving(false);
        }
    };

    const handleToggleAvailability = async (id: number, current: boolean) => {
        if (!token) return;
        try {
            await request(`/waste-collection/${id}/`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ is_available: !current })
            });
            loadWaste();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleDelete = async (id: number) => {
        if (!token) return;
        if (!confirm("Are you sure? This listing will be permanently removed.")) return;
        try {
            await request(`/waste-collection/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success("Deleted");
            loadWaste();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Waste <span className="text-rose-500 not-italic">Management</span></h1>
                <p className="text-white/40 font-medium">Manage your raw material (bones, trimmings) for the Pet Food ecosystem.</p>
            </div>

            {/* Add New Listing */}
            <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8">
                <h2 className="text-white font-black uppercase text-sm tracking-widest mb-6 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-rose-500" /> Create New Listing
                </h2>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Material Type</label>
                        <input
                            type="text"
                            placeholder="e.g. Chicken Bones"
                            value={newItem.waste_type}
                            onChange={(e) => setNewItem({ ...newItem, waste_type: e.target.value })}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:border-rose-500 transition-all font-bold uppercase italic text-sm"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Quantity (KG)</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={newItem.quantity_kg}
                            onChange={(e) => setNewItem({ ...newItem, quantity_kg: e.target.value })}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:border-rose-500 transition-all font-bold text-sm"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Price / KG (₹)</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={newItem.price_per_kg}
                            onChange={(e) => setNewItem({ ...newItem, price_per_kg: e.target.value })}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:border-rose-500 transition-all font-bold text-sm"
                            required
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full h-14 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-700 transition-all shadow-xl disabled:opacity-50"
                        >
                            {isSaving ? 'PUBLISHING...' : 'PUBLISH LISTING'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List of Active Listings */}
            <div className="space-y-4">
                <h2 className="text-white font-black uppercase text-sm tracking-widest ml-2">Your Active Listings</h2>
                {loading ? (
                    <div className="text-white/20 uppercase font-black italic tracking-widest text-center py-20">Scanning Inventory...</div>
                ) : wasteItems.length === 0 ? (
                    <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem] p-20 text-center">
                        <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/30 font-bold uppercase tracking-widest text-xs">No listings found. Start by adding one above.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {wasteItems.map((item) => (
                            <div key={item.id} className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white/[0.05] transition-all">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.is_available ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/20'}`}>
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase italic text-white">{item.waste_type}</h3>
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">
                                            <span>{item.quantity_kg} KG Available</span>
                                            <span className="h-1 w-1 bg-white/20 rounded-full" />
                                            <span className="text-rose-400">₹{item.price_per_kg} / KG</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleToggleAvailability(item.id, item.is_available)}
                                        className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${item.is_available ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'}`}
                                    >
                                        {item.is_available ? 'MARK UNAVAILABLE' : 'MARK AVAILABLE'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hint / Warning */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <div className="space-y-1">
                    <p className="text-sm font-black text-blue-100 uppercase tracking-tight">Artisan Tip: Fresh trimmings fetch higher prices</p>
                    <p className="text-[10px] text-blue-300/60 font-medium uppercase tracking-widest leading-relaxed">
                        The Meathub Pet ecosystem prioritizes bones and trimmings that are listed within 2 hours of butchery. Keep your listings updated to maintain your Artisan Hygiene Score.
                    </p>
                </div>
            </div>
        </div>
    );
}
