// ==========================================
// K-Mart AI — Inventory Management
// ==========================================
'use client';

import React, { useState } from 'react';
import { sampleProducts } from '@/data/sampleData';
import { formatCurrency } from '@/lib/constants';
import { toast } from 'sonner';
import {
  Warehouse, AlertTriangle, Package, TrendingDown, Minus, Plus,
  Search, Leaf, ArrowUpRight, BarChart3, CheckCircle2,
} from 'lucide-react';

export default function InventoryPage() {
  const [inventory, setInventory] = useState(
    sampleProducts.slice(0, 8).map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      quantity: p.quantity,
      maxCapacity: p.quantity + Math.floor(Math.random() * 500),
      unit: p.unit,
      price: p.price,
      qualityGrade: p.qualityGrade,
      freshness: p.freshness,
      image: p.images[0] || '',
      lowStockThreshold: Math.floor(p.quantity * 0.2),
      lastUpdated: p.updatedAt,
    }))
  );
  const [searchQuery, setSearchQuery] = useState('');

  const totalStock = inventory.reduce((s, i) => s + i.quantity, 0);
  const lowStockItems = inventory.filter((i) => i.quantity <= i.lowStockThreshold);
  const totalValue = inventory.reduce((s, i) => s + i.price * i.quantity, 0);
  const categories = [...new Set(inventory.map((i) => i.category))];

  const categoryBreakdown = categories.map((cat) => {
    const items = inventory.filter((i) => i.category === cat);
    const qty = items.reduce((s, i) => s + i.quantity, 0);
    return { category: cat, count: items.length, quantity: qty };
  });

  const updateQuantity = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, Math.min(item.quantity + delta, item.maxCapacity)) }
          : item
      )
    );
    toast.success('Stock updated');
  };

  const filteredInventory = searchQuery
    ? inventory.filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : inventory;

  const getStockLevel = (qty: number, threshold: number, max: number) => {
    const pct = (qty / max) * 100;
    if (qty <= threshold) return { color: '#EF4444', bg: '#FEE2E2', label: 'Low Stock' };
    if (pct < 50) return { color: '#F59E0B', bg: '#FEF3C7', label: 'Medium' };
    return { color: '#10B981', bg: '#D1FAE5', label: 'Good' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Inventory Management 🏪
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Track and manage your stock levels
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Stock', value: `${totalStock.toLocaleString()}`, icon: Warehouse, color: '#2D6A4F' },
          { label: 'Products', value: inventory.length, icon: Package, color: '#0891B2' },
          { label: 'Low Stock Items', value: lowStockItems.length, icon: AlertTriangle, color: lowStockItems.length > 0 ? '#EF4444' : '#10B981' },
          { label: 'Stock Value', value: formatCurrency(totalValue), icon: BarChart3, color: '#E9A319' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: `${stat.color}15` }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div>
                <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{stat.value}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} style={{ color: '#DC2626' }} />
            <span className="text-sm font-semibold" style={{ color: '#DC2626' }}>Low Stock Alert</span>
            <span className="badge" style={{ background: '#FEE2E2', color: '#DC2626', fontSize: '0.625rem' }}>
              {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map((item) => (
              <span key={item.id} className="badge" style={{ background: 'white', color: '#DC2626', fontSize: '0.75rem', padding: '4px 10px' }}>
                {item.name}: {item.quantity} {item.unit} left
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Inventory List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative" style={{ marginTop: '4px', marginBottom: '18px' }}>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9"
            />
          </div>

          <div className="space-y-3">
            {filteredInventory.map((item, index) => {
              const stock = getStockLevel(item.quantity, item.lowStockThreshold, item.maxCapacity);
              const pct = Math.round((item.quantity / item.maxCapacity) * 100);
              return (
                <div
                  key={item.id}
                  className="card p-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)' }}>
                      <img
                        src={item.image || '/images/tomato.jpg'}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{item.name}</h3>
                        <span className="badge capitalize" style={{ background: stock.bg, color: stock.color, fontSize: '0.6rem' }}>
                          {stock.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.category} • Grade {item.qualityGrade}</span>
                        <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{formatCurrency(item.price)}/{item.unit}</span>
                      </div>
                      {/* Stock Bar */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-2 rounded-full" style={{ background: '#F1F5F9' }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: stock.color }}
                          />
                        </div>
                        <span className="text-xs font-medium" style={{ color: stock.color }}>{pct}%</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, -10)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                        style={{ border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer' }}
                      >
                        <Minus size={14} style={{ color: 'var(--color-text-secondary)' }} />
                      </button>
                      <div className="w-20 text-center">
                        <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{item.quantity}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.unit}</p>
                      </div>
                      <button
                        onClick={() => updateQuantity(item.id, 10)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                        style={{ border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer' }}
                      >
                        <Plus size={14} style={{ color: 'var(--color-text-secondary)' }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card p-5 h-fit">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Category Breakdown</h3>
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium capitalize" style={{ color: 'var(--color-text)' }}>{cat.category}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{cat.count} items</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#F1F5F9' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(cat.quantity / totalStock) * 100}%`,
                      background: 'linear-gradient(90deg, #2D6A4F, #52B788)',
                    }}
                  />
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {cat.quantity.toLocaleString()} units
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
