import React from 'react';
import { Home, Map, ChefHat, Settings } from 'lucide-react';

interface BottomNavProps {
  currentScreen: 'home' | 'map' | 'recipes' | 'settings';
  onNavigate: (screen: 'home' | 'map' | 'recipes' | 'settings') => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'map' as const, label: 'Map', icon: Map },
    { id: 'recipes' as const, label: 'Recipes', icon: ChefHat },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-full bg-white border-t border-gray-200">
      <div className="max-w-[393px] mx-auto flex items-center justify-around px-2 pt-2 pb-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all active:scale-95 ${
                isActive ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-red-500' : ''}`} />
              <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
