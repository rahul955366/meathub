import { getButchers, getMeatItems } from '@/lib/api';
import ButcherList from '@/components/ButcherList';
import { Suspense } from 'react';

export default async function ButchersPage() {
    const butchers = await getButchers();
    const items = await getMeatItems();

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase tracking-[0.5em] text-slate-400">Loading Artisans...</div>}>
            <ButcherList initialButchers={butchers} initialItems={items} />
        </Suspense>
    );
}
