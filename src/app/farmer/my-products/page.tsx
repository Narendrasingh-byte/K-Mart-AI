// ==========================================
// K-Mart AI — My Products (Farmer)
// ==========================================
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { sampleProducts } from '@/data/sampleData';
import { formatCurrency, formatDate } from '@/lib/constants';
import { toast } from 'sonner';
import {
  Package, Plus, Search, Eye, ShoppingBag, Edit2, Pause, Play,
  Trash2, MoreVertical, TrendingUp, ArrowUpRight, Filter,
  Leaf, Star, X,
} from 'lucide-react';

export default function MyProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [products, setProducts] = useState(
    sampleProducts.slice(0, 6).map((p) => ({ ...p, farmerId: 'current-farmer' }))
  );
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: '#2D6A4F' },
    { label: 'Active', value: products.filter((p) => p.status === 'active').length, icon: Play, color: '#10B981' },
    { label: 'Total Views', value: products.reduce((s, p) => s + p.views, 0), icon: Eye, color: '#0891B2' },
    { label: 'Total Orders', value: products.reduce((s, p) => s + p.ordersCount, 0), icon: ShoppingBag, color: '#E9A319' },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') {
      list = list.filter((p) => p.status === statusFilter);
    }
    return list;
  }, [products, searchQuery, statusFilter]);

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'active' ? 'paused' : 'active' } : p
      ) as typeof prev
    );
    toast.success('Product status updated');
    setActiveMenu(null);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Product removed');
    setActiveMenu(null);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#D1FAE5', text: '#059669' };
      case 'paused': return { bg: '#FEF3C7', text: '#B45309' };
      case 'sold': return { bg: '#DBEAFE', text: '#2563EB' };
      case 'draft': return { bg: '#F1F5F9', text: '#64748B' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            My Products 📦
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Manage your product listings
          </p>
        </div>
        <Link href="/farmer/sell-product" className="btn btn-primary no-underline">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: `${stat.color}15` }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div>
                <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3" style={{ marginTop: '16px', marginBottom: '16px' }}>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'active', 'paused', 'sold'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="btn btn-sm capitalize"
              style={{
                background: statusFilter === s ? 'var(--color-primary)' : 'var(--color-surface)',
                color: statusFilter === s ? 'white' : 'var(--color-text-secondary)',
                border: statusFilter === s ? 'none' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state py-16">
          <Package size={48} style={{ color: 'var(--color-text-muted)' }} />
          <h3 className="text-lg font-semibold mt-4" style={{ color: 'var(--color-text)' }}>No products found</h3>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {searchQuery || statusFilter !== 'all' ? 'Try changing your filters' : 'Start by adding your first product'}
          </p>
          <Link href="/farmer/sell-product" className="btn btn-primary mt-4 no-underline">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product, index) => {
            const statusStyle = getStatusStyle(product.status);
            return (
              <div
                key={product.id}
                className="card p-4 hover:shadow-md transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Image */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)' }}>
                    <img
                      src={product.images[0] || '/images/tomato.jpg'}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>{product.name}</h3>
                      <span className="badge capitalize" style={{ background: statusStyle.bg, color: statusStyle.text, fontSize: '0.6rem' }}>
                        {product.status}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {product.category} • Grade {product.qualityGrade} • {product.quantity} {product.unit} available
                    </p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                        {formatCurrency(product.price)}/{product.unit}
                      </span>
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        <Eye size={11} /> {product.views} views
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        <ShoppingBag size={11} /> {product.ordersCount} orders
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {product.aiAnalysis && (
                      <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: '#D1FAE5' }}>
                        <TrendingUp size={12} style={{ color: '#059669' }} />
                        <span className="text-xs font-semibold" style={{ color: '#059669' }}>
                          {formatCurrency(product.aiAnalysis.recommendedPriceRange.min)}–{formatCurrency(product.aiAnalysis.recommendedPriceRange.max)}
                        </span>
                      </div>
                    )}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === product.id ? null : product.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        <MoreVertical size={18} style={{ color: 'var(--color-text-muted)' }} />
                      </button>
                      {activeMenu === product.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 card p-1 z-10 shadow-lg animate-fade-in-down">
                          <button
                            onClick={() => toast.info('Edit coming soon')}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50"
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text)' }}
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => toggleStatus(product.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50"
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text)' }}
                          >
                            {product.status === 'active' ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Activate</>}
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50"
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444' }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
