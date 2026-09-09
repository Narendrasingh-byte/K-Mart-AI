// ==========================================
// K-Mart AI — Application Constants
// ==========================================

export const APP_NAME = 'K-Mart AI';
export const APP_TAGLINE = 'Direct Farm-to-Consumer Marketplace with AI-Powered Decision Intelligence';
export const APP_DESCRIPTION = 'K-Mart AI helps farmers sell smarter and consumers buy smarter using AI-powered decision intelligence.';

// Design system colors
export const COLORS = {
  primary: '#2D6A4F',
  primaryLight: '#52B788',
  primaryLighter: '#95D5B2',
  primaryPale: '#D8F3DC',
  secondary: '#E9A319',
  secondaryLight: '#F5C842',
  accent: '#0891B2',
  accentLight: '#22D3EE',
  background: '#FAFAF8',
  surface: '#FFFFFF',
  textPrimary: '#1A1A2E',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
} as const;

// Product categories
export const CATEGORIES = [
  { id: 'vegetables', name: 'Vegetables', icon: '🥬', description: 'Fresh farm vegetables' },
  { id: 'fruits', name: 'Fruits', icon: '🍎', description: 'Seasonal fruits' },
  { id: 'grains', name: 'Grains & Cereals', icon: '🌾', description: 'Wheat, rice, maize and more' },
  { id: 'pulses', name: 'Pulses & Lentils', icon: '🫘', description: 'Dal, chana, moong and more' },
  { id: 'spices', name: 'Spices', icon: '🌶️', description: 'Farm-fresh spices' },
  { id: 'dairy', name: 'Dairy', icon: '🥛', description: 'Milk, curd, ghee and more' },
  { id: 'oilseeds', name: 'Oilseeds', icon: '🫒', description: 'Mustard, groundnut, sunflower' },
  { id: 'flowers', name: 'Flowers', icon: '🌸', description: 'Fresh flowers and garlands' },
  { id: 'herbs', name: 'Herbs', icon: '🌿', description: 'Fresh herbs and medicinal plants' },
  { id: 'organic', name: 'Organic', icon: '🌱', description: 'Certified organic produce' },
] as const;

// Product units
export const PRODUCT_UNITS = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'quintal', label: 'Quintal' },
  { value: 'ton', label: 'Ton' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'piece', label: 'Piece' },
  { value: 'litre', label: 'Litre' },
  { value: 'bunch', label: 'Bunch' },
  { value: 'bag', label: 'Bag (50kg)' },
] as const;

// Quality grades
export const QUALITY_GRADES = [
  { value: 'A+', label: 'Premium (A+)', description: 'Exceptional quality, top-grade produce' },
  { value: 'A', label: 'Grade A', description: 'High quality, well-sorted produce' },
  { value: 'B+', label: 'Grade B+', description: 'Good quality, minor imperfections' },
  { value: 'B', label: 'Grade B', description: 'Standard quality produce' },
  { value: 'C', label: 'Grade C', description: 'Economy grade produce' },
] as const;

// Freshness levels
export const FRESHNESS_LEVELS = [
  { value: 'harvested-today', label: 'Harvested Today', color: '#10B981' },
  { value: 'one-day', label: '1 Day Old', color: '#22C55E' },
  { value: 'two-days', label: '2 Days Old', color: '#F59E0B' },
  { value: 'three-plus-days', label: '3+ Days Old', color: '#EF4444' },
] as const;

// Order statuses
export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#F59E0B' },
  { value: 'confirmed', label: 'Confirmed', color: '#3B82F6' },
  { value: 'preparing', label: 'Preparing', color: '#8B5CF6' },
  { value: 'ready', label: 'Ready for Pickup', color: '#06B6D4' },
  { value: 'picked-up', label: 'Picked Up', color: '#0891B2' },
  { value: 'in-transit', label: 'In Transit', color: '#6366F1' },
  { value: 'delivered', label: 'Delivered', color: '#10B981' },
  { value: 'completed', label: 'Completed', color: '#059669' },
  { value: 'cancelled', label: 'Cancelled', color: '#EF4444' },
  { value: 'disputed', label: 'Disputed', color: '#DC2626' },
] as const;

// Indian states
export const INDIAN_STATES = [
  'Uttar Pradesh', 'Haryana', 'Punjab', 'Madhya Pradesh', 'Rajasthan',
  'Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh',
  'Telangana', 'Kerala', 'Bihar', 'West Bengal', 'Odisha',
  'Jharkhand', 'Chhattisgarh', 'Assam', 'Delhi', 'Uttarakhand',
] as const;

