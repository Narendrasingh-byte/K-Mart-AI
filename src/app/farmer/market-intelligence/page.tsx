// ==========================================
// K-Mart AI — Market Intelligence
// ==========================================
'use client';

import React, { useState } from 'react';
import { sampleMarketPrices, samplePriceHistory } from '@/data/sampleData';
import { CATEGORIES, formatCurrency } from '@/lib/constants';
import {
  TrendingUp, ArrowUpRight, ArrowDownRight, Search, BarChart3,
  Filter, Eye, RefreshCw, Clock, Info,
} from 'lucide-react';

export default function MarketIntelligencePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = sampleMarketPrices.filter((mp) => {
    if (selectedCategory !== 'all' && mp.category !== selectedCategory) return false;
    if (searchQuery && !mp.productName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const historyData = samplePriceHistory[selectedCrop as keyof typeof samplePriceHistory] || [];
  const maxPrice = Math.max(...historyData.map((h) => h.price), 1);
  const minPrice = Math.min(...historyData.map((h) => h.price), 0);
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Market Intelligence 📊
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Live market prices, trends, and demand analysis
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <Clock size={12} /> Updated 10 min ago
          <button className="btn btn-ghost btn-sm p-1"><RefreshCw size={14} /></button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Avg Price Change', value: '+8.2%', sub: 'This week', color: '#10B981', icon: TrendingUp },
          { label: 'Trending Up', value: '5', sub: 'Products', color: '#2D6A4F', icon: ArrowUpRight },
          { label: 'Trending Down', value: '2', sub: 'Products', color: '#EF4444', icon: ArrowDownRight },
          { label: 'High Demand', value: '4', sub: 'Products', color: '#E9A319', icon: BarChart3 },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} color={stat.color} />
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</span>
            </div>
            <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: stat.color }}>{stat.value}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Price Chart */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
            Price Trend — {selectedCrop}
          </h3>
          <div className="flex items-center gap-2">
            {Object.keys(samplePriceHistory).map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className="btn btn-sm"
                style={{
                  background: selectedCrop === crop ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: selectedCrop === crop ? 'white' : 'var(--color-text-secondary)',
                  border: selectedCrop === crop ? 'none' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        {/* CSS Chart */}
        <div className="relative h-48 flex items-end gap-2 pt-6">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <span>₹{maxPrice}</span>
            <span>₹{Math.round((maxPrice + minPrice) / 2)}</span>
            <span>₹{minPrice}</span>
          </div>
          {/* Bars */}
          <div className="flex-1 flex items-end gap-2 ml-10">
            {historyData.map((point, i) => {
              const height = ((point.price - minPrice) / priceRange) * 100;
              const isLast = i === historyData.length - 1;
              return (
                <div key={point.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium" style={{ color: isLast ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                    ₹{point.price}
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      height: `${Math.max(height, 8)}%`,
                      background: isLast
                        ? 'linear-gradient(180deg, #2D6A4F, #52B788)'
                        : 'linear-gradient(180deg, #94A3B8, #CBD5E1)',
                    }}
                  />
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)', fontSize: '0.6rem' }}>
                    {new Date(point.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Market Prices Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-9" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {['all', 'vegetables', 'grains', 'spices', 'pulses'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="btn btn-sm capitalize whitespace-nowrap"
                style={{
                  background: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: selectedCategory === cat ? 'white' : 'var(--color-text-secondary)',
                  border: selectedCategory === cat ? 'none' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-alt)' }}>
                  {['Product', 'Current Price', 'Prev Price', 'Change', 'Week Avg', 'Month Avg', 'Demand', 'Your Price'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((mp) => (
                  <tr key={mp.id} className="hover:bg-gray-50/50 transition-colors" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{mp.productName}</span>
                        <span className="text-xs ml-2 capitalize" style={{ color: 'var(--color-text-muted)' }}>({mp.category})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>₹{mp.currentPrice}/{mp.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>₹{mp.previousPrice}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1" style={{ color: mp.changePercent > 0 ? '#10B981' : mp.changePercent < 0 ? '#EF4444' : '#64748B' }}>
                        {mp.changePercent > 0 ? <ArrowUpRight size={14} /> : mp.changePercent < 0 ? <ArrowDownRight size={14} /> : null}
                        <span className="text-xs font-bold">{mp.changePercent > 0 ? '+' : ''}{mp.changePercent}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>₹{mp.weekAvgPrice}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>₹{mp.monthAvgPrice}</td>
                    <td className="px-4 py-3">
                      <span className="badge capitalize" style={{
                        background: mp.demandLevel.includes('high') ? '#D1FAE5' : mp.demandLevel === 'medium' ? '#FEF3C7' : '#FEE2E2',
                        color: mp.demandLevel.includes('high') ? '#059669' : mp.demandLevel === 'medium' ? '#B45309' : '#DC2626',
                        fontSize: '0.675rem',
                      }}>
                        {mp.demandLevel.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium" style={{ color: mp.currentPrice <= mp.weekAvgPrice ? '#10B981' : '#F59E0B' }}>
                        {mp.currentPrice <= mp.weekAvgPrice ? '✅ Good' : '⚠️ High'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
