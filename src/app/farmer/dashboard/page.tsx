// ==========================================
// K-Mart AI — Farmer Dashboard
// ==========================================
'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/constants';
import {
  Package, ShoppingBag, IndianRupee, TrendingUp, Brain,
  AlertTriangle, ArrowRight, Plus, Eye, ShoppingCart,
  Zap, BarChart3, Shield, Users, ArrowUpRight, ArrowDownRight,
  CheckCircle2, Clock, Sprout,
} from 'lucide-react';

export default function FarmerDashboard() {
  const { userProfile } = useAuth();

  const stats = [
    { label: 'Total Products', value: '12', icon: Package, change: 2, color: '#2D6A4F', bg: 'stat-gradient-green' },
    { label: 'Active Listings', value: '8', icon: Eye, change: 1, color: '#0891B2', bg: 'stat-gradient-teal' },
    { label: 'Pending Orders', value: '5', icon: ShoppingBag, change: 3, color: '#E9A319', bg: 'stat-gradient-amber' },
    { label: 'Total Earnings', value: formatCurrency(125400), icon: IndianRupee, change: 18.5, color: '#10B981', bg: 'stat-gradient-green' },
  ];

  const recentOrders = [
    { id: 'ORD-1234', buyer: 'FreshMart Restaurant', product: 'Fresh Tomatoes', qty: '50 kg', amount: 1500, status: 'confirmed', time: '2h ago' },
    { id: 'ORD-1235', buyer: 'Anita Sharma', product: 'Organic Potatoes', qty: '20 kg', amount: 440, status: 'pending', time: '4h ago' },
    { id: 'ORD-1236', buyer: 'Green Basket Store', product: 'Premium Onions', qty: '100 kg', amount: 3500, status: 'preparing', time: '6h ago' },
    { id: 'ORD-1237', buyer: 'Delhi Fresh Foods', product: 'Basmati Rice', qty: '200 kg', amount: 17000, status: 'delivered', time: '1d ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return { bg: '#DBEAFE', text: '#2563EB' };
      case 'pending': return { bg: '#FEF3C7', text: '#B45309' };
      case 'preparing': return { bg: '#F3E8FF', text: '#7C3AED' };
      case 'delivered': return { bg: '#D1FAE5', text: '#059669' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Welcome back, {userProfile?.displayName?.split(' ')[0] || 'Farmer'}! 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Here&apos;s what&apos;s happening with your farm today
          </p>
        </div>
        <Link href="/farmer/sell-product" className="btn btn-primary no-underline">
          <Plus size={18} />
          Sell Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`card p-5 ${stat.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width: 44, height: 44, background: `${stat.color}15` }}
              >
                <stat.icon size={22} color={stat.color} />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: stat.change > 0 ? '#10B981' : '#EF4444' }}>
                {stat.change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              {stat.value}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight Card + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Market Insight */}
        <div className="lg:col-span-2 ai-insight-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={20} style={{ color: 'var(--color-accent)' }} />
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
              AI Market Insight
            </span>
            <span className="badge badge-info ml-auto" style={{ fontSize: '0.625rem' }}>LIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                <strong style={{ color: 'var(--color-text)' }}>Tomato</strong> demand is{' '}
                <span className="font-semibold" style={{ color: '#10B981' }}>HIGH</span>
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                  ₹28
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>/kg current price</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="badge badge-success">↑ 12% this week</span>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-primary)' }}>
                  AI Recommended Range
                </p>
                <p className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                  ₹30 – ₹32/kg
                </p>
              </div>
            </div>

            <div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)' }}>
                  <div className="flex items-center gap-2">
                    <Shield size={16} style={{ color: '#F59E0B' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Weather Risk</span>
                  </div>
                  <span className="badge badge-warning" style={{ fontSize: '0.625rem' }}>HIGH</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)' }}>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} style={{ color: '#10B981' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Demand Forecast</span>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.625rem' }}>HIGH</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)' }}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Spoilage Risk</span>
                  </div>
                  <span className="badge badge-warning" style={{ fontSize: '0.625rem' }}>MEDIUM</span>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-4 p-3 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
                <CheckCircle2 size={16} style={{ color: '#10B981' }} className="flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed" style={{ color: '#065F46' }}>
                  <strong>AI Recommendation:</strong> Sell 300 kg now at ₹30/kg. Hold 200 kg — prices expected to rise by weekend.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Sell New Product', icon: Plus, href: '/farmer/sell-product', color: '#2D6A4F' },
              { label: 'AI Advisor', icon: Brain, href: '/farmer/ai-advisor', color: '#0891B2' },
              { label: 'Market Prices', icon: TrendingUp, href: '/farmer/market-intelligence', color: '#E9A319' },
              { label: 'Risk Analysis', icon: Shield, href: '/farmer/risk-analysis', color: '#EF4444' },
              { label: 'View Orders', icon: ShoppingBag, href: '/farmer/orders', color: '#8B5CF6' },
              { label: 'My Earnings', icon: BarChart3, href: '/farmer/earnings', color: '#10B981' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all no-underline group"
              >
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: 36, height: 36, background: `${action.color}10` }}
                >
                  <action.icon size={18} color={action.color} />
                </div>
                <span className="text-sm font-medium flex-1" style={{ color: 'var(--color-text)' }}>
                  {action.label}
                </span>
                <ArrowRight size={14} style={{ color: 'var(--color-text-muted)' }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders + Market Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between p-5 pb-0">
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>Recent Orders</h3>
            <Link href="/farmer/orders" className="text-xs font-medium no-underline flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const statusStyle = getStatusColor(order.status);
                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 40, height: 40, background: 'var(--color-primary-pale)' }}>
                      <ShoppingCart size={18} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                          {order.product}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          {order.qty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{order.buyer}</span>
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>• {order.time}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                        {formatCurrency(order.amount)}
                      </div>
                      <span
                        className="badge mt-1 capitalize"
                        style={{ background: statusStyle.bg, color: statusStyle.text, fontSize: '0.625rem' }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Market Trend Summary */}
        <div className="card p-5">
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Market Trends</h3>
          <div className="space-y-4">
            {[
              { crop: 'Tomato', price: 28, change: 12, trend: 'up', demand: 'High' },
              { crop: 'Onion', price: 35, change: 16.7, trend: 'up', demand: 'Very High' },
              { crop: 'Potato', price: 22, change: -4.3, trend: 'down', demand: 'Medium' },
              { crop: 'Wheat', price: 28, change: 3.7, trend: 'up', demand: 'High' },
              { crop: 'Rice', price: 85, change: 3.7, trend: 'up', demand: 'High' },
            ].map((item) => (
              <div key={item.crop} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: 'var(--color-bg-alt)' }}>
                    <Sprout size={14} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{item.crop}</span>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.demand} demand</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>₹{item.price}/kg</div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: item.change > 0 ? '#10B981' : '#EF4444' }}>
                    {item.change > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {Math.abs(item.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/farmer/market-intelligence" className="btn btn-secondary w-full mt-5 no-underline text-xs">
            <BarChart3 size={14} />
            View Full Market Data
          </Link>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} style={{ color: 'var(--color-secondary)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>Important Alerts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} style={{ color: '#B45309' }} />
              <span className="text-xs font-semibold" style={{ color: '#B45309' }}>Weather Alert</span>
            </div>
            <p className="text-xs" style={{ color: '#92400E' }}>
              Heavy rainfall expected tomorrow in Meerut. Harvest mature tomatoes early to avoid spoilage risk.
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: '#D1FAE5', border: '1px solid #6EE7B7' }}>
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} style={{ color: '#059669' }} />
              <span className="text-xs font-semibold" style={{ color: '#059669' }}>New Buyer Match</span>
            </div>
            <p className="text-xs" style={{ color: '#065F46' }}>
              FreshMart Restaurant needs 300 kg tomatoes at ₹31/kg. Trust Score: 94/100.
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: '#DBEAFE', border: '1px solid #93C5FD' }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} style={{ color: '#2563EB' }} />
              <span className="text-xs font-semibold" style={{ color: '#2563EB' }}>Order Update</span>
            </div>
            <p className="text-xs" style={{ color: '#1E40AF' }}>
              Order #ORD-1236 is ready for pickup. Delivery partner will arrive by 3 PM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
