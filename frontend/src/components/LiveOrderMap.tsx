'use client';
import { useEffect, useRef } from 'react';

interface Order {
    id: number;
    status: string;
    butcher_name?: string;
    delivery_address?: string;
    butcher_lat?: number;
    butcher_lng?: number;
}

interface LiveOrderMapProps {
    order: Order;
}

// Simulated delivery route progress based on status
const STATUS_PROGRESS: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 0.1,
    PROCESSING: 0.3,
    SHIPPED: 0.7,
    DELIVERED: 1.0,
};

// Hyderabad area default coords
const DEFAULT_BUTCHER = { lat: 17.4399, lng: 78.4983 };
const DEFAULT_DEST = { lat: 17.4550, lng: 78.5320 };

function interpolate(start: { lat: number; lng: number }, end: { lat: number; lng: number }, t: number) {
    return {
        lat: start.lat + (end.lat - start.lat) * t,
        lng: start.lng + (end.lng - start.lng) * t,
    };
}

export default function LiveOrderMap({ order }: LiveOrderMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !mapRef.current) return;

        // Inject Leaflet CSS once
        const cssId = 'leaflet-css';
        if (!document.getElementById(cssId)) {
            const link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        import('leaflet').then((L) => {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }

            const map = L.map(mapRef.current!, { zoomControl: false, attributionControl: false });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
            mapInstanceRef.current = map;

            const origin = {
                lat: Number(order.butcher_lat) || DEFAULT_BUTCHER.lat,
                lng: Number(order.butcher_lng) || DEFAULT_BUTCHER.lng,
            };
            const dest = DEFAULT_DEST; // Real app would geocode delivery_address

            const progress = STATUS_PROGRESS[order.status] ?? 0;
            const deliveryPos = interpolate(origin, dest, progress);

            // Butcher origin marker (solid red)
            const originIcon = L.divIcon({
                html: `<div style="width:14px;height:14px;background:#e11d48;border:3px solid #fff;border-radius:50%;box-shadow:0 0 8px rgba(225,29,72,0.6);"></div>`,
                className: '',
                iconSize: [14, 14],
                iconAnchor: [7, 7],
            });

            // Delivery marker: pulsing if in-transit, green if delivered
            const isPending = progress < 0.05;
            const isDelivered = order.status === 'DELIVERED';
            const pulseColor = isDelivered ? '#22c55e' : '#f59e0b';
            const deliveryIcon = L.divIcon({
                html: `
                  <div style="position:relative;width:20px;height:20px;">
                    ${!isPending && !isDelivered ? `
                      <div style="
                        position:absolute;inset:0;border-radius:50%;background:${pulseColor};opacity:0.3;
                        animation:live-pulse 1.4s ease-out infinite;
                      "></div>
                    ` : ''}
                    <div style="
                      position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                      width:12px;height:12px;border-radius:50%;background:${pulseColor};
                      border:2px solid #fff;box-shadow:0 0 6px ${pulseColor};
                    "></div>
                  </div>`,
                className: '',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
            });

            // Destination marker (grey pin)
            const destIcon = L.divIcon({
                html: `<div style="width:10px;height:10px;background:#94a3b8;border:2px solid #fff;border-radius:50%;"></div>`,
                className: '',
                iconSize: [10, 10],
                iconAnchor: [5, 5],
            });

            L.marker([origin.lat, origin.lng], { icon: originIcon })
                .addTo(map)
                .bindPopup(`<b>${order.butcher_name || 'Butcher'}</b><br/><small>Collection point</small>`);

            L.marker([dest.lat, dest.lng], { icon: destIcon })
                .addTo(map)
                .bindPopup(`<small>Delivery destination</small>`);

            if (!isPending) {
                L.marker([deliveryPos.lat, deliveryPos.lng], { icon: deliveryIcon })
                    .addTo(map)
                    .bindPopup(`<b>Order #${order.id}</b><br/><small>${order.status}</small>`)
                    .openPopup();
            }

            // Draw dashed route line
            L.polyline(
                [[origin.lat, origin.lng], [dest.lat, dest.lng]],
                { color: '#e11d48', weight: 2, dashArray: '6 8', opacity: 0.5 }
            ).addTo(map);

            // Fit map to all points
            const bounds = L.latLngBounds([[origin.lat, origin.lng], [dest.lat, dest.lng]]);
            map.fitBounds(bounds, { padding: [40, 40] });
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [order]);

    return (
        <>
            <style>{`
                @keyframes live-pulse {
                    0% { transform: scale(1); opacity: 0.5; }
                    70% { transform: scale(2.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 0; }
                }
            `}</style>
            <div
                ref={mapRef}
                style={{ height: '240px', background: '#0f172a', borderRadius: '1rem', overflow: 'hidden' }}
            />
        </>
    );
}
