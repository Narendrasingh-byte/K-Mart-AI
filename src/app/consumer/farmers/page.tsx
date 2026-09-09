// ==========================================
// K-Mart AI — Consumer Farmers Directory
// ==========================================
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { sampleProducts } from '@/data/sampleData';
import {
  Users, Search, MapPin, Star, Shield, Award, ChevronRight, CheckCircle2
} from 'lucide-react';

export default function FarmersDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique farmers from products
  const farmers = Array.from(new Set(sampleProducts.filter(p => p.farmerId !== 'current-farmer').map(p => p.farmerName)))
    .map((name, i) => {
      const p = sampleProducts.find(prod => prod.farmerName === name);
      return {
        id: p?.farmerId || `f${i}`,
        name: name,
        location: p?.location || 'Unknown',
        rating: p?.farmerRating || 4.5,
        reviews: Math.floor(Math.random() * 50) + 10,
        crops: sampleProducts.filter(prod => prod.farmerName === name).map(prod => prod.name).slice(0, 3).join(', '),
        isVerified: true,
      };
    });

  const filtered = farmers.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Farmers 👨🏽‍🌾
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Connect with verified local farmers in your area
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name or location..."
            className="input pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((farmer, index) => (
          <div key={farmer.id} className="card p-5 animate-fade-in-up hover:shadow-md transition-shadow" style={{ animationDelay: `${index * 40}ms` }}>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0" style={{ background: 'var(--color-primary)', color: 'white' }}>
                {farmer.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-base font-bold truncate" style={{ color: 'var(--color-text)' }}>{farmer.name}</h3>
                  {farmer.isVerified && <CheckCircle2 size={14} style={{ color: '#10B981' }} />}
                </div>
                <div className="flex items-center gap-1 text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  <MapPin size={12} /> {farmer.location}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-xs font-medium text-yellow-700 border border-yellow-200">
                    <Star size={10} fill="currentColor" /> {farmer.rating}
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>({farmer.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-3 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                <strong>Grows:</strong> <span className="truncate inline-block max-w-full align-bottom">{farmer.crops}</span>
              </p>
              <Link href={`/consumer/marketplace?search=${farmer.name}`} className="btn btn-outline w-full btn-sm flex justify-center gap-2 no-underline">
                View Products <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
