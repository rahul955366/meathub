"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Search, X, LogIn, UserPlus, LogOut, Trash2, ArrowRight, Menu, Minus, Plus, Clock } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AuthForm from './AuthForm';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const {
        user, cart, cartCount, totalAmount, searchQuery,
        setSearchQuery, removeFromCart, addToCart, login, logout,
        isCartOpen, setIsCartOpen
    } = useAppContext();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

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
                        {(user?.is_butcher
                            ? [
                                { name: 'Monitor Orders', href: '/butcher/orders' },
                                { name: 'Inventory Control', href: '/butcher/inventory' },
                                { name: 'Morning Menu', href: '/butcher/menu' },
                                { name: 'Sunday Preview', href: '/butcher/sunday-preview' },
                            ]
                            : [
                                { name: 'Browse Meat', href: '/shop' },
                                { name: 'Official Store', href: '/store' },
                                { name: 'Gym Fuel', href: '/gym' },
                                { name: 'Pet Care', href: '/pet' },
                                { name: 'Subscriptions', href: '/subscriptions' },
                                { name: 'About', href: '/about' },
                            ]
                        ).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-rose-600 transition-all hover:scale-105"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="w-10 h-10 flex md:hidden items-center justify-center text-slate-900"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        {/* Global Search (Desktop Only) */}
                        <div className={`hidden md:flex items-center transition-all duration-500 ${isSearchOpen ? 'w-64 bg-slate-100 rounded-full px-4' : 'w-10'}`}>
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

                        <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block" />

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href={user.is_staff || user.is_butcher ? "/butcher/dashboard" : "/dashboard"}
                                    className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl group hover:border-rose-600 transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-rose-600 group-hover:animate-ping" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900">
                                        {user.is_staff || user.is_butcher ? "Butcher Hub" : "Logistics Hub"}
                                    </span>
                                </Link>
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
                                <span className="hidden sm:inline">Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[40] bg-slate-950/40 backdrop-blur-sm md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-[45] shadow-2xl md:hidden flex flex-col pt-24 p-8"
                        >
                            <div className="space-y-8">
                                {(user?.is_butcher
                                    ? [
                                        { name: 'Today\'s Orders', href: '/butcher/orders' },
                                        { name: 'Manage Stock', href: '/butcher/inventory' },
                                        { name: 'Back to Store', href: '/' },
                                    ]
                                    : [
                                        { name: 'Browse Meat', href: '/shop' },
                                        { name: 'Official Store', href: '/store' },
                                        { name: 'Gym Fuel', href: '/gym' },
                                        { name: 'Pet Care', href: '/pet' },
                                        { name: 'Subscriptions', href: '/subscriptions' },
                                        { name: 'Track My Orders', href: '/orders' },
                                    ]
                                ).map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-2xl font-black uppercase tracking-tighter italic hover:text-rose-600"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-auto border-t border-slate-100 pt-8">
                                {user ? (
                                    <button
                                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                        className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-widest text-[10px]"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out from Hub
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
                                        className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                                    >
                                        <LogIn className="w-4 h-4" /> Sign In / Register
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

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
                            <div className="p-10">
                                <AuthForm onSuccess={() => setIsLoginOpen(false)} />
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => setIsLoginOpen(false)}
                                        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-rose-100 transition-all mx-auto"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

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
                                        <div key={`${item.id}-${item.selectedCut}`} className="flex gap-4 group bg-slate-50 p-4 rounded-3xl border border-transparent hover:border-rose-100 transition-all">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white flex-shrink-0 shadow-sm">
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-black text-sm uppercase tracking-tight text-slate-900">{item.name}</h4>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">{item.selectedCut}</p>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.meat_item_id, item.selectedCut)} className="text-slate-300 hover:text-rose-600 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between pt-2">
                                                    <p className="text-slate-900 font-black italic text-sm">₹{item.price}</p>
                                                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100">
                                                        <button
                                                            onClick={() => {
                                                                if (item.quantity > 1) {
                                                                    // Decrease quantity logic (could be added to context, but for now we remove one and add back is complex, better to add updateQuantity to context)
                                                                    toast.error("Use trash to remove item completely");
                                                                }
                                                            }}
                                                            className="text-slate-400 hover:text-rose-600"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-xs font-black italic">{item.quantity}</span>
                                                        <button
                                                            onClick={() => addToCart({ id: item.meat_item_id, name: item.name, price: item.price, image_url: item.image_url } as any, item.selectedCut)}
                                                            className="text-slate-400 hover:text-rose-600"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
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
                                    <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-3 border border-emerald-100">
                                        <Clock className="w-5 h-5 text-emerald-600" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Estimated Delivery</p>
                                            <p className="text-xs font-bold text-emerald-800">45-60 Minutes from MeatHub Hub</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            window.location.href = '/checkout';
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
