// ==========================================
// K-Mart AI — Forgot Password Page
// ==========================================
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Sprout, Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setIsSent(true);
      toast.success('Password reset email sent!');
    } catch {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
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

        <div className="card p-8">
          {isSent ? (
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center rounded-full" style={{ width: 56, height: 56, background: 'var(--color-success-light)' }}>
                  <CheckCircle2 size={28} style={{ color: 'var(--color-success)' }} />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                Email Sent!
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                We&apos;ve sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
              </p>
              <Link href="/login" className="btn btn-primary w-full no-underline" style={{ borderRadius: 'var(--radius-lg)' }}>
                <ArrowLeft size={18} />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                  Reset Password
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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

                <button
                  type="submit"
                  className="btn btn-primary w-full btn-lg"
                  disabled={isSubmitting}
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <div className="text-center mt-6">
                <Link href="/login" className="text-sm font-medium no-underline flex items-center justify-center gap-1" style={{ color: 'var(--color-primary)' }}>
                  <ArrowLeft size={14} />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
