// ==========================================
// K-Mart AI — Farmer Marketplace (Browse)
// ==========================================
'use client';

import React, { useState, useMemo } from 'react';
import { sampleProducts } from '@/data/sampleData';
import { sampleMarketPrices } from '@/data/sampleData';
import { CATEGORIES, formatCurrency } from '@/lib/constants';
import {
  Search, TrendingUp, TrendingDown, Minus as TrendStable, Eye, Star, MapPin,
  Leaf, Filter, ArrowUpRight, ArrowDownRight, BarChart3, ShoppingBag,
} from 'lucide-react';

export default function FarmerMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tab, setTab] = useState<'products' | 'prices'>('products');

  const filteredProducts = useMemo(() => {
    let list = sampleProducts.filter((p) => p.farmerId !== 'current-farmer');
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) || p.farmerName.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    return list;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Marketplace 🏪
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          See what other farmers are selling and compare prices
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--color-bg-alt)', width: 'fit-content' }}>
        {[
          { key: 'products' as const, label: 'Products', icon: <ShoppingBag size={14} /> },
          { key: 'prices' as const, label: 'Market Prices', icon: <BarChart3 size={14} /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.key ? 'white' : 'transparent',
              color: tab === t.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: tab === t.key ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3" style={{ marginTop: '16px', marginBottom: '16px' }}>
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Search products, farmers, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-9"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              className="btn btn-sm whitespace-nowrap"
              style={{
                background: selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-surface)',
                color: selectedCategory === 'all' ? 'white' : 'var(--color-text-secondary)',
                border: selectedCategory === 'all' ? 'none' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              All
            </button>
            {CATEGORIES.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="btn btn-sm whitespace-nowrap"
                style={{
                  background: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: selectedCategory === cat.id ? 'white' : 'var(--color-text-secondary)',
                  border: selectedCategory === cat.id ? 'none' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Showing <strong style={{ color: 'var(--color-text)' }}>{filteredProducts.length}</strong> products from other farmers
          </p>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="card p-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="w-full h-32 rounded-xl mb-3 overflow-hidden" style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)' }}>
                  <img
                    src={product.images[0] || '/images/tomato.jpg'}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin size={11} style={{ color: 'var(--color-text-muted)' }} />
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {product.farmerName} • {product.location}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                    {formatCurrency(product.price)}<span className="text-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>/{product.unit}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <Star size={12} fill="#F59E0B" color="#F59E0B" />
                    <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{product.farmerRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <span>{product.quantity} {product.unit} available</span>
                  <div className="flex items-center gap-1">
                    <Eye size={11} /> {product.views}
                  </div>
                </div>
                {product.aiAnalysis && (
                  <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                    <TrendingUp size={12} style={{ color: '#059669' }} />
                    <span className="text-xs" style={{ color: '#059669' }}>
                      AI: Sell at {formatCurrency(product.aiAnalysis.recommendedPriceRange.min)}–{formatCurrency(product.aiAnalysis.recommendedPriceRange.max)}/{product.unit}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'prices' && (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Live market prices across all mandis. Compare your prices with the market.
          </p>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg-alt)' }}>
                    {['Product', 'Current Price', 'Change', 'Week Avg', 'Month Avg', 'Demand'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleMarketPrices.map((mp, i) => (
                    <tr key={mp.id} style={{ borderTop: '1px solid var(--color-border-light)' }}>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{mp.productName}</span>
                        <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>({mp.category})</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{formatCurrency(mp.currentPrice)}/{mp.unit}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1" style={{ color: mp.changePercent > 0 ? '#10B981' : mp.changePercent < 0 ? '#EF4444' : '#64748B' }}>
                          {mp.changePercent > 0 ? <ArrowUpRight size={14} /> : mp.changePercent < 0 ? <ArrowDownRight size={14} /> : null}
                          <span className="text-xs font-semibold">{mp.changePercent > 0 ? '+' : ''}{mp.changePercent}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{formatCurrency(mp.weekAvgPrice)}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{formatCurrency(mp.monthAvgPrice)}</td>
                      <td className="px-4 py-3">
                        <span className="badge capitalize" style={{
                          background: mp.demandLevel === 'very-high' || mp.demandLevel === 'high' ? '#D1FAE5' : mp.demandLevel === 'medium' ? '#FEF3C7' : '#FEE2E2',
                          color: mp.demandLevel === 'very-high' || mp.demandLevel === 'high' ? '#059669' : mp.demandLevel === 'medium' ? '#B45309' : '#DC2626',
                          fontSize: '0.675rem',
                        }}>
                          {mp.demandLevel.replace('-', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
