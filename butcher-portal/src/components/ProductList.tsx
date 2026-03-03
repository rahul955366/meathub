"use client";

import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

import { MeatItem } from '@/types';

interface ProductListProps {
    initialItems: MeatItem[];
}

export default function ProductList({ initialItems }: ProductListProps) {
    const { searchQuery } = useAppContext();

    const filteredItems = initialItems.filter((item: MeatItem) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = ['CHICKEN', 'MUTTON', 'FISH', 'PRAWNS', 'PET', 'GYM'];

    return (
        <div className="space-y-24">
            {categories.map((category) => {
                const categoryItems = filteredItems.filter((item: MeatItem) => item.category.toUpperCase() === category);
                if (categoryItems.length === 0) return null;

                return (
                    <motion.div
                        key={category}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-10"
                    >
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{category}</h3>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {categoryItems.map((item: MeatItem) => (
                                <ProductCard key={item.id} item={item} />
                            ))}
                        </div>
                    </motion.div>
                );
            })}

            {filteredItems.length === 0 && (
                <div className="py-20 text-center space-y-4">
                    <p className="text-slate-400 font-bold italic uppercase tracking-widest">No artisanal cuts match your search.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-rose-600 text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                        Clear Search
                    </button>
                </div>
            )}
        </div>
    );
}
