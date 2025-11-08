import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MapPin, Navigation, Clock, Star, Trash2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SavedPlacesProps {
  onBack: () => void;
  accessToken?: string;
}

interface FoodLocation {
  id: number;
  name: string;
  type: string;
  address: string;
  open: boolean;
  distance: string;
  hours?: string;
}

export function SavedPlaces({ onBack, accessToken }: SavedPlacesProps) {
  const [savedPlaces, setSavedPlaces] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample locations data from 
  const allLocations: FoodLocation[] = [
    {
      id: 1,
      name: 'Community Food Bank',
      type: 'Food Bank',
      address: '123 Main St, San Francisco, CA',
      open: true,
      distance: '0.5 mi',
      hours: 'Mon-Fri: 9am-5pm'
    },
    {
      id: 2,
      name: 'Fresh Harvest Market',
      type: 'Farmers Market',
      address: '456 Market St, San Francisco, CA',
      open: true,
      distance: '1.2 mi',
      hours: 'Sat-Sun: 8am-2pm'
    },
    {
      id: 3,
      name: 'Hope Kitchen',
      type: 'Food Pantry',
      address: '789 Hope Ave, San Francisco, CA',
      open: false,
      distance: '2.1 mi',
      hours: 'Mon-Wed: 10am-6pm'
    },
    {
      id: 4,
      name: 'Nutrition Center',
      type: 'Food Bank',
      address: '321 Center Blvd, San Francisco, CA',
      open: true,
      distance: '0.8 mi',
      hours: 'Tue-Thu: 9am-4pm'
    }
  ];

  useEffect(() => {
    fetchSavedPlaces();
  }, []);

  const fetchSavedPlaces = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d598bb36/saved-places`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken || publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSavedPlaces(data.savedPlaces || []);
      }
    } catch (err) {
      console.error('Error fetching saved places:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSavePlace = async (locationId: number) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d598bb36/saved-places`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken || publicAnonKey}`,
          },
          body: JSON.stringify({ locationId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSavedPlaces(data.savedPlaces);
      }
    } catch (err) {
      console.error('Error toggling saved place:', err);
    }
  };

  const getDirections = (location: FoodLocation) => {
    const address = encodeURIComponent(location.address);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(url, '_blank');
  };

  const savedLocations = allLocations.filter(loc => savedPlaces.includes(loc.id));

  return (
    <div className="h-screen w-screen max-w-[393px] mx-auto bg-gray-50 flex flex-col overflow-hidden">
      {/* iOS Safe Area Top with Back Button */}
      <div className="h-14 bg-white flex items-center px-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-500 active:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Home
        </button>
      </div>
      
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-500 to-pink-600 px-5 py-6">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-white fill-white" />
          <h1 className="text-white">Saved Places</h1>
        </div>
        <p className="text-white/90">Your favorite food assistance locations</p>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading saved places...</p>
          </div>
        ) : savedLocations.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No Saved Places Yet</h3>
            <p className="text-gray-600 mb-4">Start saving your favorite locations to access them quickly</p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {savedLocations.map((location) => (
              <div
                key={location.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{location.name}</h3>
                      <p className="text-gray-500 mb-1">{location.type}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${location.open ? 'bg-green-500' : 'bg-gray-400'}`}>
                          {location.open ? 'Open' : 'Closed'}
                        </span>
                        <span className="text-gray-500">• {location.distance}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSavePlace(location.id)}
                      className="p-2 text-pink-500 active:scale-95 transition-transform"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-start gap-2 mb-3 text-gray-600 bg-gray-50 rounded-lg p-3">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>{location.address}</span>
                  </div>

                  {location.hours && (
                    <div className="flex items-center gap-2 mb-3 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{location.hours}</span>
                    </div>
                  )}

                  <button
                    onClick={() => getDirections(location)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 mb-4">
          <div className="flex gap-3">
            <Star className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-pink-900 mb-1">Quick Access</h4>
              <p className="text-pink-700">Save locations from the map or home screen by tapping the heart icon to access them here anytime.</p>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Safe Area Bottom */}
      <div className="h-8 bg-gray-50" />
    </div>
  );
}