// Demand level labels and colors
export const DEMAND_LEVELS = {
  'very-high': { label: 'Very High', color: '#059669', bg: '#D1FAE5' },
  'high': { label: 'High', color: '#10B981', bg: '#D1FAE5' },
  'medium': { label: 'Medium', color: '#F59E0B', bg: '#FEF3C7' },
  'low': { label: 'Low', color: '#EF4444', bg: '#FEE2E2' },
  'very-low': { label: 'Very Low', color: '#DC2626', bg: '#FEE2E2' },
} as const;

// Risk level labels and colors
export const RISK_LEVELS = {
  'very-high': { label: 'Very High', color: '#DC2626', bg: '#FEE2E2' },
  'high': { label: 'High', color: '#EF4444', bg: '#FEE2E2' },
  'medium': { label: 'Medium', color: '#F59E0B', bg: '#FEF3C7' },
  'low': { label: 'Low', color: '#10B981', bg: '#D1FAE5' },
  'very-low': { label: 'Very Low', color: '#059669', bg: '#D1FAE5' },
} as const;

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
  { value: 'upi', label: 'UPI Payment', icon: '📱' },
  { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { value: 'netbanking', label: 'Net Banking', icon: '🏦' },
] as const;

// Farmer sidebar navigation
export const FARMER_NAV_ITEMS = [
  { label: 'Home', href: '/farmer/dashboard', icon: 'Home' },
  { label: 'Marketplace', href: '/farmer/marketplace', icon: 'Store' },
  { label: 'Sell Product', href: '/farmer/sell-product', icon: 'Plus' },
  { label: 'My Products', href: '/farmer/my-products', icon: 'Package' },
  { label: 'Inventory', href: '/farmer/inventory', icon: 'Warehouse' },
  { label: 'Orders', href: '/farmer/orders', icon: 'ShoppingBag' },
  { label: 'AI Advisor', href: '/farmer/ai-advisor', icon: 'Brain' },
  { label: 'Market Intelligence', href: '/farmer/market-intelligence', icon: 'TrendingUp' },
  { label: 'Risk Analysis', href: '/farmer/risk-analysis', icon: 'Shield' },
  { label: 'Buyer Requests', href: '/farmer/buyer-requests', icon: 'Users' },
  { label: 'Collective Selling', href: '/farmer/collective-selling', icon: 'Handshake' },
  { label: 'Earnings', href: '/farmer/earnings', icon: 'IndianRupee' },
  { label: 'Notifications', href: '/farmer/notifications', icon: 'Bell' },
  { label: 'Profile', href: '/farmer/profile', icon: 'User' },
  { label: 'Settings', href: '/farmer/settings', icon: 'Settings' },
] as const;

// Consumer sidebar navigation
export const CONSUMER_NAV_ITEMS = [
  { label: 'Home', href: '/consumer/dashboard', icon: 'Home' },
  { label: 'Marketplace', href: '/consumer/marketplace', icon: 'Store' },
  { label: 'Categories', href: '/consumer/categories', icon: 'LayoutGrid' },
  { label: 'AI Buying Advisor', href: '/consumer/ai-buying-advisor', icon: 'Brain' },
  { label: 'Price Intelligence', href: '/consumer/price-intelligence', icon: 'TrendingUp' },
  { label: 'Orders', href: '/consumer/orders', icon: 'ShoppingBag' },
  { label: 'Cart', href: '/consumer/cart', icon: 'ShoppingCart' },
  { label: 'Wishlist', href: '/consumer/wishlist', icon: 'Heart' },
  { label: 'Farmers', href: '/consumer/farmers', icon: 'Users' },
  { label: 'Notifications', href: '/consumer/notifications', icon: 'Bell' },
  { label: 'Profile', href: '/consumer/profile', icon: 'User' },
  { label: 'Settings', href: '/consumer/settings', icon: 'Settings' },
] as const;

// Admin sidebar navigation
export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Users', href: '/admin/users', icon: 'Users' },
  { label: 'Products', href: '/admin/products', icon: 'Package' },
  { label: 'Orders', href: '/admin/orders', icon: 'ShoppingBag' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart3' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
] as const;

// Format currency
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Format date
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Format relative time
export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}
