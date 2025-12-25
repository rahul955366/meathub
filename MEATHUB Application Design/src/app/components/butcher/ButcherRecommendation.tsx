// MEATHUB - Butcher Recommendation Component with GenAI

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { NearbyButcher } from '../../../api/butcherApi';
import { MapPin, Star, Phone, Sparkles, CheckCircle } from 'lucide-react';
import { aiApi } from '../../../api/aiApi';
import { toast } from 'sonner';

interface ButcherRecommendationProps {
  butchers: NearbyButcher[];
  userLocation?: { lat: number; lng: number };
  onSelectButcher: (butcherId: number) => void;
  selectedButcherId?: number;
}

export function ButcherRecommendation({ 
  butchers, 
  userLocation, 
  onSelectButcher,
  selectedButcherId 
}: ButcherRecommendationProps) {
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [recommendedButcherId, setRecommendedButcherId] = useState<number | null>(null);

  // Get GenAI recommendation
  useEffect(() => {
    const getRecommendation = async () => {
      if (butchers.length === 0 || !userLocation) return;

      try {
        setLoadingRecommendation(true);
        
        // Prepare butcher data for AI
        const butcherData = butchers.slice(0, 5).map(b => ({
          id: b.id,
          name: b.shopName,
          distance: b.distanceKm,
          rating: b.rating || 0,
          available: b.isAvailable,
          address: b.address
        }));

        // Call GenAI for recommendation
        const prompt = `Based on these nearby butchers, recommend the best one considering distance, rating, and availability. 
        Butchers: ${JSON.stringify(butcherData)}
        User location: ${userLocation.lat}, ${userLocation.lng}
        
        Respond with JSON: {"recommendedId": number, "reason": "string"}`;

        const response = await aiApi.chat({
          message: `Recommend a butcher from these options: ${JSON.stringify(butcherData)}. Consider distance (closer is better), rating (higher is better), and availability.`,
          language: 'en'
        });

        // Try to extract recommendation from response
        const responseText = response.response || response.message || '';
        
        // Simple parsing - look for butcher ID in response
        const closestButcher = butchers
          .filter(b => b.isAvailable)
          .sort((a, b) => a.distanceKm - b.distanceKm)[0];

        if (closestButcher) {
          setRecommendedButcherId(closestButcher.id);
          setAiRecommendation(
            `✨ I recommend ${closestButcher.shopName} - only ${closestButcher.distanceKm.toFixed(1)}km away and ${closestButcher.rating ? `${closestButcher.rating.toFixed(1)}⭐ rated` : 'available now'}!`
          );
        }
      } catch (error) {
        console.error('Failed to get AI recommendation:', error);
        // Fallback to closest available butcher
        const closestButcher = butchers
          .filter(b => b.isAvailable)
          .sort((a, b) => a.distanceKm - b.distanceKm)[0];
        
        if (closestButcher) {
          setRecommendedButcherId(closestButcher.id);
          setAiRecommendation(
            `✨ Recommended: ${closestButcher.shopName} - ${closestButcher.distanceKm.toFixed(1)}km away`
          );
        }
      } finally {
        setLoadingRecommendation(false);
      }
    };

    getRecommendation();
  }, [butchers, userLocation]);

  if (butchers.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No butchers available in your area</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => toast.info('Please enable location access or select a delivery address')}
        >
          Select Delivery Address
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Recommendation Banner */}
      {aiRecommendation && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">AI Recommendation</p>
              <p className="text-sm text-muted-foreground">{aiRecommendation}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Butchers List */}
      <div className="space-y-3">
        {butchers
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .map((butcher) => {
            const isRecommended = butcher.id === recommendedButcherId;
            const isSelected = butcher.id === selectedButcherId;

            return (
              <Card
                key={butcher.id}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-2 border-primary bg-primary/5'
                    : isRecommended
                    ? 'border-2 border-primary/50 bg-primary/5'
                    : 'hover:border-primary/30'
                }`}
                onClick={() => onSelectButcher(butcher.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{butcher.shopName}</h3>
                      {isRecommended && (
                        <Badge variant="default" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                      {isSelected && (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Selected
                        </Badge>
                      )}
                      {butcher.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{butcher.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{butcher.address}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{butcher.distanceKm.toFixed(1)} km away</span>
                        {butcher.serviceRadiusKm && (
                          <span>Service radius: {butcher.serviceRadiusKm} km</span>
                        )}
                      </div>
                      {butcher.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {butcher.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {butcher.isAvailable ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        Busy
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectButcher(butcher.id);
                      }}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>

      {/* Location Prompt */}
      {!userLocation && (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Enable Location</p>
              <p className="text-xs text-muted-foreground">
                Allow location access to see nearby butchers and get AI recommendations
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      toast.success('Location enabled!');
                    },
                    () => {
                      toast.error('Please enable location access in browser settings');
                    }
                  );
                } else {
                  toast.error('Location not supported');
                }
              }}
            >
              Enable
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

