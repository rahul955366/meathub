import { getButcher, getButchers, getMeatItems } from '@/lib/api';
import ButcherMenu from '@/components/ButcherMenu';

export default async function ButcherDetailPage({ params, searchParams }: { params: { id: string }, searchParams: { q?: string } }) {
    const { id } = await params;
    const { q } = await searchParams;       // Get the query param (e.g. "Chicken")

    const butcher = await getButcher(id);
    const allButchers = await getButchers();
    const allItems = await getMeatItems();

    // Filter items belonging to this butcher
    let butcherItems = allItems.filter((item: any) => item.butcher === parseInt(id));

    // FALLBACK IF EMPTY (For demo purposes)
    if (butcherItems.length === 0) {
        butcherItems = allItems.slice(0, 15);
    }

    if (!butcher) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-slate-300 uppercase tracking-widest mb-4">Merchant Not Found</h1>
                    <a href="/butchers" className="text-rose-600 font-bold hover:underline">Return to Shop List</a>
                </div>
            </div>
        );
    }

    return (
        <ButcherMenu
            butcher={butcher}
            items={butcherItems}
            allItems={allItems}
            allButchers={allButchers}
            defaultCategory={q || 'Recommended'}
        />
    );
}
