// MEATHUB - Butcher Map View Component

import React, { useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { NearbyButcher } from '../../../api/butcherApi';
import { MapPin } from 'lucide-react';

interface ButcherMapViewProps {
  butchers: NearbyButcher[];
  userLat: number;
  userLng: number;
  selectedButcherId?: number;
  onButcherClick: (butcherId: number) => void;
}

export function ButcherMapView({
  butchers,
  userLat,
  userLng,
  selectedButcherId,
  onButcherClick,
}: ButcherMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize map (using Leaflet as example - can be replaced with Google Maps)
    if (!mapRef.current) return;

    // Simple SVG-based map visualization
    // In production, integrate with Google Maps API or Mapbox
    const drawMap = () => {
      if (!mapRef.current) return;

      // Create SVG map
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('viewBox', '0 0 400 400');
      svg.style.position = 'absolute';
      svg.style.top = '0';
      svg.style.left = '0';

      // Draw user location
      const userX = 200;
      const userY = 200;
      const userCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      userCircle.setAttribute('cx', userX.toString());
      userCircle.setAttribute('cy', userY.toString());
      userCircle.setAttribute('r', '8');
      userCircle.setAttribute('fill', '#8B1538');
      userCircle.setAttribute('stroke', '#fff');
      userCircle.setAttribute('stroke-width', '2');
      svg.appendChild(userCircle);

      // Draw user label
      const userLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      userLabel.setAttribute('x', (userX + 12).toString());
      userLabel.setAttribute('y', (userY + 4).toString());
      userLabel.setAttribute('font-size', '12');
      userLabel.setAttribute('fill', '#333');
      userLabel.textContent = 'You';
      svg.appendChild(userLabel);

      // Draw butchers
      butchers.forEach((butcher, index) => {
        // Calculate relative position (simplified - in production use actual lat/lng)
        const angle = (index * (360 / butchers.length)) * (Math.PI / 180);
        const distance = Math.min(butcher.distanceKm * 10, 150); // Scale distance
        const butcherX = userX + Math.cos(angle) * distance;
        const butcherY = userY + Math.sin(angle) * distance;

        // Draw route line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', userX.toString());
        line.setAttribute('y1', userY.toString());
        line.setAttribute('x2', butcherX.toString());
        line.setAttribute('y2', butcherY.toString());
        line.setAttribute('stroke', '#8B1538');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '5,5');
        line.setAttribute('opacity', '0.3');
        svg.appendChild(line);

        // Draw butcher marker
        const butcherCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        butcherCircle.setAttribute('cx', butcherX.toString());
        butcherCircle.setAttribute('cy', butcherY.toString());
        butcherCircle.setAttribute('r', selectedButcherId === butcher.id ? '10' : '6');
        butcherCircle.setAttribute(
          'fill',
          selectedButcherId === butcher.id ? '#8B1538' : butcher.isAvailable ? '#059669' : '#DC2626'
        );
        butcherCircle.setAttribute('stroke', '#fff');
        butcherCircle.setAttribute('stroke-width', '2');
        butcherCircle.style.cursor = 'pointer';
        butcherCircle.addEventListener('click', () => onButcherClick(butcher.id));
        svg.appendChild(butcherCircle);

        // Draw distance label
        const distanceLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        distanceLabel.setAttribute('x', butcherX.toString());
        distanceLabel.setAttribute('y', (butcherY - 15).toString());
        distanceLabel.setAttribute('font-size', '10');
        distanceLabel.setAttribute('fill', '#333');
        distanceLabel.setAttribute('text-anchor', 'middle');
        distanceLabel.textContent = `${butcher.distanceKm.toFixed(1)}km`;
        svg.appendChild(distanceLabel);
      });

      mapRef.current.appendChild(svg);
    };

    drawMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [butchers, userLat, userLng, selectedButcherId, onButcherClick]);

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Map View</h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>You</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
      <div
        ref={mapRef}
        className="relative w-full h-96 bg-muted rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      >
        {/* Fallback message */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Interactive map view</p>
            <p className="text-xs mt-1">
              In production, integrate with Google Maps API
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

