// ==========================================
// K-Mart AI — Sidebar Navigation
// ==========================================
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FARMER_NAV_ITEMS, CONSUMER_NAV_ITEMS, ADMIN_NAV_ITEMS } from '@/lib/constants';
import {
  Home, Store, Plus, Package, Warehouse, ShoppingBag, Brain, TrendingUp,
  Shield, Users, Handshake, IndianRupee, Bell, User, Settings, ShoppingCart,
  Heart, LayoutGrid, LayoutDashboard, BarChart3, LogOut, ChevronLeft,
  Sprout, X,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Home, Store, Plus, Package, Warehouse, ShoppingBag, Brain, TrendingUp,
  Shield, Users, Handshake, IndianRupee, Bell, User, Settings, ShoppingCart,
  Heart, LayoutGrid, LayoutDashboard, BarChart3,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { userProfile, logout } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const role = userProfile?.role;
  const navItems = role === 'farmer'
    ? FARMER_NAV_ITEMS
    : role === 'admin'
      ? ADMIN_NAV_ITEMS
      : CONSUMER_NAV_ITEMS;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const isActive = (href: string) => {
    if (href === `/${role}/dashboard` && pathname === `/${role}/dashboard`) return true;
    if (href !== `/${role}/dashboard` && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="overlay lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-white border-r transition-all duration-300 ease-in-out
          flex flex-col
          ${isCollapsed ? 'w-[72px]' : 'w-[270px]'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ borderColor: 'var(--color-border-light)' }}
      >
        {/* Logo Section */}
        <div
          className="flex items-center justify-between px-5 flex-shrink-0"
          style={{ height: 'var(--topbar-height)', borderBottom: '1px solid var(--color-border-light)' }}
        >
          <Link href={`/${role}/dashboard`} className="flex items-center gap-3 no-underline" onClick={onClose}>
            <img
              src="/logo.png"
              alt="K-Mart AI Logo"
              className="w-10 h-10 rounded-xl object-cover"
            />
            {!isCollapsed && (
              <div className="flex flex-col">
                <span
                  className="font-bold text-base leading-tight"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                >
                  K-Mart
                </span>
                <span
                  className="text-xs font-semibold leading-tight"
                  style={{ color: 'var(--color-accent)' }}
                >
                  AI
                </span>
              </div>
            )}
          </Link>
          
          {/* Close button (mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
          
          {/* Collapse button (desktop) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              size={18}
              className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              style={{ color: 'var(--color-text-muted)' }}
            />
          </button>
        </div>

        {/* User info card */}
        {!isCollapsed && (
          <div className="px-4 py-3 mx-3 mt-3 rounded-xl" style={{ background: 'var(--color-bg-alt)' }}>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0 text-sm font-semibold"
                style={{
                  width: 36,
                  height: 36,
                  background: 'var(--color-primary-pale)',
                  color: 'var(--color-primary)',
                }}
              >
                {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                  {userProfile?.displayName || 'User'}
                </span>
                <span
                  className="text-xs capitalize"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon];
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-all duration-200
                    ${isCollapsed ? 'justify-center' : ''}
                    group relative
                  `}
                  style={{
                    background: active ? 'var(--color-primary-pale)' : 'transparent',
                    color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontWeight: active ? 600 : 400,
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Active indicator */}
                  {active && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
                      style={{ background: 'var(--color-primary)' }}
                    />
                  )}
                  
                  {Icon && <Icon size={20} className="flex-shrink-0" />}
                  
                  {!isCollapsed && (
                    <span className="text-sm truncate">{item.label}</span>
                  )}
                  
                  {/* Hover effect */}
                  <style jsx>{`
                    a:hover {
                      background: ${active ? 'var(--color-primary-pale)' : 'var(--color-bg-alt)'} !important;
                      color: ${active ? 'var(--color-primary)' : 'var(--color-text)'} !important;
                    }
                  `}</style>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="px-3 pb-4 pt-2 flex-shrink-0" style={{ borderTop: '1px solid var(--color-border-light)' }}>
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200
              hover:bg-red-50
              ${isCollapsed ? 'justify-center' : ''}
            `}
            style={{ color: 'var(--color-danger)', border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
