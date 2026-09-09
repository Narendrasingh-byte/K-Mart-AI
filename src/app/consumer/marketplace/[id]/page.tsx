// ==========================================
// K-Mart AI — Product Detail Page
// ==========================================
'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { sampleProducts } from '@/data/sampleData';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/constants';
import { toast } from 'sonner';
import {
  ArrowLeft, Star, MapPin, ShoppingCart, Heart, Check,
  Leaf, Shield, Brain, TrendingUp, Clock, Eye, Package,
  Minus, Plus, ChevronRight, Truck, Award, CheckCircle2, Users,
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = sampleProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="empty-state py-20">
        <Package size={48} style={{ color: 'var(--color-text-muted)' }} />
        <h3 className="text-lg font-semibold mt-4" style={{ color: 'var(--color-text)' }}>Product not found</h3>
        <button onClick={() => router.back()} className="btn btn-primary mt-4">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || '',
      price: product.price,
      unit: product.unit,
      quantity: quantity,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      maxQuantity: product.quantity,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const freshnessConfig = {
    'harvested-today': { label: 'Harvested Today', color: '#10B981', bg: '#D1FAE5' },
    'one-day': { label: '1 Day Old', color: '#22C55E', bg: '#DCFCE7' },
    'two-days': { label: '2 Days Old', color: '#F59E0B', bg: '#FEF3C7' },
    'three-plus-days': { label: '3+ Days Old', color: '#EF4444', bg: '#FEE2E2' },
  };

  const freshness = freshnessConfig[product.freshness] || freshnessConfig['harvested-today'];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
        style={{ color: 'var(--color-primary)', border: 'none', background: 'transparent', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} />
        Back to Marketplace
      </button>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div
            className="w-full rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{
              height: 400,
              background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F0FDFA 100%)',
            }}
          >
            <Leaf size={80} style={{ color: 'var(--color-primary-lighter)' }} />
            {product.freshness === 'harvested-today' && (
              <span
                className="absolute top-4 left-4 badge badge-success"
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                🌿 Harvested Today
              </span>
            )}
            <span
              className="absolute top-4 right-4 badge"
              style={{ background: 'rgba(255,255,255,0.95)', color: 'var(--color-primary)', fontWeight: 700, padding: '6px 14px' }}
            >
              Grade {product.qualityGrade}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-primary capitalize">{product.category}</span>
            <span className="badge" style={{ background: freshness.bg, color: freshness.color }}>
              {freshness.label}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{product.farmerRating}</span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>(128 reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} style={{ color: 'var(--color-text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{product.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} style={{ color: 'var(--color-text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{product.location}, {product.state}</span>
            </div>
          </div>

          {/* Price */}
          <div className="p-5 rounded-xl mb-6" style={{ background: 'var(--color-primary-pale)' }}>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                {formatCurrency(product.price)}
              </span>
              <span className="text-sm" style={{ color: 'var(--color-primary)' }}>per {product.unit}</span>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Min. order: {product.minOrderQty} {product.unit} • Available: {product.quantity} {product.unit}
            </p>
          </div>

          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Quantity:</span>
            <div className="flex items-center gap-2 border rounded-xl px-2 py-1" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setQuantity(Math.max(product.minOrderQty, quantity - 1))}
                className="p-1 rounded-lg hover:bg-gray-100"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <Minus size={16} style={{ color: 'var(--color-text-secondary)' }} />
              </button>
              <span className="w-12 text-center text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                className="p-1 rounded-lg hover:bg-gray-100"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <Plus size={16} style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{product.unit}</span>
            <span className="text-sm font-semibold ml-auto" style={{ color: 'var(--color-text)' }}>
              Total: {formatCurrency(product.price * quantity)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className={`btn btn-lg flex-1 ${isInCart(product.id) ? 'btn-secondary' : 'btn-primary'}`}
              style={{ borderRadius: 'var(--radius-xl)' }}
            >
              {isInCart(product.id) ? (
                <><Check size={18} /> Already in Cart</>
              ) : (
                <><ShoppingCart size={18} /> Add to Cart</>
              )}
            </button>
            <button
              onClick={() => { setIsWishlisted(!isWishlisted); toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'); }}
              className="btn btn-outline btn-lg"
              style={{ borderRadius: 'var(--radius-xl)', borderColor: 'var(--color-border)' }}
            >
              <Heart size={18} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : 'var(--color-text-secondary)'} />
            </button>
          </div>

          {/* Quick Info Tags */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-xl text-center" style={{ background: 'var(--color-bg-alt)' }}>
              <Truck size={18} style={{ color: 'var(--color-accent)' }} className="mx-auto mb-1" />
              <span className="text-xs font-medium block" style={{ color: 'var(--color-text-secondary)' }}>Est. Delivery</span>
              <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>1–2 Days</span>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ background: 'var(--color-bg-alt)' }}>
              <Shield size={18} style={{ color: '#10B981' }} className="mx-auto mb-1" />
              <span className="text-xs font-medium block" style={{ color: 'var(--color-text-secondary)' }}>Quality</span>
              <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>Verified</span>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ background: 'var(--color-bg-alt)' }}>
              <Award size={18} style={{ color: '#E9A319' }} className="mx-auto mb-1" />
              <span className="text-xs font-medium block" style={{ color: 'var(--color-text-secondary)' }}>Grade</span>
              <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>{product.qualityGrade}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Know Your Farmer + AI Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Know Your Farmer */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>Know Your Farmer</h3>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="flex items-center justify-center rounded-full text-lg font-bold"
              style={{ width: 56, height: 56, background: 'var(--color-primary-pale)', color: 'var(--color-primary)' }}
            >
              {product.farmerName.charAt(0)}
            </div>
            <div>
              <h4 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>{product.farmerName}</h4>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{product.location}, {product.state}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-xl" style={{ background: 'var(--color-bg-alt)' }}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{product.farmerRating}</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Rating</span>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: 'var(--color-bg-alt)' }}>
              <div className="text-lg font-bold mb-1" style={{ color: 'var(--color-primary)' }}>92</div>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Trust Score</span>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: 'var(--color-bg-alt)' }}>
              <div className="text-lg font-bold mb-1" style={{ color: 'var(--color-text)' }}>Today</div>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Last Harvest</span>
            </div>
          </div>
        </div>

        {/* AI Buy/Wait Advisor */}
        <div className="ai-insight-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={18} style={{ color: 'var(--color-accent)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-accent)' }}>AI Buying Advisor</h3>
            <span className="badge badge-info ml-auto" style={{ fontSize: '0.625rem' }}>AI</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Current Price</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{formatCurrency(product.price)}/{product.unit}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>7-Day Average</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{formatCurrency(Math.round(product.price * 0.92))}/{product.unit}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Expected Price</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                {formatCurrency(Math.round(product.price * 0.9))}–{formatCurrency(Math.round(product.price * 0.95))}/{product.unit}
              </span>
            </div>

            <div className="divider" />

            {/* Buy Score */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Buy Score</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 rounded-full" style={{ background: '#D1FAE5' }}>
                  <div className="h-full rounded-full" style={{ width: '86%', background: '#10B981' }} />
                </div>
                <span className="text-sm font-bold" style={{ color: '#10B981' }}>86/100</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl mt-2" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
              <CheckCircle2 size={16} style={{ color: '#10B981' }} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold" style={{ color: '#059669' }}>Recommendation: BUY NOW</p>
                <p className="text-xs mt-1" style={{ color: '#065F46' }}>
                  Price is near seasonal low. Quality is premium grade. Fresh harvest available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card p-6">
        <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Customer Reviews</h3>
        <div className="space-y-4">
          {[
            { name: 'Anita Sharma', rating: 5, comment: 'Very fresh tomatoes! Arrived same day. Will definitely order again.', date: '2 days ago' },
            { name: 'Mohit Kumar', rating: 4, comment: 'Good quality, but some were slightly overripe. Overall satisfied.', date: '5 days ago' },
            { name: 'Priya Gupta', rating: 5, comment: 'Best tomatoes I have bought online. The farmer is very responsive.', date: '1 week ago' },
          ].map((review, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--color-bg-alt)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center rounded-full text-xs font-bold"
                    style={{ width: 32, height: 32, background: 'var(--color-primary-pale)', color: 'var(--color-primary)' }}
                  >
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{review.name}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, j) => (
                        <Star
                          key={j}
                          size={10}
                          fill={j < review.rating ? '#F59E0B' : 'none'}
                          color={j < review.rating ? '#F59E0B' : '#D1D5DB'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{review.date}</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
