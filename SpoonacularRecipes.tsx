import React, { useState } from 'react';
import { ArrowLeft, Search, ChefHat, Clock, Users, Sparkles, ExternalLink } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { BottomNav } from './BottomNav';
import { Button } from './ui/button';

// DYlan did this - Spoonacular recipe search component

interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: Array<{ name: string }>;
  usedIngredients: Array<{ name: string }>;
}

interface DetailedRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  summary: string;
  instructions: string;
  extendedIngredients: Array<{ original: string }>;
  nutrition?: {
    nutrients: Array<{ name: string; amount: number; unit: string }>;
  };
}

interface SpoonacularRecipesProps {
  onBack: () => void;
  onSettingsClick?: () => void;
  onMapClick?: () => void;
  onHomeClick?: () => void;
}

export function SpoonacularRecipes({ onBack, onSettingsClick, onMapClick, onHomeClick }: SpoonacularRecipesProps) {
  const [ingredientInput, setIngredientInput] = useState('');
  const [recipes, setRecipes] = useState<SpoonacularRecipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<DetailedRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState('');

  const searchRecipes = async () => {
    if (!ingredientInput.trim()) {
      setError('Please enter some ingredients');
      return;
    }

    setLoading(true);
    setError('');
    setRecipes([]);
    setSelectedRecipe(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d598bb36/spoonacular/search-by-ingredients`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ingredients: ingredientInput,
            number: 6,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search recipes');
      }

      const data = await response.json();
      setRecipes(data.recipes);
    } catch (err) {
      console.error('Error searching recipes:', err);
      setError('Failed to search recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRecipeDetails = async (recipeId: number) => {
    setLoadingDetails(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d598bb36/spoonacular/recipe/${recipeId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get recipe details');
      }

      const data = await response.json();
      setSelectedRecipe(data.recipe);
    } catch (err) {
      console.error('Error getting recipe details:', err);
      setError('Failed to load recipe details.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchRecipes();
    }
  };

  return (
    <div className="h-screen w-screen max-w-[393px] mx-auto bg-gradient-to-b from-orange-50 to-white flex flex-col overflow-hidden">
      {/* iOS Safe Area Top */}
      <div className="h-14 bg-white flex items-center px-4">
        <button
          onClick={selectedRecipe ? () => setSelectedRecipe(null) : onBack}
          className="flex items-center gap-2 text-blue-500 active:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {selectedRecipe ? 'Back to Results' : 'Home'}
        </button>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-5 py-6">
        <div className="flex items-center gap-3 mb-2">
          <ChefHat className="w-8 h-8 text-white" />
          <h1 className="text-white">Find Recipes</h1>
        </div>
        <p className="text-white/90">Search by ingredients you have</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* Recipe Details View */}
        {selectedRecipe ? (
          <div className="space-y-4">
            {loadingDetails ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
              </div>
            ) : (
              <>
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h2 className="text-gray-900 mb-3">{selectedRecipe.title}</h2>
                    
                    <div className="flex gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{selectedRecipe.readyInMinutes} min</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{selectedRecipe.servings} servings</span>
                      </div>
                    </div>

                    {/* Nutrition */}
                    {selectedRecipe.nutrition && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                        <h4 className="text-green-900 mb-2">Nutrition per Serving</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {selectedRecipe.nutrition.nutrients.slice(0, 6).map((nutrient) => (
                            <div key={nutrient.name} className="flex justify-between">
                              <span className="text-green-800">{nutrient.name}:</span>
                              <span className="text-green-900">
                                {Math.round(nutrient.amount)}{nutrient.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <h3 className="text-gray-900 mb-2">Ingredients</h3>
                      <div className="space-y-2">
                        {selectedRecipe.extendedIngredients.map((ingredient, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                            <span className="text-gray-700">{ingredient.original}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedRecipe.sourceUrl && (
                      <Button
                        onClick={() => window.open(selectedRecipe.sourceUrl, '_blank')}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Full Recipe
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-gray-900 mb-1">Search by Ingredients</h3>
                  <p className="text-gray-600 text-sm">Enter ingredients separated by commas (e.g., rice, beans, chicken)</p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="rice, beans, eggs..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Button
                  onClick={searchRecipes}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Find Recipes
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 mb-4">
                {error}
              </div>
            )}

            {/* Recipe Results */}
            {recipes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-orange-600" />
                  <h3 className="text-gray-900">Found {recipes.length} Recipes</h3>
                </div>

                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => getRecipeDetails(recipe.id)}
                    className="bg-white rounded-2xl shadow-md overflow-hidden active:scale-95 transition-transform cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-24 h-24 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 p-3">
                        <h4 className="text-gray-900 mb-2 line-clamp-2">{recipe.title}</h4>
                        <div className="flex gap-3 text-sm">
                          <span className="text-green-600">
                            ✓ {recipe.usedIngredientCount} match
                          </span>
                          <span className="text-orange-600">
                            + {recipe.missedIngredientCount} more
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-blue-900 mb-1">Powered by Spoonacular</h4>
                  <p className="text-blue-700 text-sm">Get real recipes from a database of over 380,000 recipes with detailed nutrition information.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        currentScreen="recipes" 
        onNavigate={(screen) => {
          if (screen === 'recipes') return;
          if (screen === 'home') onHomeClick?.();
          if (screen === 'map') onMapClick?.();
          if (screen === 'settings') onSettingsClick?.();
        }} 
      />

      {/* iOS Safe Area Bottom */}
      <div className="h-8 bg-white" />
    </div>
  );
}