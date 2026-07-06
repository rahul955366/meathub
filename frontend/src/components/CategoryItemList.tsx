"use client";

import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';
import CategoryItemCard from './CategoryItemCard';
import { MeatItem } from '@/types';

interface CategoryItemListProps {
    initialItems: MeatItem[];
    categoryName: string;
}

export default function CategoryItemList({ initialItems, categoryName }: CategoryItemListProps) {
    const { searchQuery } = useAppContext();

    // Filter items based on search query
    const filteredItems = initialItems.filter((item: MeatItem) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group items by their unique name (case-insensitive)
    const groupedItems: Record<string, MeatItem[]> = {};
    filteredItems.forEach((item) => {
        const key = item.name.trim();
        if (!groupedItems[key]) {
            groupedItems[key] = [];
        }
        groupedItems[key].push(item);
    });

    const uniqueItemNames = Object.keys(groupedItems);

    return (
        <div className="space-y-12">
            <div className="flex items-center gap-4">
                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                    Select a cut of {categoryName}
                </h3>
                <div className="h-px flex-1 bg-slate-200" />
            </div>

            {uniqueItemNames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {uniqueItemNames.map((name) => (
                        <motion.div
                            key={name}
                            layout
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CategoryItemCard
                                name={name}
                                category={categoryName}
                                items={groupedItems[name]}
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center space-y-4">
                    <p className="text-slate-400 font-bold italic uppercase tracking-widest">
                        No cuts match your search query.
                    </p>
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
