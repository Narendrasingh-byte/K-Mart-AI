// ==========================================
// K-Mart AI — Consumer Settings
// ==========================================
'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Settings, Bell, Lock, CreditCard, HelpCircle,
  LogOut, ChevronRight, User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ConsumerSettingsPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    priceAlerts: true,
    promotions: false,
    smsAlerts: true,
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
            { id: 'payment', label: 'Payment Methods', icon: CreditCard },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'help', label: 'Help & Support', icon: HelpCircle },
          ].map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left"
              style={{
                background: item.id === 'notifications' ? 'var(--color-surface)' : 'transparent',
                color: item.id === 'notifications' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                border: item.id === 'notifications' ? '1px solid var(--color-border)' : 'none',
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
              <Bell size={18} style={{ color: 'var(--color-accent)' }} /> Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about your order status and delivery' },
                { key: 'priceAlerts', label: 'Price Alerts', desc: 'Notifications when products in your wishlist drop in price' },
                { key: 'smsAlerts', label: 'SMS Notifications', desc: 'Receive delivery updates via SMS' },
                { key: 'promotions', label: 'Offers & Promotions', desc: 'Receive emails about special discounts and new arrivals' },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b last:border-0" style={{ borderColor: 'var(--color-border-light)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                    className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                    style={{ background: notifications[item.key as keyof typeof notifications] ? 'var(--color-accent)' : '#CBD5E1' }}
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
              <CreditCard size={18} style={{ color: 'var(--color-accent)' }} /> Saved Payment Methods
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-500">VISA</div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>•••• •••• •••• 4242</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Expires 12/28</p>
                  </div>
                </div>
                <button className="text-xs font-medium text-red-600 hover:underline">Remove</button>
              </div>
              <button className="w-full py-3 text-sm font-medium border-dashed border-2 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors">
                <CreditCard size={16} /> Add Payment Method
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} className="btn" style={{ background: 'var(--color-accent)', color: 'white' }}>Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
