// ==========================================
// K-Mart AI — Login Page
// ==========================================
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Sprout, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, loginWithGoogle, user, userProfile, loading: authLoading, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && userProfile) {
      router.push(`/${userProfile.role}/dashboard`);
    }
  }, [user, userProfile, authLoading, router]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const profile = await login(email, password);
      toast.success('Welcome back!');
      const role = profile?.role || 'consumer';
      router.push(`/${role}/dashboard`);
    } catch {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      toast.success('Welcome!');
    } catch {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--color-bg)' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-center items-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full opacity-10" style={{ background: '#52B788' }} />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full opacity-5" style={{ background: '#95D5B2' }} />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full opacity-8" style={{ background: '#E9A319' }} />

        <div className="relative z-10 max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center rounded-2xl" style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
              <Sprout size={30} color="white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome to K-Mart AI
          </h1>

          <p className="text-base text-white/70 mb-10 leading-relaxed">
            Create your account and start trading smarter with AI-powered intelligence designed for Indian agriculture.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center rounded-xl" style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #2D6A4F, #52B788)' }}>
              <Sprout size={24} color="white" />
            </div>
            <div>
              <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>K-Mart</span>
              <span className="text-xl font-bold ml-1" style={{ color: 'var(--color-accent)' }}>AI</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              Sign In
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Welcome back! Please enter your credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium no-underline" style={{ color: 'var(--color-primary)' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input pl-10 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  {showPassword
                    ? <EyeOff size={16} style={{ color: 'var(--color-text-muted)' }} />
                    : <Eye size={16} style={{ color: 'var(--color-text-muted)' }} />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              disabled={isSubmitting}
              style={{ borderRadius: 'var(--radius-lg)', marginTop: '14px' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center mt-8 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold no-underline" style={{ color: 'var(--color-primary)' }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
