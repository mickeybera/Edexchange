export interface LocationData {
  city?: string;
  state?: string;
  country?: string;
  formatted?: string;
  latitude?: number;
  longitude?: number;
}

export interface IPLocationData {
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

/**
 * Get location from IP address as a fallback
 */
export async function getLocationFromIP(): Promise<LocationData> {
  try {
    // Using ipapi.co (free tier, no API key required)
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error('Failed to get IP location');
    }
    
    const data: IPLocationData = await response.json();
    
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
}

/**
 * Reverse geocoding using OpenStreetMap Nominatim
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationData> {
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
}

/**
 * Format location data into a readable string
 */
export function formatLocation(locationData: LocationData): string {
  if (locationData.city && locationData.state) {
    return `${locationData.city}, ${locationData.state}`;
  } else if (locationData.city) {
    return locationData.city;
  } else if (locationData.formatted) {
    // Use the first part of the formatted address
    return locationData.formatted.split(',')[0];
  }
  return '';
}

/**
 * Get user's location using multiple methods
 */
export async function getUserLocation(): Promise<LocationData> {
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
}

/**
 * Validate if a location string is reasonable
 */
export function validateLocation(location: string): boolean {
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
}
