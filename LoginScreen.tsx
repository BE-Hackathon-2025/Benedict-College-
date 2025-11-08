import React, { useState } from 'react';
import Icon from '../imports/Icon';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LoginScreenProps {
  onLogin: (userData: { name: string; email: string }, accessToken?: string) => void;
  onSignUpClick: () => void;
}

export function LoginScreen({ onLogin, onSignUpClick }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔵 Attempting login with email:', email);
      console.log('🔵 API URL:', `https://${projectId}.supabase.co/functions/v1/make-server-d598bb36/login`);
      
      // Call the server to login
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d598bb36/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      console.log('🟢 Response status:', response.status);
      const data = await response.json();
      console.log('🟢 Response data:', data);

      if (!response.ok) {
        // Provide more helpful error messages
        if (response.status === 401 && data.error?.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials or sign up for a new account.');
        }
        throw new Error(data.error || 'Login failed');
      }

      console.log('✅ Login successful:', data);
      onLogin({ name: data.user.name, email: data.user.email }, data.access_token);
    } catch (err) {
      console.error('❌ Login error:', err);
      
      // Better error message for network issues
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Unable to connect to server. Please check your internet connection and try again. The server may still be deploying (wait 60 seconds).');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to login. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen max-w-[393px] mx-auto bg-white flex flex-col">
      {/* iOS Safe Area Top - Dynamic Island */}
      <div className="h-14" />
      
      {/* Logo Section */}
      <div className="flex flex-col items-center pt-6 pb-8">
        <div className="w-20 h-20 mb-4">
          <Icon />
        </div>
        <h2 className="text-gray-900 mb-1">Welcome Back</h2>
        <p className="text-gray-500">Sign in to continue</p>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-6">
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-900 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-blue-500 active:text-blue-600 transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-gray-500">or</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Apple Sign In */}
          <button
            type="button"
            className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continue with Apple
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center py-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSignUpClick}
              className="text-blue-500 active:text-blue-600 transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* iOS Safe Area Bottom */}
      <div className="h-8" />
    </div>
  );
}