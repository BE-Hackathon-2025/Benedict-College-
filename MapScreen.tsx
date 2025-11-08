import React, { useRef, useState, useEffect } from 'react';
import { MapPin, Heart, Clock, Phone, Navigation, X, ChevronLeft, ArrowLeft, AlertCircle } from 'lucide-react';
import { BottomNav } from './BottomNav';

// DYlan did this - Google Maps API Key configuration
const GOOGLE_MAPS_API_KEY = 'AIzaSyCmRo0hAWbPvXLs6orDjsRLLSkjXfthAv0';

interface MapScreenProps {
  onBack: () => void;
  onSettingsClick?: () => void;
  onHomeClick?: () => void;
}

interface FoodLocation {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  address: string;
  open: boolean;
  distance?: string;
  weeklySchedule?: {
    [day: string]: {
      available: string[];
      hours: string;
    };
  };
}

export function MapScreen({ onBack, onSettingsClick, onHomeClick }: MapScreenProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<FoodLocation | null>(null);
  const [showMapView, setShowMapView] = useState(false);
  const [locationError, setLocationError] = useState('');
  const scriptLoadedRef = useRef(false);
  const [showScheduleView, setShowScheduleView] = useState(false);

  // uSED COPIOLT FOR Sample food assistance locations
  const foodLocations: FoodLocation[] = [
    {
      id: 1,
      name: 'Community Food Bank',
      type: 'Food Bank',
      lat: 37.7749,
      lng: -122.4194,
      address: '123 Main St, San Francisco, CA',
      open: true,
      distance: '0.5 mi',
      weeklySchedule: {
        Monday: { available: ['Rice', 'Beans', 'Pasta', 'Canned Vegetables'], hours: '9AM - 5PM' },
        Tuesday: { available: ['Bread', 'Eggs', 'Milk', 'Cheese'], hours: '9AM - 5PM' },
        Wednesday: { available: ['Rice', 'Pasta', 'Canned Soup', 'Cereal'], hours: '9AM - 5PM' },
        Thursday: { available: ['Fresh Produce', 'Potatoes', 'Onions', 'Carrots'], hours: '9AM - 5PM' },
        Friday: { available: ['Beans', 'Rice', 'Pasta', 'Canned Fruit'], hours: '9AM - 5PM' },
        Saturday: { available: ['Bread', 'Eggs', 'Fresh Produce'], hours: '10AM - 3PM' },
        Sunday: { available: [], hours: 'Closed' }
      }
    },
    {
      id: 2,
      name: 'Fresh Harvest Market',
      type: 'Farmers Market',
      lat: 37.7849,
      lng: -122.4094,
      address: '456 Market St, San Francisco, CA',
      open: true,
      distance: '1.2 mi',
      weeklySchedule: {
        Monday: { available: [], hours: 'Closed' },
        Tuesday: { available: [], hours: 'Closed' },
        Wednesday: { available: ['Fresh Vegetables', 'Fruits', 'Herbs'], hours: '8AM - 2PM' },
        Thursday: { available: [], hours: 'Closed' },
        Friday: { available: [], hours: 'Closed' },
        Saturday: { available: ['Fresh Vegetables', 'Fruits', 'Bread', 'Eggs'], hours: '8AM - 3PM' },
        Sunday: { available: ['Fresh Vegetables', 'Fruits'], hours: '9AM - 1PM' }
      }
    },
    {
      id: 3,
      name: 'Hope Kitchen',
      type: 'Food Pantry',
      lat: 37.7649,
      lng: -122.4294,
      address: '789 Hope Ave, San Francisco, CA',
      open: false,
      distance: '2.1 mi',
      weeklySchedule: {
        Monday: { available: ['Pasta', 'Sauce', 'Canned Goods'], hours: '10AM - 4PM' },
        Tuesday: { available: ['Rice', 'Beans', 'Oil'], hours: '10AM - 4PM' },
        Wednesday: { available: ['Bread', 'Peanut Butter', 'Jelly'], hours: '10AM - 4PM' },
        Thursday: { available: ['Pasta', 'Rice', 'Canned Vegetables'], hours: '10AM - 4PM' },
        Friday: { available: ['Fresh Produce', 'Eggs'], hours: '10AM - 4PM' },
        Saturday: { available: [], hours: 'Closed' },
        Sunday: { available: [], hours: 'Closed' }
      }
    },
    {
      id: 4,
      name: 'Nutrition Center',
      type: 'Food Bank',
      lat: 37.7799,
      lng: -122.4144,
      address: '321 Center Blvd, San Francisco, CA',
      open: true,
      distance: '0.8 mi',
      weeklySchedule: {
        Monday: { available: ['Rice', 'Beans', 'Lentils', 'Chickpeas'], hours: '8AM - 6PM' },
        Tuesday: { available: ['Pasta', 'Sauce', 'Canned Tomatoes'], hours: '8AM - 6PM' },
        Wednesday: { available: ['Bread', 'Eggs', 'Milk'], hours: '8AM - 6PM' },
        Thursday: { available: ['Fresh Produce', 'Potatoes', 'Apples'], hours: '8AM - 6PM' },
        Friday: { available: ['Rice', 'Pasta', 'Beans', 'Cereal'], hours: '8AM - 6PM' },
        Saturday: { available: ['Bread', 'Fresh Produce'], hours: '9AM - 2PM' },
        Sunday: { available: [], hours: 'Closed' }
      }
    },
    {
      id: 5,
      name: 'Mission District Food Pantry',
      type: 'Food Pantry',
      lat: 37.7599,
      lng: -122.4148,
      address: '2450 Mission St, San Francisco, CA',
      open: true,
      distance: '1.8 mi',
      weeklySchedule: {
        Monday: { available: ['Tortillas', 'Beans', 'Rice', 'Salsa'], hours: '10AM - 6PM' },
        Tuesday: { available: ['Pasta', 'Bread', 'Canned Goods'], hours: '10AM - 6PM' },
        Wednesday: { available: ['Fresh Produce', 'Eggs', 'Cheese'], hours: '10AM - 6PM' },
        Thursday: { available: ['Rice', 'Beans', 'Oil', 'Spices'], hours: '10AM - 6PM' },
        Friday: { available: ['Bread', 'Milk', 'Eggs', 'Butter'], hours: '10AM - 6PM' },
        Saturday: { available: ['Fresh Produce', 'Tortillas', 'Beans'], hours: '9AM - 3PM' },
        Sunday: { available: [], hours: 'Closed' }
      }
    },
    {
      id: 6,
      name: 'Bayview Community Center',
      type: 'Food Bank',
      lat: 37.7299,
      lng: -122.3965,
      address: '1601 Lane St, San Francisco, CA',
      open: true,
      distance: '3.5 mi',
      weeklySchedule: {
        Monday: { available: ['Rice', 'Pasta', 'Cereal', 'Oatmeal'], hours: '9AM - 5PM' },
        Tuesday: { available: ['Canned Vegetables', 'Soup', 'Beans'], hours: '9AM - 5PM' },
        Wednesday: { available: ['Bread', 'Eggs', 'Milk', 'Yogurt'], hours: '9AM - 5PM' },
        Thursday: { available: ['Fresh Produce', 'Potatoes', 'Onions'], hours: '9AM - 5PM' },
        Friday: { available: ['Rice', 'Beans', 'Pasta', 'Sauce'], hours: '9AM - 5PM' },
        Saturday: { available: ['Bread', 'Fresh Produce', 'Eggs'], hours: '10AM - 2PM' },
        Sunday: { available: [], hours: 'Closed' }
      }
    },
    {
      id: 7,
      name: 'Sunset Food Relief',
      type: 'Food Pantry',
      lat: 37.7599,
      lng: -122.4947,
      address: '1501 Sunset Blvd, San Francisco, CA',
      open: true,
      distance: '4.2 mi',
      weeklySchedule: {
        Monday: { available: ['Pasta', 'Rice', 'Canned Goods'], hours: '11AM - 5PM' },
        Tuesday: { available: ['Bread', 'Cereal', 'Oatmeal'], hours: '11AM - 5PM' },
        Wednesday: { available: ['Fresh Produce', 'Potatoes', 'Carrots'], hours: '11AM - 5PM' },
        Thursday: { available: ['Beans', 'Rice', 'Lentils'], hours: '11AM - 5PM' },
        Friday: { available: ['Eggs', 'Milk', 'Cheese', 'Butter'], hours: '11AM - 5PM' },
        Saturday: { available: [], hours: 'Closed' },
        Sunday: { available: [], hours: 'Closed' }
      }
    },
    {
      id: 8,
      name: 'Richmond Neighborhood Pantry',
      type: 'Food Pantry',
      lat: 37.7799,
      lng: -122.4647,
      address: '601 Balboa St, San Francisco, CA',
      open: false,
      distance: '2.9 mi',
      weeklySchedule: {
        Monday: { available: ['Rice', 'Noodles', 'Soy Sauce'], hours: '10AM - 4PM' },
        Tuesday: { available: ['Fresh Produce', 'Tofu', 'Eggs'], hours: '10AM - 4PM' },
        Wednesday: { available: ['Bread', 'Pasta', 'Sauce'], hours: '10AM - 4PM' },
        Thursday: { available: ['Beans', 'Rice', 'Canned Vegetables'], hours: '10AM - 4PM' },
        Friday: { available: ['Fresh Produce', 'Eggs', 'Milk'], hours: '10AM - 4PM' },
        Saturday: { available: [], hours: 'Closed' },
        Sunday: { available: [], hours: 'Closed' }
      }
    },
    {
      id: 9,
      name: 'Tenderloin Food Access',
      type: 'Food Bank',
      lat: 37.7849,
      lng: -122.4194,
      address: '180 Jones St, San Francisco, CA',
      open: true,
      distance: '1.5 mi',
      weeklySchedule: {
        Monday: { available: ['Rice', 'Beans', 'Pasta', 'Bread'], hours: '8AM - 7PM' },
        Tuesday: { available: ['Canned Soup', 'Vegetables', 'Fruit'], hours: '8AM - 7PM' },
        Wednesday: { available: ['Fresh Produce', 'Eggs', 'Milk'], hours: '8AM - 7PM' },
        Thursday: { available: ['Pasta', 'Sauce', 'Cheese', 'Bread'], hours: '8AM - 7PM' },
        Friday: { available: ['Rice', 'Beans', 'Oil', 'Spices'], hours: '8AM - 7PM' },
        Saturday: { available: ['Bread', 'Fresh Produce', 'Eggs'], hours: '9AM - 4PM' },
        Sunday: { available: ['Bread', 'Milk', 'Eggs'], hours: '10AM - 2PM' }
      }
    },
    {
      id: 10,
      name: 'North Beach Community Kitchen',
      type: 'Food Pantry',
      lat: 37.8004,
      lng: -122.4100,
      address: '541 Columbus Ave, San Francisco, CA',
      open: true,
      distance: '2.3 mi',
      weeklySchedule: {
        Monday: { available: ['Pasta', 'Tomato Sauce', 'Olive Oil'], hours: '10AM - 5PM' },
        Tuesday: { available: ['Bread', 'Cheese', 'Eggs'], hours: '10AM - 5PM' },
        Wednesday: { available: ['Rice', 'Beans', 'Canned Goods'], hours: '10AM - 5PM' },
        Thursday: { available: ['Fresh Produce', 'Potatoes', 'Onions'], hours: '10AM - 5PM' },
        Friday: { available: ['Pasta', 'Bread', 'Fresh Vegetables'], hours: '10AM - 5PM' },
        Saturday: { available: ['Fresh Produce', 'Bread', 'Eggs'], hours: '11AM - 3PM' },
        Sunday: { available: [], hours: 'Closed' }
      }
    },
    {
      id: 11,
      name: 'Potrero Hill Food Share',
      type: 'Food Bank',
      lat: 37.7599,
      lng: -122.3947,
      address: '953 De Haro St, San Francisco, CA',
      open: true,
      distance: '2.7 mi',
      weeklySchedule: {
        Monday: { available: ['Rice', 'Quinoa', 'Lentils', 'Beans'], hours: '9AM - 6PM' },
        Tuesday: { available: ['Fresh Produce', 'Organic Vegetables'], hours: '9AM - 6PM' },
        Wednesday: { available: ['Bread', 'Eggs', 'Milk', 'Yogurt'], hours: '9AM - 6PM' },
        Thursday: { available: ['Pasta', 'Sauce', 'Canned Tomatoes'], hours: '9AM - 6PM' },
        Friday: { available: ['Rice', 'Beans', 'Fresh Produce'], hours: '9AM - 6PM' },
        Saturday: { available: ['Fresh Produce', 'Bread', 'Eggs'], hours: '10AM - 3PM' },
        Sunday: { available: [], hours: 'Closed' }
      }
    },
    {
      id: 12,
      name: 'Haight Community Relief',
      type: 'Food Pantry',
      lat: 37.7699,
      lng: -122.4477,
      address: '1700 Haight St, San Francisco, CA',
      open: true,
      distance: '1.9 mi',
      weeklySchedule: {
        Monday: { available: ['Pasta', 'Rice', 'Beans', 'Cereal'], hours: '11AM - 6PM' },
        Tuesday: { available: ['Bread', 'Peanut Butter', 'Jelly'], hours: '11AM - 6PM' },
        Wednesday: { available: ['Fresh Produce', 'Potatoes', 'Carrots'], hours: '11AM - 6PM' },
        Thursday: { available: ['Canned Soup', 'Vegetables', 'Fruit'], hours: '11AM - 6PM' },
        Friday: { available: ['Rice', 'Pasta', 'Eggs', 'Milk'], hours: '11AM - 6PM' },
        Saturday: { available: ['Bread', 'Fresh Produce'], hours: '12PM - 4PM' },
        Sunday: { available: [], hours: 'Closed' }
      }
    }
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          console.log('User location obtained:', location);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          setLocationError('Unable to get your location. Showing default area.');
          // Default to San Francisco
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
    }
  }, []);

  const loadGoogleMaps = () => {
    if (scriptLoadedRef.current) {
      if (typeof google !== 'undefined' && google.maps) {
        setTimeout(() => initMap(), 100);
      }
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      console.log('Google Maps script already exists in DOM');
      scriptLoadedRef.current = true;
      // Wait for it to load
      const checkLoaded = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps) {
          clearInterval(checkLoaded);
          setTimeout(() => initMap(), 100);
        }
      }, 100);
      return;
    }

    // Get API key from info file
    const apiKey = GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      console.log('Google Maps API key not configured');
      alert('Please configure your Google Maps API key in /utils/supabase/info.tsx\n\nSteps:\n1. Go to console.cloud.google.com/google/maps-apis\n2. Enable "Maps JavaScript API"\n3. Create an API key\n4. Replace YOUR_GOOGLE_MAPS_API_KEY_HERE in info.tsx');
      setShowMapView(false);
      return;
    }

    console.log('Creating Google Maps script element...');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMap`;
    script.async = true;
    script.defer = true;
    
    // Set up callback
    (window as any).initGoogleMap = () => {
      scriptLoadedRef.current = true;
      console.log('Google Maps callback executed, maps ready');
      setTimeout(() => initMap(), 100);
    };
    
    script.onerror = (e) => {
      console.error('Failed to load Google Maps script:', e);
      alert('Failed to load Google Maps.\n\nPlease verify:\n1. Your API key is correct\n2. Maps JavaScript API is enabled\n3. Billing is set up (required by Google)\n4. API key has no restrictions blocking this domain');
      setShowMapView(false);
    };
    
    document.head.appendChild(script);
    console.log('Google Maps script added to DOM');
  };

  useEffect(() => {
    if (showMapView && userLocation) {
      console.log('Map view enabled, checking for Google Maps...');
      if (typeof google !== 'undefined' && google.maps) {
        console.log('Google Maps already loaded');
        // Give the DOM a moment to render the map container
        setTimeout(() => initMap(), 100);
      } else {
        console.log('Loading Google Maps script...');
        loadGoogleMaps();
      }
    }
  }, [showMapView, userLocation]);

  const initMap = () => {
    if (!mapRef.current || !userLocation) {
      console.log('Cannot init map - missing ref or location');
      return;
    }
    
    if (typeof google === 'undefined' || !google.maps) {
      console.error('Google Maps not loaded');
      return;
    }

    try {
      console.log('Initializing map with location:', userLocation);
      
      // Create map without mapId (not needed for legacy markers)
      const newMap = new google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 13,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      setMap(newMap);
      console.log('Map initialized successfully');

      // Add user location marker (using legacy API for compatibility)
      new google.maps.Marker({
        position: userLocation,
        map: newMap,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        title: 'Your Location'
      });

      // Add food location markers
      foodLocations.forEach((location) => {
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: newMap,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: location.open ? '#EF4444' : '#9CA3AF',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
          },
          title: location.name
        });

        marker.addListener('click', () => {
          setSelectedLocation(location);
          newMap.panTo({ lat: location.lat, lng: location.lng });
        });
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      alert('Failed to initialize map. Please check:\n1. Your API key is valid\n2. Billing is enabled on Google Cloud\n3. Maps JavaScript API is enabled\n\nError: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setShowMapView(false);
    }
  };

  const centerOnUser = () => {
    if (map && userLocation) {
      map.panTo(userLocation);
      map.setZoom(15);
    }
  };

  const getDirections = (location: FoodLocation) => {
    const destination = `${location.lat},${location.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
  };

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const getTodayAvailability = (location: FoodLocation) => {
    const today = getCurrentDay();
    return location.weeklySchedule?.[today];
  };

  return (
    <div className="h-screen w-screen max-w-[393px] mx-auto bg-gray-50 flex flex-col overflow-hidden">
      {/* iOS Safe Area Top */}
      <div className="h-14 bg-white flex items-center px-4 shadow-sm z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-500 active:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Home
        </button>
        <h2 className="text-gray-900 ml-4">Food Locations</h2>
      </div>

      {/* Toggle Map/List View */}
      {!showMapView && (
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          <button
            onClick={() => setShowMapView(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Enable Map View
          </button>
          {(!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-900 mb-2">Map requires Google Maps API key</p>
              <p className="text-amber-700">1. Visit console.cloud.google.com/google/maps-apis</p>
              <p className="text-amber-700">2. Enable Maps JavaScript API</p>
              <p className="text-amber-700">3. Create API key with billing enabled</p>
              <p className="text-amber-700">4. Add key to /utils/supabase/info.tsx</p>
            </div>
          )}
        </div>
      )}

      {/* Location Error */}
      {locationError && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="flex items-center gap-2 text-blue-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{locationError}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {showMapView ? (
          <>
            <div ref={mapRef} className="w-full h-full bg-gray-200" style={{ minHeight: '400px' }} />
            
            {/* Center on User Button */}
            {map && (
              <button
                onClick={centerOnUser}
                className="absolute bottom-32 right-4 bg-white rounded-full p-3 shadow-lg active:scale-95 transition-transform"
              >
                <Navigation className="w-6 h-6 text-blue-600" />
              </button>
            )}

            {/* Location Info Card */}
            {selectedLocation && (
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-5 max-h-[70vh] overflow-y-auto">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{selectedLocation.name}</h3>
                    <p className="text-gray-500">{selectedLocation.type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-white ${selectedLocation.open ? 'bg-green-500' : 'bg-gray-400'}`}>
                    {selectedLocation.open ? 'Open' : 'Closed'}
                  </span>
                </div>

                <div className="flex items-start gap-2 mb-4 text-gray-600">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>{selectedLocation.address}</span>
                </div>

                {/* Today's Availability */}
                {getTodayAvailability(selectedLocation) && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-blue-900 mb-2">📅 Today's Availability ({getCurrentDay()})</p>
                    <p className="text-blue-700 mb-2">🕐 {getTodayAvailability(selectedLocation)?.hours}</p>
                    {getTodayAvailability(selectedLocation)?.available.length! > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {getTodayAvailability(selectedLocation)?.available.map((item, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-500 text-white rounded-lg text-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-blue-600">Closed today</p>
                    )}
                  </div>
                )}

                {/* Schedule Toggle */}
                <button
                  onClick={() => setShowScheduleView(!showScheduleView)}
                  className="w-full mb-3 text-blue-600 py-2 rounded-lg border border-blue-300 active:bg-blue-50 transition-colors"
                >
                  {showScheduleView ? '📅 Hide Weekly Schedule' : '📅 View Weekly Schedule'}
                </button>

                {/* Weekly Schedule */}
                {showScheduleView && selectedLocation.weeklySchedule && (
                  <div className="mb-4 space-y-2">
                    {Object.entries(selectedLocation.weeklySchedule).map(([day, schedule]) => (
                      <div 
                        key={day} 
                        className={`p-3 rounded-xl border ${
                          day === getCurrentDay() 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-900">{day}</span>
                          <span className="text-gray-600">{schedule.hours}</span>
                        </div>
                        {schedule.available.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {schedule.available.map((item, idx) => (
                              <span key={idx} className="px-2 py-1 bg-white border border-gray-300 rounded text-sm text-gray-700">
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No items available</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => getDirections(selectedLocation)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </button>
              </div>
            )}
          </>
        ) : (
          // List View
          <div className="h-full overflow-y-auto px-4 py-4">
            <div className="space-y-3 pb-4">
              {foodLocations.map((location) => {
                const todaySchedule = getTodayAvailability(location);
                return (
                  <div
                    key={location.id}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{location.name}</h3>
                        <p className="text-gray-500">{location.type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-white ${location.open ? 'bg-green-500' : 'bg-gray-400'}`}>
                        {location.open ? 'Open' : 'Closed'}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 mb-3 text-gray-600">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>{location.address}</span>
                    </div>

                    {/* Today's Items */}
                    {todaySchedule && todaySchedule.available.length > 0 && (
                      <div className="mb-3 p-2 bg-green-50 rounded-lg">
                        <p className="text-green-900 mb-1">Today: {todaySchedule.hours}</p>
                        <div className="flex flex-wrap gap-1">
                          {todaySchedule.available.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-green-500 text-white rounded text-sm">
                              {item}
                            </span>
                          ))}
                          {todaySchedule.available.length > 3 && (
                            <span className="px-2 py-0.5 text-green-700 text-sm">
                              +{todaySchedule.available.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{location.distance}</span>
                      <button
                        onClick={() => {
                          setSelectedLocation(location);
                          setShowScheduleView(false);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg active:scale-95 transition-all flex items-center gap-2"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        currentScreen="map" 
        onNavigate={(screen) => {
          if (screen === 'map') return;
          if (screen === 'home') onHomeClick?.();
          if (screen === 'recipes') onHomeClick?.();
          if (screen === 'settings') onSettingsClick?.();
        }} 
      />

      {/* iOS Safe Area Bottom */}
      <div className="h-8 bg-gray-50" />
    </div>
  );
}