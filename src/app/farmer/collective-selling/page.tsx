// ==========================================
// K-Mart AI — Collective Selling
// ==========================================
'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/constants';
import { toast } from 'sonner';
import {
  Users, Handshake, Truck, TrendingUp, Search, Plus, MapPin,
  Clock, IndianRupee, Shield, ArrowRight, Sparkles, CheckCircle2,
} from 'lucide-react';

const activeGroups = [
  {
    id: 'GRP-101',
    product: 'Wheat (Sharbati)',
    destination: 'Delhi APMC',
    targetQty: 5000,
    currentQty: 3200,
    unit: 'kg',
    farmersCount: 4,
    deadline: '2 days',
    transportType: '10-Ton Truck',
    estPrice: 28,
    estSavings: 4500,
    distance: '65 km',
    joined: false,
  },
  {
    id: 'GRP-102',
    product: 'Onions',
    destination: 'Noida Wholesale',
    targetQty: 2000,
    currentQty: 1800,
    unit: 'kg',
    farmersCount: 3,
    deadline: 'Tomorrow',
    transportType: 'Mini Truck',
    estPrice: 35,
    estSavings: 2100,
    distance: '40 km',
    joined: true,
  },
  {
    id: 'GRP-103',
    product: 'Potatoes',
    destination: 'Meerut Mandi',
    targetQty: 3000,
    currentQty: 500,
    unit: 'kg',
    farmersCount: 1,
    deadline: '5 days',
    transportType: 'Medium Truck',
    estPrice: 22,
    estSavings: 3000,
    distance: '15 km',
    joined: false,
  },
];

export default function CollectiveSellingPage() {
  const [groups, setGroups] = useState(activeGroups);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filteredGroups = groups.filter((g) =>
    g.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = (id: string) => {
    toast.success('Joined collective selling group!');
    setGroups(groups.map((g) => g.id === id ? { ...g, joined: true, farmersCount: g.farmersCount + 1, currentQty: g.currentQty + 200 } : g));
  };

  const handleLeave = (id: string) => {
    toast.info('Left collective selling group.');
    setGroups(groups.map((g) => g.id === id ? { ...g, joined: false, farmersCount: g.farmersCount - 1, currentQty: g.currentQty - 200 } : g));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Collective Selling 🤝
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Pool your produce with nearby farmers to save on transport and negotiate better prices
          </p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn btn-primary">
          <Plus size={16} /> Create Group
        </button>
      </div>

      {/* AI Suggestion */}
      <div className="card p-5" style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: '1px solid #BBF7D0' }}>
        <div className="flex items-start gap-3">
          <Sparkles size={20} style={{ color: '#059669' }} className="flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: '#065F46' }}>AI Savings Opportunity</h3>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#065F46' }}>
              You are planning to sell 300kg of Onions to Noida. Joining <strong>GRP-102</strong> will reduce your transport cost from ₹800 to ₹250.
            </p>
            <button
              onClick={() => {
                if (!groups.find((g) => g.id === 'GRP-102')?.joined) handleJoin('GRP-102');
              }}
              className="btn btn-sm"
              style={{ background: '#059669', color: 'white', border: 'none' }}
              disabled={groups.find((g) => g.id === 'GRP-102')?.joined}
            >
              {groups.find((g) => g.id === 'GRP-102')?.joined ? 'Joined GRP-102' : 'Join GRP-102 Now'}
            </button>
          </div>
        </div>
      </div>

      <div className="relative w-full sm:w-96">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
        <input type="text" placeholder="Search by crop or destination..." className="input pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredGroups.map((group) => {
          const progress = Math.min((group.currentQty / group.targetQty) * 100, 100);
          return (
            <div key={group.id} className="card p-5 animate-fade-in-up">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{group.product}</h3>
                    {group.joined && (
                      <span className="badge" style={{ background: '#D1FAE5', color: '#059669', fontSize: '0.6rem' }}>
                        <CheckCircle2 size={10} className="inline mr-1" /> Joined
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                    <MapPin size={14} /> To: {group.destination} ({group.distance})
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{group.id}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Collected: <strong>{group.currentQty} {group.unit}</strong></span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Target: <strong>{group.targetQty} {group.unit}</strong></span>
                </div>
                <div className="h-2.5 rounded-full" style={{ background: '#F1F5F9' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progress}%`, background: progress >= 100 ? '#10B981' : 'linear-gradient(90deg, #2D6A4F, #52B788)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="flex items-center gap-2">
                  <Users size={16} style={{ color: 'var(--color-text-muted)' }} />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Farmers</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{group.farmersCount} Joined</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} style={{ color: 'var(--color-text-muted)' }} />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Departs In</p>
                    <p className="text-sm font-semibold" style={{ color: '#EF4444' }}>{group.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} style={{ color: 'var(--color-text-muted)' }} />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Transport</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{group.transportType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} style={{ color: '#10B981' }} />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Est Savings/Farmer</p>
                    <p className="text-sm font-semibold" style={{ color: '#10B981' }}>~{formatCurrency(group.estSavings)}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {group.joined ? (
                  <button onClick={() => handleLeave(group.id)} className="btn btn-outline flex-1">Leave Group</button>
                ) : (
                  <button onClick={() => handleJoin(group.id)} className="btn btn-primary flex-1" disabled={progress >= 100}>
                    {progress >= 100 ? 'Group Full' : 'Join Group'}
                  </button>
                )}
                <button className="btn btn-ghost" style={{ color: 'var(--color-text-secondary)' }}>Details</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
