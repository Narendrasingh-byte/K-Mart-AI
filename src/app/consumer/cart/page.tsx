// ==========================================
// K-Mart AI — Cart Page
// ==========================================
'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/constants';
import { toast } from 'sonner';
import {
  ShoppingCart, Trash2, Minus, Plus, ArrowRight, ArrowLeft,
  Leaf, ShoppingBag, Truck,
} from 'lucide-react';

export default function CartPage() {
  const { items, itemCount, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Shopping Cart
        </h1>
        <div className="empty-state py-20">
          <ShoppingCart size={56} style={{ color: 'var(--color-text-muted)' }} />
          <h3 className="text-lg font-semibold mt-4" style={{ color: 'var(--color-text)' }}>Your cart is empty</h3>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Discover fresh produce from farmers near you</p>
          <Link href="/consumer/marketplace" className="btn btn-primary mt-6 no-underline">
            <ShoppingBag size={18} />
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const deliveryCharge = totalAmount > 500 ? 0 : 40;
  const platformFee = Math.round(totalAmount * 0.02);
  const grandTotal = totalAmount + deliveryCharge + platformFee;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Shopping Cart
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {itemCount} item{itemCount > 1 ? 's' : ''} in your cart
          </p>
        </div>
        <button
          onClick={() => { clearCart(); toast.success('Cart cleared'); }}
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--color-danger)' }}
        >
          <Trash2 size={14} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="card p-4 animate-fade-in">
              <div className="flex items-center gap-4">
                {/* Product image */}
                <div
                  className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)' }}
                >
                  <img
                    src={item.productImage || '/images/tomato.jpg'}
                    alt={item.productName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{item.productName}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    by {item.farmerName}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>
                      {formatCurrency(item.price)}/{item.unit}
                    </span>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 border rounded-xl px-2 py-1" style={{ borderColor: 'var(--color-border)' }}>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <Minus size={14} style={{ color: 'var(--color-text-secondary)' }} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <Plus size={14} style={{ color: 'var(--color-text-secondary)' }} />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right flex-shrink-0">
                  <span className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => { removeFromCart(item.productId); toast.success('Removed from cart'); }}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  <Trash2 size={16} style={{ color: 'var(--color-danger)' }} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Order Summary</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Subtotal ({itemCount} items)</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Delivery</span>
              <span className="text-sm font-medium" style={{ color: deliveryCharge === 0 ? '#10B981' : 'var(--color-text)' }}>
                {deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Platform Fee</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{formatCurrency(platformFee)}</span>
            </div>
            {deliveryCharge === 0 && (
              <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: '#D1FAE5' }}>
                <Truck size={14} style={{ color: '#059669' }} />
                <span className="text-xs font-medium" style={{ color: '#059669' }}>Free delivery on orders above ₹500</span>
              </div>
            )}
          </div>

          <div className="divider" />

          <div className="flex items-center justify-between mb-6">
            <span className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>Total</span>
            <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{formatCurrency(grandTotal)}</span>
          </div>

          <Link
            href="/consumer/checkout"
            className="btn btn-primary w-full btn-lg no-underline"
            style={{ borderRadius: 'var(--radius-xl)' }}
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/consumer/marketplace"
            className="btn btn-ghost w-full mt-2 no-underline text-xs"
          >
            <ArrowLeft size={14} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
