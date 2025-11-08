//Imported from Figma 
import React from 'react';
import { ArrowLeft, HelpCircle, Info, Shield, Mail, Phone, MessageCircle, ExternalLink, FileText } from 'lucide-react';
import Icon from '../imports/Icon';

interface HelpInfoProps {
  onBack: () => void;
}

export function HelpInfo({ onBack }: HelpInfoProps) {
  const helpItems = [
    {
      icon: <Info className="w-5 h-5" />,
      color: 'bg-blue-500',
      title: 'About Food 4 All',
      description: 'Learn about our mission and services',
      action: () => console.log('About'),
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      color: 'bg-green-500',
      title: 'How It Works',
      description: 'Guide to using the app effectively',
      action: () => console.log('How it works'),
    },
    {
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-purple-500',
      title: 'Terms of Service',
      description: 'Review our terms and conditions',
      action: () => console.log('Terms'),
    },
    {
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-orange-500',
      title: 'Privacy Policy',
      description: 'How we protect your information',
      action: () => console.log('Privacy'),
    },
  ];

  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-red-500',
      title: 'Email Support',
      value: 'support@food4all.org',
      action: () => window.open('mailto:support@food4all.org'),
    },
    {
      icon: <Phone className="w-5 h-5" />,
      color: 'bg-blue-500',
      title: 'Phone Support',
      value: '1-800-FOOD-4ALL',
      action: () => window.open('tel:1-800-3663-4255'),
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-green-500',
      title: 'Live Chat',
      value: 'Available 9am-5pm EST',
      action: () => console.log('Live chat'),
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
        <div className="px-5 pt-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16">
              <Icon />
            </div>
          </div>
          <h1 className="text-gray-800 mb-1">Help & Info</h1>
          <p className="text-gray-600">We're here to assist you</p>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* App Info */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-gray-900 mb-4">App Information</h3>
          <div className="space-y-3">
            {helpItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
              >
                <div className={`${item.color} p-2 rounded-lg text-white flex-shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-900">{item.title}</p>
                  <p className="text-gray-500">{item.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-gray-900 mb-4">Contact Support</h3>
          <div className="space-y-3">
            {contactMethods.map((method, index) => (
              <button
                key={index}
                onClick={method.action}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
              >
                <div className={`${method.color} p-2 rounded-lg text-white flex-shrink-0`}>
                  {method.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-900">{method.title}</p>
                  <p className="text-gray-500">{method.value}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 mb-4">
          <h3 className="text-gray-900 mb-2">Frequently Asked Questions</h3>
          <p className="text-gray-700 mb-4">Find quick answers to common questions</p>
          <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5" />
            View FAQs
          </button>
        </div>

        {/* Version Info */}
        <div className="text-center space-y-2 text-gray-500 pb-4">
          <p>Food 4 All</p>
          <p>Version 1.0.0</p>
          <p className="text-gray-400">© 2024 Food 4 All. All rights reserved.</p>
        </div>
      </div>

      {/* iOS Safe Area Bottom */}
      <div className="h-8 bg-gray-50" />
    </div>
  );
}