"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

export default function ProteinSelection() {
    const router = useRouter();

    const categories = [
        {
            id: 1,
            name: 'CHICKEN',
            label: 'Chicken',
            tagline: 'Fresh & Tender',
            gradient: 'from-amber-400 via-orange-400 to-orange-500',
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80', // Raw chicken pieces on board
            shops: '19 Shops',
            popular: true
        },
        {
            id: 2,
            name: 'MUTTON',
            label: 'Mutton',
            tagline: 'Premium Cuts',
            gradient: 'from-rose-500 via-red-500 to-red-600',
            image: 'https://images.unsplash.com/photo-1549487950-8488339c636f?auto=format&fit=crop&w=800&q=80', // Raw red meat chunks
            shops: '19 Shops',
            popular: true
        },
        {
            id: 3,
            name: 'FISH',
            label: 'Fish',
            tagline: 'Fresh Catch',
            gradient: 'from-cyan-400 via-blue-400 to-blue-500',
            image: 'https://images.unsplash.com/photo-1521503332462-8511790bf7e5?auto=format&fit=crop&w=800&q=80', // Fresh whole fish on display
            shops: '19 Shops',
            popular: false
        },
        {
            id: 4,
            name: 'PRAWNS',
            label: 'Prawns',
            tagline: 'Ocean Fresh',
            gradient: 'from-pink-400 via-rose-400 to-rose-500',
            image: 'https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?auto=format&fit=crop&w=800&q=80', // Fresh prawns/shrimp
            shops: '19 Shops',
            popular: false
        },
        {
            id: 5,
            name: 'EGGS',
            label: 'Farm Eggs',
            tagline: 'Free Range',
            gradient: 'from-yellow-300 via-amber-300 to-amber-400',
            image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80', // Brown farm eggs
            shops: '19 Shops',
            popular: false
        }
    ];

    const handleCategoryClick = (name: string) => {
        router.push(`/butchers?q=${encodeURIComponent(name)}`);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
                <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    onClick={() => handleCategoryClick(category.name)}
                    className="group relative h-[450px] rounded-[3.5rem] overflow-hidden bg-slate-100 shadow-2xl hover:shadow-3xl transition-all duration-500 active:scale-[0.98] border-8 border-white"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                        />
                        {/* More sophisticated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-end p-10">

                        {/* Top corner popular tag */}
                        {category.popular && (
                            <div className="absolute top-8 left-8">
                                <span className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                                    Trending
                                </span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.gradient} shadow-lg shadow-orange-500/50`} />
                                    <p className="text-white/70 text-xs font-black uppercase tracking-[0.2em]">{category.tagline}</p>
                                </div>
                                <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none mb-2">
                                    {category.label}
                                </h3>
                                <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">{category.shops}</p>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <motion.div
                                    whileHover={{ width: '100%' }}
                                    className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 transition-all group-hover:bg-white group-hover:px-8 shadow-2xl"
                                >
                                    <span className="text-white group-hover:text-slate-900 text-xs font-black uppercase tracking-widest transition-colors">
                                        View Shops
                                    </span>
                                    <ArrowRight className="w-5 h-5 text-white group-hover:text-rose-600 group-hover:translate-x-2 transition-all" />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    </div>
                </motion.button>
            ))}
        </div>
    );
}
