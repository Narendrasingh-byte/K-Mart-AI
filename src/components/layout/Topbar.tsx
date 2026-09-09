// ==========================================
// K-Mart AI — Top Navigation Bar
// ==========================================
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  Menu, Search, Bell, ShoppingCart, User, Settings,
  LogOut, ChevronDown, X,
} from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, userProfile, logout } = useAuth();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const role = userProfile?.role;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
  };

  return (
    <header
      className="fixed top-0 right-0 z-40 flex items-center justify-between px-4 md:px-6 glass"
      style={{
        height: 'var(--topbar-height)',
        left: 'var(--sidebar-width)',
        borderBottom: '1px solid var(--color-border-light)',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Mobile: adjust left position */}
      <style jsx>{`
        @media (max-width: 1024px) {
          header { left: 0 !important; }
        }
      `}</style>

      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          aria-label="Open menu"
        >
          <Menu size={22} style={{ color: 'var(--color-text)' }} />
        </button>

        {/* Page context - hidden on mobile */}
        <div className="hidden md:block">
          <h2
            className="text-lg font-semibold capitalize"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            {getPageTitle(role)}
          </h2>
        </div>
      </div>

      {/* Center - Search */}
      <div ref={searchRef} className="flex-1 max-w-lg mx-4 hidden sm:block">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search products, farmers, orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="input pl-10 pr-4"
            style={{
              height: 42,
              background: 'var(--color-bg-alt)',
              border: '1px solid transparent',
              borderRadius: 'var(--radius-xl)',
              fontSize: '0.875rem',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <X size={14} style={{ color: 'var(--color-text-muted)' }} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile search toggle */}
      <button
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className="sm:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
        aria-label="Search"
      >
        <Search size={20} style={{ color: 'var(--color-text-secondary)' }} />
      </button>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Cart (consumer only) */}
        {role === 'consumer' && (
          <Link
            href="/consumer/cart"
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors no-underline"
          >
            <ShoppingCart size={20} style={{ color: 'var(--color-text-secondary)' }} />
            {itemCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center text-white text-xs font-bold rounded-full"
                style={{
                  width: 20,
                  height: 20,
                  background: 'var(--color-danger)',
                  fontSize: '0.625rem',
                }}
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
        )}

        {/* Notifications */}
        <Link
          href={`/${role}/notifications`}
          className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors no-underline"
        >
          <Bell size={20} style={{ color: 'var(--color-text-secondary)' }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: 'var(--color-danger)' }}
          />
        </Link>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <div
              className="flex items-center justify-center rounded-full text-sm font-semibold"
              style={{
                width: 36,
                height: 36,
                background: 'var(--color-primary-pale)',
                color: 'var(--color-primary)',
              }}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            <ChevronDown
              size={14}
              className={`hidden md:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
              style={{ color: 'var(--color-text-muted)' }}
            />
          </button>

          {/* Profile dropdown menu */}
          {isProfileOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 py-2 card animate-fade-in-down"
              style={{ boxShadow: 'var(--shadow-xl)' }}
            >
              {/* User info */}
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                  {userProfile?.displayName || 'User'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {user?.email}
                </p>
                <span
                  className="badge badge-primary mt-2 capitalize"
                  style={{ fontSize: '0.6875rem' }}
                >
                  {role}
                </span>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  href={`/${role}/profile`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors no-underline"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                <Link
                  href={`/${role}/settings`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors no-underline"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
              </div>

              {/* Logout */}
              <div style={{ borderTop: '1px solid var(--color-border-light)' }} className="pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-red-50 transition-colors"
                  style={{ color: 'var(--color-danger)', border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search overlay */}
      {isSearchOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 p-3 bg-white border-b" style={{ borderColor: 'var(--color-border-light)' }}>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
              style={{ background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-xl)' }}
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}

function getPageTitle(role?: string): string {
  if (role === 'farmer') return 'Farmer Dashboard';
  if (role === 'admin') return 'Admin Panel';
  return 'Consumer Dashboard';
}
