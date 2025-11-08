//iMPORTED FROM FIGMA DESIGN 
import React, { useState } from 'react';
import { ArrowLeft, Bell, BellRing, Clock, MapPin, ChefHat, Star } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface NotificationSettingsProps {
  onBack: () => void;
}

export function NotificationSettings({ onBack }: NotificationSettingsProps) {
  const [notifications, setNotifications] = useState({
    all: true,
    newLocations: true,
    dailyRecipes: true,
    hoursChange: true,
    nearbyEvents: false,
    specialOffers: true,
    reminders: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    if (key === 'all') {
      const newValue = !notifications.all;
      setNotifications({
        all: newValue,
        newLocations: newValue,
        dailyRecipes: newValue,
        hoursChange: newValue,
        nearbyEvents: newValue,
        specialOffers: newValue,
        reminders: newValue,
      });
    } else {
      setNotifications(prev => {
        const updated = { ...prev, [key]: !prev[key] };
        // Check if all are enabled to enable master toggle
        const allEnabled = Object.entries(updated)
          .filter(([k]) => k !== 'all')
          .every(([, v]) => v);
        return { ...updated, all: allEnabled };
      });
    }
  };

  const notificationItems = [
    {
      key: 'newLocations',
      icon: <MapPin className="w-5 h-5" />,
      color: 'bg-green-500',
      title: 'New Locations',
      description: 'When new food locations are added near you',
    },
    {
      key: 'dailyRecipes',
      icon: <ChefHat className="w-5 h-5" />,
      color: 'bg-orange-500',
      title: 'Daily Recipes',
      description: 'Fresh recipe ideas every morning',
    },
    {
      key: 'hoursChange',
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-blue-500',
      title: 'Hours Changes',
      description: 'When location hours are updated',
    },
    {
      key: 'nearbyEvents',
      icon: <Star className="w-5 h-5" />,
      color: 'bg-purple-500',
      title: 'Nearby Events',
      description: 'Food distribution events in your area',
    },
    {
      key: 'specialOffers',
      icon: <BellRing className="w-5 h-5" />,
      color: 'bg-red-500',
      title: 'Special Offers',
      description: 'Exclusive deals and promotions',
    },
    {
      key: 'reminders',
      icon: <Bell className="w-5 h-5" />,
      color: 'bg-yellow-500',
      title: 'Reminders',
      description: 'Scheduled reminders for pickups',
    },
  ];

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
          <h1 className="text-gray-800 mb-1">Notifications</h1>
          <p className="text-gray-600">Manage your alert preferences</p>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Master Toggle */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-md p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white">All Notifications</h3>
                <p className="text-white/80">Master control for all alerts</p>
              </div>
            </div>
            <Switch
              checked={notifications.all}
              onCheckedChange={() => toggleNotification('all')}
              className="data-[state=checked]:bg-white"
            />
          </div>
        </div>

        {/* Individual Notification Settings */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          {notificationItems.map((item, index) => (
            <div
              key={item.key}
              className={`p-4 ${index !== notificationItems.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`${item.color} p-2 rounded-xl text-white flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="text-gray-900 block">{item.title}</Label>
                    <p className="text-gray-500">{item.description}</p>
                  </div>
                </div>
                <Switch
                  checked={notifications[item.key as keyof typeof notifications] as boolean}
                  onCheckedChange={() => toggleNotification(item.key as keyof typeof notifications)}
                  disabled={!notifications.all}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quiet Hours */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="text-gray-900 mb-3">Quiet Hours</h3>
          <p className="text-gray-600 mb-4">Disable notifications during specific times</p>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label className="text-gray-700 mb-2 block">From</Label>
              <input
                type="time"
                defaultValue="22:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <Label className="text-gray-700 mb-2 block">To</Label>
              <input
                type="time"
                defaultValue="08:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* iOS Safe Area Bottom */}
      <div className="h-8 bg-gray-50" />
    </div>
  );
}
