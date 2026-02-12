import HomeContent from '@/components/HomeContent';
import { getButchers, getMeatItems } from '@/lib/api';

export default async function Home() {
  const butchers = await getButchers();
  const items = await getMeatItems();

  return (
    <HomeContent
      initialButchers={butchers}
      initialItems={items}
    />
  );
}
