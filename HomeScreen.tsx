//IMported from Figma design 
import React from 'react';
import Icon from '../imports/Icon';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, Heart, Clock, Search, Settings, Sparkles, TrendingUp, ChefHat, Map, Camera } from 'lucide-react';
import { BottomNav } from './BottomNav';

interface HomeScreenProps {
  userName?: string;
  onSettingsClick: () => void;
  onRecipesClick: () => void;
  onMapClick: () => void;
  onSavedPlacesClick: () => void;
  onCameraRecipesClick?: () => void;
  onSpoonacularRecipesClick?: () => void;
}

export function HomeScreen({ userName, onSettingsClick, onRecipesClick, onMapClick, onSavedPlacesClick, onCameraRecipesClick, onSpoonacularRecipesClick }: HomeScreenProps) {
  const quickActions = [
    { id: 'map', label: 'Map View', icon: <Map className="w-5 h-5" />, color: 'from-blue-500 to-blue-600', onClick: onMapClick },
    { id: 'recipes', label: 'Find Recipes', icon: <ChefHat className="w-5 h-5" />, color: 'from-orange-500 to-orange-600', onClick: onRecipesClick },
    { id: 'camera', label: 'Scan Food', icon: <Camera className="w-5 h-5" />, color: 'from-purple-500 to-purple-600', onClick: onCameraRecipesClick },
    { id: 'saved', label: 'Saved Places', icon: <Heart className="w-5 h-5" />, color: 'from-pink-500 to-pink-600', onClick: onSavedPlacesClick },
  ];

  const featuredLocations = [
    { name: 'Community Food Bank', distance: '0.5 mi', open: true, type: 'Food Bank' },
    { name: 'Fresh Harvest Market', distance: '1.2 mi', open: true, type: 'Farmers Market' },
    { name: 'Hope Kitchen', distance: '2.1 mi', open: false, type: 'Food Pantry' },
  ];

  return (
    <div className="h-screen w-screen max-w-[393px] mx-auto bg-gradient-to-b from-red-50 to-white flex flex-col overflow-hidden">
      {/* iOS Safe Area Top */}
      <div className="h-14" />
      
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12">
              <Icon />
            </div>
            <div>
              <p className="text-gray-600">Welcome back,</p>
              <h2 className="text-gray-900">{userName || 'Friend'}!</h2>
            </div>
          </div>
          <button 
            onClick={onSettingsClick}
            className="p-2 bg-white rounded-xl shadow-sm active:scale-95 transition-transform"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {/* Hero Card */}
        <div className="relative bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-lg overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <p className="text-white/90">New Features Available</p>
            </div>
            <h3 className="text-white mb-3">Discover Fresh Food Near You</h3>
            <p className="text-white/90 mb-4">Access hundreds of food assistance locations in your community</p>
            <button 
              onClick={onMapClick}
              className="bg-white text-red-600 px-6 py-3 rounded-xl active:scale-95 transition-transform flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Explore Now
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className="bg-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform flex flex-col items-center gap-2"
              >
                <div className={`bg-gradient-to-br ${action.color} p-3 rounded-xl text-white`}>
                  {action.icon}
                </div>
                <p className="text-gray-700 text-center">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 mb-6 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-white" />
            <p className="text-white/90">Your Impact</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-white text-3xl mb-1">12</p>
              <p className="text-white/80">Visits This Month</p>
            </div>
            <div>
              <p className="text-white text-3xl mb-1">5</p>
              <p className="text-white/80">Saved Locations</p>
            </div>
          </div>
        </div>

        {/* Featured Locations */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Nearby Locations</h3>
            <button className="text-blue-500 active:text-blue-600 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {featuredLocations.map((location, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 shadow-sm active:scale-98 transition-transform"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">{location.name}</h4>
                    <p className="text-gray-500">{location.type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-white ${location.open ? 'bg-green-500' : 'bg-gray-400'}`}>
                    {location.open ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{location.distance}</span>
                  </div>
                  <button 
                    onClick={onMapClick}
                    className="text-blue-500 active:text-blue-600 transition-colors"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Banner */}
        <div className="rounded-2xl overflow-hidden shadow-md mb-4">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1631067776332-4f2d55453125?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHZlZ2V0YWJsZXMlMjBtYXJrZXR8ZW58MXx8fHwxNzYxNjMzMzI3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Fresh vegetables"
            className="w-full h-32 object-cover"
          />
          <div className="bg-white p-4">
            <h4 className="text-gray-900 mb-1">Fresh & Nutritious</h4>
            <p className="text-gray-600">Access quality food assistance in your area</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        currentScreen="home" 
        onNavigate={(screen) => {
          if (screen === 'home') return;
          if (screen === 'map') onMapClick();
          if (screen === 'recipes') onRecipesClick();
          if (screen === 'settings') onSettingsClick();
        }} 
      />

      {/* iOS Safe Area Bottom */}
      <div className="h-8 bg-white" />
    </div>
  );
}