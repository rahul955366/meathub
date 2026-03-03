"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Weight, ChevronRight, CheckCircle2, ShieldCheck, Zap, Dog, Target } from 'lucide-react';
import { getMeatItems, getButchers, createSubscription, createGymSubscription, createPetSubscription, getUserProfile } from '@/lib/api';
import { MeatItem, Butcher, Subscription, GymSubscription, PetSubscription, UserProfile } from '@/types';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

interface SubscriptionFormProps {
    type: 'GENERAL' | 'GYM' | 'PET';
    planId?: string;
    petType?: string;
    gymGoal?: string;
    initialItemId?: string | number;
    onClose: () => void;
}

export default function SubscriptionForm({ type, planId, petType, gymGoal, initialItemId, onClose }: SubscriptionFormProps) {
    const { token } = useAppContext();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [butchers, setButchers] = useState<Butcher[]>([]);
    const [meatItems, setMeatItems] = useState<MeatItem[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const [formData, setFormData] = useState({
        butcherId: '',
        meatItemId: initialItemId ? initialItemId.toString() : '',
        quantity: 2,
        frequency: planId || 'WEEKLY',
        timeSlot: 'MORNING',
        // Specialized
        trainingGoal: gymGoal || 'MAINTAIN', // Renamed from proteinGoal to match backend Enum choices
        petActivity: 'Moderate'
    });

    useEffect(() => {
        getButchers().then(data => {
            setButchers(data);
            if (type !== 'GENERAL') {
                const flagship = data.find(b => b.is_official) || data[0];
                if (flagship) {
                    setFormData(prev => ({ ...prev, butcherId: flagship.id.toString() }));
                }
            }
        });
        getMeatItems().then(setMeatItems);
        if (token) getUserProfile(token).then(setProfile);
    }, [token, type]);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        if (!token) {
            toast.error("Please login to subscribe");
            return;
        }

        const selectedItem = meatItems.find(m => m.id.toString() === formData.meatItemId);
        const selectedButcher = butchers.find(b => b.id.toString() === formData.butcherId);

        if (!selectedItem || !selectedButcher) {
            toast.error("Invalid selection.");
            return;
        }

        setLoading(true);
        try {
            const deliveryAddress = profile?.addresses?.[0]?.street || profile?.bio || "Please update address";
            const deliveryPhone = profile?.phone || "0000000000";
            const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

            let success = false;
            if (type === 'GENERAL') {
                success = await createSubscription(token, {
                    butcher: selectedButcher.id,
                    meat_item: selectedItem.id,
                    meat_item_name: selectedItem.name,
                    quantity_kg: formData.quantity.toString(),
                    period: formData.frequency,
                    delivery_option: 'SUNDAY_ONLY',
                    primary_day_of_week: 'SUNDAY',
                    delivery_time: formData.timeSlot === 'MORNING' ? '08:00:00' : '18:00:00',
                    next_run_date: tomorrow,
                    delivery_address: deliveryAddress,
                    delivery_phone: deliveryPhone,
                    subscription_price: calculateTotal().toString(),
                    active: true
                } as Partial<Subscription>);
            } else if (type === 'GYM') {
                success = await createGymSubscription(token, {
                    butcher: selectedButcher.id,
                    meat_item: selectedItem.id,
                    meat_item_name: selectedItem.name,
                    daily_quantity: `${formData.quantity} servings`,
                    training_goal: formData.trainingGoal,
                    delivery_time: '06:00:00',
                    next_delivery_date: tomorrow,
                    delivery_address: deliveryAddress,
                    delivery_phone: deliveryPhone,
                    active: true
                } as Partial<GymSubscription>);
            } else {
                success = await createPetSubscription(token, {
                    meat_item: selectedItem.id,
                    product_name: selectedItem.name,
                    quantity_kg: formData.quantity.toString(),
                    pet_type: (petType || "DOG") as 'DOG' | 'CAT',
                    schedule_type: (formData.frequency === 'BI-WEEKLY' ? 'WEEKLY' : formData.frequency) as any, // Sync with backend enum
                    next_delivery_date: tomorrow,
                    delivery_address: deliveryAddress,
                    active: true
                } as Partial<PetSubscription>);
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

    const calculateTotal = () => {
        const item = meatItems.find(m => m.id.toString() === formData.meatItemId);
        if (!item) return 0;
        let base = Number(item.price) * formData.quantity;
        // Frequency discount logic
        if (formData.frequency === 'WEEKLY') base *= 4 * 0.9; // 10% off
        if (formData.frequency === 'BI-WEEKLY') base *= 2 * 0.95; // 5% off
        return Math.round(base);
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
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'CUT', label: 'CUT', sub: 'Lean/Loss', Icon: Target },
                                            { id: 'BULK', label: 'BULK', sub: 'Gain/Mass', Icon: Zap },
                                            { id: 'MAINTAIN', label: 'STAY', sub: 'Performance', Icon: ShieldCheck }
                                        ].map(goal => (
                                            <button
                                                key={goal.id}
                                                onClick={() => setFormData({ ...formData, trainingGoal: goal.id })}
                                                className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${formData.trainingGoal === goal.id ? 'bg-rose-50 border-rose-500 scale-105 shadow-xl' : 'bg-slate-50 border-slate-100 opacity-60'}`}
                                            >
                                                <goal.Icon className={`w-6 h-6 ${formData.trainingGoal === goal.id ? 'text-rose-600' : 'text-slate-400'}`} />
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">{goal.label}</p>
                                                    <p className="text-[8px] font-bold text-slate-400 mt-0.5">{goal.sub}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Select Your Protein Target</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {meatItems.filter(m => {
                                            // Enforce Official Flagship items for GYM and PET as per vision
                                            const isOfficial = butchers.find(b => b.id === m.butcher)?.is_official;
                                            if (type === 'GYM') return isOfficial && (m.category === 'CHICKEN' || m.name.includes('Lean') || m.name.includes('Breast'));
                                            if (type === 'PET') return isOfficial && (m.name.includes('Raw') || m.category === 'FISH' || m.category === 'MUTTON');
                                            return true;
                                        }).map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => setFormData({ ...formData, meatItemId: m.id.toString() })}
                                                className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.meatItemId === m.id.toString() ? 'border-rose-600 bg-rose-50/50 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}
                                            >
                                                <p className="text-[10px] font-black uppercase tracking-tight text-slate-900 line-clamp-1">{m.name}</p>
                                                <p className="text-[10px] font-bold text-rose-600 italic">₹{m.price}/KG</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {type === 'GENERAL' && (
                                    <div className="space-y-2 pt-4 border-t border-slate-100">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Assigned Master Butcher</label>
                                        <select
                                            value={formData.butcherId}
                                            onChange={(e) => setFormData({ ...formData, butcherId: e.target.value })}
                                            className="w-full h-16 px-6 rounded-2xl bg-neutral-900 text-white font-bold focus:ring-2 focus:ring-rose-600 outline-none transition-all appearance-none italic"
                                        >
                                            <option value="">Select Butcher (Nearest assigned by default)</option>
                                            {butchers.map(b => <option key={b.id} value={b.id}>{b.shop_name} {b.is_official ? '★ Official' : ''}</option>)}
                                        </select>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="p-8 bg-slate-900 rounded-[3rem] text-white space-y-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <ShieldCheck className="w-32 h-32" />
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Subscription summary</p>
                                            <div className="bg-rose-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">Save 25%</div>
                                        </div>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-4xl font-black italic tracking-tighter uppercase">₹{calculateTotal()}</h3>
                                            <p className="text-xs text-slate-400 font-bold line-through">₹{Math.round(calculateTotal() * 1.33)}</p>
                                        </div>

                                        <div className="space-y-3 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-[10px] font-black italic">✓</div>
                                                <span>4 Priority Deliveries/Month</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-[10px] font-black italic">✓</div>
                                                <span>Zero Delivery Charges Forever</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-[10px] font-black italic">✓</div>
                                                <span>Verified Freshness Guarantee</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Benefit breakdown</p>
                                            <div className="flex justify-between text-xs font-bold italic">
                                                <span>Market Price (4kg)</span>
                                                <span className="text-slate-400">₹{Math.round(calculateTotal() * 1.15)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-bold italic mt-1">
                                                <span>MeatHub Discount</span>
                                                <span className="text-rose-500">-₹{Math.round(calculateTotal() * 0.15)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
