// MEATHUB - Nearby Butchers Component

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MapPin, Phone, Star, CheckCircle2, Loader2 } from 'lucide-react';
import { butcherApi, NearbyButcher } from '../../../api/butcherApi';
import { userApi } from '../../../api/userApi';
import { ButcherMapView } from './ButcherMapView';
import { toast } from 'sonner';

interface NearbyButchersProps {
  latitude: number;
  longitude: number;
  onSelectButcher: (butcherId: number) => void;
  selectedButcherId?: number;
  showMap?: boolean;
  userLat?: number;
  userLng?: number;
}

export function NearbyButchers({ 
  latitude, 
  longitude, 
  onSelectButcher, 
  selectedButcherId,
  showMap = false,
  userLat,
  userLng
}: NearbyButchersProps) {
  const [butchers, setButchers] = useState<NearbyButcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferredButcherId, setPreferredButcherId] = useState<number | null>(null);
  const [settingPreferred, setSettingPreferred] = useState<number | null>(null);

  useEffect(() => {
    loadNearbyButchers();
    loadPreferredButcher();
  }, [latitude, longitude]);

  const loadNearbyButchers = async () => {
    try {
      setLoading(true);
      // Increase radius to 50km to find more butchers
      const nearby = await butcherApi.getNearbyButchers(latitude, longitude, 50);
      // Sort by distance
      nearby.sort((a, b) => a.distanceKm - b.distanceKm);
      setButchers(nearby);
      
      if (nearby.length === 0) {
        toast.info('No butchers found nearby. Try entering a different pincode or location.', {
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Failed to load nearby butchers:', error);
      // Handle 401 - user not authenticated
      if (error?.status === 401) {
        toast.error('Please login to view nearby butchers', {
          duration: 5000,
        });
      } else {
        toast.error('Failed to load nearby butchers. Please try again.');
      }
      setButchers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPreferredButcher = async () => {
    try {
      const butcherId = await userApi.getPreferredButcher();
      setPreferredButcherId(butcherId);
    } catch (error) {
      console.error('Failed to load preferred butcher:', error);
    }
  };

  const handleSetPreferred = async (butcherId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setSettingPreferred(butcherId);
      await userApi.setPreferredButcher(butcherId);
      setPreferredButcherId(butcherId);
      toast.success('Set as your regular butcher');
    } catch (error) {
      console.error('Failed to set preferred butcher:', error);
      toast.error('Failed to set preferred butcher');
    } finally {
      setSettingPreferred(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading nearby butchers...</span>
      </div>
    );
  }

  if (butchers.length === 0 && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-2">No nearby butchers found</p>
        <p className="text-sm text-muted-foreground mb-4">
          Try adjusting your location or enter a different pincode
        </p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Current search location: {latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
          <p>Search radius: 50 km</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Nearby Butchers</h2>
        <Badge variant="outline">{butchers.length} found</Badge>
      </div>

      <div className="grid gap-4">
        {butchers.map((butcher) => (
          <Card
            key={butcher.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedButcherId === butcher.id ? 'border-2 border-primary' : ''
            }`}
            onClick={() => onSelectButcher(butcher.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{butcher.shopName}</h3>
                  {preferredButcherId === butcher.id && (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Your Regular
                    </Badge>
                  )}
                  {butcher.isAvailable ? (
                    <Badge variant="outline" className="text-xs text-green-600">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-red-600">
                      Unavailable
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{butcher.distanceKm.toFixed(1)} km away</span>
                  </div>
                  {butcher.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{butcher.rating.toFixed(1)}</span>
                      {butcher.totalRatings && (
                        <span className="text-xs">({butcher.totalRatings})</span>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-2">{butcher.address}</p>
                <p className="text-xs text-muted-foreground">{butcher.description}</p>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <Button
                  size="sm"
                  variant={selectedButcherId === butcher.id ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectButcher(butcher.id);
                  }}
                  disabled={!butcher.isAvailable}
                >
                  {selectedButcherId === butcher.id ? 'Selected' : 'Select'}
                </Button>
                {preferredButcherId !== butcher.id && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleSetPreferred(butcher.id, e)}
                    disabled={settingPreferred === butcher.id}
                    className="text-xs"
                  >
                    {settingPreferred === butcher.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Set as Regular'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

