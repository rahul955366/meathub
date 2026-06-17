import { getButcher, getButchers, getMeatItems } from '@/lib/api';
import ButcherMenu from '@/components/ButcherMenu';
import { MeatItem, Butcher } from '@/types';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Final structural cleanup to resolve the Turbopack "negative timestamp" tracing bug.
// Renaming to a unique identifier to break any internal profiling cache.
export default async function ArtisanProfileView({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ q?: string }>
}) {
    const { id } = await params;
    const { q } = await searchParams;

    // Direct, stable data fetching
    const responses = await Promise.all([
        getButcher(id),
        getButchers(),
        getMeatItems()
    ]);

    const [butcher, butchers, allItems] = responses;

    // Handle missing artisan profile with a clean, branded UI instead of throwing notFound()
    // which can sometimes disrupt the tracer segment.
    if (!butcher) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-slate-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                        <MapPin className="text-slate-400 w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase italic tracking-tighter">Artisan Not Found</h1>
                    <p className="text-slate-500 font-medium mb-8">This butcher might be offline or undergoing a routine hygiene audit.</p>
                    <Link href="/butchers" className="bg-rose-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-rose-700 transition-all">
                        Browse Other Sources
                    </Link>
                </div>
            </div>
        );
    }

    const safeButchers = butchers || [];
    const safeItems = allItems || [];

    // Correct filtering using String cast for ID compatibility (number vs string)
    const filteredItems = safeItems.filter((item: MeatItem) => {
        const itemButcherId = typeof item.butcher === 'object' ? (item.butcher as any).id : item.butcher;
        return String(itemButcherId) === String(id);
    });

    return (
        <div id={`profile-view-wrapper-${id}`}>
            <ButcherMenu
                butcher={butcher as Butcher}
                items={filteredItems}
                allItems={safeItems}
                allButchers={safeButchers}
                defaultCategory={q || 'Recommended'}
            />
        </div>
    );
}

// Add necessary imports if missing
import { MapPin } from 'lucide-react';
import Link from 'next/link';
