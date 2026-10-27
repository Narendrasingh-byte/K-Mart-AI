// ==========================================
// K-Mart AI — Consumer Dashboard
// ==========================================
'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/constants';
import { sampleProducts } from '@/data/sampleData';
import {
  ShoppingBag, TrendingUp, Brain, Heart, Star,
  ArrowRight, ArrowUpRight, ArrowDownRight,
  ShoppingCart, Clock, Package, MapPin, CheckCircle2,
  Sparkles, Leaf, Eye,
} from 'lucide-react';

export default function ConsumerDashboard() {
  const { userProfile } = useAuth();

  const stats = [
    { label: 'Total Orders', value: '14', icon: ShoppingBag, change: 3, color: '#2D6A4F', bg: 'stat-gradient-green' },
    { label: 'Active Orders', value: '2', icon: Clock, change: 0, color: '#0891B2', bg: 'stat-gradient-teal' },
    { label: 'Wishlist Items', value: '8', icon: Heart, change: 2, color: '#EF4444', bg: 'stat-gradient-amber' },
    { label: 'Amount Saved', value: formatCurrency(2340), icon: TrendingUp, change: 15, color: '#10B981', bg: 'stat-gradient-green' },
  ];

  const trendingProducts = sampleProducts.slice(0, 4);

  const recentOrders = [
    { id: 'ORD-2001', farmer: 'Rajesh Kumar', product: 'Fresh Tomatoes', qty: '10 kg', amount: 280, status: 'in-transit', eta: 'Today, 5 PM' },
    { id: 'ORD-2002', farmer: 'Amit Singh', product: 'Premium Onions', qty: '5 kg', amount: 175, status: 'delivered', eta: 'Delivered' },
    { id: 'ORD-2003', farmer: 'Priya Devi', product: 'Alphonso Mangoes', qty: '2 dozen', amount: 700, status: 'completed', eta: 'Sep 5' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-transit': return { bg: '#EDE9FE', text: '#7C3AED' };
      case 'delivered': return { bg: '#D1FAE5', text: '#059669' };
      case 'completed': return { bg: '#F1F5F9', text: '#475569' };
      default: return { bg: '#FEF3C7', text: '#B45309' };
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Welcome, {userProfile?.displayName?.split(' ')[0] || 'Consumer'}! 🛒
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Fresh produce and AI-powered buying intelligence await you
          </p>
        </div>
        <Link href="/consumer/marketplace" className="btn btn-primary no-underline">
          <ShoppingCart size={18} />
          Shop Now
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
              {stat.change > 0 && (
                <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#10B981' }}>
                  <ArrowUpRight size={14} />
                  {stat.change}
                </div>
              )}
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

      {/* AI Buying Insight + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Buying Advisor Highlight */}
        <div className="lg:col-span-2 ai-insight-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={20} style={{ color: 'var(--color-accent)' }} />
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
              AI Buying Intelligence
            </span>
            <span className="badge badge-info ml-auto" style={{ fontSize: '0.625rem' }}>AI POWERED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Best Buy */}
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.8)' }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                <span className="text-xs font-semibold" style={{ color: '#059669' }}>Best Buy Now</span>
              </div>
              <p className="text-base font-bold mb-1" style={{ color: 'var(--color-text)' }}>Organic Potatoes</p>
              <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>₹22/kg</p>
              <div className="flex items-center gap-1 mt-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: '#D1FAE5' }}>
                  <div className="h-full rounded-full" style={{ width: '88%', background: '#10B981' }} />
                </div>
                <span className="text-xs font-bold" style={{ color: '#10B981' }}>88</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Buy Score</p>
            </div>

            {/* Wait */}
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.8)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} style={{ color: '#F59E0B' }} />
                <span className="text-xs font-semibold" style={{ color: '#B45309' }}>Wait Advised</span>
              </div>
              <p className="text-base font-bold mb-1" style={{ color: 'var(--color-text)' }}>Premium Onions</p>
              <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>₹35/kg</p>
              <p className="text-xs mt-2" style={{ color: '#B45309' }}>
                Price ↑16.7% above average. Supply expected to increase next week.
              </p>
            </div>

            {/* Trending */}
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.8)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} style={{ color: '#8B5CF6' }} />
                <span className="text-xs font-semibold" style={{ color: '#7C3AED' }}>Trending</span>
              </div>
              <p className="text-base font-bold mb-1" style={{ color: 'var(--color-text)' }}>Alphonso Mangoes</p>
              <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>₹350/dz</p>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Limited seasonal availability. 892 views today.
              </p>
            </div>
          </div>

          <Link href="/consumer/ai-buying-advisor" className="btn btn-accent mt-4 no-underline text-xs">
            <Brain size={14} />
            Open AI Buying Advisor
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>Recent Orders</h3>
            <Link href="/consumer/orders" className="text-xs font-medium no-underline" style={{ color: 'var(--color-primary)' }}>
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              return (
                <div key={order.id} className="p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{order.product}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                      {formatCurrency(order.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {order.farmer} • {order.qty}
                    </span>
                    <span
                      className="badge capitalize"
                      style={{ background: statusStyle.bg, color: statusStyle.text, fontSize: '0.6rem' }}
                    >
                      {order.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Package size={11} style={{ color: 'var(--color-text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{order.eta}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trending Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Fresh From Farms 🌿
          </h3>
          <Link href="/consumer/marketplace" className="text-sm font-medium no-underline flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
            Browse All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingProducts.map((product) => (
            <Link
              key={product.id}
              href={`/consumer/marketplace/${product.id}`}
              className="card card-interactive p-4 no-underline group"
            >
              {/* Product image */}
              <div
                className="w-full h-36 rounded-xl mb-3 overflow-hidden"
                style={{ background: 'var(--color-bg-alt)' }}
              >
                <img
                  src={product.images[0] || '/images/tomato.jpg'}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  className="group-hover:scale-105"
                />
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-text)' }}>
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-1">
                    <MapPin size={10} style={{ color: 'var(--color-text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{product.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>
                    ₹{product.price}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>/{product.unit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                <div className="flex items-center gap-1">
                  <Star size={12} style={{ color: '#F59E0B' }} fill="#F59E0B" />
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{product.farmerRating}</span>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.6rem' }}>
                  {product.qualityGrade}
                </span>
                <div className="flex items-center gap-1">
                  <Eye size={12} style={{ color: 'var(--color-text-muted)' }} />
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{product.views}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories Quick Access */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Shop by Category
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { name: 'Vegetables', emoji: '🥬', count: 45 },
            { name: 'Fruits', emoji: '🍎', count: 28 },
            { name: 'Grains', emoji: '🌾', count: 18 },
            { name: 'Pulses', emoji: '🫘', count: 12 },
            { name: 'Spices', emoji: '🌶️', count: 22 },
          ].map((cat) => (
            <Link
              key={cat.name}
              href="/consumer/categories"
              className="card card-interactive p-4 text-center no-underline"
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{cat.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{cat.count} products</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
