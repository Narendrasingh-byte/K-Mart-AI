// ==========================================
// K-Mart AI — Risk Analysis
// ==========================================
'use client';

import React, { useState } from 'react';
import { sampleProducts } from '@/data/sampleData';
import { formatCurrency } from '@/lib/constants';
import {
  Shield, AlertTriangle, TrendingUp, TrendingDown, CloudRain,
  Thermometer, Truck, BarChart3, Brain, CheckCircle2, Sparkles,
  ChevronDown, Leaf, Info,
} from 'lucide-react';

const riskCategories = [
  { key: 'price', label: 'Price Volatility', icon: TrendingUp, score: 35, level: 'medium', detail: 'Moderate fluctuation. Tomato prices swinging ±8% this week due to uneven supply from Maharashtra.' },
  { key: 'demand', label: 'Demand Drop', icon: BarChart3, score: 15, level: 'low', detail: 'Strong buyer interest. 342 active buyers in your region. Restaurant demand at seasonal high.' },
  { key: 'weather', label: 'Weather Impact', icon: CloudRain, score: 72, level: 'high', detail: 'Heavy rainfall forecast in UP in 2-3 days. May disrupt harvest and transport. Pre-harvest recommended.' },
  { key: 'spoilage', label: 'Spoilage Risk', icon: Thermometer, score: 45, level: 'medium', detail: 'Average shelf life 3-5 days at current temperatures (32°C). Cold chain recommended for 50+ km transport.' },
  { key: 'transport', label: 'Transport Risk', icon: Truck, score: 55, level: 'medium', detail: 'Monsoon road conditions in UP. Highway delays reported on NH-58. Consider local mandis for immediate sale.' },
  { key: 'market', label: 'Market Competition', icon: TrendingDown, score: 28, level: 'low', detail: 'Your pricing is competitive. Only 12 other farmers listing tomatoes in Grade A+ quality nearby.' },
];

const aiRecommendations = [
  { priority: 'high', text: 'Harvest and sell tomatoes before rain arrives (2 days). Expected 15% price drop post-rain.', icon: CloudRain, color: '#EF4444' },
  { priority: 'high', text: 'Use covered transport for onion shipments. Moisture causes 8-12% value loss.', icon: Truck, color: '#EF4444' },
  { priority: 'medium', text: 'Consider cold storage for 200kg potato stock. Current temp risk is moderate.', icon: Thermometer, color: '#F59E0B' },
  { priority: 'medium', text: 'Diversify buyers — 70% of your sales go to 2 buyers. Reduce dependency risk.', icon: BarChart3, color: '#F59E0B' },
  { priority: 'low', text: 'Explore collective selling for wheat. 5 farmers nearby — combined transport saves ₹2,400.', icon: TrendingUp, color: '#10B981' },
];

export default function RiskAnalysisPage() {
  const [selectedProduct, setSelectedProduct] = useState('all');
  const overallScore = Math.round(riskCategories.reduce((s, r) => s + r.score, 0) / riskCategories.length);

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#EF4444';
    if (score >= 40) return '#F59E0B';
    return '#10B981';
  };

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'high': case 'very-high': return { bg: '#FEE2E2', text: '#DC2626' };
      case 'medium': return { bg: '#FEF3C7', text: '#B45309' };
      default: return { bg: '#D1FAE5', text: '#059669' };
    }
  };

  const circumference = 2 * Math.PI * 60;
  const dashOffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Risk Analysis 🛡️
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          AI-powered risk assessment for your farming business
        </p>
      </div>

      {/* Product Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setSelectedProduct('all')}
          className="btn btn-sm whitespace-nowrap"
          style={{
            background: selectedProduct === 'all' ? 'var(--color-primary)' : 'var(--color-surface)',
            color: selectedProduct === 'all' ? 'white' : 'var(--color-text-secondary)',
            border: selectedProduct === 'all' ? 'none' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
          }}
        >
          All Products
        </button>
        {sampleProducts.slice(0, 5).map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProduct(p.id)}
            className="btn btn-sm whitespace-nowrap"
            style={{
              background: selectedProduct === p.id ? 'var(--color-primary)' : 'var(--color-surface)',
              color: selectedProduct === p.id ? 'white' : 'var(--color-text-secondary)',
              border: selectedProduct === p.id ? 'none' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Score Gauge */}
        <div className="card p-6 flex flex-col items-center">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Overall Risk Score</h3>
          <div className="relative" style={{ width: 160, height: 160 }}>
            <svg viewBox="0 0 140 140" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="70" cy="70" r="60" fill="none" strokeWidth="12" stroke="#F1F5F9" />
              <circle
                cx="70" cy="70" r="60" fill="none" strokeWidth="12"
                stroke={getScoreColor(overallScore)}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: getScoreColor(overallScore) }}>
                {overallScore}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>/ 100</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className="badge" style={{
              background: overallScore >= 70 ? '#FEE2E2' : overallScore >= 40 ? '#FEF3C7' : '#D1FAE5',
              color: getScoreColor(overallScore),
              fontSize: '0.75rem',
            }}>
              {overallScore >= 70 ? 'High Risk' : overallScore >= 40 ? 'Medium Risk' : 'Low Risk'}
            </span>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
              Based on 6 risk factors analyzed by AI
            </p>
          </div>
        </div>

        {/* Risk Breakdown */}
        <div className="lg:col-span-2 space-y-3">
          {riskCategories.map((risk) => {
            const levelStyle = getLevelStyle(risk.level);
            return (
              <div key={risk.key} className="card p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: `${getScoreColor(risk.score)}15` }}>
                    <risk.icon size={20} color={getScoreColor(risk.score)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{risk.label}</h4>
                      <span className="badge capitalize" style={{ background: levelStyle.bg, color: levelStyle.text, fontSize: '0.625rem' }}>
                        {risk.level}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{risk.detail}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 rounded-full" style={{ background: '#F1F5F9' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${risk.score}%`, background: getScoreColor(risk.score) }}
                        />
                      </div>
                      <span className="text-xs font-bold" style={{ color: getScoreColor(risk.score) }}>{risk.score}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={18} style={{ color: 'var(--color-accent)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>AI Risk Mitigation Recommendations</h3>
          <span className="badge badge-info" style={{ fontSize: '0.625rem' }}>AI POWERED</span>
        </div>
        <div className="space-y-3">
          {aiRecommendations.map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl animate-fade-in-up"
              style={{
                animationDelay: `${i * 80}ms`,
                background: rec.priority === 'high' ? '#FEF2F2' : rec.priority === 'medium' ? '#FFFBEB' : '#F0FDF4',
                border: `1px solid ${rec.priority === 'high' ? '#FECACA' : rec.priority === 'medium' ? '#FDE68A' : '#BBF7D0'}`,
              }}
            >
              <div className="flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5" style={{ width: 28, height: 28, background: `${rec.color}15` }}>
                <rec.icon size={14} color={rec.color} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase" style={{ color: rec.color }}>{rec.priority} Priority</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{rec.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
