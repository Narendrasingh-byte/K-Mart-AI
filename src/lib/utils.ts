// ==========================================
// K-Mart AI — Utility Functions
// ==========================================

import { type ClassValue, clsx } from 'clsx';

// Simple class name merger (no tailwind-merge dependency needed for now)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Truncate text
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Clamp number
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Get risk color
export function getRiskColor(score: number): string {
  if (score >= 80) return '#DC2626';
  if (score >= 60) return '#EF4444';
  if (score >= 40) return '#F59E0B';
  if (score >= 20) return '#10B981';
  return '#059669';
}

// Get demand color
export function getDemandColor(level: string): string {
  const colors: Record<string, string> = {
    'very-high': '#059669',
    high: '#10B981',
    medium: '#F59E0B',
    low: '#EF4444',
    'very-low': '#DC2626',
  };
  return colors[level] || '#64748B';
}

// Format large numbers
export function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
