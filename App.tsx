import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { HomeScreen } from './components/HomeScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { MapScreen } from './components/MapScreen';
import { SavedPlaces } from './components/SavedPlaces';
import { CameraRecipes } from './components/CameraRecipes';
import { SpoonacularRecipes } from './components/SpoonacularRecipes';

type Screen = 'login' | 'signup' | 'home' | 'settings' | 'map' | 'saved-places' | 'camera-recipes' | 'spoonacular-recipes';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleLogin = (user: { name: string; email: string }, token?: string) => {
    setUserData(user);
    setAccessToken(token || null);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUserData(null);
    setAccessToken(null);
    setCurrentScreen('login');
  };

  const handleSignUpSuccess = () => {
    // After successful signup, go to login
    setCurrentScreen('login');
  };

  const handleSignUpClick = () => {
    setCurrentScreen('signup');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const handleSettingsClick = () => {
    setCurrentScreen('settings');
  };

  const handleMapClick = () => {
    setCurrentScreen('map');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleSavedPlacesClick = () => {
    setCurrentScreen('saved-places');
  };

  const handleCameraRecipesClick = () => {
    setCurrentScreen('camera-recipes');
  };

  const handleSpoonacularRecipesClick = () => {
    setCurrentScreen('spoonacular-recipes');
  };

  return (
    <>
      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} onSignUpClick={handleSignUpClick} />
      )}
      {currentScreen === 'signup' && (
        <SignUpScreen onSignUpSuccess={handleSignUpSuccess} onBackToLogin={handleBackToLogin} />
      )}
      {currentScreen === 'home' && (
        <HomeScreen 
          userName={userData?.name} 
          onSettingsClick={handleSettingsClick}
          onRecipesClick={handleSpoonacularRecipesClick}
          onMapClick={handleMapClick}
          onSavedPlacesClick={handleSavedPlacesClick}
          onCameraRecipesClick={handleCameraRecipesClick}
          onSpoonacularRecipesClick={handleSpoonacularRecipesClick}
        />
      )}
      {currentScreen === 'saved-places' && (
        <SavedPlaces 
          onBack={handleBackToHome}
          accessToken={accessToken || undefined}
        />
      )}
      {currentScreen === 'settings' && (
        <SettingsScreen 
          userName={userData?.name} 
          userEmail={userData?.email}
          onBack={handleBackToHome}
          onLogout={handleLogout}
          onHomeClick={handleBackToHome}
          onMapClick={handleMapClick}
        />
      )}
      {currentScreen === 'map' && (
        <MapScreen 
          onBack={handleBackToHome}
          onHomeClick={handleBackToHome}
          onSettingsClick={handleSettingsClick}
        />
      )}
      {currentScreen === 'camera-recipes' && (
        <CameraRecipes 
          onBack={handleBackToHome}
          onHomeClick={handleBackToHome}
          onMapClick={handleMapClick}
          onSettingsClick={handleSettingsClick}
        />
      )}
      {currentScreen === 'spoonacular-recipes' && (
        <SpoonacularRecipes 
          onBack={handleBackToHome}
          onHomeClick={handleBackToHome}
          onMapClick={handleMapClick}
          onSettingsClick={handleSettingsClick}
        />
      )}
    </>
  );
}