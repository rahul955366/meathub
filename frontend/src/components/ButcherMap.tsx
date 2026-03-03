'use client';
import { useEffect, useRef } from 'react';
import type { Butcher } from '@/types';

interface ButcherMapProps {
    butchers: Butcher[];
    selectedId?: number | null;
    onSelect?: (id: number) => void;
}

export default function ButcherMap({ butchers, selectedId, onSelect }: ButcherMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    useEffect(() => {
        if (typeof window === 'undefined' || !mapRef.current) return;

        // Dynamically import Leaflet to avoid SSR issues
        import('leaflet').then(L => {
            // Fix default icon paths for webpack
            const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
            const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
            const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

            if (!mapInstanceRef.current) {
                // Centre on Hyderabad
                const map = L.map(mapRef.current!, { zoomControl: true, attributionControl: false });
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
                map.setView([17.4399, 78.4983], 12);
                mapInstanceRef.current = map;
            }

            const map = mapInstanceRef.current;

            // Clear old markers
            markersRef.current.forEach(m => m.remove());
            markersRef.current = [];

            // Rose icon for selected, default for others
            const roseIcon = L.divIcon({
                html: `<div style="width:14px;height:14px;background:#e11d48;border:2px solid #fff;border-radius:50%;box-shadow:0 0 8px #e11d48;"></div>`,
                className: '',
                iconSize: [14, 14],
                iconAnchor: [7, 7],
            });
            const defaultIcon = L.divIcon({
                html: `<div style="width:10px;height:10px;background:#6b7280;border:2px solid #fff;border-radius:50%;"></div>`,
                className: '',
                iconSize: [10, 10],
                iconAnchor: [5, 5],
            });

            butchers.forEach(b => {
                if (!b.latitude || !b.longitude) return;
                const isSelected = b.id === selectedId;
                const marker = L.marker([b.latitude, b.longitude], { icon: isSelected ? roseIcon : defaultIcon })
                    .addTo(map)
                    .bindPopup(
                        `<div style="font-family:sans-serif;min-width:160px;">
              <strong style="color:#111;">${b.shop_name}</strong><br/>
              <span style="color:#555;font-size:12px;">${b.address ?? ''}</span>
            </div>`,
                        { maxWidth: 220 }
                    );
                marker.on('click', () => onSelect?.(b.id));
                if (isSelected) marker.openPopup();
                markersRef.current.push(marker);
            });

            // Pan to selected
            const sel = butchers.find(b => b.id === selectedId);
            if (sel?.latitude && sel?.longitude) {
                map.flyTo([sel.latitude, sel.longitude], 15, { duration: 1 });
            }
        });

        return () => {
            // Cleanup is handled by replacing markers on re-render
        };
    }, [butchers, selectedId, onSelect]);

    // Import Leaflet CSS globally via style tag (next-safe)
    useEffect(() => {
        const id = 'leaflet-css';
        if (!document.getElementById(id)) {
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }
    }, []);

    return (
        <div
            ref={mapRef}
            className="w-full rounded-2xl overflow-hidden border border-white/10"
            style={{ height: '400px', background: '#1a1a2e' }}
        />
    );
}
