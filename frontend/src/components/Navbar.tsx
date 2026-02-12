"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Search, X, LogIn, UserPlus, LogOut, Trash2, ArrowRight } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const {
        user, cart, cartCount, totalAmount, searchQuery,
        setSearchQuery, removeFromCart, login, logout
    } = useAppContext();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const API_URL = typeof window === 'undefined'
        ? 'http://backend:8000'
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const endpoint = authMode === 'LOGIN' ? '/api/auth/login/' : '/api/auth/register/';

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                if (authMode === 'LOGIN') {
                    login(data.access, { username: formData.username });
                    setIsLoginOpen(false);
                } else {
                    setAuthMode('LOGIN');
                    setError('Account created! Please sign in.');
                }
            } else {
                setError(data.detail || 'Authentication failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Connection failed. Is the backend running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">
                            MEAT<span className="text-rose-600 not-italic">HUB</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {[
                            { name: 'Marketplace', href: '/butchers' },
                            { name: 'Our Store', href: '/store' },
                            { name: 'Subscriptions', href: '/subscriptions' },
                            { name: 'Gym Proteins', href: '/gym' },
                            { name: 'Pet Meat', href: '/pet' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-rose-600 transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Global Search */}
                        <div className={`flex items-center transition-all duration-500 ${isSearchOpen ? 'w-64 bg-slate-100 rounded-full px-4' : 'w-10'}`}>
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="w-10 h-10 flex items-center justify-center text-slate-900 hover:bg-slate-100/50 rounded-full transition-all"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            {isSearchOpen && (
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search fresh cuts..."
                                    className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-tight w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            window.location.href = `/butchers?q=${encodeURIComponent(searchQuery)}`;
                                        }
                                    }}
                                />
                            )}
                        </div>

                        {/* Cart Button */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-all relative"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <div className="h-6 w-px bg-slate-200 mx-2" />

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard/subscriptions"
                                    className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl group hover:border-rose-600 transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-rose-600 group-hover:animate-ping" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900">Logistics Hub</span>
                                </Link>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hi, {user.username}</span>
                                <button onClick={logout} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg active:scale-95"
                            >
                                <User className="w-4 h-4" />
                                <span>Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Login Modal */}
            <AnimatePresence>
                {isLoginOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                    >
                        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsLoginOpen(false)} />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <form className="p-10" onSubmit={handleAuth}>
                                <div className="flex justify-between items-center mb-10">
                                    <span className="text-xl font-black tracking-tighter uppercase italic">
                                        MEAT<span className="text-rose-600 not-italic">HUB</span>
                                    </span>
                                    <button type="button" onClick={() => setIsLoginOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-rose-100 transition-all">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-2">
                                    {authMode === 'LOGIN' ? 'Welcome Back' : 'Join the Club'}
                                </h2>
                                <p className="text-slate-500 font-medium italic text-sm mb-8">
                                    {authMode === 'LOGIN' ? 'Enter your credentials to access premium cuts.' : 'Create an account for artisanal meat delivery.'}
                                </p>

                                {error && (
                                    <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-6">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {authMode === 'REGISTER' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">First Name</label>
                                                <input required type="text" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none" placeholder="Chef" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Last Name</label>
                                                <input required type="text" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none" placeholder="Meat" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Username</label>
                                        <input required type="text" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none" placeholder="the_pitmaster" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                                    </div>
                                    {authMode === 'REGISTER' && (
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                                            <input required type="email" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none" placeholder="chef@meathub.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</label>
                                        <input required type="password" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600 outline-none" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                    </div>
                                </div>

                                <button
                                    disabled={isLoading}
                                    className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-10 hover:bg-rose-600 transition-all shadow-xl flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Processing...' : (authMode === 'LOGIN' ? 'Sign In to Hub' : 'Create Account')}
                                </button>

                                <div className="mt-8 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-600 transition-colors"
                                    >
                                        {authMode === 'LOGIN' ? "Don't have an account? Sign Up" : "Already a member? Sign In"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cart Sidebar */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col"
                        >
                            <div className="p-8 flex items-center justify-between border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="w-6 h-6 text-rose-600" />
                                    <h3 className="text-xl font-black tracking-tighter uppercase italic">My Bag ({cartCount})</h3>
                                </div>
                                <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                            <ShoppingBag className="w-10 h-10" />
                                        </div>
                                        <p className="text-slate-400 font-bold italic uppercase tracking-widest text-sm">Your bag is empty.<br />Fill it with artisanal goodness.</p>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex gap-4 group">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="font-black text-sm uppercase tracking-tight text-slate-900">{item.name}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.category}</p>
                                                <div className="flex items-center justify-between pt-1">
                                                    <p className="text-rose-600 font-black italic">₹{item.price} x {item.quantity}</p>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-600 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-8 border-t border-slate-100 bg-slate-50 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Order Summary</span>
                                        <span className="text-2xl font-black italic tracking-tighter text-slate-900">₹{totalAmount}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (user) {
                                                window.location.href = '/checkout';
                                            } else {
                                                setIsCartOpen(false);
                                                setIsLoginOpen(true);
                                                setError('Please sign in to proceed with your order.');
                                            }
                                        }}
                                        className="w-full h-16 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-2xl"
                                    >
                                        PROCEED TO CHECKOUT <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
