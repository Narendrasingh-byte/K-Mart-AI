// ==========================================
// K-Mart AI — Consumer Marketplace
// ==========================================
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { sampleProducts } from '@/data/sampleData';
import { CATEGORIES } from '@/lib/constants';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import {
  Search, SlidersHorizontal, Star, MapPin, Eye, ShoppingCart,
  Leaf, ArrowUpDown, X, Check, Heart, Grid3X3, List, ChevronDown,
} from 'lucide-react';

export default function MarketplacePage() {
  const { addToCart, isInCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    let products = [...sampleProducts];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.farmerName.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Grade
    if (selectedGrade !== 'all') {
      products = products.filter((p) => p.qualityGrade === selectedGrade);
    }

    // Price range
    products = products.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => (b.farmerRating || 0) - (a.farmerRating || 0));
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        products.sort((a, b) => b.views - a.views);
        break;
    }

    return products;
  }, [searchQuery, selectedCategory, sortBy, selectedGrade, priceRange]);

  const handleAddToCart = (product: typeof sampleProducts[0]) => {
    if (isInCart(product.id)) {
      toast.info('Already in cart');
      return;
    }
    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || '',
      price: product.price,
      unit: product.unit,
      quantity: product.minOrderQty,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      maxQuantity: product.quantity,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Marketplace 🌾
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Fresh produce directly from verified farmers
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search products, farmers, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
            style={{ borderRadius: 'var(--radius-xl)' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <X size={14} style={{ color: 'var(--color-text-muted)' }} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'} btn-sm`}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select btn-sm pr-8"
              style={{ borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', padding: '6px 30px 6px 12px', height: 34 }}
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center border rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setViewMode('grid')}
              className="p-1.5"
              style={{ background: viewMode === 'grid' ? 'var(--color-primary-pale)' : 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <Grid3X3 size={16} style={{ color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="p-1.5"
              style={{ background: viewMode === 'list' ? 'var(--color-primary-pale)' : 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <List size={16} style={{ color: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setSelectedCategory('all')}
          className="btn btn-sm whitespace-nowrap"
          style={{
            background: selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-surface)',
            color: selectedCategory === 'all' ? 'white' : 'var(--color-text-secondary)',
            border: selectedCategory === 'all' ? 'none' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
          }}
        >
          All Products
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="btn btn-sm whitespace-nowrap"
            style={{
              background: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--color-surface)',
              color: selectedCategory === cat.id ? 'white' : 'var(--color-text-secondary)',
              border: selectedCategory === cat.id ? 'none' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-5 animate-fade-in-down">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Quality Grade</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="select"
                style={{ fontSize: '0.875rem' }}
              >
                <option value="all">All Grades</option>
                <option value="A+">Premium (A+)</option>
                <option value="A">Grade A</option>
                <option value="B+">Grade B+</option>
                <option value="B">Grade B</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Min Price (₹)</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="input"
                min={0}
                style={{ fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>Max Price (₹)</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="input"
                min={0}
                style={{ fontSize: '0.875rem' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Showing <strong style={{ color: 'var(--color-text)' }}>{filteredProducts.length}</strong> products
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state py-20">
          <Search size={48} style={{ color: 'var(--color-text-muted)' }} />
          <h3 className="text-lg font-semibold mt-4" style={{ color: 'var(--color-text)' }}>No products found</h3>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Try adjusting your search or filters</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedGrade('all'); setPriceRange([0, 500]); }}
            className="btn btn-secondary mt-4"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-3'
        }>
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`card card-interactive overflow-hidden animate-fade-in-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {viewMode === 'grid' ? (
                /* Grid Card */
                <>
                  <Link href={`/consumer/marketplace/${product.id}`} className="no-underline block">
                    <div
                      className="relative w-full h-40 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)' }}
                    >
                      <Leaf size={36} style={{ color: 'var(--color-primary-lighter)' }} />
                      {/* Freshness badge */}
                      {product.freshness === 'harvested-today' && (
                        <span
                          className="absolute top-3 left-3 badge badge-success"
                          style={{ fontSize: '0.625rem' }}
                        >
                          🌿 Harvested Today
                        </span>
                      )}
                      <span
                        className="absolute top-3 right-3 badge"
                        style={{
                          background: 'rgba(255,255,255,0.9)',
                          color: 'var(--color-primary)',
                          fontSize: '0.625rem',
                          fontWeight: 700,
                        }}
                      >
                        {product.qualityGrade}
                      </span>
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/consumer/marketplace/${product.id}`} className="no-underline">
                      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin size={11} style={{ color: 'var(--color-text-muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {product.farmerName} • {product.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                          ₹{product.price}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          /{product.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={12} fill="#F59E0B" color="#F59E0B" />
                        <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>
                          {product.farmerRating}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`btn w-full btn-sm ${isInCart(product.id) ? 'btn-secondary' : 'btn-primary'}`}
                    >
                      {isInCart(product.id) ? (
                        <><Check size={14} /> In Cart</>
                      ) : (
                        <><ShoppingCart size={14} /> Add to Cart</>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                /* List Card */
                <div className="flex items-center gap-4 p-4">
                  <Link href={`/consumer/marketplace/${product.id}`} className="no-underline flex-shrink-0">
                    <div
                      className="w-20 h-20 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)' }}
                    >
                      <Leaf size={24} style={{ color: 'var(--color-primary-lighter)' }} />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/consumer/marketplace/${product.id}`} className="no-underline">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{product.farmerName}</span>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>•</span>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{product.location}</span>
                      <span className="badge badge-primary" style={{ fontSize: '0.6rem' }}>{product.qualityGrade}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>₹{product.price}/{product.unit}</span>
                      <div className="flex items-center gap-1">
                        <Star size={12} fill="#F59E0B" color="#F59E0B" />
                        <span className="text-xs">{product.farmerRating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={12} style={{ color: 'var(--color-text-muted)' }} />
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{product.views}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`btn btn-sm flex-shrink-0 ${isInCart(product.id) ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {isInCart(product.id) ? <Check size={14} /> : <ShoppingCart size={14} />}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
