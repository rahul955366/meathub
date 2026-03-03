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
    const butcherItems = allItems.filter((item: MeatItem) => {
        const itemButcherId = typeof item.butcher === 'object' ? (item.butcher as any).id : item.butcher;
        return Number(itemButcherId) === Number(id);
    });

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
