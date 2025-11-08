import React, { useState } from 'react';
import Icon from '../imports/Icon';
import { User, Heart, MapPin, Bell, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { AccountSettings } from './AccountSettings';
import { FoodPreferences } from './FoodPreferences';
import { LocationSettings } from './LocationSettings';
import { NotificationSettings } from './NotificationSettings';
import { HelpInfo } from './HelpInfo';
import { BottomNav } from './BottomNav';

interface NavigationItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface SettingsScreenProps {
  userName?: string;
  userEmail?: string;
  onBack: () => void;
  onLogout: () => void;
  onHomeClick?: () => void;
  onMapClick?: () => void;
}

type SettingsPage = 'main' | 'account' | 'food-preference' | 'location' | 'notifications' | 'help';

export function SettingsScreen({ userName, userEmail, onBack, onLogout, onHomeClick, onMapClick }: SettingsScreenProps) {
  const [currentPage, setCurrentPage] = useState<SettingsPage>('main');

  const navigationItems: NavigationItem[] = [
    {
      id: 'account',
      title: 'Account',
      description: 'Manage your settings',
      icon: <User className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'food-preference',
      title: 'Food Preference',
      description: 'Dietary settings, allergies, favorites',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-red-500'
    },
    {
      id: 'location',
      title: 'Location',
      description: 'Set default, delivery options, nearby options',
      icon: <MapPin className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage your alerts',
      icon: <Bell className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 'help',
      title: 'Help and Info',
      description: 'About app, privacy policy',
      icon: <HelpCircle className="w-6 h-6" />,
      color: 'bg-orange-500'
    }
  ];

  const handleNavigation = (id: string) => {
    setCurrentPage(id as SettingsPage);
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
  };

  // Render sub-pages
  if (currentPage === 'account') {
    return <AccountSettings userName={userName} userEmail={userEmail} onBack={handleBackToMain} onLogout={onLogout} />;
  }
  if (currentPage === 'food-preference') {
    return <FoodPreferences onBack={handleBackToMain} />;
  }
  if (currentPage === 'location') {
    return <LocationSettings onBack={handleBackToMain} />;
  }
  if (currentPage === 'notifications') {
    return <NotificationSettings onBack={handleBackToMain} />;
  }
  if (currentPage === 'help') {
    return <HelpInfo onBack={handleBackToMain} />;
  }

  return (
    <div className="h-screen w-screen max-w-[393px] mx-auto bg-gray-50 flex flex-col overflow-hidden">
      {/* iOS Safe Area Top with Back Button */}
      <div className="h-14 bg-white flex items-center px-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-500 active:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Home
        </button>
      </div>
      
      {/* Header with Logo */}
      <div className="bg-white pb-6">
        <div className="px-5 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 flex items-center justify-center">
              <Icon />
            </div>
          </div>
          <h1 className="text-gray-800 mb-1">Settings</h1>
          <p className="text-gray-600">Manage your preferences</p>
        </div>
      </div>

      {/* Navigation Cards - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-2.5 pb-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className="w-full bg-white rounded-2xl shadow-sm active:scale-[0.98] active:bg-gray-50 transition-transform p-4 flex items-center gap-3.5"
            >
              {/* Icon */}
              <div className={`${item.color} rounded-xl p-2.5 text-white flex-shrink-0`}>
                {item.icon}
              </div>
              
              {/* Text Content */}
              <div className="flex-1 text-left min-w-0">
                <h3 className="text-gray-900 mb-0.5 truncate">{item.title}</h3>
                <p className="text-gray-500 truncate">{item.description}</p>
              </div>
              
              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 pb-2">
          <p>Food 4 All v1.0.0</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        currentScreen="settings" 
        onNavigate={(screen) => {
          if (screen === 'settings') return;
          if (screen === 'home') onHomeClick?.();
          if (screen === 'map') onMapClick?.();
          if (screen === 'recipes') onHomeClick?.();
        }} 
      />

      {/* iOS Safe Area Bottom */}
      <div className="h-8 bg-gray-50" />
    </div>
  );
}