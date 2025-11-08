import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Upload, Sparkles, ChefHat, X, Loader2, Apple } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { BottomNav } from './BottomNav';
import { Button } from './ui/button';

interface IdentifiedIngredient {
  name: string;
  confidence: string;
}

interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
}

// DYlan did this - Nutrition info from USDA
interface NutritionInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface CameraRecipesProps {
  onBack: () => void;
  onSettingsClick?: () => void;
  onMapClick?: () => void;
  onHomeClick?: () => void;
  onRecipesClick?: () => void;
}

export function CameraRecipes({ onBack, onSettingsClick, onMapClick, onHomeClick }: CameraRecipesProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [identifiedIngredients, setIdentifiedIngredients] = useState<IdentifiedIngredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [demoMessage, setDemoMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [nutritionInfo, setNutritionInfo] = useState<{ [key: string]: NutritionInfo }>({});
  const [loadingNutrition, setLoadingNutrition] = useState<{ [key: string]: boolean }>({});
  
  // DYlan did this - Get nutrition for ingredient
  const fetchNutrition = async (ingredientName: string) => {
    setLoadingNutrition(prev => ({ ...prev, [ingredientName]: true }));
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d598bb36/nutrition/search`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ingredient: ingredientName }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch nutrition data');
      }

      const data = await response.json();
      setNutritionInfo(prev => ({ ...prev, [ingredientName]: data.nutrition }));
    } catch (err) {
      console.error('Error fetching nutrition:', err);
    } finally {
      setLoadingNutrition(prev => ({ ...prev, [ingredientName]: false }));
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setError('');
      setIdentifiedIngredients([]);
      setRecipes([]);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setAnalyzing(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d598bb36/recipes/analyze-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            image: selectedImage,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        
        // DYlan did this - Better error messages for content moderation
        if (errorData.moderationReason) {
          const reasonMessages: { [key: string]: string } = {
            'adult_content': '⚠️ This image contains inappropriate content and cannot be processed.',
            'weapons': '⚠️ This image appears to contain weapons and cannot be processed.',
            'substances': '⚠️ This image contains alcohol or drugs and cannot be processed.',
            'offensive': '⚠️ This image contains offensive content and cannot be processed.'
          };
          throw new Error(reasonMessages[errorData.moderationReason] || errorData.error);
        }
        
        throw new Error(errorData.error || 'Failed to analyze image');
      }

      const data = await response.json();
      setIdentifiedIngredients(data.ingredients);
      setRecipes(data.recipes);
      setIsDemo(data.demo || false);
      setDemoMessage(data.message || '');
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const resetImage = () => {
    setSelectedImage(null);
    setIdentifiedIngredients([]);
    setRecipes([]);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="h-screen w-screen max-w-[393px] mx-auto bg-gradient-to-b from-orange-50 to-white flex flex-col overflow-hidden">
      {/* iOS Safe Area Top */}
      <div className="h-14 bg-white flex items-center px-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-500 active:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Recipes
        </button>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 px-5 py-6">
        <div className="flex items-center gap-3 mb-2">
          <Camera className="w-8 h-8 text-white" />
          <h1 className="text-white">Scan Your Food</h1>
        </div>
        <p className="text-white/90">Take a photo and get personalized recipes</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* Upload Section */}
        {!selectedImage && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-gray-900 mb-1">How it works</h3>
                  <p className="text-gray-600">Take a photo of your ingredients and our AI will identify them and suggest delicious recipes you can make!</p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-6 rounded-xl flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Take Photo
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-gray-500">or</span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full py-6 rounded-xl flex items-center justify-center gap-2 border-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <Upload className="w-5 h-5" />
                  Upload from Gallery
                </Button>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <h4 className="text-blue-900 mb-2">📸 Photo Tips</h4>
              <ul className="text-blue-700 space-y-1.5 text-sm">
                <li>• Use good lighting</li>
                <li>• Keep ingredients visible and clear</li>
                <li>• Include all items you want identified</li>
              </ul>
            </div>
          </div>
        )}

        {/* Image Preview & Analysis */}
        {selectedImage && (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected food"
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={resetImage}
                  className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-lg active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {!analyzing && identifiedIngredients.length === 0 && (
                <div className="p-5">
                  <Button
                    onClick={analyzeImage}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 rounded-xl"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analyze Ingredients
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Loading State */}
            {analyzing && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex flex-col items-center justify-center py-6">
                  <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-3" />
                  <h3 className="text-gray-900 mb-2">Analyzing your food...</h3>
                  <p className="text-gray-600 text-center">Our AI is identifying ingredients and creating recipes</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600">
                {error}
              </div>
            )}

            {/* Identified Ingredients */}
            {identifiedIngredients.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-gray-900">Identified Ingredients</h3>
                </div>
                <div className="space-y-3">
                  {identifiedIngredients.map((ingredient, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between bg-purple-50 rounded-xl p-3">
                        <span className="text-gray-900">{ingredient.name}</span>
                        <span className="text-purple-600">{ingredient.confidence}</span>
                      </div>
                      
                      {/* DYlan did this - Nutrition button for each ingredient */}
                      <button
                        onClick={() => fetchNutrition(ingredient.name)}
                        disabled={loadingNutrition[ingredient.name]}
                        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg active:scale-95 transition-all disabled:opacity-50 text-sm"
                      >
                        <Apple className={`w-4 h-4 ${loadingNutrition[ingredient.name] ? 'animate-pulse' : ''}`} />
                        {loadingNutrition[ingredient.name] ? 'Loading...' : 'View Nutrition'}
                      </button>
                      
                      {/* DYlan did this - Show nutrition if loaded */}
                      {nutritionInfo[ingredient.name] && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <h5 className="text-green-900 mb-2 text-sm flex items-center gap-1">
                            <Apple className="w-4 h-4" />
                            {nutritionInfo[ingredient.name].name} (per 100g)
                          </h5>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-green-800">Calories:</span>
                              <span className="text-green-900">{Math.round(nutritionInfo[ingredient.name].calories)} kcal</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-800">Protein:</span>
                              <span className="text-green-900">{nutritionInfo[ingredient.name].protein.toFixed(1)}g</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-800">Carbs:</span>
                              <span className="text-green-900">{nutritionInfo[ingredient.name].carbs.toFixed(1)}g</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-800">Fat:</span>
                              <span className="text-green-900">{nutritionInfo[ingredient.name].fat.toFixed(1)}g</span>
                            </div>
                          </div>
                          <p className="text-green-700 mt-2 text-xs">Source: USDA</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Recipes */}
            {recipes.length > 0 && (
              <div className="space-y-4">
                {/* Demo Message */}
                {isDemo && demoMessage && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <div className="flex gap-3">
                      <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-900">{demoMessage}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-purple-600" />
                  <h3 className="text-gray-900">Recipe Suggestions</h3>
                </div>

                {recipes.map((recipe, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-5">
                      <h2 className="text-white">{recipe.name}</h2>
                      <p className="text-white/90 mt-1">{recipe.prepTime}</p>
                    </div>

                    <div className="p-5 space-y-4">
                      <p className="text-gray-700">{recipe.description}</p>

                      <div>
                        <h4 className="text-gray-900 mb-2">Ingredients</h4>
                        <div className="space-y-1.5">
                          {recipe.ingredients.map((ingredient, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0" />
                              <span className="text-gray-700">{ingredient}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-gray-900 mb-2">Instructions</h4>
                        <ol className="space-y-2">
                          {recipe.instructions.map((instruction, idx) => (
                            <li key={idx} className="flex gap-3">
                              <span className="text-purple-600 flex-shrink-0">{idx + 1}.</span>
                              <span className="text-gray-700">{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={resetImage}
                  variant="outline"
                  className="w-full py-4 rounded-xl border-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  Scan Another Photo
                </Button>
              </div>
            )}
          </div>
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