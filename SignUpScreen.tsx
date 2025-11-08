import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft } from 'lucide-react';
import logoImage from 'figma:asset/141619a524f92c6a9ab2b26955cb5535a2950681.png';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onBackToLogin: () => void;
}

export function SignUpScreen({ onSignUpSuccess, onBackToLogin }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Call the server to create the user
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d598bb36/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      console.log('Sign up successful:', data);
      onSignUpSuccess();
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen max-w-[393px] mx-auto bg-white flex flex-col overflow-y-auto">
      {/* iOS Safe Area Top */}
      <div className="h-12 flex items-center px-4">
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-red-500 active:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>
      
      {/* Logo Section */}
      <div className="px-8 pt-4 pb-6">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
            <ImageWithFallback 
              src={logoImage} 
              alt="Food 4 All Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>
        <h1 className="text-center text-gray-800 mb-1">Create Account</h1>
        <p className="text-center text-gray-600">Join Food 4 All today</p>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSignUp} className="px-8 pb-8 flex-1">
        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Error Message */} // From Figma Design
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Sign Up Button */}// From Figma Design
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-transform mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          {/* Terms */}// From Figma Design
          <p className="text-center text-gray-500 pt-2">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </form>

      {/* iOS Safe Area Bottom */}
      <div className="h-8" />
    </div>
  );
}