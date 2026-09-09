// ==========================================
// K-Mart AI — Consumer Wishlist
// ==========================================
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { sampleProducts } from '@/data/sampleData';
import { formatCurrency } from '@/lib/constants';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingBag, Trash2, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { addItem } = useCart();
  const [wishlist, setWishlist] = useState(
    sampleProducts.slice(0, 4).map((p) => ({ ...p, priceDrop: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 5 : 0 }))
  );

  const removeFromWishlist = (id: string) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      unit: product.unit,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
    });
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          My Wishlist ❤️
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Products you&apos;ve saved for later
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state py-16">
          <Heart size={48} style={{ color: 'var(--color-border)' }} />
          <h3 className="text-lg font-semibold mt-4" style={{ color: 'var(--color-text)' }}>Your wishlist is empty</h3>
          <p className="text-sm mt-1 mb-4" style={{ color: 'var(--color-text-muted)' }}>Save items you like to find them quickly later.</p>
          <Link href="/consumer/marketplace" className="btn btn-primary no-underline">Browse Marketplace</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wishlist.map((item, index) => (
            <div key={item.id} className="card p-4 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="relative w-full h-32 rounded-xl mb-3 flex items-center justify-center bg-gray-50">
                <span className="text-4xl">🌱</span>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm text-red-500 hover:scale-110 transition-transform"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>

              {item.priceDrop > 0 && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 mb-1">
                  <TrendingDown size={12} /> Price dropped by {item.priceDrop}%
                </div>
              )}

              <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{item.name}</h3>
              <p className="text-xs mt-0.5 mb-2" style={{ color: 'var(--color-text-muted)' }}>By {item.farmerName}</p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                  {formatCurrency(item.price)}<span className="text-xs font-normal text-gray-500">/{item.unit}</span>
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(item)}
                className="w-full btn btn-primary btn-sm flex justify-center gap-2"
              >
                <ShoppingBag size={14} /> Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
