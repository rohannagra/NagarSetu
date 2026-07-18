import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  accuracy: number | null;
}

export const useGeolocation = (watch: boolean = false) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
    accuracy: null,
  });

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by your browser',
        loading: false,
        accuracy: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    console.log('🌍 Requesting geolocation with high accuracy...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
        
        console.log('📍 ===== GEOLOCATION RESULT =====');
        console.log('✅ Latitude:', latitude);
        console.log('✅ Longitude:', longitude);
        console.log('📏 Accuracy:', accuracy, 'meters');
        console.log('🏔️ Altitude:', altitude, 'meters');
        console.log('📐 Altitude Accuracy:', altitudeAccuracy, 'meters');
        console.log('🧭 Heading:', heading, 'degrees');
        console.log('🚀 Speed:', speed, 'm/s');
        console.log('⏰ Timestamp:', new Date(position.timestamp).toLocaleString());
        console.log('🗺️ Google Maps Link:', `https://www.google.com/maps?q=${latitude},${longitude}`);
        console.log('================================');

        // Warn if accuracy is poor
        if (accuracy > 100) {
          console.warn('⚠️ WARNING: Location accuracy is poor (>' + accuracy + ' meters)');
          console.warn('💡 TIP: Enable GPS and move to an open area for better accuracy');
        } else if (accuracy > 50) {
          console.warn('⚠️ Location accuracy is moderate (' + accuracy + ' meters)');
        } else {
          console.log('✅ Location accuracy is good (' + accuracy + ' meters)');
        }

        setState({
          latitude,
          longitude,
          error: null,
          loading: false,
          accuracy,
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        
        console.error('❌ ===== GEOLOCATION ERROR =====');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please allow location access.';
            console.error('🚫 User denied location permission');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Check GPS/network.';
            console.error('📡 Position unavailable - GPS/network issue');
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            console.error('⏱️ Geolocation request timeout');
            break;
          default:
            console.error('❓ Unknown geolocation error');
        }
        console.error('================================');

        setState({
          latitude: null,
          longitude: null,
          error: errorMessage,
          loading: false,
          accuracy: null,
        });
      },
      {
        enableHighAccuracy: true,  // Use GPS for best accuracy
        timeout: 15000,            // 15 seconds timeout
        maximumAge: 0,             // Don't use cached position
      }
    );
  };

  useEffect(() => {
    if (watch) {
      getCurrentPosition();
    }
  }, [watch]);

  return {
    ...state,
    getCurrentPosition,
  };
};
