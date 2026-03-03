"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Store, MapPin, Phone, ArrowRight, CheckCircle2, Loader2, LogIn, Sparkles } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

interface AuthFormProps {
    onSuccess?: () => void;
    initialMode?: 'LOGIN' | 'REGISTER';
}

export default function AuthForm({ onSuccess, initialMode = 'LOGIN' }: AuthFormProps) {
    const { login } = useAppContext();
    const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        role: 'BUTCHER' as 'USER' | 'BUTCHER', // Default to Butcher for the Butcher Portal
        shop_name: '',
        address: '',
        phone: ''
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const url = `${API_URL}/api/auth/${authMode === 'LOGIN' ? 'login' : 'register'}/`;

        // Prepare simple payload
        const payload = authMode === 'LOGIN'
            ? { username: formData.username, password: formData.password }
            : {
                ...formData,
                confirm_password: formData.password,
                is_butcher: formData.role === 'BUTCHER'
            };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                if (authMode === 'LOGIN') {
                    login(data.access, {
                        username: data.username,
                        email: data.email,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        id: data.user_id,
                        is_butcher: data.is_butcher
                    });
                    toast.success(`Welcome back, ${data.username}!`);
                    onSuccess?.();
                } else {
                    toast.success('Account created! Sign in to continue.');
                    setAuthMode('LOGIN');
                }
            } else {
                if (data.details && typeof data.details === 'object') {
                    const firstError = Object.values(data.details)[0];
                    setError(Array.isArray(firstError) ? firstError[0] : (typeof firstError === 'string' ? firstError : 'Validation failed'));
                } else {
                    setError(data.message || data.detail || 'Authentication failed');
                }
            }
        } catch (err) {
            setError('Connection failed. Is the server running?');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full h-14 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none transition-all placeholder:text-slate-300";

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full mb-4"
                >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Butcher Hub Access</span>
                </motion.div>
                <h2 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900 mb-2">
                    {authMode === 'LOGIN' ? 'Butcher Sign In' : 'Join the Guild'}
                </h2>
                <p className="text-slate-500 font-medium italic text-sm">
                    {authMode === 'LOGIN' ? 'Manage your shop and orders.' : 'Ready to partner with MeatHub?'}
                </p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-6 text-center"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'REGISTER' && (
                    <>
                        {/* Role Switcher */}
                        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-[1.5rem] mb-6">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'USER' })}
                                className={`py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${formData.role === 'USER' ? 'bg-white text-slate-900 shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'BUTCHER' })}
                                className={`py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${formData.role === 'BUTCHER' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Butcher
                            </button>
                        </div>

                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-rose-600 transition-colors" />
                            <input
                                required
                                type="text"
                                className={inputClasses}
                                placeholder="Full Name"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            />
                        </div>
                    </>
                )}

                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-rose-600 transition-colors" />
                    <input
                        required
                        type="text"
                        className={inputClasses}
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                </div>

                {authMode === 'REGISTER' && (
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-rose-600 transition-colors" />
                        <input
                            required
                            type="email"
                            className={inputClasses}
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                )}

                {/* Butcher Specific Fields */}
                <AnimatePresence mode="wait">
                    {authMode === 'REGISTER' && formData.role === 'BUTCHER' && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="relative group">
                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300 group-focus-within:text-rose-600 transition-colors" />
                                <input
                                    required
                                    type="text"
                                    className={`${inputClasses} bg-rose-50/30 border-rose-100`}
                                    placeholder="Shop Name"
                                    value={formData.shop_name}
                                    onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                                />
                            </div>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300 group-focus-within:text-rose-600 transition-colors" />
                                <input
                                    required
                                    type="text"
                                    className={`${inputClasses} bg-rose-50/30 border-rose-100`}
                                    placeholder="Business Address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300 group-focus-within:text-rose-600 transition-colors" />
                                <input
                                    required
                                    type="text"
                                    className={`${inputClasses} bg-rose-50/30 border-rose-100`}
                                    placeholder="Contact Phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-rose-600 transition-colors" />
                    <input
                        required
                        type="password"
                        className={inputClasses}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-rose-600 transition-all shadow-xl shadow-slate-950/20 flex items-center justify-center gap-3 relative overflow-hidden group active:scale-[0.98]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <span>{authMode === 'LOGIN' ? 'Sign In' : 'Create Account'}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <button
                type="button"
                onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                className="w-full mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-rose-600 transition-colors"
            >
                {authMode === 'LOGIN' ? "Don't have an account? Join the Guild" : "Already a member? Sign In"}
            </button>
        </div>
    );
}
