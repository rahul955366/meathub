"use client";

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { createOrder, createPaymentOrder, verifyPayment } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, CreditCard, Wallet, Building, Check, ArrowRight, ShieldCheck, Clock, Truck, AlertCircle, User, Store } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPlaceholderImage } from '@/utils/imageHelpers';
import Script from 'next/script';

interface FormData {
    name: string;
    phone: string;
    address: string;
    landmark: string;
    city: string;
    pincode: string;
    paymentMethod: 'COD' | 'UPI' | 'CARD';
}

export default function CheckoutPage() {
    const { cart, totalAmount, clearCart, user, token } = useAppContext();
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Address, 2: AuthBridge (if not logged in), 3: Payment, 4: Confirm
    const [guestMode, setGuestMode] = useState(false);
    const [error, setError] = useState('');

    // Detect if this is a subscription checkout
    const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const plan = params.get('plan');
        if (plan) setSubscriptionPlan(plan);
    }, []);

    const PLANS = {
        'WEEKLY': { id: 'WEEKLY', name: 'Artisan Weekly', price: 2400, desc: '4 Deliveries / Month • Sunday Priority' },
        'MONTHLY': { id: 'MONTHLY', name: 'Concierge Monthly', price: 8500, desc: 'Daily Drops • Sunday Auto-Dispatch' },
        'YEARLY': { id: 'YEARLY', name: 'Elite Annual', price: 95000, desc: 'Price Protection • 24/7 Concierge' },
        'gym': { id: 'gym', name: 'Gym/Protein Subscription', price: 1500, desc: 'High Protein Bulk Meat' },
        'pet': { id: 'pet', name: 'Pet Food Subscription', price: 800, desc: 'Healthy Meats for Pets' }
    };

    const currentPlan = subscriptionPlan ? PLANS[subscriptionPlan as keyof typeof PLANS] : null;

    const [formData, setFormData] = useState<FormData>({
        name: user?.username || '',
        phone: '',
        address: '',
        landmark: '',
        city: 'Hyderabad',
        pincode: '',
        paymentMethod: 'COD'
    });

    const [sundaySpecial, setSundaySpecial] = useState(false);
    const [sundaySlot, setSundaySlot] = useState<'EARLY_MORNING' | 'MORNING' | 'LATE_MORNING'>('EARLY_MORNING');
    const [isProcessing, setIsProcessing] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => console.warn("GPS Permission denied for checkout mapping.")
            );
        }
    }, []);

    const validateStep1 = () => {
        if (!formData.phone || formData.phone.length < 10) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }
        if (!formData.address.trim()) {
            setError('Please enter your delivery address');
            return false;
        }
        if (!formData.pincode || formData.pincode.length < 6) {
            setError('Please enter a valid 6-digit pincode');
            return false;
        }
        setError('');
        return true;
    };

    const handleStep1Next = () => {
        if (validateStep1()) {
            if (user || guestMode) {
                setStep(3); // Skip bridge if already user or guest
            } else {
                setStep(2); // Show guest vs login bridge
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');

        if (!token && !guestMode) {
            setError('Please login or continue as guest.');
            setIsProcessing(false);
            return;
        }

        if (cart.length === 0 && !subscriptionPlan) {
            setError('Your cart is empty.');
            setIsProcessing(false);
            return;
        }

        // --- Sunday Special Cutoff Check ---
        if (sundaySpecial) {
            const now = new Date();
            const day = now.getDay(); // 0=Sun, 6=Sat
            const hour = now.getHours();

            if (day === 6 && hour >= 12) {
                setError('Sunday special delivery cutoff was 12 PM Saturday. Orders are now closed for tomorrow.');
                setIsProcessing(false);
                return;
            }
            if (day === 0) {
                setError('Sunday special orders must be placed by Saturday 12 PM.');
                setIsProcessing(false);
                return;
            }
        }

        if (currentPlan) {
            if (!token) {
                setError('Login required for subscriptions');
                setIsProcessing(false);
                return;
            }
            try {
                const api = await import('@/lib/api');
                let success = false;
                if (currentPlan.id === 'gym') {
                    success = await api.createGymSubscription(token, {
                        protein_type: 'CHICKEN', // default
                        weekly_weight_kg: 5,
                        active: true
                    } as any);
                } else if (currentPlan.id === 'pet') {
                    success = await api.createPetSubscription(token, {
                        pet_type: 'DOG', // required field in model
                        weekly_quantity_kg: 3,
                        active: true
                    } as any);
                } else {
                    success = await api.createSubscription(token, {
                        plan_name: currentPlan.name,
                        price: currentPlan.price,
                        active: true
                    } as any);
                }

                if (success) {
                    router.push('/order-success?type=subscription');
                } else {
                    setError('Failed to create subscription in database.');
                }
            } catch (e) {
                setError('Subscription failed. Please try again.');
            } finally {
                setIsProcessing(false);
            }
            return;
        }

        let paymentId = '';

        // --- Razorpay Integration ---
        if (formData.paymentMethod !== 'COD') {
            try {
                // 1. Create Payment Order on Backend
                const pOrder = await createPaymentOrder(token || '', totalAmount);
                if (!pOrder || !pOrder.success) {
                    throw new Error('Failed to initiate payment gateway.');
                }

                // 2. Open Razorpay Checkout
                const options = {
                    key: pOrder.razorpay_key,
                    amount: totalAmount * 100,
                    currency: 'INR',
                    name: 'MeatHub',
                    description: 'Premium Meat Purchase',
                    order_id: pOrder.razorpay_order_id,
                    handler: async (response: any) => {
                        // 3. Verify Payment
                        const verifyResult = await verifyPayment(token || '', {
                            razorpay_order_id: pOrder.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyResult && verifyResult.success) {
                            paymentId = verifyResult.payment_id;
                            // Proceed to create final order
                            await finalizeOrder(paymentId);
                        } else {
                            setError('Payment verification failed. Please contact support.');
                            setIsProcessing(false);
                        }
                    },
                    prefill: {
                        name: formData.name,
                        contact: formData.phone
                    },
                    modal: {
                        ondismiss: function () {
                            setError('Payment cancelled or window closed.');
                            setIsProcessing(false);
                        }
                    },
                    theme: { color: "#e11d48" }
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();
                return; // Early return, wait for handler
            } catch (err: any) {
                setError(err.message || 'Payment initiation failed.');
                setIsProcessing(false);
                return;
            }
        }

        await finalizeOrder('');
    };

    const finalizeOrder = async (pId: string) => {
        // --- Multi-Butcher Order Splitting ---
        const butcherGroups: Record<number, typeof cart> = {};
        cart.forEach(item => {
            const bId = item.butcher_id;
            if (!butcherGroups[bId]) butcherGroups[bId] = [];
            butcherGroups[bId].push(item);
        });

        const butcherIds = Object.keys(butcherGroups).map(Number);
        let successCount = 0;
        let lastError = '';
        let hasOfficial = false;
        let firstOrderId = null;

        for (const bId of butcherIds) {
            const groupItems = butcherGroups[bId];
            const result = await createOrder(token, {
                butcher_id: bId,
                delivery_address: `${formData.address}, ${formData.landmark}, ${formData.city} - ${formData.pincode}`,
                delivery_phone: formData.phone,
                user_lat: userLocation?.lat,
                user_lng: userLocation?.lng,
                payment_method: formData.paymentMethod,
                payment_id: pId || undefined,
                sunday_special: sundaySpecial, // backwards compat
                sunday_slot: sundaySpecial ? sundaySlot : undefined,
                items: groupItems.map(item => ({
                    meat_item_id: item.meat_item_id,
                    quantity: item.quantity,
                    price: Number(item.price),
                })),
            });

            if (result && result.success) {
                successCount++;
                if (result.order_id) firstOrderId = result.order_id;
                if (result.is_official) hasOfficial = true;
            } else {
                lastError = (result as any)?.error || 'Order placement failed.';
            }
        }

        if (successCount === butcherIds.length) {
            clearCart();
            let successUrl = `/order-success?official=${hasOfficial}`;
            if (butcherIds.length > 1) successUrl += `&split=${butcherIds.length}`;
            if (firstOrderId) successUrl += `&orderId=${firstOrderId}`;
            router.push(successUrl);
        } else {
            setError(successCount > 0 ? `Partial success (${successCount}/${butcherIds.length}). ${lastError}` : lastError);
            setIsProcessing(false);
        }
    };

    if (cart.length === 0 && !subscriptionPlan && !isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-32">
                <div className="text-center space-y-8 p-12">
                    <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                        <ShieldCheck className="w-16 h-16 text-slate-300" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Your cart is empty</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-8">Add some premium cuts to proceed</p>
                        <Link href="/butchers" className="inline-flex h-16 px-10 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs items-center gap-3 hover:bg-rose-700 transition-all shadow-xl">
                            Browse Master Butchers <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Progress Steps */}
                    <div className="mb-16 flex items-center justify-center gap-4">
                        {[
                            { num: 1, label: 'Delivery' },
                            { num: 2, label: 'Auth', skip: user || guestMode },
                            { num: 3, label: 'Payment' },
                            { num: 4, label: 'Confirm' }
                        ].filter(s => !s.skip).map((s, i, arr) => (
                            <React.Fragment key={s.num}>
                                <div className={`flex items-center gap-3 ${step >= s.num ? 'opacity-100' : 'opacity-30'}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm ${step >= s.num ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                        {step > s.num ? <Check className="w-5 h-5" /> : (i + 1)}
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest hidden md:block">{s.label}</span>
                                </div>
                                {i < arr.length - 1 && <div className={`hidden md:block w-20 h-[2px] ${step > s.num ? 'bg-rose-600' : 'bg-slate-200'}`} />}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Error Banner */}
                        {error && (
                            <div className="lg:col-span-3">
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-red-900/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                                            <AlertCircle className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-red-900 uppercase tracking-tight italic">{error}</p>
                                            <p className="text-xs text-red-700/60 font-medium mt-1">Stale data detected? Try resetting your bag to clear old product IDs.</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { clearCart(); setError(''); const timer = setTimeout(() => setError(''), 5000); router.push('/butchers'); }}
                                        className="h-14 px-8 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                                    >
                                        Reset Bag & Start Fresh
                                    </button>
                                </motion.div>
                            </div>
                        )}

                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-8">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Step 1: Delivery Details */}
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100"
                                        >
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                                                    <MapPin className="w-6 h-6 text-rose-600" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Delivery Details</h2>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Where should we deliver?</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none"
                                                        placeholder="Chef Master"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
                                                    <input
                                                        required
                                                        type="tel"
                                                        inputMode="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none"
                                                        placeholder="9347277124"
                                                    />
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Complete Address</label>
                                                    <textarea
                                                        required
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                        className="w-full h-24 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none resize-none"
                                                        placeholder="Flat/House No, Building Name, Street"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Landmark</label>
                                                    <input
                                                        type="text"
                                                        value={formData.landmark}
                                                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none"
                                                        placeholder="Near KPHB Metro"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Pincode</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        value={formData.pincode}
                                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none"
                                                        placeholder="500072"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleStep1Next}
                                                className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-8 hover:bg-rose-600 transition-all shadow-xl flex items-center justify-center gap-3"
                                            >
                                                Continue to Payment <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Auth Bridge */}
                                    {step === 2 && !user && !guestMode && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 text-center space-y-8"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                                                <User className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black uppercase tracking-tighter italic">One last thing</h2>
                                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Sign in to earn rewards or continue as a guest</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col items-center justify-between gap-6 hover:border-rose-100 transition-all">
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-black uppercase tracking-tight">Returning Customer</h4>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Unlock premium rewards & track orders</p>
                                                    </div>
                                                    <Link href="/login?redirect=checkout" className="w-full h-14 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg">
                                                        Sign In / Register
                                                    </Link>
                                                </div>

                                                <div className="p-6 rounded-[2rem] bg-rose-50 border border-rose-100 flex flex-col items-center justify-between gap-6 hover:border-rose-200 transition-all">
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-black uppercase tracking-tight text-rose-600">New Customer</h4>
                                                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Fast checkout, no account needed</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setGuestMode(true);
                                                            setStep(3);
                                                        }}
                                                        className="w-full h-14 bg-rose-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-700 transition-all shadow-lg"
                                                    >
                                                        Continue as Guest
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors"
                                            >
                                                Edit Address
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Step 3: Payment Method */}
                                    {step === 3 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100"
                                        >
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                                                    <CreditCard className="w-6 h-6 text-rose-600" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Payment Method</h2>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Choose your preferred option</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {[
                                                    { id: 'COD' as const, icon: Wallet, label: 'Cash on Delivery', desc: 'Pay when you receive' },
                                                    { id: 'UPI' as const, icon: Building, label: 'UPI / Net Banking', desc: 'Instant online payment' },
                                                    { id: 'CARD' as const, icon: CreditCard, label: 'Credit / Debit Card', desc: 'Secure card payment' }
                                                ].map((method) => (
                                                    <button
                                                        key={method.id}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                                                        className={`w-full p-6 rounded-2xl border-2 flex items-center gap-6 transition-all ${formData.paymentMethod === method.id ? 'border-rose-600 bg-rose-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                                    >
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.paymentMethod === method.id ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                            <method.icon className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <h4 className="text-sm font-black uppercase tracking-tight">{method.label}</h4>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{method.desc}</p>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === method.id ? 'border-rose-600 bg-rose-600' : 'border-slate-200'}`}>
                                                            {formData.paymentMethod === method.id && <Check className="w-4 h-4 text-white" />}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Sunday Special Toggle (Issue #13) */}
                                            <div className="mt-8 space-y-4">
                                                <div className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${sundaySpecial ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100'}`} onClick={() => setSundaySpecial(!sundaySpecial)}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${sundaySpecial ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                            <Clock className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black uppercase tracking-tight text-rose-900">Sunday Morning Special</h4>
                                                            <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mt-0.5">Priority Delivery (+₹49)</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-14 h-8 rounded-full p-1 transition-all ${sundaySpecial ? 'bg-rose-600' : 'bg-slate-200'}`}>
                                                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all ${sundaySpecial ? 'translate-x-6' : 'translate-x-0'}`} />
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {sundaySpecial && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden space-y-3"
                                                        >
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2">Select Your Sunday Slot</p>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                {[
                                                                    { id: 'EARLY_MORNING', label: '6am - 8am' },
                                                                    { id: 'MORNING', label: '8am - 10am' },
                                                                    { id: 'LATE_MORNING', label: '10am - 12pm' }
                                                                ].map((slot) => (
                                                                    <button
                                                                        key={slot.id}
                                                                        type="button"
                                                                        onClick={() => setSundaySlot(slot.id as any)}
                                                                        className={`h-14 rounded-xl border-2 font-black uppercase tracking-widest text-[9px] transition-all ${sundaySlot === slot.id ? 'border-rose-600 bg-rose-600 text-white shadow-lg' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                                                    >
                                                                        {slot.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <div className="flex gap-4 mt-8">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="flex-1 h-16 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(4)}
                                                    className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all shadow-xl flex items-center justify-center gap-3"
                                                >
                                                    Review Order <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 4: Confirm */}
                                    {step === 4 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100"
                                        >
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                                                    <ShieldCheck className="w-6 h-6 text-rose-600" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Confirm Your Order</h2>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Review before placing</p>
                                                </div>
                                            </div>

                                            <div className="space-y-6 mb-8">
                                                <div className="p-6 bg-slate-50 rounded-2xl space-y-3">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Delivery Address</p>
                                                    <p className="text-sm font-bold">{formData.name}</p>
                                                    <p className="text-sm font-bold text-slate-600">{formData.phone}</p>
                                                    <p className="text-sm font-bold text-slate-600">{formData.address}, {formData.landmark}</p>
                                                    <p className="text-sm font-bold text-slate-600">{formData.city} - {formData.pincode}</p>
                                                </div>

                                                <div className="p-6 bg-slate-50 rounded-2xl space-y-3">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Method</p>
                                                    <p className="text-sm font-black uppercase">{formData.paymentMethod === 'COD' ? 'Cash on Delivery' : formData.paymentMethod === 'UPI' ? 'UPI Payment' : 'Card Payment'}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(3)}
                                                    className="flex-1 h-16 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isProcessing}
                                                    className="flex-1 h-16 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-700 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                                                >
                                                    {isProcessing ? (
                                                        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                                                    ) : (
                                                        <>Place Order <Check className="w-5 h-5" /></>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 sticky top-32">
                                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-6">Order Summary</h3>

                                <div className="space-y-4 mb-8 max-h-64 overflow-y-auto">
                                    {subscriptionPlan && currentPlan ? (
                                        <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 flex gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-rose-600 flex items-center justify-center text-white flex-shrink-0">
                                                <ShieldCheck className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-tight text-rose-600">{currentPlan.name}</h4>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{currentPlan.desc}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        cart.map((item) => (
                                            <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-50">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                    <img
                                                        src={item.image_url && item.image_url.length > 10 ? item.image_url : getPlaceholderImage(item.category)}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = getPlaceholderImage(item.category);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-black uppercase tracking-tight truncate">{item.name}</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Qty: {item.quantity}</p>
                                                    <p className="text-sm font-black text-rose-600 italic mt-1">₹{Number(item.price) * item.quantity}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="space-y-4 pt-6 border-t-2 border-slate-100">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Subtotal</span>
                                        <span className="font-black">₹{subscriptionPlan && currentPlan ? currentPlan.price : totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Delivery</span>
                                        <span className="font-black text-emerald-500">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-xl pt-4 border-t border-slate-100">
                                        <span className="font-black uppercase tracking-tight">Total</span>
                                        <span className="font-black text-rose-600 italic">₹{subscriptionPlan && currentPlan ? currentPlan.price : totalAmount}</span>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Clock className="w-4 h-4 text-rose-600" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Delivery Time</span>
                                    </div>
                                    <p className="text-sm font-black text-slate-900">45-60 Minutes</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main >
    );
}
