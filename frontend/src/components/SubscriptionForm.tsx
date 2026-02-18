"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Weight, ChevronRight, CheckCircle2, ShieldCheck, Zap, Dog, Target } from 'lucide-react';
import { getMeatItems, getButchers, createSubscription, createGymSubscription, createPetSubscription } from '@/lib/api';
import { MeatItem, Butcher } from '@/types';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

interface SubscriptionFormProps {
    type: 'GENERAL' | 'GYM' | 'PET';
    planId?: string;
    petType?: string;
    gymGoal?: string;
    onClose: () => void;
}

export default function SubscriptionForm({ type, planId, petType, gymGoal, onClose }: SubscriptionFormProps) {
    const { token } = useAppContext();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [butchers, setButchers] = useState<Butcher[]>([]);
    const [meatItems, setMeatItems] = useState<MeatItem[]>([]);

    const [formData, setFormData] = useState({
        butcherId: '',
        meatItemId: '',
        quantity: 2,
        frequency: planId || 'WEEKLY',
        timeSlot: 'MORNING',
        // Specialized
        proteinGoal: gymGoal || 'Maintenance',
        petActivity: 'Moderate'
    });

    useEffect(() => {
        getButchers().then(setButchers);
        getMeatItems().then(setMeatItems);
    }, []);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        if (!token) {
            toast.error("Please login to subscribe");
            return;
        }

        setLoading(true);
        try {
            let success = false;
            if (type === 'GENERAL') {
                success = await createSubscription(token, {
                    butcher_id: parseInt(formData.butcherId),
                    meat_item_id: parseInt(formData.meatItemId),
                    quantity_kg: formData.quantity,
                    period: formData.frequency,
                    delivery_time_slot: formData.timeSlot
                });
            } else if (type === 'GYM') {
                success = await createGymSubscription(token, {
                    meat_item_id: parseInt(formData.meatItemId),
                    daily_quantity: `${formData.quantity} servings`,
                    goal: formData.proteinGoal,
                    next_delivery_date: new Date(Date.now() + 86400000).toISOString().split('T')[0]
                });
            } else {
                success = await createPetSubscription(token, {
                    product_name: "Premium Selection",
                    quantity_kg: formData.quantity,
                    pet_type: (petType || "DOG").toUpperCase(),
                    schedule_type: formData.frequency,
                    next_delivery_date: new Date(Date.now() + 86400000).toISOString().split('T')[0]
                });
            }

            if (success) {
                toast.success(`${type} Cycle Activated!`);
                onClose();
            } else {
                toast.error("Protocol failed. Check logistics.");
            }
        } catch (error) {
            toast.error("System Error during activation.");
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative border border-slate-100"
            >
                {/* Header */}
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/20 blur-3xl -mr-16 -mt-16" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                            Initiate <span className="text-rose-600 not-italic">{type}.</span>
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Optimization Phase {step} of 3</p>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-rose-600 transition-all relative z-10">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100 flex">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        className="h-full bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                    />
                </div>

                <div className="p-10 space-y-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                {/* Specialized Heading */}
                                {type === 'GYM' && (
                                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4 mb-4">
                                        <Target className="w-8 h-8 text-emerald-600" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Performance Protocol</p>
                                            <p className="text-xs font-bold text-emerald-800">Optimizing for {formData.proteinGoal}</p>
                                        </div>
                                    </div>
                                )}

                                {type === 'PET' && (
                                    <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 flex items-center gap-4 mb-4">
                                        <Dog className="w-8 h-8 text-rose-600" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">Bio-Correct Nutrition</p>
                                            <p className="text-xs font-bold text-rose-800">Feeding Calculator Active</p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Master Butcher Selection</label>
                                    <select
                                        value={formData.butcherId}
                                        onChange={(e) => setFormData({ ...formData, butcherId: e.target.value })}
                                        className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-rose-600 outline-none transition-all appearance-none"
                                    >
                                        <option value="">Select Butcher</option>
                                        {butchers.map(b => <option key={b.id} value={b.id}>{b.shop_name}</option>)}
                                    </select>
                                </div>

                                {/* GYM Specifics */}
                                {type === 'GYM' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Training Goal</label>
                                            <select
                                                value={formData.proteinGoal}
                                                onChange={(e) => setFormData({ ...formData, proteinGoal: e.target.value })}
                                                className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-rose-600 outline-none transition-all appearance-none"
                                            >
                                                <option value="Maintenance">Maintenance</option>
                                                <option value="Bulking">Bulking (Surplus)</option>
                                                <option value="Cutting">Cutting (Deficit)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Lean Source Only</label>
                                            <div className="w-full h-16 px-6 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex items-center gap-3">
                                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                                <span className="text-[10px] font-black text-emerald-800 uppercase">Verified Lean</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* PET Specifics */}
                                {type === 'PET' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Activity Level</label>
                                            <select
                                                value={formData.petActivity}
                                                onChange={(e) => setFormData({ ...formData, petActivity: e.target.value })}
                                                className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-rose-600 outline-none transition-all appearance-none"
                                            >
                                                <option value="Low">Sedentary (Low)</option>
                                                <option value="Moderate">Active (Moderate)</option>
                                                <option value="High">Working (High)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Daily Serving Suggestion</label>
                                            <div className="w-full h-16 px-6 rounded-2xl bg-rose-50 border-2 border-rose-100 flex items-center justify-between">
                                                <span className="text-[10px] font-black text-rose-800 uppercase">{formData.petActivity === 'High' ? '750g/Day' : '500g/Day'}</span>
                                                <Zap className="w-4 h-4 text-rose-600 animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Protein Selection</label>
                                    <select
                                        value={formData.meatItemId}
                                        onChange={(e) => setFormData({ ...formData, meatItemId: e.target.value })}
                                        className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-rose-600 outline-none transition-all appearance-none"
                                    >
                                        <option value="">Select Item</option>
                                        {meatItems.filter(m => {
                                            if (type === 'GYM') return m.category === 'CHICKEN' || m.name.includes('Lean');
                                            if (type === 'PET') return m.name.includes('Raw') || m.category === 'FISH' || m.category === 'MUTTON';
                                            return true;
                                        }).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logistics Volume (KG)</label>
                                        <span className="text-xl font-black italic text-rose-600">{formData.quantity} KG</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="20"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {(['WEEKLY', 'BI-WEEKLY', 'MONTHLY'] as const).map(freq => (
                                        <button
                                            key={freq}
                                            onClick={() => setFormData({ ...formData, frequency: freq })}
                                            className={`h-16 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] transition-all ${formData.frequency === freq ? 'border-rose-600 bg-rose-50 text-rose-600 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            {freq} Cycle
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 flex items-center gap-6">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase tracking-tighter text-emerald-900">Protocol Verified</h4>
                                        <p className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-widest leading-none">Price Locked for next 4 cycles</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-rose-600" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Master Logistics Window</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {(['MORNING', 'EVENING'] as const).map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => setFormData({ ...formData, timeSlot: slot })}
                                                className={`h-16 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] transition-all ${formData.timeSlot === slot ? 'border-rose-600 bg-rose-50 text-rose-600 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                {slot} (6-9)
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Actions */}
                    <div className="flex gap-4 pt-6">
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="h-16 px-8 rounded-2xl border-2 border-slate-100 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:bg-slate-50 transition-all"
                            >
                                Re-Target
                            </button>
                        )}
                        <button
                            onClick={step === 3 ? handleSubmit : handleNext}
                            disabled={loading || (step === 1 && (!formData.butcherId || !formData.meatItemId))}
                            className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-xl disabled:opacity-50 disabled:hover:bg-slate-900"
                        >
                            {loading ? "SYNCING..." : step === 3 ? "ACTIVATE SUBSCRIPTION" : "LOGISTICS CONTINUED"}
                            {!loading && <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
