import { getButchers, getMeatItems } from '@/lib/api';
import ButcherList from '@/components/ButcherList';
import { Suspense } from 'react';
import DynamicButcherMap from '@/components/DynamicButcherMap';
import AIChat from '@/components/AIChat';

export const dynamic = 'force-dynamic';

export default async function ButcherListings() {
    const butchers = await getButchers();
    const items = await getMeatItems();

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase tracking-[0.5em] text-slate-400">Loading Artisans...</div>}>
            <div className="bg-slate-50 min-h-screen">
                <ButcherList initialButchers={butchers} initialItems={items} />

                {/* Global Map View - Permanently visible Artisan GPS Browser */}
                <div className="container mx-auto px-4 pb-32">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-2 rounded-full mb-4">
                            <span className="text-rose-600 text-[10px] font-black uppercase tracking-widest">GPS Browser</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-slate-900 mb-3">
                            Artisan <span className="text-rose-600 not-italic">Discovery Map</span>
                        </h2>
                        <p className="text-slate-500 text-lg font-medium">Visualizing our network of certified village-source partners</p>
                    </div>

                    <div className="h-[600px] rounded-[3.5rem] overflow-hidden border-[12px] border-white shadow-3xl relative">
                        <DynamicButcherMap butchers={butchers} />
                    </div>
                </div>
                <AIChat context="GENERAL" title="Artisan Assistant" />
            </div>
        </Suspense>
    );
}
