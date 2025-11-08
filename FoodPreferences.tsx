//Imported from figma 
import React, { useState } from 'react';
import { ArrowLeft, Heart, Plus, X } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface FoodPreferencesProps {
  onBack: () => void;
}

export function FoodPreferences({ onBack }: FoodPreferencesProps) {
  const [dietaryRestrictions, setDietaryRestrictions] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
    halal: false,
    kosher: false,
  });

  const [allergies, setAllergies] = useState<string[]>(['Peanuts', 'Shellfish']);
  const [newAllergy, setNewAllergy] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['Italian', 'Mexican', 'Asian']);
  const [newFavorite, setNewFavorite] = useState('');

  const toggleRestriction = (key: keyof typeof dietaryRestrictions) => {
    setDietaryRestrictions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const addFavorite = () => {
    if (newFavorite.trim()) {
      setFavorites([...favorites, newFavorite.trim()]);
      setNewFavorite('');
    }
  };

  const removeFavorite = (index: number) => {
    setFavorites(favorites.filter((_, i) => i !== index));
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
          <h1 className="text-gray-800 mb-1">Food Preferences</h1>
          <p className="text-gray-600">Customize your dietary needs</p>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Dietary Restrictions */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Dietary Restrictions
          </h3>
          
          <div className="space-y-3">
            {Object.entries(dietaryRestrictions).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <Label className="text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Switch
                  checked={value}
                  onCheckedChange={() => toggleRestriction(key as keyof typeof dietaryRestrictions)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-gray-900 mb-4">Food Allergies</h3>
          
          <div className="mb-3 flex gap-2">
            <Input
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Add an allergy"
              onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
              className="flex-1"
            />
            <button
              onClick={addAllergy}
              className="p-2 bg-blue-500 text-white rounded-lg active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {allergies.map((allergy, index) => (
              <Badge key={index} variant="destructive" className="pl-3 pr-1 py-1.5 flex items-center gap-1">
                {allergy}
                <button
                  onClick={() => removeAllergy(index)}
                  className="ml-1 hover:bg-red-700 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {allergies.length === 0 && (
              <p className="text-gray-500">No allergies added</p>
            )}
          </div>
        </div>

        {/* Favorite Cuisines */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-gray-900 mb-4">Favorite Cuisines</h3>
          
          <div className="mb-3 flex gap-2">
            <Input
              value={newFavorite}
              onChange={(e) => setNewFavorite(e.target.value)}
              placeholder="Add a favorite cuisine"
              onKeyPress={(e) => e.key === 'Enter' && addFavorite()}
              className="flex-1"
            />
            <button
              onClick={addFavorite}
              className="p-2 bg-blue-500 text-white rounded-lg active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {favorites.map((favorite, index) => (
              <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1.5 flex items-center gap-1">
                {favorite}
                <button
                  onClick={() => removeFavorite(index)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {favorites.length === 0 && (
              <p className="text-gray-500">No favorites added</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors text-white py-4 px-4 rounded-xl">
          Save Preferences
        </button>
      </div>

      {/* iOS Safe Area Bottom */}
      <div className="h-8 bg-gray-50" />
    </div>
  );
}
