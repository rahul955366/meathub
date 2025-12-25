// MEATHUB - Butcher Selection Page

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LocationAccess } from '../components/butcher/LocationAccess';
import { NearbyButchers } from '../components/butcher/NearbyButchers';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, ShoppingBag, Map, List, LogIn } from 'lucide-react';

interface ButcherSelectionPageProps {
  onNavigate: (page: string, data?: any) => void;
  onButcherSelected: (butcherId: number) => void;
}

export function ButcherSelectionPage({ onNavigate, onButcherSelected }: ButcherSelectionPageProps) {
  const { isAuthenticated, setShowAuthModal } = useApp();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedButcherId, setSelectedButcherId] = useState<number | undefined>();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const handleLocationObtained = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleButcherSelect = (butcherId: number) => {
    setSelectedButcherId(butcherId);
    onButcherSelected(butcherId);
  };

  const handleViewItems = () => {
    if (selectedButcherId) {
      onNavigate('butcher-items', selectedButcherId);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-semibold mb-2">Select Your Butcher</h1>
            <p className="text-muted-foreground">
              Choose a nearby butcher to view their available meat items
            </p>
            {!isAuthenticated && (
              <Card className="mt-4 p-4 bg-yellow-50 border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LogIn className="h-5 w-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Please login to view nearby butchers
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowAuthModal(true)}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    Login
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {!location ? (
            <LocationAccess onLocationObtained={handleLocationObtained} />
          ) : (
            <div className="space-y-6">
              {/* View Mode Toggle */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Nearby Butchers</h2>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                  >
                    <Map className="h-4 w-4 mr-2" />
                    Map
                  </Button>
                </div>
              </div>

              {/* List or Map View */}
              <NearbyButchers
                latitude={location.lat}
                longitude={location.lng}
                onSelectButcher={handleButcherSelect}
                selectedButcherId={selectedButcherId}
                showMap={viewMode === 'map'}
                userLat={location.lat}
                userLng={location.lng}
              />

              {selectedButcherId && (
                <div className="flex justify-end">
                  <Button size="lg" onClick={handleViewItems}>
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    View Items from This Butcher
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
