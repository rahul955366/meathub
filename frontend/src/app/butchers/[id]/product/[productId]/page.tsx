import { getButcher, getMeatItem } from '@/lib/api';
import { ChevronLeft, ShoppingBag, ShieldCheck, MapPin, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetailPage({
    params
}: {
    params: { id: string, productId: string }
}) {
    const { id, productId } = await params;
    const butcher = await getButcher(id);
    const item = await getMeatItem(productId);

    if (!butcher || !item) {
        return <div className="min-h-screen flex items-center justify-center font-black uppercase text-slate-400">Inventory Log Error.</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-24">
                <div className="flex flex-col gap-16">
                    {/* Header Controls */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                        <Link
                            href={`/butchers?q=${item.name}`}
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Return to Masters
                        </Link>
                        <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available in Real-Time</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        {/* Visual Asset Section */}
                        <div className="space-y-8">
                            <div className="aspect-square rounded-[4rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl relative">
                                <img
                                    src={item.image_url || 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80'}
                                    className="w-full h-full object-cover"
                                    alt={item.name}
                                />
                                <div className="absolute top-10 right-10 flex flex-col gap-4">
                                    <div className="bg-white/90 backdrop-blur px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-100">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="text-sm font-black text-slate-900">4.9</span>
                                    </div>
                                </div>
                            </div>

                            {/* Butcher Identity Mini-Card */}
                            <div className="bg-slate-900 text-white rounded-[3rem] p-10 flex items-center justify-between border border-white/10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-rose-600/40 transition-colors" />
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-rose-600" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Official Master</span>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{butcher.shop_name}</h3>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                                            <MapPin className="w-3 h-3" /> {butcher.address}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 relative z-10">
                                    <span className="text-4xl font-black italic tracking-tighter text-rose-600">Premium</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Source Grade</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Configuration Section */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="px-4 py-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                        {item.category}
                                    </span>
                                </div>
                                <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.85]">
                                    {item.name}.
                                </h1>
                                <p className="text-slate-500 text-lg font-medium italic leading-relaxed border-l-4 border-slate-100 pl-6">
                                    {item.description || "Expertly prepared cut prepared in highly hygienic conditions by our certified master butchers."}
                                </p>
                            </div>

                            <ProductDetailClient item={item} />

                            {/* Trust Signals */}
                            <div className="grid grid-cols-2 gap-6 pt-12 border-t border-slate-100">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                                        <ShieldCheck className="w-6 h-6 text-slate-900 group-hover:text-rose-600 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quality Log</p>
                                        <p className="text-sm font-black text-slate-900 uppercase">Certified Fresh</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                                        <Clock className="w-6 h-6 text-slate-900 group-hover:text-rose-600 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ready Time</p>
                                        <p className="text-sm font-black text-slate-900 uppercase">24 Min Pick</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
