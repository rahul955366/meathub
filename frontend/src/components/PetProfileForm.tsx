"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Dog, Cat, Save, Trash2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

interface PetProfile {
    id?: number;
    name: string;
    type: 'DOG' | 'CAT';
    breed: string;
    age: string;
    weight: string;
    activity_level: 'LOW' | 'MODERATE' | 'HIGH';
}

interface PetProfileFormProps {
    initialData?: PetProfile;
    onSave: (data: PetProfile) => void;
    onCancel: () => void;
}

export default function PetProfileForm({ initialData, onSave, onCancel }: PetProfileFormProps) {
    const [formData, setFormData] = useState<PetProfile>(initialData || {
        name: '',
        type: 'DOG',
        breed: '',
        age: '',
        weight: '',
        activity_level: 'MODERATE'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.breed) {
            toast.error("Please fill in the pet's name and breed");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-2xl w-full max-h-[85vh] relative flex flex-col overflow-hidden"
            >
                {/* Header - Fixed */}
                <div className="p-6 md:p-8 bg-white border-b border-slate-50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Heart className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                                {initialData ? 'Edit' : 'Create'} <span className="text-rose-600 not-italic">Pet.</span>
                            </h2>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Nutrition Protocol</p>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={onCancel} 
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
                    <form id="pet-profile-form" onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pet Type Toggle */}
                            <div className="md:col-span-2 flex gap-4">
                                {(['DOG', 'CAT'] as const).map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`flex-1 h-16 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all ${formData.type === type ? 'border-rose-600 bg-rose-50 text-rose-600 shadow-md' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                    >
                                        {type === 'DOG' ? <Dog className="w-4 h-4" /> : <Cat className="w-4 h-4" />}
                                        {type} Selection
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Pet Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-rose-600 outline-none transition-all placeholder:text-slate-300"
                                    placeholder="e.g. Bruno"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Breed / Species</label>
                                <input
                                    type="text"
                                    value={formData.breed}
                                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-rose-600 outline-none transition-all placeholder:text-slate-300"
                                    placeholder="e.g. Golden Retriever"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Age (Years)</label>
                                <input
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-rose-600 outline-none transition-all"
                                    placeholder="e.g. 3"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Weight (KG)</label>
                                <input
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-rose-600 outline-none transition-all"
                                    placeholder="e.g. 25"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Activity Protocol</label>
                                <div className="flex gap-2">
                                    {(['LOW', 'MODERATE', 'HIGH'] as const).map(level => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, activity_level: level })}
                                            className={`flex-1 h-14 rounded-xl border-2 font-black uppercase tracking-widest text-[9px] transition-all ${formData.activity_level === level ? 'border-rose-600 bg-rose-50 text-rose-600 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer - Fixed */}
                <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
                    <button
                        type="submit"
                        form="pet-profile-form"
                        className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-xl active:scale-95"
                    >
                        <Save className="w-4 h-4" /> Save Protocol
                    </button>
                    {initialData && (
                        <button
                            type="button"
                            className="w-16 h-16 border-2 border-rose-100 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-50 transition-all active:scale-95"
                            onClick={() => toast.error("Delete functionality mock enabled")}
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
