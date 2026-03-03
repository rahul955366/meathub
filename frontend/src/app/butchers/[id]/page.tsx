import { getButcher, getButchers, getMeatItems } from '@/lib/api';
import ButcherMenu from '@/components/ButcherMenu';
import { MeatItem, Butcher } from '@/types';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ButcherDetailPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ q?: string }>
}) {
    const { id } = await params;
    const { q } = await searchParams;

    console.log(`[ROUTE DEBUG] Rendering ButcherDetailPage for ID: ${id}, Search: ${q}`);

    const [butcher, allButchers, allItems] = await Promise.all([
        getButcher(id),
        getButchers(),
        getMeatItems()
    ]);

    if (!butcher) {
        console.warn(`[ROUTE DEBUG] Butcher ${id} not found, triggering notFound()`);
        notFound();
    }

    console.log(`[ROUTE DEBUG] Fetch result for ${id}: ${butcher.shop_name}`);

    // Filter items belonging to this butcher
    let butcherItems = allItems.filter((item: MeatItem) => item.butcher === parseInt(id));

    // FALLBACK IF EMPTY (For demo purposes)
    if (butcherItems.length === 0) {
        butcherItems = allItems;
    }

    return (
        <ButcherMenu
            butcher={butcher as Butcher}
            items={butcherItems}
            allItems={allItems}
            allButchers={allButchers}
            defaultCategory={q || 'Recommended'}
        />
    );
}
