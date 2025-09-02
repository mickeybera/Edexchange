'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { MapPin, Loader2, RefreshCw, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationDetectorProps {
  onLocationDetected: (location: string) => void;
  className?: string;
  placeholder?: string;
  label?: string;
  autoDetectOnMount?: boolean;
  initialValue?: string;
}

interface LocationData {
  city?: string;
  state?: string;
  country?: string;
  formatted?: string;
  latitude?: number;
  longitude?: number;
}

export function LocationDetector({ 
  onLocationDetected, 
  className = '',
  placeholder = 'Enter your location or use auto-detect',
  label = 'Location',
  autoDetectOnMount = false,
  initialValue = ''
}: LocationDetectorProps) {
  const [location, setLocation] = useState(initialValue);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState<'gps' | 'ip' | 'manual' | null>(null);
  const [hasAutoDetected, setHasAutoDetected] = useState(false);
  const { toast } = useToast();

  // Get location from IP address as a fallback
  const getLocationFromIP = async (): Promise<LocationData> => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      
      if (!response.ok) {
        throw new Error('Failed to get IP location');
      }
      
      const data = await response.json();
      
      return {
        city: data.city,
        state: data.region,
        country: data.country,
        latitude: data.lat,
        longitude: data.lon,
        formatted: `${data.city}, ${data.region}`
      };
    } catch (error) {
      console.error('IP location error:', error);
      throw new Error('Failed to get location from IP');
    }
  };

  // Reverse geocoding using OpenStreetMap Nominatim
  const reverseGeocode = async (latitude: number, longitude: number): Promise<LocationData> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get location data');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const address = data.address;
      const locationData: LocationData = {
        city: address.city || address.town || address.village || address.county,
        state: address.state,
        country: address.country,
        latitude,
        longitude,
        formatted: data.display_name
      };
      
      return locationData;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw new Error('Failed to get location details');
    }
  };

  // Format location data into a readable string
  const formatLocation = (locationData: LocationData): string => {
    if (locationData.city && locationData.state) {
      return `${locationData.city}, ${locationData.state}`;
    } else if (locationData.city) {
      return locationData.city;
    } else if (locationData.formatted) {
      // Use the first part of the formatted address
      return locationData.formatted.split(',')[0];
    }
    return '';
  };

  // Validate if a location string is reasonable
  const validateLocation = (location: string): boolean => {
    if (!location || location.trim().length === 0) {
      return false;
    }
    
    // Check if it's at least 2 characters and contains some letters
    const trimmed = location.trim();
    if (trimmed.length < 2) {
      return false;
    }
    
    // Check if it contains at least some letters
    if (!/[a-zA-Z]/.test(trimmed)) {
      return false;
    }
    
    return true;
  };

  // Get user's location using multiple methods
  const getUserLocation = async (): Promise<LocationData> => {
    // First try browser geolocation
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          });
        });

        const { latitude, longitude } = position.coords;
        return await reverseGeocode(latitude, longitude);
      } catch (error) {
        console.log('Browser geolocation failed, trying IP-based location');
      }
    }
    
    // Fallback to IP-based location
    return await getLocationFromIP();
  };

  // Detect location using multiple methods
  const detectLocation = async () => {
    setIsDetecting(true);
    setDetectionMethod(null);

    try {
      const locationData = await getUserLocation();
      const formattedLocation = formatLocation(locationData);
      
      if (formattedLocation && validateLocation(formattedLocation)) {
        setLocation(formattedLocation);
        onLocationDetected(formattedLocation);
        
        // Determine detection method
        if (locationData.latitude && locationData.longitude) {
          setDetectionMethod('gps');
        } else {
          setDetectionMethod('ip');
        }
        
        toast({
          title: 'Location detected!',
          description: `Found: ${formattedLocation}`,
        });
      } else {
        throw new Error('Could not format location data');
      }
      
    } catch (error: any) {
      console.error('Location detection error:', error);
      
      let errorMessage = 'Failed to detect location. Please try again or enter manually.';
      
      if (error.code === 1) {
        errorMessage = 'Location access denied. Please allow location access in your browser settings.';
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable. Please try again or enter manually.';
      } else if (error.code === 3) {
        errorMessage = 'Location request timed out. Please try again.';
      }
      
      toast({
        title: 'Location detection failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsDetecting(false);
    }
  };

  // Handle manual location input
  const handleLocationChange = (value: string) => {
    setLocation(value);
    setDetectionMethod('manual');
    onLocationDetected(value);
  };

  // Auto-detect on component mount (optional)
  useEffect(() => {
    if (autoDetectOnMount && !hasAutoDetected) {
      setHasAutoDetected(true);
      detectLocation();
    }
  }, [autoDetectOnMount, hasAutoDetected]);

  // Update location when initialValue changes
  useEffect(() => {
    if (initialValue && initialValue !== location) {
      setLocation(initialValue);
      setDetectionMethod('manual');
    }
  }, [initialValue, location]);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor="location">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={detectLocation}
          disabled={isDetecting}
          className="flex items-center gap-2"
        >
          {isDetecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Detecting...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              Auto-detect
            </>
          )}
        </Button>
      </div>
      
      <div className="relative">
        <Input
          id="location"
          value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        {location && !isDetecting && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocation('');
              onLocationDetected('');
              setDetectionMethod(null);
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {detectionMethod === 'manual' && location && (
        <p className="text-sm text-gray-500">
          Location entered manually
        </p>
      )}
      
      {detectionMethod === 'gps' && location && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          Location detected via GPS
        </p>
      )}
      
      {detectionMethod === 'ip' && location && (
        <p className="text-sm text-blue-600 flex items-center gap-1">
          <Globe className="h-3 w-3" />
          Location detected via IP address
        </p>
      )}
    </div>
  );
}
