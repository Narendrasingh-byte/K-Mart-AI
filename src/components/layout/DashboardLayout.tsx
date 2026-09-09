// ==========================================
// K-Mart AI — Dashboard Layout (Protected)
// ==========================================
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authenticated (in useEffect to avoid setState during render)
  useEffect(() => {
    if (!loading && (!user || !userProfile)) {
      router.push('/login');
    }
  }, [user, userProfile, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #2D6A4F, #52B788)',
            }}
          >
            <Loader2 size={28} color="white" className="animate-spin" />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Loading K-Mart AI...
          </p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      <main className="dashboard-main page-enter">
        {children}
      </main>
    </div>
  );
}
