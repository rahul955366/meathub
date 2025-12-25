// MEATHUB - Location Access Component

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LocationAccessProps {
  onLocationObtained: (lat: number, lng: number) => void;
}

export function LocationAccess({ onLocationObtained }: LocationAccessProps) {
  const [loading, setLoading] = useState(false);
  const [pincode, setPincode] = useState('');
  const [usePincode, setUsePincode] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setUsePincode(true);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationObtained(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        // Silently handle geolocation errors - don't spam console
        // Fallback to Hyderabad coordinates (where butchers are located)
        // This ensures users can still find butchers even if GPS fails
        onLocationObtained(17.3850, 78.4867);
        toast.info('Using default location. You can enter pincode for more accurate results.');
        setUsePincode(true);
        setLoading(false);
      },
      {
        timeout: 5000,
        enableHighAccuracy: false
      }
    );
  };

  const handlePincodeSubmit = async () => {
    if (!pincode || pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    try {
      // Use a geocoding service to convert pincode to coordinates
      // For now, using a mock API - in production, use Google Maps Geocoding API or similar
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.[0]) {
        // Try to determine city from pincode data
        const postOffice = data[0]?.PostOffice?.[0];
        const city = postOffice?.District || postOffice?.State || '';
        
        // Default to Hyderabad coordinates (where butchers are located)
        // In production, use proper geocoding API to get exact coordinates
        let lat = 17.3850; // Hyderabad
        let lng = 78.4867;
        
        // Adjust based on city if detected (simplified)
        if (city.toLowerCase().includes('mumbai') || city.toLowerCase().includes('maharashtra')) {
          lat = 19.0760;
          lng = 72.8777;
        } else if (city.toLowerCase().includes('delhi') || city.toLowerCase().includes('new delhi')) {
          lat = 28.6139;
          lng = 77.2090;
        } else if (city.toLowerCase().includes('bangalore') || city.toLowerCase().includes('bengaluru')) {
          lat = 12.9716;
          lng = 77.5946;
        } else if (city.toLowerCase().includes('hyderabad') || city.toLowerCase().includes('telangana')) {
          lat = 17.3850;
          lng = 78.4867;
        }
        
        // Add small random offset to simulate pincode-based location
        lat = lat + (Math.random() - 0.5) * 0.1;
        lng = lng + (Math.random() - 0.5) * 0.1;
        
        onLocationObtained(lat, lng);
        toast.success(`Location found: ${postOffice.Name || city || 'Area'}`);
      } else {
        toast.error('Invalid pincode. Please try again.');
      }
    } catch (error) {
      // Silently handle geocoding errors
      // Fallback to Hyderabad coordinates (where butchers are located)
      onLocationObtained(17.3850, 78.4867);
      toast.info('Using default location');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-request location on mount
    getCurrentLocation();
  }, []);

  if (usePincode) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Enter Your Pincode</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            We need your location to find nearby butchers
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter 6-digit pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="flex-1"
            />
            <Button onClick={handlePincodeSubmit} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Find'}
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={getCurrentLocation}>
            Try GPS location again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Getting your location...</p>
        <Button variant="outline" onClick={() => setUsePincode(true)}>
          Enter Pincode Instead
        </Button>
      </div>
    </Card>
  );
}

