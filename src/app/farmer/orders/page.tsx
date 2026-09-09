// ==========================================
// K-Mart AI — Farmer Orders
// ==========================================
'use client';

import React, { useState } from 'react';
import { formatCurrency, formatRelativeTime } from '@/lib/constants';
import { toast } from 'sonner';
import {
  ShoppingBag, Clock, CheckCircle2, Truck, Package, XCircle,
  Search, Filter, ArrowRight, Phone, MapPin, User,
  IndianRupee, Eye,
} from 'lucide-react';

const sampleOrders = [
  { id: 'ORD-1001', buyer: 'FreshMart Restaurant', buyerPhone: '9876543210', product: 'Fresh Tomatoes', qty: '50 kg', amount: 1500, status: 'pending', address: 'Sector 15, Noida, UP', placedAt: '2026-09-09T08:00:00Z' },
  { id: 'ORD-1002', buyer: 'Anita Sharma', buyerPhone: '9123456789', product: 'Organic Potatoes', qty: '20 kg', amount: 440, status: 'confirmed', address: '42 MG Road, Delhi', placedAt: '2026-09-09T06:30:00Z' },
  { id: 'ORD-1003', buyer: 'Green Basket Store', buyerPhone: '9988776655', product: 'Premium Onions', qty: '100 kg', amount: 3500, status: 'preparing', address: 'Saket, New Delhi', placedAt: '2026-09-08T14:00:00Z' },
  { id: 'ORD-1004', buyer: 'Delhi Fresh Foods', buyerPhone: '9111222333', product: 'Basmati Rice', qty: '200 kg', amount: 17000, status: 'ready', address: 'Chandni Chowk, Delhi', placedAt: '2026-09-08T10:00:00Z' },
  { id: 'ORD-1005', buyer: 'Rahul Verma', buyerPhone: '9444555666', product: 'Fresh Cauliflower', qty: '30 kg', amount: 1200, status: 'in-transit', address: 'Dwarka, Delhi', placedAt: '2026-09-07T16:00:00Z' },
  { id: 'ORD-1006', buyer: 'Spice Corner', buyerPhone: '9777888999', product: 'Green Chillies', qty: '15 kg', amount: 900, status: 'delivered', address: 'Lajpat Nagar, Delhi', placedAt: '2026-09-07T09:00:00Z' },
  { id: 'ORD-1007', buyer: 'Mango Lovers Club', buyerPhone: '9000111222', product: 'Alphonso Mangoes', qty: '5 dozen', amount: 1750, status: 'completed', address: 'Gurgaon, HR', placedAt: '2026-09-05T12:00:00Z' },
  { id: 'ORD-1008', buyer: 'Quick Bites Cafe', buyerPhone: '9333444555', product: 'Fresh Coriander', qty: '20 bunch', amount: 300, status: 'cancelled', address: 'Connaught Place, Delhi', placedAt: '2026-09-04T08:00:00Z' },
];

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState(sampleOrders);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const tabs = [
    { key: 'all', label: 'All Orders', count: orders.length },
    { key: 'pending', label: 'Pending', count: orders.filter((o) => o.status === 'pending').length },
    { key: 'confirmed', label: 'Active', count: orders.filter((o) => ['confirmed', 'preparing', 'ready'].includes(o.status)).length },
    { key: 'transit', label: 'In Transit', count: orders.filter((o) => o.status === 'in-transit').length },
    { key: 'completed', label: 'Completed', count: orders.filter((o) => ['delivered', 'completed'].includes(o.status)).length },
  ];

  const filteredOrders = orders.filter((o) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!o.buyer.toLowerCase().includes(q) && !o.product.toLowerCase().includes(q) && !o.id.toLowerCase().includes(q)) return false;
    }
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return o.status === 'pending';
    if (activeTab === 'confirmed') return ['confirmed', 'preparing', 'ready'].includes(o.status);
    if (activeTab === 'transit') return o.status === 'in-transit';
    if (activeTab === 'completed') return ['delivered', 'completed'].includes(o.status);
    return true;
  });

  const totalRevenue = orders.filter((o) => ['delivered', 'completed'].includes(o.status)).reduce((s, o) => s + o.amount, 0);

  const getStatusStyle = (status: string) => {
    const map: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      'pending': { bg: '#FEF3C7', text: '#B45309', icon: <Clock size={12} /> },
      'confirmed': { bg: '#DBEAFE', text: '#2563EB', icon: <CheckCircle2 size={12} /> },
      'preparing': { bg: '#F3E8FF', text: '#7C3AED', icon: <Package size={12} /> },
      'ready': { bg: '#CFFAFE', text: '#0891B2', icon: <Package size={12} /> },
      'in-transit': { bg: '#EDE9FE', text: '#6366F1', icon: <Truck size={12} /> },
      'delivered': { bg: '#D1FAE5', text: '#059669', icon: <CheckCircle2 size={12} /> },
      'completed': { bg: '#D1FAE5', text: '#059669', icon: <CheckCircle2 size={12} /> },
      'cancelled': { bg: '#FEE2E2', text: '#DC2626', icon: <XCircle size={12} /> },
    };
    return map[status] || { bg: '#F1F5F9', text: '#64748B', icon: null };
  };

  const updateOrderStatus = (id: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
    toast.success(`Order ${id} updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Orders 📋
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Manage and track your orders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card px-4 py-2 flex items-center gap-2">
            <IndianRupee size={16} style={{ color: '#10B981' }} />
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Revenue</p>
              <p className="text-sm font-bold" style={{ color: '#10B981' }}>{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="btn btn-sm whitespace-nowrap"
            style={{
              background: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeTab === tab.key ? 'white' : 'var(--color-text-secondary)',
              border: activeTab === tab.key ? 'none' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            {tab.label}
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs" style={{
              background: activeTab === tab.key ? 'rgba(255,255,255,0.2)' : 'var(--color-bg-alt)',
              fontSize: '0.65rem',
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          placeholder="Search by order ID, buyer, or product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-9"
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state py-16">
          <ShoppingBag size={48} style={{ color: 'var(--color-text-muted)' }} />
          <h3 className="text-lg font-semibold mt-4" style={{ color: 'var(--color-text)' }}>No orders found</h3>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Orders will appear here when customers buy your products</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order, index) => {
            const status = getStatusStyle(order.status);
            const isExpanded = expandedOrder === order.id;
            return (
              <div
                key={order.id}
                className="card overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 44, height: 44, background: status.bg }}>
                      {status.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{order.id}</span>
                        <span className="badge capitalize" style={{ background: status.bg, color: status.text, fontSize: '0.625rem' }}>
                          {order.status.replace('-', ' ')}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{order.product} • {order.qty}</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                        <User size={10} className="inline mr-1" />{order.buyer} • {formatRelativeTime(order.placedAt)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-bold" style={{ color: 'var(--color-text)' }}>{formatCurrency(order.amount)}</p>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t animate-fade-in" style={{ borderColor: 'var(--color-border-light)' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <User size={14} style={{ color: 'var(--color-text-muted)' }} />
                        <div>
                          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Buyer</p>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{order.buyer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} style={{ color: 'var(--color-text-muted)' }} />
                        <div>
                          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Phone</p>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{order.buyerPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} style={{ color: 'var(--color-text-muted)' }} />
                        <div>
                          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Delivery Address</p>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{order.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-4">
                      {order.status === 'pending' && (
                        <>
                          <button onClick={() => updateOrderStatus(order.id, 'confirmed')} className="btn btn-primary btn-sm">
                            <CheckCircle2 size={14} /> Accept Order
                          </button>
                          <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="btn btn-outline btn-sm" style={{ color: '#EF4444', borderColor: '#EF4444' }}>
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="btn btn-primary btn-sm">
                          <Package size={14} /> Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button onClick={() => updateOrderStatus(order.id, 'ready')} className="btn btn-primary btn-sm">
                          <CheckCircle2 size={14} /> Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button onClick={() => updateOrderStatus(order.id, 'in-transit')} className="btn btn-primary btn-sm">
                          <Truck size={14} /> Dispatch
                        </button>
                      )}
                      {order.status === 'in-transit' && (
                        <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="btn btn-primary btn-sm">
                          <CheckCircle2 size={14} /> Mark Delivered
                        </button>
                      )}
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
