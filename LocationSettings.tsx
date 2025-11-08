//imported from figma design 
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Navigation, Home, Crosshair } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface LocationSettingsProps {
  onBack: () => void;
}

export function LocationSettings({ onBack }: LocationSettingsProps) {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [autoDetect, setAutoDetect] = useState(true);
  const [searchRadius, setSearchRadius] = useState('5');
  const [savedAddress, setSavedAddress] = useState('123 Main St, Springfield, IL 62701');
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const handleSaveAddress = () => {
    setIsEditingAddress(false);
    // Save address logic
  };

  return (
    <div className="h-screen w-screen max-w-[393px] mx-auto bg-gray-50 flex flex-col overflow-hidden">
      {/* iOS Safe Area Top with Back Button */}
      <div className="h-14 bg-white flex items-center px-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-500 active:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Settings
        </button>
      </div>
      
      {/* Header */}
      <div className="bg-white pb-6 border-b border-gray-100">
        <div className="px-5 pt-4">
          <h1 className="text-gray-800 mb-1">Location Settings</h1>
          <p className="text-gray-600">Manage location preferences</p>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Location Services */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-500" />
            Location Services
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-gray-700">Enable Location</Label>
                <p className="text-gray-500">Allow app to access your location</p>
              </div>
              <Switch
                checked={locationEnabled}
                onCheckedChange={setLocationEnabled}
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <div>
                <Label className="text-gray-700">Auto-Detect Location</Label>
                <p className="text-gray-500">Automatically find nearby resources</p>
              </div>
              <Switch
                checked={autoDetect}
                onCheckedChange={setAutoDetect}
                disabled={!locationEnabled}
              />
            </div>
          </div>
        </div>

        {/* Default Address */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-green-500" />
            Default Address
          </h3>
          
          {isEditingAddress ? (
            <div className="space-y-3">
              <Input
                value={savedAddress}
                onChange={(e) => setSavedAddress(e.target.value)}
                placeholder="Enter your address"
                className="w-full"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveAddress}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg active:scale-95 transition-transform"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingAddress(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg active:scale-95 transition-transform"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-3">{savedAddress}</p>
              <button
                onClick={() => setIsEditingAddress(true)}
                className="w-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors py-3 px-4 rounded-xl text-blue-500"
              >
                Edit Address
              </button>
            </div>
          )}
        </div>

        {/* Search Radius */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-orange-500" />
            Search Radius
          </h3>
          
          <RadioGroup value={searchRadius} onValueChange={setSearchRadius}>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <Label className="text-gray-700">2 miles</Label>
                <RadioGroupItem value="2" />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <Label className="text-gray-700">5 miles</Label>
                <RadioGroupItem value="5" />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <Label className="text-gray-700">10 miles</Label>
                <RadioGroupItem value="10" />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <Label className="text-gray-700">25 miles</Label>
                <RadioGroupItem value="25" />
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Current Location Button */}
        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md">
          <MapPin className="w-5 h-5" />
          Use Current Location
        </button>
      </div>

      {/* iOS Safe Area Bottom */}
      <div className="h-8 bg-gray-50" />
    </div>
  );
}
