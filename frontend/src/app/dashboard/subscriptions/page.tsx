"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Clock,
    Pause,
    Play,
    Settings,
    Package,
    AlertCircle,
    Plus,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { getSubscriptions, getGymSubscriptions, getPetSubscriptions, toggleSubscriptionStatus } from '@/lib/api';
import { Subscription, GymSubscription, PetSubscription } from '@/types';
import { useRouter } from 'next/navigation';
import PetProfileForm from '@/components/PetProfileForm';
import { Heart, Dog, Utensils, Award, Sparkles, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

type TabType = 'UPCOMING' | 'HISTORY' | 'PETS' | 'RECIPES' | 'SETTINGS';

export default function SubscriptionDashboard() {
    const { user, token } = useAppContext();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<TabType>('UPCOMING');
    const [loading, setLoading] = useState(true);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [gymSubscriptions, setGymSubscriptions] = useState<GymSubscription[]>([]);
    const [petSubscriptions, setPetSubscriptions] = useState<PetSubscription[]>([]);

    const fetchData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [general, gym, pet] = await Promise.all([
                getSubscriptions(token),
                getGymSubscriptions(token),
                getPetSubscriptions(token)
            ]);
            setSubscriptions(general);
            setGymSubscriptions(gym);
            setPetSubscriptions(pet);
        } catch (error) {
            console.error("Failed to fetch subscriptions:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token && !loading) {
            // Give context a chance to load
            const timer = setTimeout(() => {
                if (!token) router.push('/login');
            }, 1000);
            return () => clearTimeout(timer);
        }
        if (token) {
            fetchData();
        }
    }, [token, fetchData, router]);

    const handleToggle = async (type: 'general' | 'gym' | 'pet', id: number, currentStatus: boolean) => {
        if (!token) return;

        const success = await toggleSubscriptionStatus(token, type, id, !currentStatus);
        if (success) {
            fetchData(); // Refresh data
        }
    };

    if (!token && loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto space-y-12">

                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="h-[2px] w-12 bg-rose-600" />
                                <span className="text-rose-500 text-xs font-black uppercase tracking-[0.4em]">Personal Logistics Hub</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                                My <br />
                                <span className="text-rose-600 not-italic">Subscriptions.</span>
                            </h1>
                        </div>
                        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto gap-2">
                            {(['UPCOMING', 'HISTORY', 'PETS', 'RECIPES'] as TabType[]).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        {/* Main Content Area */}
                        <div className="lg:col-span-3 space-y-12">
                            {loading ? (
                                <div className="py-24 flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Your Protein Cycles...</p>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {activeTab === 'UPCOMING' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                            {[...subscriptions, ...gymSubscriptions, ...petSubscriptions].length > 0 ? (
                                                <>
                                                    {[...subscriptions].map((sub) => (
                                                        <SubscriptionCard
                                                            key={`gen-${sub.id}`}
                                                            type="general"
                                                            subscription={sub}
                                                            onToggle={() => handleToggle('general', sub.id, sub.active)}
                                                        />
                                                    ))}
                                                    {[...gymSubscriptions].map((sub) => (
                                                        <SubscriptionCard
                                                            key={`gym-${sub.id}`}
                                                            type="gym"
                                                            subscription={sub}
                                                            onToggle={() => handleToggle('gym', sub.id, sub.active)}
                                                        />
                                                    ))}
                                                    {[...petSubscriptions].map((sub) => (
                                                        <SubscriptionCard
                                                            key={`pet-${sub.id}`}
                                                            type="pet"
                                                            subscription={sub}
                                                            onToggle={() => handleToggle('pet', sub.id, sub.active)}
                                                        />
                                                    ))}
                                                </>
                                            ) : (
                                                <EmptyState message="No active subscriptions found." />
                                            )}
                                        </motion.div>
                                    )}

                                    {activeTab === 'PETS' && (
                                        <PetProfilesSection />
                                    )}

                                    {activeTab === 'RECIPES' && (
                                        <RecipeLibrarySection />
                                    )}

                                    {activeTab === 'HISTORY' && (
                                        <EmptyState message="Your delivery history is arriving soon." />
                                    )}
                                </AnimatePresence>
                            )}

                            {/* Add New Hook */}
                            <Link href="/butchers" className="group bg-slate-50 rounded-[3.5rem] p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 hover:border-rose-300 hover:bg-rose-50/30 transition-all duration-500">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-rose-600 group-hover:shadow-xl transition-all">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-rose-600 transition-colors text-center">Initiate New Protein Cycle</span>
                            </Link>

                            {/* Logistics Warning Notice */}
                            <div className="bg-rose-600 rounded-[3rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-full bg-slate-950/10 skew-x-12 translate-x-1/2" />
                                <div className="flex items-center gap-8 relative z-10">
                                    <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-10 h-10 text-rose-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-3xl font-black uppercase tracking-tighter italic">Sunday Morning Logistics</h4>
                                        <p className="text-rose-100 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-xl">System Lock-in: Subscriptions for Sunday 6AM window lock 12 hours prior for master butcher preparation.</p>
                                    </div>
                                </div>
                                <button className="h-16 px-10 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-slate-950 transition-all shadow-2xl relative z-10 whitespace-nowrap">
                                    Verify Schedule
                                </button>
                            </div>
                        </div>

                        {/* Sidebar: Loyalty & Notifications */}
                        <div className="space-y-8">
                            <LoyaltyStatus />
                            <NotificationsSummary />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function SubscriptionCard({
    subscription,
    type,
    onToggle
}: {
    subscription: any;
    type: 'general' | 'gym' | 'pet';
    onToggle: () => void
}) {
    const isGeneral = type === 'general';
    const isGym = type === 'gym';
    const isPet = type === 'pet';

    const getName = () => {
        if (isPet) return subscription.product_name;
        return subscription.meat_item_name;
    };

    const getDetails = () => {
        if (isPet) return `${subscription.quantity_kg}kg • ${subscription.pet_type} Plan`;
        if (isGym) return `${subscription.daily_quantity} • Fitness Protocol`;
        return `${subscription.quantity_kg}kg • ${subscription.butcher_name}`;
    };

    const getCycleType = () => {
        if (isPet) return subscription.schedule_type;
        if (isGym) return "DAILY 6AM";
        return subscription.period;
    };

    const getNextDate = () => {
        const dateStr = isGeneral ? subscription.next_run_date : subscription.next_delivery_date;
        if (!dateStr) return "Pending Schedule";
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const getCost = () => {
        if (isGeneral) return `₹${subscription.subscription_price}`;
        if (isGym) return "Included in Plan";
        return "Pay on Delivery";
    };

    const getImage = () => {
        if (isPet) return 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80';
        if (isGym) return 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80';
        return 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-10 items-center hover:shadow-2xl transition-all duration-700 relative overflow-hidden group"
        >
            {/* Type Badge */}
            <div className={`absolute top-0 left-12 px-4 py-2 rounded-b-2xl text-[8px] font-black uppercase tracking-widest text-white ${isPet ? 'bg-orange-500' : isGym ? 'bg-rose-600' : 'bg-slate-900'}`}>
                {type}
            </div>

            {/* Status Indicator */}
            <div className={`absolute top-0 right-12 px-6 py-3 rounded-b-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl ${subscription.active ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}>
                {subscription.active ? 'ACTIVE' : 'PAUSED'}
            </div>

            <div className="w-full md:w-56 aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 flex-shrink-0 relative">
                <img
                    src={getImage()}
                    alt={getName()}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="flex-1 space-y-6">
                <div className="space-y-2">
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">{getName()}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase italic">{getDetails()}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-rose-600">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Next Run</span>
                        </div>
                        <p className="text-sm font-black text-slate-900 uppercase">
                            {getNextDate()}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-rose-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Cycle Type</span>
                        </div>
                        <p className="text-sm font-black text-slate-900 uppercase">{getCycleType()}</p>
                    </div>
                    <div className="space-y-1 hidden md:block text-right">
                        <div className="flex items-center justify-end gap-2 text-rose-600">
                            <Package className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Cycle Cost</span>
                        </div>
                        <p className="text-xl font-black text-slate-900 italic tracking-tighter">{getCost()}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-row md:flex-col gap-4 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-slate-50">
                <button
                    onClick={onToggle}
                    className={`flex-1 md:w-48 h-16 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${subscription.active ? 'bg-slate-100 text-slate-900 hover:bg-rose-100 hover:text-rose-600' : 'bg-slate-900 text-white hover:bg-rose-600'}`}
                >
                    {subscription.active ? <><Pause className="w-4 h-4" /> Pause Cycle</> : <><Play className="w-4 h-4" /> Resume Cycle</>}
                </button>
                <button className="h-16 w-16 md:w-48 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-white hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm">
                    <Settings className="w-5 h-5" />
                    <span className="hidden md:block ml-2 text-[10px] font-black uppercase tracking-widest">Modify</span>
                </button>
            </div>
        </motion.div>
    );
}

const EmptyState = ({ message }: { message: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3.5rem] p-16 text-center border-2 border-dashed border-slate-100"
    >
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">{message}</p>
    </motion.div>
);

const PetProfilesSection = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [profiles, setProfiles] = useState<any[]>([]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Manage <span className="text-rose-600">Pack.</span></h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="h-12 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg flex items-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" /> Add Protocol
                </button>
            </div>

            {isAdding ? (
                <PetProfileForm
                    onSave={(data) => {
                        setProfiles([...profiles, data]);
                        setIsAdding(false);
                        toast.success("Profile Protocolized.");
                    }}
                    onCancel={() => setIsAdding(false)}
                />
            ) : profiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profiles.map((p, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex items-center gap-6">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400">
                                {p.type === 'DOG' ? <Dog className="w-10 h-10" /> : <Heart className="w-10 h-10 text-rose-200" />}
                            </div>
                            <div>
                                <h4 className="text-lg font-black uppercase tracking-tight">{p.name}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">{p.breed}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic">{p.weight}KG • {p.activity_level} Activity</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState message="No Pet Profiles found. Secure their nutrition today." />
            )}
        </div>
    );
};

const LoyaltyStatus = () => (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/20 blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                    <h4 className="text-sm font-black uppercase tracking-widest italic">Meat Points</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Village Tier Member</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <p className="text-3xl font-black italic tracking-tighter">1,250</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Next: 2,000</p>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '62.5%' }}
                        className="h-full bg-rose-600"
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <Sparkles className="w-3 h-3" />
                    <span>First Delivery Free Active</span>
                </div>
            </div>
        </div>
    </div>
);

const NotificationsSummary = () => (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Latest Alerts</h4>
        <div className="space-y-4">
            {[
                { type: 'DELIVERY', msg: 'Sunday 6AM Delivery Protocol Confirmed', time: '2h ago' },
                { type: 'LOYALTY', msg: 'You earned 50 points from last cycle', time: '1d ago' }
            ].map((n, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="w-1 h-8 bg-slate-100 group-hover:bg-rose-600 rounded-full transition-colors" />
                    <div>
                        <p className="text-[11px] font-bold text-slate-900 leading-tight">{n.msg}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{n.time}</p>
                    </div>
                </div>
            ))}
        </div>
        <button className="w-full h-12 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all">
            Manage Alerts
        </button>
    </div>
);


const RecipeLibrarySection = () => {
    const RECIPES = [
        { title: 'Village-Style Mutton Curry', time: '45m', level: 'Intermediate', tags: ['High Protein', 'Authentic'] },
        { title: 'Keto Grilled Chicken Wings', time: '20m', level: 'Beginner', tags: ['Gym Focused', 'Low Carb'] },
        { title: 'Pet-Safe Organ Meat Stew', time: '30m', level: 'Beginner', tags: ['Natural Nutrition', 'Dogs/Cats'] }
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
                <Utensils className="w-6 h-6 text-rose-600" />
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Recipe <span className="text-slate-900">Vault.</span></h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {RECIPES.map((r, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -10 }}
                        className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group"
                    >
                        <div className="aspect-video bg-slate-50 rounded-3xl mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Utensils className="w-12 h-12 text-slate-200" />
                            </div>
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-900 border border-slate-100">
                                {r.level}
                            </div>
                        </div>
                        <h4 className="font-black text-slate-900 text-sm uppercase leading-tight mb-2 group-hover:text-rose-600 transition-colors">{r.title}</h4>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase italic">{r.time}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {r.tags.map(t => (
                                <span key={t} className="text-[8px] font-black uppercase tracking-widest text-rose-600/60 bg-rose-50 px-2 py-0.5 rounded-md">{t}</span>
                            ))}
                        </div>
                        <button className="w-full h-12 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2">
                            View Protocol <Sparkles className="w-3 h-3" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

