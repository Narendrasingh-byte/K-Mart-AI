// ==========================================
// K-Mart AI — Consumer Orders
// ==========================================
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatRelativeTime, formatDate } from '@/lib/constants';
import { sampleProducts } from '@/data/sampleData';
import {
  ShoppingBag, Clock, CheckCircle2, Truck, Package, XCircle,
  Search, Star, MapPin, ArrowRight, RefreshCw, Leaf, ChevronDown, ChevronUp,
} from 'lucide-react';

// Map product names to their images for quick lookup
const productImageMap: Record<string, string> = {};
sampleProducts.forEach((p) => {
  productImageMap[p.name] = p.images[0] || '';
});

const consumerOrders = [
  { id: 'ORD-2001', farmer: 'Rajesh Kumar', product: 'Fresh Tomatoes', qty: '10 kg', amount: 280, status: 'in-transit', placedAt: '2026-09-09T06:00:00Z', eta: 'Today, 5 PM', rated: false },
  { id: 'ORD-2002', farmer: 'Amit Singh', product: 'Premium Onions', qty: '5 kg', amount: 175, status: 'delivered', placedAt: '2026-09-08T10:00:00Z', eta: 'Delivered Sep 8', rated: false },
  { id: 'ORD-2003', farmer: 'Priya Devi', product: 'Alphonso Mangoes', qty: '2 dozen', amount: 700, status: 'completed', placedAt: '2026-09-05T08:00:00Z', eta: 'Sep 5', rated: true },
  { id: 'ORD-2004', farmer: 'Suresh Yadav', product: 'Organic Potatoes', qty: '15 kg', amount: 330, status: 'confirmed', placedAt: '2026-09-09T04:00:00Z', eta: 'Tomorrow, 10 AM', rated: false },
  { id: 'ORD-2005', farmer: 'Vikram Patel', product: 'Fresh Cauliflower', qty: '8 kg', amount: 320, status: 'completed', placedAt: '2026-09-03T12:00:00Z', eta: 'Sep 3', rated: true },
  { id: 'ORD-2006', farmer: 'Harinder Kaur', product: 'Punjab Wheat', qty: '50 kg', amount: 1400, status: 'cancelled', placedAt: '2026-09-02T09:00:00Z', eta: 'Cancelled', rated: false },
];

export default function ConsumerOrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const filtered = consumerOrders.filter((o) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!o.product.toLowerCase().includes(q) && !o.farmer.toLowerCase().includes(q) && !o.id.toLowerCase().includes(q)) return false;
    }
    if (activeTab === 'active') return ['confirmed', 'preparing', 'ready', 'in-transit', 'delivered'].includes(o.status);
    if (activeTab === 'completed') return o.status === 'completed';
    if (activeTab === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  const getStatusStyle = (status: string) => {
    const map: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
      'pending': { bg: '#FEF3C7', text: '#B45309', icon: <Clock size={14} />, label: 'Pending' },
      'confirmed': { bg: '#DBEAFE', text: '#2563EB', icon: <CheckCircle2 size={14} />, label: 'Confirmed' },
      'preparing': { bg: '#F3E8FF', text: '#7C3AED', icon: <Package size={14} />, label: 'Preparing' },
      'ready': { bg: '#CFFAFE', text: '#0891B2', icon: <Package size={14} />, label: 'Ready' },
      'in-transit': { bg: '#EDE9FE', text: '#6366F1', icon: <Truck size={14} />, label: 'In Transit' },
      'delivered': { bg: '#D1FAE5', text: '#059669', icon: <CheckCircle2 size={14} />, label: 'Delivered' },
      'completed': { bg: '#D1FAE5', text: '#059669', icon: <CheckCircle2 size={14} />, label: 'Completed' },
      'cancelled': { bg: '#FEE2E2', text: '#DC2626', icon: <XCircle size={14} />, label: 'Cancelled' },
    };
    return map[status] || { bg: '#F1F5F9', text: '#64748B', icon: null, label: status };
  };

  const statusTimeline = ['confirmed', 'preparing', 'ready', 'in-transit', 'delivered'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          My Orders 📦
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Track your orders and purchase history</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="btn btn-sm"
            style={{
              background: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeTab === tab.key ? 'white' : 'var(--color-text-secondary)',
              border: activeTab === tab.key ? 'none' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative" style={{ marginTop: '18px', marginBottom: '18px' }}>
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
        <input type="text" placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state py-16">
          <ShoppingBag size={48} style={{ color: 'var(--color-text-muted)' }} />
          <h3 className="text-lg font-semibold mt-4" style={{ color: 'var(--color-text)' }}>No orders found</h3>
          <Link href="/consumer/marketplace" className="btn btn-primary mt-4 no-underline">Browse Marketplace</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, index) => {
            const status = getStatusStyle(order.status);
            const isExpanded = expandedOrder === order.id;
            const currentStep = statusTimeline.indexOf(order.status);
            return (
              <div key={order.id} className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
                <div className="p-4 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)' }}>
                      <img
                        src={productImageMap[order.product] || '/images/tomato.jpg'}
                        alt={order.product}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{order.product}</h3>
                        <span className="badge flex items-center gap-1" style={{ background: status.bg, color: status.text, fontSize: '0.625rem' }}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {order.farmer} • {order.qty} • {order.id}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        <Clock size={10} className="inline mr-1" />{order.eta}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-bold" style={{ color: 'var(--color-text)' }}>{formatCurrency(order.amount)}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{formatRelativeTime(order.placedAt)}</p>
                    </div>
                    {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t animate-fade-in" style={{ borderColor: 'var(--color-border-light)' }}>
                    {/* Status Timeline */}
                    {order.status !== 'cancelled' && (
                      <div className="flex items-center justify-between mt-4 mb-4 px-2">
                        {statusTimeline.map((s, i) => {
                          const isActive = i <= currentStep;
                          const isCurrent = i === currentStep;
                          return (
                            <React.Fragment key={s}>
                              <div className="flex flex-col items-center gap-1">
                                <div
                                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                                  style={{
                                    background: isActive ? 'var(--color-primary)' : 'var(--color-bg-alt)',
                                    border: isCurrent ? '2px solid var(--color-primary)' : 'none',
                                    transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                                  }}
                                >
                                  <CheckCircle2 size={12} color={isActive ? 'white' : 'var(--color-text-muted)'} />
                                </div>
                                <span className="text-xs capitalize whitespace-nowrap" style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)', fontSize: '0.6rem', fontWeight: isActive ? 600 : 400 }}>
                                  {s.replace('-', ' ')}
                                </span>
                              </div>
                              {i < statusTimeline.length - 1 && (
                                <div className="flex-1 h-0.5 mx-1" style={{ background: i < currentStep ? 'var(--color-primary)' : 'var(--color-border)' }} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      {order.status === 'delivered' && !order.rated && (
                        <button className="btn btn-primary btn-sm" onClick={() => { /* TODO */ }}>
                          <Star size={14} /> Rate Order
                        </button>
                      )}
                      <button className="btn btn-outline btn-sm" onClick={() => { /* TODO */ }}>
                        <RefreshCw size={14} /> Reorder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
