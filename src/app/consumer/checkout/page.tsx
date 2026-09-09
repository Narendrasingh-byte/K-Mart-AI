// ==========================================
// K-Mart AI — Consumer Checkout
// ==========================================
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatCurrency, PAYMENT_METHODS } from '@/lib/constants';
import { toast } from 'sonner';
import {
  MapPin, CreditCard, ShoppingBag, ArrowLeft, ArrowRight,
  CheckCircle2, Loader2, Leaf, Home, Briefcase, Phone, Truck,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, totalAmount, clearCart } = useCart();
  const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address');
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    label: 'Home',
    fullAddress: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const deliveryCharge = totalAmount > 500 ? 0 : 40;
  const platformFee = Math.round(totalAmount * 0.02);
  const grandTotal = totalAmount + deliveryCharge + platformFee;

  if (items.length === 0 && !orderPlaced) {
    router.push('/consumer/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: '#D1FAE5' }}>
          <CheckCircle2 size={40} style={{ color: '#059669' }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Order Placed Successfully! 🎉
        </h2>
        <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
          Your order has been placed and farmers have been notified.
        </p>
        <p className="text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Order ID: ORD-{Math.floor(Math.random() * 9000 + 1000)}
        </p>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/consumer/orders')} className="btn btn-primary">
            <ShoppingBag size={16} /> View Orders
          </button>
          <button onClick={() => router.push('/consumer/marketplace')} className="btn btn-outline">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!address.fullAddress || !address.city || !address.pincode || !address.phone) {
      toast.error('Please fill all address fields');
      setStep('address');
      return;
    }
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 2000));
    clearCart();
    setPlacing(false);
    setOrderPlaced(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-primary)', border: 'none', background: 'transparent', cursor: 'pointer' }}>
        <ArrowLeft size={16} /> Back to Cart
      </button>

      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Checkout 🛒</h1>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {[
          { key: 'address' as const, label: 'Address', icon: <MapPin size={14} /> },
          { key: 'payment' as const, label: 'Payment', icon: <CreditCard size={14} /> },
          { key: 'confirm' as const, label: 'Confirm', icon: <CheckCircle2 size={14} /> },
        ].map((s, i) => {
          const stepIndex = ['address', 'payment', 'confirm'].indexOf(step);
          const isActive = i <= stepIndex;
          return (
            <React.Fragment key={s.key}>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium" style={{
                background: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
                color: isActive ? 'white' : 'var(--color-text-muted)',
                border: isActive ? 'none' : '1px solid var(--color-border)',
              }}>
                {s.icon} {s.label}
              </div>
              {i < 2 && <div className="w-8 h-0.5" style={{ background: i < stepIndex ? 'var(--color-primary)' : 'var(--color-border)' }} />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 'address' && (
            <div className="card p-6 space-y-4 animate-fade-in">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Delivery Address</h2>
              <div className="flex items-center gap-2 mb-2">
                {['Home', 'Office', 'Other'].map((label) => (
                  <button
                    key={label}
                    onClick={() => setAddress((p) => ({ ...p, label }))}
                    className="btn btn-sm"
                    style={{
                      background: address.label === label ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: address.label === label ? 'white' : 'var(--color-text-secondary)',
                      border: address.label === label ? 'none' : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {label === 'Home' ? <Home size={12} /> : label === 'Office' ? <Briefcase size={12} /> : <MapPin size={12} />}
                    {label}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Full Address *</label>
                <textarea value={address.fullAddress} onChange={(e) => setAddress((p) => ({ ...p, fullAddress: e.target.value }))} className="input" rows={3} placeholder="House/Flat No, Street, Area..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>City *</label>
                  <input value={address.city} onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))} className="input" placeholder="City" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>State *</label>
                  <input value={address.state} onChange={(e) => setAddress((p) => ({ ...p, state: e.target.value }))} className="input" placeholder="State" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Pincode *</label>
                  <input value={address.pincode} onChange={(e) => setAddress((p) => ({ ...p, pincode: e.target.value }))} className="input" placeholder="110001" maxLength={6} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Phone *</label>
                  <input value={address.phone} onChange={(e) => setAddress((p) => ({ ...p, phone: e.target.value }))} className="input" placeholder="9876543210" maxLength={10} />
                </div>
              </div>
              <button onClick={() => setStep('payment')} className="btn btn-primary w-full mt-2">
                Continue to Payment <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="card p-6 space-y-4 animate-fade-in">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Payment Method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.value}
                    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: paymentMethod === pm.value ? 'var(--color-primary-pale)' : 'var(--color-surface)',
                      border: `2px solid ${paymentMethod === pm.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={pm.value}
                      checked={paymentMethod === pm.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span className="text-xl">{pm.icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{pm.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => setStep('address')} className="btn btn-outline">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={() => setStep('confirm')} className="btn btn-primary flex-1">
                  Review Order <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="card p-6 space-y-5 animate-fade-in">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Confirm Order</h2>

              <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Delivery to: {address.label}</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{address.fullAddress}, {address.city}, {address.state} - {address.pincode}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>📱 {address.phone}</p>
              </div>

              <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg-alt)' }}>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                  Payment: {PAYMENT_METHODS.find((p) => p.value === paymentMethod)?.icon} {PAYMENT_METHODS.find((p) => p.value === paymentMethod)?.label}
                </p>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--color-bg-alt)' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#D8F3DC' }}>
                      <Leaf size={16} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{item.productName}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.quantity} {item.unit} × {formatCurrency(item.price)}</p>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setStep('payment')} className="btn btn-outline">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handlePlaceOrder} className="btn btn-primary btn-lg flex-1" disabled={placing}>
                  {placing ? <><Loader2 size={18} className="animate-spin" /> Placing Order...</> : <><CheckCircle2 size={18} /> Place Order — {formatCurrency(grandTotal)}</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="card p-5 h-fit sticky top-24">
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm"><span style={{ color: 'var(--color-text-secondary)' }}>Items ({itemCount})</span><span style={{ color: 'var(--color-text)' }}>{formatCurrency(totalAmount)}</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: 'var(--color-text-secondary)' }}>Delivery</span><span style={{ color: deliveryCharge === 0 ? '#10B981' : 'var(--color-text)' }}>{deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: 'var(--color-text-secondary)' }}>Platform Fee</span><span style={{ color: 'var(--color-text)' }}>{formatCurrency(platformFee)}</span></div>
          </div>
          {deliveryCharge === 0 && (
            <div className="flex items-center gap-2 p-2 rounded-lg mb-3" style={{ background: '#D1FAE5' }}>
              <Truck size={12} style={{ color: '#059669' }} />
              <span className="text-xs font-medium" style={{ color: '#059669' }}>Free delivery on orders above ₹500</span>
            </div>
          )}
          <div className="divider" />
          <div className="flex justify-between mt-3">
            <span className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>Total</span>
            <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
