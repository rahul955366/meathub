import HomeContent from '@/components/HomeContent';
import { getButchers, getMeatItems } from '@/lib/api';

export default async function MeathubLanding() {
  const [butchers, items] = await Promise.all([
    getButchers(),
    getMeatItems()
  ]);

  if (!butchers || !items) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 text-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Hub Synchronization <span className="text-rose-600">Failed</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">The master meat logistics backend is currently unreachable. Please check the Artisan Command Center status.</p>
        </div>
      </div>
    )
  }

  return (
    <HomeContent
      initialButchers={butchers}
      initialItems={items}
    />
  );
}
