// ==========================================
// K-Mart AI — Consumer Profile
// ==========================================
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  User, MapPin, Phone, Mail, ShoppingBag, Heart, CheckCircle2,
  Edit2, Save, Camera, Star, Clock
} from 'lucide-react';

export default function ConsumerProfilePage() {
  const { user, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: userProfile?.displayName || 'Consumer',
    phone: userProfile?.phoneNumber || '+91 9123456789',
    email: user?.email || '',
    address: 'Flat 402, Block B, Green Apartments',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    preferences: 'Organic Vegetables, Fresh Fruits, Premium Spices',
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            My Profile 👤
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Manage your personal details and preferences</p>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="btn btn-outline btn-sm">Cancel</button>
            <button onClick={handleSave} className="btn btn-primary btn-sm"><Save size={16} /> Save Changes</button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-sm"><Edit2 size={16} /> Edit Profile</button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Avatar & Activity */}
        <div className="space-y-6">
          <div className="card p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold" style={{ background: 'var(--color-accent)', color: 'white' }}>
                {profile.name.charAt(0)}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:scale-105 transition-transform" style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
                  <Camera size={14} />
                </button>
              )}
            </div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{profile.name}</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Member since Sep 2026</p>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Your Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={16} style={{ color: 'var(--color-primary)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Total Orders</span>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>14</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="flex items-center gap-2">
                  <Heart size={16} style={{ color: '#EF4444' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Wishlist Items</span>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>8</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="flex items-center gap-2">
                  <Star size={16} style={{ color: '#F59E0B' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Reviews Given</span>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>6</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Details Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <User size={18} style={{ color: 'var(--color-accent)' }} /> Personal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Full Name</label>
                <input type="text" name="name" value={profile.name} onChange={handleChange} disabled={!isEditing} className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Phone Number</label>
                <input type="text" name="phone" value={profile.phone} onChange={handleChange} disabled={!isEditing} className="input" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Email Address</label>
                <input type="email" name="email" value={profile.email} onChange={handleChange} disabled={!isEditing} className="input" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <MapPin size={18} style={{ color: 'var(--color-accent)' }} /> Delivery Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Full Address</label>
                <input type="text" name="address" value={profile.address} onChange={handleChange} disabled={!isEditing} className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>City</label>
                <input type="text" name="city" value={profile.city} onChange={handleChange} disabled={!isEditing} className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>State</label>
                <input type="text" name="state" value={profile.state} onChange={handleChange} disabled={!isEditing} className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Pincode</label>
                <input type="text" name="pincode" value={profile.pincode} onChange={handleChange} disabled={!isEditing} className="input" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <Heart size={18} style={{ color: 'var(--color-accent)' }} /> Preferences
            </h3>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Preferred Categories & Products</label>
              <textarea name="preferences" value={profile.preferences} onChange={handleChange} disabled={!isEditing} className="input" rows={2} />
              <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>This helps our AI recommend the best products for you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
