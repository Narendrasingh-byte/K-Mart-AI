// ==========================================
// K-Mart AI — Consumer Price Intelligence
// ==========================================
'use client';

import React, { useState } from 'react';
import { sampleMarketPrices, samplePriceHistory } from '@/data/sampleData';
import { CATEGORIES, formatCurrency } from '@/lib/constants';
import {
  TrendingUp, ArrowUpRight, ArrowDownRight, Search, BarChart3,
  Filter, Eye, RefreshCw, Clock, Info, LineChart, Tag, Target,
} from 'lucide-react';

export default function ConsumerPriceIntelligencePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Tomato');

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
            Price Intelligence 📈
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Track market prices to ensure you get the best deals
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <Clock size={12} /> Live Market Data
          <button className="btn btn-ghost btn-sm p-1"><RefreshCw size={14} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <div className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                Retail Price Trend — {selectedCrop}
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

            <div className="relative h-48 flex items-end gap-2 pt-6">
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <span>₹{maxPrice}</span>
                <span>₹{Math.round((maxPrice + minPrice) / 2)}</span>
                <span>₹{minPrice}</span>
              </div>
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
                            ? 'linear-gradient(180deg, #8B5CF6, #6366F1)'
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

          {/* Detailed Market Prices */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>All Commodities</h3>
            <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {['all', 'vegetables', 'grains', 'spices'].map((cat) => (
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

            <div className="space-y-2">
              {filtered.map((mp) => (
                <div key={mp.id} className="card p-3 flex items-center justify-between hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-bg-alt)' }}>
                      <Tag size={16} style={{ color: 'var(--color-text-muted)' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{mp.productName}</p>
                      <p className="text-xs capitalize" style={{ color: 'var(--color-text-muted)' }}>{mp.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <div className="hidden sm:block">
                      <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Avg Week</p>
                      <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{formatCurrency(mp.weekAvgPrice)}</p>
                    </div>
                    <div>
                      <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Current Price</p>
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{formatCurrency(mp.currentPrice)}<span className="text-[10px] font-normal" style={{ color: 'var(--color-text-muted)' }}>/{mp.unit}</span></span>
                      </div>
                    </div>
                    <div className="w-16 flex justify-end">
                      <span className="badge" style={{
                        background: mp.changePercent > 0 ? '#FEE2E2' : mp.changePercent < 0 ? '#D1FAE5' : '#F1F5F9',
                        color: mp.changePercent > 0 ? '#DC2626' : mp.changePercent < 0 ? '#059669' : '#64748B',
                        fontSize: '0.625rem',
                      }}>
                        {mp.changePercent > 0 ? '↑' : '↓'}{Math.abs(mp.changePercent)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Value Picks Sidebar */}
        <div className="space-y-4">
          <div className="card p-5" style={{ background: 'var(--color-primary-pale)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Target size={18} style={{ color: 'var(--color-primary)' }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Best Value Picks</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: '#065F46' }}>Prices are currently lower than the monthly average.</p>
            <div className="space-y-2">
              {[
                { name: 'Organic Potatoes', current: 22, avg: 26 },
                { name: 'Green Chillies', current: 60, avg: 68 },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center bg-white p-2 rounded-lg">
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{item.name}</span>
                  <div className="text-right">
                    <span className="text-xs font-bold" style={{ color: '#10B981' }}>₹{item.current}</span>
                    <span className="text-[10px] line-through ml-1" style={{ color: 'var(--color-text-muted)' }}>₹{item.avg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
