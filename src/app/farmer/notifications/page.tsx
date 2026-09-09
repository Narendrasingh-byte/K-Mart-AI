// ==========================================
// K-Mart AI — Farmer Notifications
// ==========================================
'use client';

import React, { useState } from 'react';
import { formatRelativeTime } from '@/lib/constants';
import {
  Bell, Package, IndianRupee, AlertTriangle, Sparkles,
  CheckCircle2, Info, Users, ArrowRight
} from 'lucide-react';

const initialNotifications = [
  {
    id: 'n1',
    type: 'order',
    title: 'New Order Received!',
    message: 'FreshMart Restaurant placed an order for 50kg Fresh Tomatoes (ORD-1001).',
    time: '2026-09-09T08:05:00Z',
    read: false,
    actionLink: '/farmer/orders',
  },
  {
    id: 'n2',
    type: 'ai',
    title: 'AI Price Alert: Tomatoes',
    message: 'Tomato prices in your region are expected to drop by 15% this weekend. Consider selling your inventory now.',
    time: '2026-09-09T06:30:00Z',
    read: false,
    actionLink: '/farmer/ai-advisor',
  },
  {
    id: 'n3',
    type: 'payment',
    title: 'Payment Credited',
    message: '₹17,000 has been credited to your bank account for ORD-1004.',
    time: '2026-09-08T14:20:00Z',
    read: true,
    actionLink: '/farmer/earnings',
  },
  {
    id: 'n4',
    type: 'request',
    title: 'New Bulk Request',
    message: 'Sharma Foods is looking for 500kg Onions. Your trust score matches their criteria.',
    time: '2026-09-08T09:15:00Z',
    read: true,
    actionLink: '/farmer/buyer-requests',
  },
  {
    id: 'n5',
    type: 'system',
    title: 'System Maintenance',
    message: 'K-Mart app will be down for maintenance from 2 AM to 4 AM tonight.',
    time: '2026-09-07T10:00:00Z',
    read: true,
    actionLink: null,
  },
];

export default function FarmerNotificationsPage() {
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
    if (filter === 'ai') return n.type === 'ai';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return { icon: Package, color: '#2563EB', bg: '#DBEAFE' };
      case 'payment': return { icon: IndianRupee, color: '#059669', bg: '#D1FAE5' };
      case 'ai': return { icon: Sparkles, color: '#7C3AED', bg: '#F3E8FF' };
      case 'request': return { icon: Users, color: '#D97706', bg: '#FEF3C7' };
      default: return { icon: Info, color: '#64748B', bg: '#F1F5F9' };
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl" style={{ width: 44, height: 44, background: 'var(--color-primary-pale)' }}>
            <Bell size={20} style={{ color: 'var(--color-primary)' }} />
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
        {['all', 'unread', 'ai'].map((f) => (
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
            {f === 'ai' ? 'AI Insights' : f}
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
                className={`card p-4 transition-colors cursor-pointer animate-fade-in-up ${!notification.read ? 'bg-blue-50/30' : ''}`}
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
                      <a href={notification.actionLink} className="inline-flex items-center gap-1 mt-2 text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
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
