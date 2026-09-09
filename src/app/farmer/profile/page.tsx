// ==========================================
// K-Mart AI — Farmer Profile
// ==========================================
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  User, MapPin, Phone, Mail, Award, Shield, CheckCircle2,
  Edit2, Save, Map, Star, Sprout, Tractor, Camera,
} from 'lucide-react';

export default function FarmerProfilePage() {
  const { user, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: userProfile?.displayName || 'Farmer',
    phone: userProfile?.phoneNumber || '+91 9876543210',
    email: user?.email || '',
    farmName: 'Green Acres Farm',
    address: 'Vill. Rampur, Post Khas',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    pincode: '250001',
    experience: '12 Years',
    bio: 'Multi-generational farmer focusing on organic vegetables and high-yield grains. Passionate about sustainable farming practices.',
    primaryCrops: 'Wheat, Tomatoes, Onions, Potatoes',
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
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Manage your personal and farm details</p>
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
        {/* Left Col: Avatar & Stats */}
        <div className="space-y-6">
          <div className="card p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold" style={{ background: 'var(--color-primary)', color: 'white' }}>
                {profile.name.charAt(0)}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:scale-105 transition-transform" style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
                  <Camera size={14} />
                </button>
              )}
            </div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{profile.name}</h2>
            <p className="text-sm flex items-center justify-center gap-1 mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              <Tractor size={14} /> Farmer
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <span className="badge badge-success px-3 py-1.5"><Shield size={12} className="mr-1 inline" /> Verified Seller</span>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Reputation Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--color-text-secondary)' }} className="flex items-center gap-1"><Shield size={14} /> Trust Score</span>
                  <span className="font-bold" style={{ color: '#10B981' }}>98/100</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: '#F1F5F9' }}>
                  <div className="h-full rounded-full" style={{ width: '98%', background: '#10B981' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--color-text-secondary)' }} className="flex items-center gap-1"><Star size={14} fill="#F59E0B" color="#F59E0B" /> Rating</span>
                  <span className="font-bold" style={{ color: 'var(--color-text)' }}>4.8/5.0</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: '#F1F5F9' }}>
                  <div className="h-full rounded-full" style={{ width: '96%', background: '#F59E0B' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--color-text-secondary)' }} className="flex items-center gap-1"><CheckCircle2 size={14} /> Completion Rate</span>
                  <span className="font-bold" style={{ color: 'var(--color-primary)' }}>100%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: '#F1F5F9' }}>
                  <div className="h-full rounded-full" style={{ width: '100%', background: 'var(--color-primary)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Details Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <User size={18} style={{ color: 'var(--color-primary)' }} /> Personal Details
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
              <Map size={18} style={{ color: 'var(--color-primary)' }} /> Farm Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Farm Name</label>
                <input type="text" name="farmName" value={profile.farmName} onChange={handleChange} disabled={!isEditing} className="input" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Farm Address</label>
                <input type="text" name="address" value={profile.address} onChange={handleChange} disabled={!isEditing} className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>District</label>
                <input type="text" name="district" value={profile.district} onChange={handleChange} disabled={!isEditing} className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>State</label>
                <input type="text" name="state" value={profile.state} onChange={handleChange} disabled={!isEditing} className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Pincode</label>
                <input type="text" name="pincode" value={profile.pincode} onChange={handleChange} disabled={!isEditing} className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Farming Experience</label>
                <input type="text" name="experience" value={profile.experience} onChange={handleChange} disabled={!isEditing} className="input" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Primary Crops</label>
                <input type="text" name="primaryCrops" value={profile.primaryCrops} onChange={handleChange} disabled={!isEditing} className="input" placeholder="Comma separated list" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Bio / About Farm</label>
                <textarea name="bio" value={profile.bio} onChange={handleChange} disabled={!isEditing} className="input" rows={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
