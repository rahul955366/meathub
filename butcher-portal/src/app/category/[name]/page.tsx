import { getMeatItems } from '@/lib/api';
import ProductList from '@/components/ProductList';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { MeatItem } from '@/types';
import AIChat from '@/components/AIChat';

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    const allItems = await getMeatItems();

    const categoryItems = allItems.filter((item: MeatItem) =>
        item.category.toLowerCase() === name.toLowerCase() && item.status === 'AVAILABLE'
    );

    return (
        <div className="min-h-screen bg-white py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 pb-12">
                        <div className="space-y-4">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors group"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Back to Sourcing
                            </Link>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none text-slate-900">
                                Global <br />
                                <span className="text-rose-600 not-italic">{name} Stock.</span>
                            </h1>
                        </div>
                        <div className="max-w-xs text-right">
                            <p className="text-slate-500 font-bold italic uppercase tracking-widest text-sm mb-2">Available Inventory</p>
                            <p className="text-3xl font-black text-slate-900">{categoryItems.length} Premium Cuts</p>
                        </div>
                    </div>

                    {categoryItems.length > 0 ? (
                        <div className="py-12">
                            <ProductList initialItems={categoryItems} />
                        </div>
                    ) : (
                        <div className="py-40 text-center space-y-6">
                            <div className="text-9xl font-black opacity-10 uppercase italic">Empty</div>
                            <h2 className="text-3xl font-black uppercase italic text-slate-300">No {name} items found in our global logs.</h2>
                            <Link href="/" className="inline-block h-16 px-12 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center hover:bg-rose-600 transition-all">
                                Return to Sourcing
                            </Link>
                        </div>
                    )}
                </div>
                <AIChat context="GENERAL" title="Nutrition Expert" />
            </div>
        </div>
    );
}
