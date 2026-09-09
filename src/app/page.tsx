// ==========================================
// K-Mart AI — Landing Page
// ==========================================
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sprout, ArrowRight, Shield, TrendingUp, Brain,
  Users, BarChart3, ShoppingBag, Star, Zap, Leaf,
  ChevronRight, CheckCircle2,
  AlignCenter,
} from 'lucide-react';

export default function LandingPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && user && userProfile) {
      router.push(`/${userProfile.role}/dashboard`);
    }
  }, [user, userProfile, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--color-bg)' }}>
        <div className="animate-spin">
          <Sprout size={32} style={{ color: 'var(--color-primary)' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.5)' }}>
        <div className="container-app flex items-center justify-between" style={{ height: 72 }}>
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img
              src="/logo.png"
              alt="K-Mart AI Logo"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                K-Mart{' '}
              </span>
              <span className="text-xl font-bold ml-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}>
                AI{' '}
              </span>
              <span className="text-sm font-bold ml-3" style={{ color: 'var(--color-text-secondary)' }}>
                by Meta Miners
              </span>
            </div>
          </Link>



          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-ghost text-sm no-underline" style={{ color: 'var(--color-text-secondary)' }}>
              Log In
            </Link>
            <Link href="/register" className="btn btn-primary text-sm no-underline">
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ paddingTop: 140, paddingBottom: 100, paddingLeft: 220 }}>
        {/* Background decorations */}
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #D8F3DC, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #CCFBF1, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute top-40 left-1/4 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FEF3C7, transparent)', filter: 'blur(50px)' }} />

        <div className="container-app relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full animate-fade-in-down" style={{ background: 'var(--color-primary-pale)', border: '1px solid var(--color-primary-lighter)', marginBottom: '13px' }}>
              <Zap size={14} style={{ color: 'var(--color-secondary)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                AI-Powered Agricultural Intelligence
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight animate-fade-in-up" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)', marginBottom: '19px' }}>
              Sell Smarter.{' '}
              <span className="gradient-text">Buy Smarter.</span>
              <br />
              Farm-to-Consumer, Direct.
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up stagger-3">
              <Link href="/register" className="btn btn-primary btn-xl no-underline" style={{ borderRadius: 'var(--radius-xl)' }}>
                <Leaf size={20} />
                Start as Farmer
                <ArrowRight size={18} />
              </Link>
              <Link href="/register" className="btn btn-outline btn-xl no-underline" style={{ borderRadius: 'var(--radius-xl)' }}>
                <ShoppingBag size={20} />
                Start as Consumer
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="py-12" style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-border-light)', marginTop: 'auto' }}>
        <div className="container-app">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="K-Mart AI Logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                K-Mart AI
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              © {new Date().getFullYear()} K-Mart AI. Empowering Indian Agriculture.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
