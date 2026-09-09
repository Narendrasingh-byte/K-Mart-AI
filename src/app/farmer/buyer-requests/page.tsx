// ==========================================
// K-Mart AI — Farmer Buyer Requests
// ==========================================
'use client';

import React, { useState } from 'react';
import { formatCurrency, formatRelativeTime } from '@/lib/constants';
import { toast } from 'sonner';
import {
  Users, MapPin, Search, CheckCircle2, XCircle, Handshake,
  Shield, AlertTriangle, ArrowRight, Star, Clock,
} from 'lucide-react';

const sampleRequests = [
  {
    id: 'REQ-001',
    buyerName: 'FreshMart Restaurant',
    buyerType: 'Business',
    trustScore: 94,
    product: 'Fresh Tomatoes',
    qty: '300 kg',
    offeredPrice: 30,
    unit: 'kg',
    marketAvg: 28,
    distance: '12 km',
    expiresIn: '4 hours',
    status: 'open',
    note: 'Need Grade A quality for our chain of restaurants. Consistent daily supply preferred.',
  },
  {
    id: 'REQ-002',
    buyerName: 'Green Basket Retail',
    buyerType: 'Retailer',
    trustScore: 88,
    product: 'Organic Potatoes',
    qty: '150 kg',
    offeredPrice: 20,
    unit: 'kg',
    marketAvg: 22,
    distance: '8 km',
    expiresIn: '2 days',
    status: 'open',
    note: 'Looking for bulk discount on organic potatoes.',
  },
  {
    id: 'REQ-003',
    buyerName: 'Sharma Foods',
    buyerType: 'Wholesaler',
    trustScore: 75,
    product: 'Onions',
    qty: '500 kg',
    offeredPrice: 32,
    unit: 'kg',
    marketAvg: 35,
    distance: '25 km',
    expiresIn: 'Expired',
    status: 'expired',
    note: '',
  },
];

export default function BuyerRequestsPage() {
  const [requests, setRequests] = useState(sampleRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('open');

  const filteredRequests = requests.filter((r) => {
    if (activeTab !== 'all' && r.status !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.product.toLowerCase().includes(q) || r.buyerName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAction = (id: string, action: string) => {
    if (action === 'accept') {
      toast.success('Request accepted! Buyer will be notified.');
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'accepted' } : r));
    } else if (action === 'reject') {
      toast.info('Request rejected.');
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'rejected' } : r));
    } else if (action === 'negotiate') {
      toast.info('Negotiation feature coming soon.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Buyer Requests 🤝
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Direct bulk requests from verified businesses and retailers
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['open', 'accepted', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="btn btn-sm capitalize"
              style={{
                background: activeTab === tab ? 'var(--color-primary)' : 'var(--color-surface)',
                color: activeTab === tab ? 'white' : 'var(--color-text-secondary)',
                border: activeTab === tab ? 'none' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search products or buyers..."
            className="input pl-9 btn-sm text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="empty-state py-16">
            <Users size={48} style={{ color: 'var(--color-text-muted)' }} />
            <h3 className="text-lg font-semibold mt-4" style={{ color: 'var(--color-text)' }}>No requests found</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>You have no buyer requests matching your criteria.</p>
          </div>
        ) : (
          filteredRequests.map((req, index) => (
            <div key={req.id} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`, opacity: req.status === 'expired' ? 0.6 : 1 }}>
              <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>{req.product}</h3>
                      <span className="badge" style={{ background: 'var(--color-primary-pale)', color: 'var(--color-primary)', fontSize: '0.625rem' }}>
                        {req.qty}
                      </span>
                    </div>
                    <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{req.id}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <div className="flex items-center gap-1">
                      <Users size={14} /> {req.buyerName} <span className="text-xs">({req.buyerType})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield size={14} style={{ color: req.trustScore > 90 ? '#10B981' : '#F59E0B' }} />
                      <span style={{ color: req.trustScore > 90 ? '#10B981' : '#F59E0B' }}>Trust: {req.trustScore}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <MapPin size={14} /> {req.distance} away
                  </div>

                  {req.note && (
                    <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--color-bg-alt)', color: 'var(--color-text-secondary)' }}>
                      &quot;{req.note}&quot;
                    </div>
                  )}
                </div>

                <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-5" style={{ borderColor: 'var(--color-border-light)' }}>
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Offered Price</span>
                      <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>₹{req.offeredPrice}<span className="text-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>/{req.unit}</span></span>
                    </div>
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Market Avg</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>₹{req.marketAvg}/{req.unit}</span>
                    </div>

                    <div className="flex items-center gap-1 mb-4 text-xs font-medium" style={{ color: req.offeredPrice >= req.marketAvg ? '#10B981' : '#F59E0B' }}>
                      {req.offeredPrice >= req.marketAvg ? (
                        <>✅ Good Offer (+{Math.round((req.offeredPrice - req.marketAvg) / req.marketAvg * 100)}%)</>
                      ) : (
                        <>⚠️ Below Market (-{Math.round((req.marketAvg - req.offeredPrice) / req.marketAvg * 100)}%)</>
                      )}
                    </div>
                  </div>

                  {req.status === 'open' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 justify-center text-xs mb-2" style={{ color: '#EF4444' }}>
                        <Clock size={12} /> Expires in {req.expiresIn}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAction(req.id, 'accept')} className="btn btn-primary flex-1 btn-sm">Accept</button>
                        <button onClick={() => handleAction(req.id, 'reject')} className="btn btn-outline flex-1 btn-sm text-red-500 hover:bg-red-50" style={{ borderColor: '#FECACA' }}>Reject</button>
                      </div>
                      <button onClick={() => handleAction(req.id, 'negotiate')} className="btn btn-ghost w-full btn-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <Handshake size={14} /> Negotiate
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <span className="badge capitalize" style={{
                        background: req.status === 'accepted' ? '#D1FAE5' : '#F1F5F9',
                        color: req.status === 'accepted' ? '#059669' : 'var(--color-text-muted)'
                      }}>
                        {req.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
