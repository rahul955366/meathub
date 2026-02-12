"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { createOrder } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, CreditCard, Wallet, Building, Check, ArrowRight, ShieldCheck, Clock, Truck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cart, totalAmount, clearCart, user, token } = useAppContext();
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirm
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: user?.username || '',
        phone: '',
        address: '',
        landmark: '',
        city: 'Hyderabad',
        pincode: '',
        paymentMethod: 'COD'
    });

    const [isProcessing, setIsProcessing] = useState(false);

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
        if (validateStep1()) setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');

        if (!token) {
            setError('Please login to place an order.');
            setIsProcessing(false);
            return;
        }

        // Group cart items by butcher (use first item's butcher as default)
        const butcherId = cart[0]?.id ? 1 : 1; // Default butcher

        const result = await createOrder(token, {
            butcher_id: butcherId,
            delivery_address: `${formData.address}, ${formData.landmark}, ${formData.city} - ${formData.pincode}`,
            delivery_phone: formData.phone,
            payment_method: formData.paymentMethod,
            items: cart.map(item => ({
                meat_item_id: item.id,
                quantity: item.quantity,
                price: Number(item.price),
            })),
        });

        if (result.success) {
            clearCart();
            router.push('/order-success');
        } else {
            setError(result.error || 'Order placement failed. Please try again.');
            setIsProcessing(false);
        }
    };

    if (cart.length === 0 && !isProcessing) {
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
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Progress Steps */}
                    <div className="mb-16 flex items-center justify-center gap-4">
                        {[
                            { num: 1, label: 'Delivery' },
                            { num: 2, label: 'Payment' },
                            { num: 3, label: 'Confirm' }
                        ].map((s, i) => (
                            <React.Fragment key={s.num}>
                                <div className={`flex items-center gap-3 ${step >= s.num ? 'opacity-100' : 'opacity-30'}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm ${step >= s.num ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                        {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest hidden md:block">{s.label}</span>
                                </div>
                                {i < 2 && <div className={`hidden md:block w-20 h-[2px] ${step > s.num ? 'bg-rose-600' : 'bg-slate-200'}`} />}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Error Banner */}
                        {error && (
                            <div className="lg:col-span-3">
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-sm font-bold text-red-700">{error}</p>
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
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none"
                                                        placeholder="+91 98765 43210"
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

                                    {/* Step 2: Payment Method */}
                                    {step === 2 && (
                                        <motion.div
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
                                                    { id: 'COD', icon: Wallet, label: 'Cash on Delivery', desc: 'Pay when you receive' },
                                                    { id: 'UPI', icon: Building, label: 'UPI / Net Banking', desc: 'Instant online payment' },
                                                    { id: 'CARD', icon: CreditCard, label: 'Credit / Debit Card', desc: 'Secure card payment' }
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
                                                    onClick={() => setStep(3)}
                                                    className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all shadow-xl flex items-center justify-center gap-3"
                                                >
                                                    Review Order <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 3: Confirm */}
                                    {step === 3 && (
                                        <motion.div
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
                                                    onClick={() => setStep(2)}
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
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-50">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-black uppercase tracking-tight truncate">{item.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Qty: {item.quantity}</p>
                                                <p className="text-sm font-black text-rose-600 italic mt-1">₹{Number(item.price) * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-6 border-t-2 border-slate-100">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Subtotal</span>
                                        <span className="font-black">₹{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Delivery</span>
                                        <span className="font-black text-emerald-500">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-xl pt-4 border-t border-slate-100">
                                        <span className="font-black uppercase tracking-tight">Total</span>
                                        <span className="font-black text-rose-600 italic">₹{totalAmount}</span>
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
        </main>
    );
}
