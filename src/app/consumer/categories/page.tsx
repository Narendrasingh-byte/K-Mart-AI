// ==========================================
// K-Mart AI — Consumer Categories
// ==========================================
'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants';
import { ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Categories 🏷️
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Browse fresh produce directly from farmers by category
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, index) => (
          <Link
            key={cat.id}
            href={`/consumer/marketplace?category=${cat.id}`}
            className="card p-5 hover:-translate-y-1 transition-transform group"
            style={{ textDecoration: 'none' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform"
                style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)' }}
              >
                {cat.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{cat.name}</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Explore fresh {cat.name.toLowerCase()}</p>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--color-border)' }} className="group-hover:text-[var(--color-primary)] transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
