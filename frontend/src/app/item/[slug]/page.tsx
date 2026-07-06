import { getMeatItems, getButchers } from '@/lib/api';
import ShopsForItem from '@/components/ShopsForItem';
import { ChevronLeft, Info, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import AIChat from '@/components/AIChat';

// Helper to slugify item names for comparison fallback
const slugify = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

interface ItemDetailsProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ name?: string }>;
}

export default async function ItemDetailsPage({ params, searchParams }: ItemDetailsProps) {
    const { slug } = await params;
    const { name: queryName } = await searchParams;

    const allItems = await getMeatItems();
    const allButchers = await getButchers();

    if (!allItems || !allButchers) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 text-center py-40">
                <div className="space-y-6">
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                        Logistics Error
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                        Failed to load data. The master logistics backend is currently unreachable.
                    </p>
                </div>
            </div>
        );
    }

    // Match items by query param first, then by slugified name
    let matchedItems = allItems.filter(item => item.status === 'AVAILABLE');

    if (queryName) {
        matchedItems = matchedItems.filter(item => item.name.toLowerCase() === queryName.toLowerCase());
    } else {
        matchedItems = matchedItems.filter(item => slugify(item.name) === slug);
    }

    if (matchedItems.length === 0) {
        return (
            <div className="min-h-screen bg-white py-40 text-center space-y-6">
                <div className="text-9xl font-black opacity-10 uppercase italic">Not Found</div>
                <h2 className="text-3xl font-black uppercase italic text-slate-300">
                    This cut is currently unavailable or out of stock.
                </h2>
                <Link href="/" className="inline-block h-16 px-12 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center hover:bg-rose-600 transition-all">
                    Return to Sourcing
                </Link>
            </div>
        );
    }

    const representativeItem = matchedItems[0];
    const itemName = representativeItem.name;
    const categoryName = representativeItem.category;

    // Estimate macros if present
    const hasMacros = matchedItems.some(i => i.protein_g || i.fat_g || i.calories);

    return (
        <div className="min-h-screen bg-white py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-12">
                    {/* Header Card */}
                    <div className="bg-slate-950 text-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                        {/* Background Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent z-10" />
                        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${representativeItem.image_url || 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1920&q=80'})` }} />

                        <div className="relative z-20 space-y-6 max-w-3xl">
                            <Link
                                href={`/category/${categoryName.toLowerCase()}`}
                                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors group"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Back to {categoryName} Category
                            </Link>

                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 bg-rose-600 px-3 py-1 rounded-lg">
                                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white">Guaranteed Fresh</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                                    {itemName}
                                </h1>
                            </div>

                            <p className="text-slate-300 text-lg font-medium leading-relaxed">
                                Fresh premium grade {itemName.toLowerCase()} cuts. Certified 100% Halal and traceable to local organic farms. Select a shop below to customize your cut and order.
                            </p>

                            {/* Macro info */}
                            {hasMacros && (
                                <div className="flex flex-wrap gap-4 pt-4">
                                    {representativeItem.protein_g && (
                                        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Protein</span>
                                            <span className="text-lg font-black">{representativeItem.protein_g}g</span>
                                        </div>
                                    )}
                                    {representativeItem.fat_g && (
                                        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Fat</span>
                                            <span className="text-lg font-black">{representativeItem.fat_g}g</span>
                                        </div>
                                    )}
                                    {representativeItem.calories && (
                                        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Calories</span>
                                            <span className="text-lg font-black">{representativeItem.calories} kcal</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shops Component */}
                    <div className="py-6">
                        <ShopsForItem
                            itemName={itemName}
                            categoryName={categoryName}
                            items={matchedItems}
                            butchers={allButchers}
                        />
                    </div>
                </div>
            </div>
            <AIChat context="GENERAL" title="Nutrition Expert" />
        </div>
    );
}
