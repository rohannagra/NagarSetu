import express from 'express';
import axios from 'axios';

const router = express.Router();

// Reverse geocoding with multiple providers
const reverseGeocode = async (lat, lng) => {
  console.log('🌐 ===== BACKEND GEOCODING ATTEMPT =====');
  console.log('📍 Received Coordinates:');
  console.log('   Latitude:', lat, '(should be ~23.2 for Bhopal)');
  console.log('   Longitude:', lng, '(should be ~77.4 for Bhopal)');
  console.log('   🗺️ Verify on Google Maps: https://www.google.com/maps?q=' + lat + ',' + lng);
  console.log('=====================================');
  
  // Provider 1: Nominatim (OpenStreetMap) - Primary
  try {
    console.log(`🔄 Trying Nominatim for: ${lat}, ${lng}`);
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`;
    console.log('   URL:', nominatimUrl);
    
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: {
          format: 'json',
          lat: lat,
          lon: lng,
          addressdetails: 1,
          zoom: 18
        },
        headers: {
          'User-Agent': 'Nagar-Setu-App/1.0',
          'Accept-Language': 'en'
        },
        timeout: 10000
      }
    );

    const data = response.data;
    const address = data.address;
    
    console.log('✅ Nominatim Response:', JSON.stringify(data, null, 2));

    if (address) {
      const result = {
        streetNumber: address.house_number || '',
        road: address.road || address.street || address.highway || '',
        suburb: address.suburb || address.neighbourhood || address.residential || '',
        locality: address.city || address.town || address.village || address.municipality || '',
        district: address.state_district || address.county || address.city_district || '',
        state: address.state || '',
        pincode: address.postcode || '',
        landmark: address.landmark || address.amenity || '',
        formattedAddress: data.display_name || ''
      };
      console.log('✅ Parsed Address:', result);
      return result;
    }
  } catch (error) {
    console.log('❌ Nominatim failed:', error.message);
  }

  // Provider 2: LocationIQ (Fallback) - Free tier available
  try {
    console.log(`Trying LocationIQ for: ${lat}, ${lng}`);
    const response = await axios.get(
      'https://us1.locationiq.com/v1/reverse.php',
      {
        params: {
          key: 'pk.0f147952a41c555c5b70614039fd148b', // Free public key for demo
          lat: lat,
          lon: lng,
          format: 'json',
          addressdetails: 1
        },
        timeout: 8000
      }
    );

    const data = response.data;
    const address = data.address;

    if (address) {
      return {
        streetNumber: address.house_number || '',
        road: address.road || address.street || '',
        suburb: address.suburb || address.neighbourhood || '',
        locality: address.city || address.town || address.village || '',
        district: address.state_district || address.county || '',
        state: address.state || '',
        pincode: address.postcode || '',
        landmark: '',
        formattedAddress: data.display_name || ''
      };
    }
  } catch (error) {
    console.log('LocationIQ failed:', error.message);
  }

  // Provider 3: Simple fallback with coordinates
  return {
    streetNumber: '',
    road: '',
    suburb: '',
    locality: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    district: 'Unknown District',
    state: 'Maharashtra',
    pincode: '',
    landmark: '',
    formattedAddress: `Coordinates: ${lat}, ${lng}`
  };
};

// Reverse geocoding endpoint (coordinates to address)
router.get('/reverse', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    console.log('🌍 ===== GEOCODING REQUEST RECEIVED =====');
    console.log('📥 Raw Query Params:', req.query);
    console.log('   lat:', lat);
    console.log('   lng:', lng);
    
    if (!lat || !lng) {
      console.error('❌ Missing coordinates in request');
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    console.log('📊 Parsed Values:');
    console.log('   latitude:', latitude, typeof latitude);
    console.log('   longitude:', longitude, typeof longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.error('❌ Invalid coordinate format');
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      console.error('❌ Coordinates out of valid range');
      console.error('   Valid ranges: lat: -90 to 90, lng: -180 to 180');
      return res.status(400).json({
        success: false,
        message: 'Coordinates out of range'
      });
    }

    console.log('✅ Coordinates validated successfully');
    console.log(`🎯 Geocoding for: ${latitude}, ${longitude}`);
    console.log('   Expected location: Bhopal area should be ~23.2, ~77.4');
    console.log('=========================================');

    // Try geocoding with multiple providers
    const addressData = await reverseGeocode(latitude, longitude);

    const result = {
      success: true,
      data: addressData
    };

    console.log('✅ ===== GEOCODING COMPLETE =====');
    console.log('📍 Result:', result.data.locality, result.data.district);
    console.log('📝 Full Address:', result.data.formattedAddress);
    console.log('=================================');
    
    res.json(result);

  } catch (error) {
    console.error('Geocoding error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch address',
      error: error.message
    });
  }
});

export default router;
