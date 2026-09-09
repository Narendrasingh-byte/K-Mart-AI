// ==========================================
// K-Mart AI — Farmer Earnings
// ==========================================
'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/constants';
import {
  IndianRupee, TrendingUp, ArrowUpRight, ArrowDownRight, Wallet,
  Calendar, Download, BarChart3, Package, ShoppingBag, CreditCard,
} from 'lucide-react';

const earningsData = {
  today: 4200, thisWeek: 28500, thisMonth: 125400, total: 485600,
  transactions: [
    { id: 'TXN-001', type: 'credit', label: 'Order #ORD-1234 — Fresh Tomatoes', amount: 1500, date: '2026-09-09T08:00:00Z', status: 'completed' },
    { id: 'TXN-002', type: 'credit', label: 'Order #ORD-1235 — Organic Potatoes', amount: 440, date: '2026-09-09T06:00:00Z', status: 'completed' },
    { id: 'TXN-003', type: 'debit', label: 'Platform Fee — September', amount: 850, date: '2026-09-08T12:00:00Z', status: 'completed' },
    { id: 'TXN-004', type: 'credit', label: 'Order #ORD-1236 — Premium Onions', amount: 3500, date: '2026-09-08T10:00:00Z', status: 'completed' },
    { id: 'TXN-005', type: 'debit', label: 'Withdrawal to Bank', amount: 15000, date: '2026-09-07T14:00:00Z', status: 'completed' },
    { id: 'TXN-006', type: 'credit', label: 'Order #ORD-1237 — Basmati Rice', amount: 17000, date: '2026-09-07T08:00:00Z', status: 'completed' },
    { id: 'TXN-007', type: 'credit', label: 'Order #ORD-1238 — Green Chillies', amount: 900, date: '2026-09-06T16:00:00Z', status: 'pending' },
    { id: 'TXN-008', type: 'credit', label: 'Order #ORD-1239 — Fresh Coriander', amount: 450, date: '2026-09-06T10:00:00Z', status: 'completed' },
  ],
  categoryBreakdown: [
    { category: 'Vegetables', amount: 52400, pct: 42 },
    { category: 'Grains', amount: 37500, pct: 30 },
    { category: 'Spices', amount: 18700, pct: 15 },
    { category: 'Fruits', amount: 10100, pct: 8 },
    { category: 'Others', amount: 6700, pct: 5 },
  ],
  weeklyData: [
    { day: 'Mon', amount: 3200 },
    { day: 'Tue', amount: 4800 },
    { day: 'Wed', amount: 2100 },
    { day: 'Thu', amount: 5400 },
    { day: 'Fri', amount: 6200 },
    { day: 'Sat', amount: 3800 },
    { day: 'Sun', amount: 3000 },
  ],
};

export default function EarningsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'total'>('month');
  const maxWeekly = Math.max(...earningsData.weeklyData.map((d) => d.amount));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Earnings 💰
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Track your revenue and payouts</p>
        </div>
        <button className="btn btn-outline btn-sm">
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Today', value: earningsData.today, change: 12, icon: IndianRupee, color: '#10B981' },
          { label: 'This Week', value: earningsData.thisWeek, change: 8.5, icon: Calendar, color: '#0891B2' },
          { label: 'This Month', value: earningsData.thisMonth, change: 18.5, icon: TrendingUp, color: '#E9A319' },
          { label: 'Total Earnings', value: earningsData.total, change: 0, icon: Wallet, color: '#2D6A4F' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center justify-center rounded-xl" style={{ width: 36, height: 36, background: `${stat.color}15` }}>
                <stat.icon size={18} color={stat.color} />
              </div>
              {stat.change > 0 && (
                <div className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#10B981' }}>
                  <ArrowUpRight size={12} /> {stat.change}%
                </div>
              )}
            </div>
            <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{formatCurrency(stat.value)}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>Weekly Earnings</h3>
            <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{formatCurrency(earningsData.thisWeek)}</span>
          </div>
          <div className="flex items-end gap-3 h-48">
            {earningsData.weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{formatCurrency(d.amount)}</span>
                <div
                  className="w-full rounded-lg transition-all hover:opacity-80"
                  style={{
                    height: `${(d.amount / maxWeekly) * 100}%`,
                    minHeight: '12px',
                    background: 'linear-gradient(180deg, #2D6A4F, #52B788)',
                  }}
                />
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card p-5">
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Revenue by Category</h3>
          <div className="space-y-4">
            {earningsData.categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{cat.category}</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>{formatCurrency(cat.amount)}</span>
                </div>
                <div className="h-2.5 rounded-full" style={{ background: '#F1F5F9' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${cat.pct}%`, background: 'linear-gradient(90deg, #2D6A4F, #52B788)' }} />
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{cat.pct}% of total</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Withdrawal Card */}
      <div className="card p-5" style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: '1px solid #BBF7D0' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Available for Withdrawal</p>
            <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{formatCurrency(85400)}</p>
            <p className="text-xs mt-1" style={{ color: '#065F46' }}>Minimum withdrawal: ₹100</p>
          </div>
          <button className="btn btn-primary btn-lg">
            <CreditCard size={18} /> Withdraw to Bank
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <div className="p-5 pb-0">
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>Transaction History</h3>
        </div>
        <div className="p-5">
          <div className="space-y-2">
            {earningsData.transactions.map((txn, index) => (
              <div
                key={txn.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{
                    width: 40, height: 40,
                    background: txn.type === 'credit' ? '#D1FAE5' : '#FEE2E2',
                  }}
                >
                  {txn.type === 'credit' ? (
                    <ArrowDownRight size={18} style={{ color: '#059669' }} />
                  ) : (
                    <ArrowUpRight size={18} style={{ color: '#DC2626' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{txn.label}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: txn.type === 'credit' ? '#059669' : '#DC2626' }}>
                    {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </p>
                  <span className="badge capitalize" style={{
                    background: txn.status === 'completed' ? '#D1FAE5' : '#FEF3C7',
                    color: txn.status === 'completed' ? '#059669' : '#B45309',
                    fontSize: '0.6rem',
                  }}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
