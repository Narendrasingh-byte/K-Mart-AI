// ==========================================
// K-Mart AI — Registration Page
// ==========================================
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { toast } from 'sonner';
import {
  Sprout, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight,
  User, Leaf, ShoppingBag, CheckCircle2,
} from 'lucide-react';

export default function RegisterPage() {
  const { register, loginWithGoogle, user, userProfile, loading: authLoading, error, clearError } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'role' | 'details'>('role');

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && userProfile) {
      router.push(`/${userProfile.role}/dashboard`);
    }
  }, [user, userProfile, authLoading, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!role) {
      toast.error('Please select your role');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email, password, name, role);
      toast.success('Account created successfully! Please verify your email.');
      router.push(`/${role}/dashboard`);
    } catch {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!role) {
      toast.error('Please select your role first');
      return;
    }
    setIsSubmitting(true);
    try {
      await loginWithGoogle(role);
      toast.success('Account created successfully!');
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
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-center items-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)' }}
      >
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full opacity-10" style={{ background: '#52B788' }} />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full opacity-5" style={{ background: '#95D5B2' }} />

        <div className="relative z-10 max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <img
              src="/logo.png"
              alt="K-Mart AI Logo"
              className="w-16 h-16 rounded-2xl object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Join K-Mart AI
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
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <img
              src="/logo.png"
              alt="K-Mart AI Logo"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>K-Mart</span>
              <span className="text-xl font-bold ml-1" style={{ color: 'var(--color-accent)' }}>AI</span>
            </div>
          </div>

          {step === 'role' ? (
            /* Step 1: Role Selection */
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                  I want to join as...
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)', marginBottom: '2px', }}>
                  Select your role to get started
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {/* Farmer option */}
                <button
                  onClick={() => { setRole('farmer'); setStep('details'); }}
                  className="w-full p-6 rounded-2xl text-left transition-all duration-300 group"
                  style={{
                    background: role === 'farmer' ? 'var(--color-primary-pale)' : 'var(--color-surface)',
                    border: `2px solid ${role === 'farmer' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    cursor: 'pointer',
                    marginBottom: '12px',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center justify-center rounded-xl transition-colors"
                      style={{
                        width: 52,
                        height: 52,
                        background: 'linear-gradient(135deg, #D8F3DC, #B7E4C7)',
                      }}
                    >
                      <Leaf size={26} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                        Farmer
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Sell your produce directly. Get AI-powered pricing & risk advice.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Consumer option */}
                <button
                  onClick={() => { setRole('consumer'); setStep('details'); }}
                  className="w-full p-6 rounded-2xl text-left transition-all duration-300 group"
                  style={{
                    background: role === 'consumer' ? '#DBEAFE' : 'var(--color-surface)',
                    border: `2px solid ${role === 'consumer' ? '#3B82F6' : 'var(--color-border)'}`,
                    cursor: 'pointer',
                    marginBottom: '5px',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center justify-center rounded-xl"
                      style={{
                        width: 52,
                        height: 52,
                        background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
                      }}
                    >
                      <ShoppingBag size={26} style={{ color: '#3B82F6' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                        Consumer
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Buy fresh produce from farmers. Get AI buy/wait recommendations.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Already have an account?{' '}
                <Link href="/login" className="font-semibold no-underline" style={{ color: 'var(--color-primary)' }}>
                  Sign In
                </Link>
              </p>
            </div>
          ) : (
            /* Step 2: Account Details */
            <div>
              <button
                onClick={() => setStep('role')}
                className="text-sm font-medium mb-6 flex items-center gap-1 hover:opacity-70"
                style={{ color: 'var(--color-primary)', border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                ← Change role
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="badge" style={{
                    background: role === 'farmer' ? 'var(--color-primary-pale)' : '#DBEAFE',
                    color: role === 'farmer' ? 'var(--color-primary)' : '#3B82F6',
                  }}>
                    {role === 'farmer' ? <Leaf size={12} /> : <ShoppingBag size={12} />}
                    {role === 'farmer' ? 'Farmer Account' : 'Consumer Account'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                  Create Your Account
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Fill in your details to get started
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rajesh Kumar"
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>

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
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="input pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                      {showPassword
                        ? <EyeOff size={16} style={{ color: 'var(--color-text-muted)' }} />
                        : <Eye size={16} style={{ color: 'var(--color-text-muted)' }} />
                      }
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="input pl-10"
                      required
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>Passwords do not match</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-full btn-lg"
                  disabled={isSubmitting}
                  style={{ borderRadius: 'var(--radius-lg)', marginTop: '24px' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Already have an account?{' '}
                <Link href="/login" className="font-semibold no-underline" style={{ color: 'var(--color-primary)' }}>
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
