// MEATHUB - Butcher Search Box (Stylish Right Panel Component)

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { NearbyButcher } from '../../../api/butcherApi';
import { butcherApi } from '../../../api/butcherApi';
import { MapPin, Search, Store, X, Sparkles, Star, CheckCircle, Navigation } from 'lucide-react';
import { toast } from 'sonner';

interface ButcherSearchBoxProps {
  onButcherSelect: (butcher: NearbyButcher) => void;
  selectedButcherId?: number;
  onClearSelection: () => void;
}

export function ButcherSearchBox({ 
  onButcherSelect, 
  selectedButcherId,
  onClearSelection 
}: ButcherSearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchByDistance, setSearchByDistance] = useState(false);
  const [nearbyButchers, setNearbyButchers] = useState<NearbyButcher[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user location with better error handling
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          // Silently fallback to mock location - don't show error
          console.log('Location access not available, using default location');
          setUserLocation({ lat: 12.9716, lng: 77.5946 });
        },
        {
          timeout: 5000,
          enableHighAccuracy: false
        }
      );
    } else {
      // Geolocation not supported
      setUserLocation({ lat: 12.9716, lng: 77.5946 });
    }
  }, []);

  // Search by distance
  const handleSearchByDistance = async () => {
    if (!userLocation) {
      toast.error('Please enable location access');
      return;
    }

    try {
      setLoading(true);
      setSearchByDistance(true);
      const butchers = await butcherApi.getNearbyButchers(userLocation.lat, userLocation.lng, 10);
      setNearbyButchers(butchers);
      if (butchers.length === 0) {
        toast.info('No butchers found nearby');
      }
    } catch (error: any) {
      // Handle errors gracefully
      console.log('Butcher search error:', error?.message || 'Service unavailable');
      if (error?.status === 0) {
        toast.error('Unable to connect to server. Please check if services are running.');
      } else {
        toast.error('Failed to search butchers');
      }
    } finally {
      setLoading(false);
    }
  };

  // Search by shop name/location
  const handleSearchByName = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter shop name or location');
      return;
    }

    try {
      setLoading(true);
      setSearchByDistance(false);
      
      // If we have location, search nearby first, then filter by name
      if (userLocation) {
        const butchers = await butcherApi.getNearbyButchers(userLocation.lat, userLocation.lng, 20);
        const filtered = butchers.filter(b => 
          b.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setNearbyButchers(filtered);
        
        if (filtered.length === 0) {
          toast.info(`No butchers found matching "${searchQuery}"`);
        }
      } else {
        toast.error('Please enable location access');
      }
    } catch (error: any) {
      // Handle errors gracefully
      console.log('Butcher search error:', error?.message || 'Service unavailable');
      if (error?.status === 0) {
        toast.error('Unable to connect to server. Please check if services are running.');
      } else {
        toast.error('Failed to search butchers');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectButcher = (butcher: NearbyButcher) => {
    onButcherSelect(butcher);
    toast.success(`Selected ${butcher.shopName}`);
  };

  return (
    <div className="space-y-4">
      {/* Selected Butcher Info - Enhanced */}
      {selectedButcherId && (
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                  <Store className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                  <CheckCircle className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {nearbyButchers.find(b => b.id === selectedButcherId)?.shopName || 'Selected Butcher'}
                </p>
                <p className="text-xs text-muted-foreground">Ready to order</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Search Input - Enhanced */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by shop name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchByName();
              }
            }}
            className="pl-9 bg-background/80 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSearchByName}
            disabled={loading || !searchQuery.trim()}
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            size="sm"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button
            onClick={handleSearchByDistance}
            disabled={loading || !userLocation}
            variant="outline"
            size="sm"
            className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-105"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Nearby
          </Button>
        </div>
      </div>

      {/* Butchers List - Enhanced */}
      {nearbyButchers.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50">
          {nearbyButchers.map((butcher, index) => {
            const isSelected = selectedButcherId === butcher.id;
            return (
              <Card
                key={butcher.id}
                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected
                    ? 'border-2 border-primary bg-gradient-to-r from-primary/10 to-secondary/10 shadow-md scale-[1.02]'
                    : 'border border-primary/10 hover:border-primary/30 hover:bg-primary/5'
                }`}
                onClick={() => handleSelectButcher(butcher)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Butcher Icon */}
                    <div className={`relative flex-shrink-0 ${
                      isSelected ? 'ring-2 ring-primary ring-offset-2 rounded-full' : ''
                    }`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isSelected 
                          ? 'bg-gradient-to-br from-primary to-secondary' 
                          : 'bg-primary/10'
                      }`}>
                        <Store className={`h-6 w-6 ${
                          isSelected ? 'text-primary-foreground' : 'text-primary'
                        }`} />
                      </div>
                      {butcher.isAvailable && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>

                    {/* Butcher Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm truncate">{butcher.shopName}</h4>
                        {isSelected && (
                          <Badge variant="default" className="text-xs px-1.5 py-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                        {butcher.rating && (
                          <div className="flex items-center gap-1 ml-auto">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{butcher.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{butcher.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        {searchByDistance && butcher.distanceKm && (
                          <Badge variant="outline" className="text-xs">
                            <Navigation className="h-3 w-3 mr-1" />
                            {butcher.distanceKm.toFixed(1)} km
                          </Badge>
                        )}
                        {butcher.isAvailable ? (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600 bg-green-50">
                            Available Now
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-red-600 border-red-600 bg-red-50">
                            Busy
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Loading State - Enhanced */}
      {loading && (
        <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground font-medium">Searching butchers...</p>
          </div>
        </Card>
      )}

      {/* Empty State - Enhanced */}
      {!loading && nearbyButchers.length === 0 && searchByDistance && (
        <Card className="p-8 text-center bg-muted/30 border-dashed">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Store className="h-8 w-8 text-primary/50" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">No butchers found nearby</p>
              <p className="text-xs text-muted-foreground">Try searching by name or expanding your search radius</p>
            </div>
          </div>
        </Card>
      )}

      {/* Initial State */}
      {!loading && nearbyButchers.length === 0 && !searchByDistance && !searchQuery && (
        <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex flex-col items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary/50" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Find Your Perfect Butcher</p>
              <p className="text-xs text-muted-foreground">
                Search by name or click "Nearby" to find butchers close to you
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
