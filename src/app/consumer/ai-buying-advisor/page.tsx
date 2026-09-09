// ==========================================
// K-Mart AI — Consumer AI Buying Advisor
// ==========================================
'use client';

import React, { useState } from 'react';
import { sampleProducts, sampleMarketPrices } from '@/data/sampleData';
import { formatCurrency } from '@/lib/constants';
import {
  Brain, TrendingUp, TrendingDown, Clock, Search, MapPin, Star,
  ShieldAlert, Sparkles, Zap, ChevronRight, CheckCircle2,
} from 'lucide-react';

export default function AIBuyingAdvisorPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const recommendations = [
    {
      id: 'r1',
      productName: 'Organic Potatoes',
      currentPrice: 22,
      unit: 'kg',
      action: 'buy',
      confidence: 94,
      score: 88,
      reason: 'Price is 15% below weekly average. Supply is high today but expected to drop by weekend.',
      savings: 4,
      trend: 'down',
    },
    {
      id: 'r2',
      productName: 'Premium Onions',
      currentPrice: 35,
      unit: 'kg',
      action: 'wait',
      confidence: 82,
      score: 45,
      reason: 'Price spiked 16% due to rain delays. Fresh arrivals expected in 2 days which will normalize prices.',
      savings: 0,
      trend: 'up',
    },
    {
      id: 'r3',
      productName: 'Basmati Rice',
      currentPrice: 85,
      unit: 'kg',
      action: 'buy',
      confidence: 88,
      score: 76,
      reason: 'Stable price. Good time to stock up before upcoming festival season drives demand up.',
      savings: 0,
      trend: 'stable',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-2xl" style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}>
          <Brain size={24} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            AI Buying Intelligence 🧠
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Smart recommendations on when to buy and what to wait for
          </p>
        </div>
      </div>

      {/* Main Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Today&apos;s AI Recommendations</h2>
            <div className="relative w-64 hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input type="text" placeholder="Search products..." className="input pl-9 btn-sm text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="card p-5" style={{
                borderLeft: `4px solid ${rec.action === 'buy' ? '#10B981' : '#F59E0B'}`
              }}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>{rec.productName}</h3>
                      <span className="badge" style={{
                        background: rec.action === 'buy' ? '#D1FAE5' : '#FEF3C7',
                        color: rec.action === 'buy' ? '#059669' : '#B45309',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>
                        {rec.action === 'buy' ? <CheckCircle2 size={10} className="inline mr-1" /> : <Clock size={10} className="inline mr-1" />}
                        {rec.action === 'buy' ? 'Best Buy Now' : 'Wait Advised'}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                      {rec.reason}
                    </p>

                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Current Price</p>
                        <p className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{formatCurrency(rec.currentPrice)}<span className="text-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>/{rec.unit}</span></p>
                      </div>
                      {rec.savings > 0 && (
                        <div>
                          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Est. Savings</p>
                          <p className="text-lg font-bold" style={{ color: '#10B981' }}>{formatCurrency(rec.savings)}<span className="text-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>/{rec.unit}</span></p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Score Circular Gauge */}
                  <div className="flex flex-col items-center justify-center flex-shrink-0 w-24 h-24 rounded-full" style={{ background: 'var(--color-bg-alt)' }}>
                    <span className="text-2xl font-bold" style={{ color: rec.action === 'buy' ? '#10B981' : '#F59E0B' }}>{rec.score}</span>
                    <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Buy Score</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border-light)' }}>
                  <div className="flex items-center gap-1">
                    <Sparkles size={14} style={{ color: '#8B5CF6' }} />
                    <span className="text-xs" style={{ color: '#7C3AED' }}>{rec.confidence}% AI Confidence</span>
                  </div>
                  <button className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Find Sellers <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5" style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: '1px solid #BBF7D0' }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#065F46' }}>Top Savings Opportunity</h3>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold" style={{ color: '#059669' }}>Organic Potatoes</span>
            </div>
            <p className="text-xs mb-3" style={{ color: '#065F46' }}>Buy now and save ~15% compared to weekend prices.</p>
            <button className="btn btn-primary w-full btn-sm">Shop Now</button>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} style={{ color: '#F59E0B' }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Price Alerts</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Fresh Tomatoes', target: 'Below ₹25/kg', current: '₹28/kg' },
                { name: 'Alphonso Mangoes', target: 'Below ₹300/dz', current: '₹350/dz' },
              ].map((alert) => (
                <div key={alert.name} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'var(--color-bg-alt)' }}>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{alert.name}</p>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Target: {alert.target}</p>
                  </div>
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{alert.current}</span>
                </div>
              ))}
              <button className="w-full py-2 text-xs font-medium border-dashed border-2 rounded-lg" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                + Add Price Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
