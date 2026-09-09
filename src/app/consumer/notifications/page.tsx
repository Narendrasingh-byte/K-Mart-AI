// ==========================================
// K-Mart AI — Consumer Notifications
// ==========================================
'use client';

import React, { useState } from 'react';
import { formatRelativeTime } from '@/lib/constants';
import {
  Bell, Package, CheckCircle2, TrendingDown, Sparkles,
  Info, Star, ArrowRight, Truck
} from 'lucide-react';

const initialNotifications = [
  {
    id: 'c1',
    type: 'order',
    title: 'Order Delivered! 🎉',
    message: 'Your order of Premium Onions (ORD-2002) has been delivered. Please rate the farmer.',
    time: '2026-09-08T10:30:00Z',
    read: false,
    actionLink: '/consumer/orders',
  },
  {
    id: 'c2',
    type: 'ai',
    title: 'Price Drop Alert',
    message: 'Good news! Organic Potatoes on your wishlist dropped by 15% to ₹22/kg.',
    time: '2026-09-08T08:00:00Z',
    read: false,
    actionLink: '/consumer/ai-buying-advisor',
  },
  {
    id: 'c3',
    type: 'delivery',
    title: 'Order Out for Delivery',
    message: 'Your order of Fresh Tomatoes (ORD-2001) is on the way and will arrive by 5 PM today.',
    time: '2026-09-08T07:15:00Z',
    read: true,
    actionLink: '/consumer/orders',
  },
  {
    id: 'c4',
    type: 'promo',
    title: 'Weekend Farmer Market',
    message: 'Get 10% off on all fresh fruits this weekend! Use code FRESH10 at checkout.',
    time: '2026-09-07T14:00:00Z',
    read: true,
    actionLink: '/consumer/marketplace',
  },
];

export default function ConsumerNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'orders') return n.type === 'order' || n.type === 'delivery';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return { icon: CheckCircle2, color: '#059669', bg: '#D1FAE5' };
      case 'delivery': return { icon: Truck, color: '#2563EB', bg: '#DBEAFE' };
      case 'ai': return { icon: TrendingDown, color: '#7C3AED', bg: '#F3E8FF' };
      case 'promo': return { icon: Star, color: '#D97706', bg: '#FEF3C7' };
      default: return { icon: Info, color: '#64748B', bg: '#F1F5F9' };
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl" style={{ width: 44, height: 44, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <Bell size={20} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              Notifications
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              You have {unreadCount} unread messages
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn btn-outline btn-sm">
            <CheckCircle2 size={14} /> Mark all as read
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--color-border-light)' }}>
        {['all', 'unread', 'orders'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="btn btn-sm capitalize"
            style={{
              background: filter === f ? 'var(--color-text)' : 'transparent',
              color: filter === f ? 'white' : 'var(--color-text-secondary)',
              border: filter === f ? 'none' : '1px solid transparent',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="empty-state py-16">
            <Bell size={40} style={{ color: 'var(--color-text-muted)' }} />
            <h3 className="text-base font-semibold mt-4" style={{ color: 'var(--color-text)' }}>No notifications</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>You&apos;re all caught up!</p>
          </div>
        ) : (
          filtered.map((notification, index) => {
            const { icon: Icon, color, bg } = getIcon(notification.type);
            return (
              <div
                key={notification.id}
                onClick={() => markRead(notification.id)}
                className={`card p-4 transition-colors cursor-pointer animate-fade-in-up ${!notification.read ? 'bg-gray-50/50' : ''}`}
                style={{ animationDelay: `${index * 40}ms`, borderLeft: !notification.read ? `3px solid ${color}` : '1px solid var(--color-border)' }}
              >
                <div className="flex gap-4">
                  <div className="flex items-center justify-center rounded-full flex-shrink-0 mt-1" style={{ width: 36, height: 36, background: bg }}>
                    <Icon size={16} color={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold" style={{ color: !notification.read ? 'var(--color-text)' : 'var(--color-text-secondary)' }}>
                        {notification.title}
                      </h3>
                      <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                        {formatRelativeTime(notification.time)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: !notification.read ? 'var(--color-text-secondary)' : 'var(--color-text-muted)' }}>
                      {notification.message}
                    </p>
                    {notification.actionLink && (
                      <a href={notification.actionLink} className="inline-flex items-center gap-1 mt-2 text-xs font-medium" style={{ color: 'var(--color-accent)' }}>
                        View Details <ArrowRight size={12} />
                      </a>
                    )}
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full mt-2" style={{ background: color }} />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
