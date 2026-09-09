// ==========================================
// K-Mart AI — Farmer Settings
// ==========================================
'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Settings, Bell, Lock, Shield, CreditCard, HelpCircle,
  LogOut, ChevronRight, Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function FarmerSettingsPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    priceAlerts: true,
    aiRecommendations: true,
    marketingEmails: false,
    smsAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    showProfileToBuyers: true,
    showLocation: true,
    showPhone: false,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Settings ⚙️
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Manage your preferences and account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-1">
          {[
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Privacy & Security', icon: Lock },
            { id: 'payment', label: 'Payment Methods', icon: CreditCard },
            { id: 'help', label: 'Help & Support', icon: HelpCircle },
          ].map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left"
              style={{
                background: item.id === 'notifications' ? 'var(--color-primary-pale)' : 'transparent',
                color: item.id === 'notifications' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              }}
            >
              <item.icon size={16} /> {item.label}
            </button>
          ))}
          <div className="divider my-2" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="card p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <Bell size={18} style={{ color: 'var(--color-primary)' }} /> Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { key: 'orderAlerts', label: 'Order Alerts', desc: 'Get notified when you receive a new order or update' },
                { key: 'priceAlerts', label: 'Market Price Alerts', desc: 'Notifications about significant price changes for your crops' },
                { key: 'aiRecommendations', label: 'AI Recommendations', desc: 'Smart tips on when to sell and risk alerts' },
                { key: 'smsAlerts', label: 'SMS Notifications', desc: 'Receive critical alerts via SMS (Standard rates apply)' },
                { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive offers, news, and updates from K-Mart' },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b last:border-0" style={{ borderColor: 'var(--color-border-light)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                    className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                    style={{ background: notifications[item.key as keyof typeof notifications] ? 'var(--color-primary)' : '#CBD5E1' }}
                  >
                    <div
                      className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                      style={{ transform: notifications[item.key as keyof typeof notifications] ? 'translateX(20px)' : 'translateX(0)' }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <Lock size={18} style={{ color: 'var(--color-primary)' }} /> Privacy Settings
            </h3>
            <div className="space-y-4">
              {[
                { key: 'showProfileToBuyers', label: 'Public Profile', desc: 'Allow buyers to see your farm profile and ratings' },
                { key: 'showLocation', label: 'Show Location', desc: 'Show your exact farm location to verified buyers' },
                { key: 'showPhone', label: 'Show Phone Number', desc: 'Allow buyers to contact you directly via phone' },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b last:border-0" style={{ borderColor: 'var(--color-border-light)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setPrivacy({ ...privacy, [item.key]: !privacy[item.key as keyof typeof privacy] })}
                    className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                    style={{ background: privacy[item.key as keyof typeof privacy] ? 'var(--color-primary)' : '#CBD5E1' }}
                  >
                    <div
                      className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                      style={{ transform: privacy[item.key as keyof typeof privacy] ? 'translateX(20px)' : 'translateX(0)' }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} className="btn btn-primary">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
