'use client';

import dynamic from 'next/dynamic';
import type { Butcher } from '@/types';

const ButcherMap = dynamic(() => import('./ButcherMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-900/50 animate-pulse flex items-center justify-center">
            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing Satellite Discovery...</span>
        </div>
    )
});

interface DynamicButcherMapProps {
    butchers: Butcher[];
    selectedId?: number | null;
    onSelect?: (id: number) => void;
}

export default function DynamicButcherMap(props: DynamicButcherMapProps) {
    return <ButcherMap {...props} />;
}
