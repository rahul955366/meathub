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
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100 max-w-2xl w-full"
        >
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white">
                        <Heart className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                            {initialData ? 'Edit' : 'Create'} <span className="text-rose-600 not-italic">Pet Profile.</span>
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personalized Nutrition Protocol</p>
                    </div>
                </div>
                <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pet Type Toggle */}
                    <div className="md:col-span-2 flex gap-4">
                        {(['DOG', 'CAT'] as const).map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setFormData({ ...formData, type })}
                                className={`flex-1 h-16 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all ${formData.type === type ? 'border-rose-600 bg-rose-50 text-rose-600' : 'border-slate-100 text-slate-400'}`}
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
                            className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-rose-600 outline-none transition-all"
                            placeholder="e.g. Bruno"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Breed / Species</label>
                        <input
                            type="text"
                            value={formData.breed}
                            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                            className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-rose-600 outline-none transition-all"
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

                <div className="pt-6 flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-xl"
                    >
                        <Save className="w-4 h-4" /> Save Protocol
                    </button>
                    {initialData && (
                        <button
                            type="button"
                            className="w-16 h-16 border-2 border-rose-100 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-50 transition-all"
                            onClick={() => toast.error("Delete functionality mock enabled")}
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </form>
        </motion.div>
    );
}
