import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, LogOut, Edit2, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface AccountSettingsProps {
  userName?: string;
  userEmail?: string;
  onBack: () => void;
  onLogout: () => void;
}

export function AccountSettings({ userName, userEmail, onBack, onLogout }: AccountSettingsProps) {
  const [editingField, setEditingField] = useState<'name' | 'email' | null>(null);
  const [name, setName] = useState(userName || '');
  const [email, setEmail] = useState(userEmail || '');
  const [tempValue, setTempValue] = useState('');

  const handleEditClick = (field: 'name' | 'email') => {
    setEditingField(field);
    setTempValue(field === 'name' ? name : email);
  };

  const handleSave = () => {
    if (editingField === 'name') {
      setName(tempValue);
    } else if (editingField === 'email') {
      setEmail(tempValue);
    }
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
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
          <h1 className="text-gray-800 mb-1">Account Settings</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </h3>
          
          {/* Name Field */}
          <div className="mb-4 pb-4 border-b border-gray-100">
            <Label className="text-gray-700 mb-2 block">Full Name</Label>
            {editingField === 'name' ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="p-2 bg-green-500 text-white rounded-lg active:scale-95 transition-transform"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-gray-200 text-gray-700 rounded-lg active:scale-95 transition-transform"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{name}</span>
                <button
                  onClick={() => handleEditClick('name')}
                  className="p-2 text-blue-500 active:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-0">
            <Label className="text-gray-700 mb-2 block flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            {editingField === 'email' ? (
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="p-2 bg-green-500 text-white rounded-lg active:scale-95 transition-transform"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-gray-200 text-gray-700 rounded-lg active:scale-95 transition-transform"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{email}</span>
                <button
                  onClick={() => handleEditClick('email')}
                  className="p-2 text-blue-500 active:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </h3>
          
          <button className="w-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors py-3 px-4 rounded-xl flex items-center justify-between">
            <span className="text-gray-900">Change Password</span>
            <Lock className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Logout Section */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full bg-red-50 hover:bg-red-100 active:bg-red-200 transition-colors py-4 px-4 rounded-xl flex items-center justify-center gap-2 text-red-600">
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[340px] mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Log Out</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out of your account?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onLogout} className="bg-red-500 hover:bg-red-600">
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Account Info */}
        <div className="mt-6 text-center text-gray-500">
          <p>Member since October 2024</p>
        </div>
      </div>

      {/* iOS Safe Area Bottom */}
      <div className="h-8 bg-gray-50" />
    </div>
  );
}
