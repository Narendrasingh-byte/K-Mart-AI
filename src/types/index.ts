// ==========================================
// K-Mart AI — Core Type Definitions
// ==========================================

// User roles
export type UserRole = 'farmer' | 'consumer' | 'admin';

// Base user from Firebase Auth + Firestore
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  phone?: string;
  createdAt: string;
  isVerified: boolean;
  isActive: boolean;
}

// Farmer-specific profile
export interface FarmerProfile {
  uid: string;
  farmName: string;
  location?: GeoLocation;
  address: string;
  district: string;
  state: string;
  crops: string[];
  trustScore: number;
  rating: number;
  totalSales: number;
  totalEarnings: number;
  isVerified: boolean;
  bio?: string;
  experience?: number; // years
}

// Consumer-specific profile
export interface ConsumerProfile {
  uid: string;
  addresses: Address[];
  preferredCategories: string[];
  defaultAddressIndex: number;
}

export interface Address {
  id: string;
  label: string; // Home, Office, etc.
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

// Product types
export type ProductStatus = 'active' | 'paused' | 'sold' | 'draft';
export type QualityGrade = 'A+' | 'A' | 'B+' | 'B' | 'C';
export type FreshnessLevel = 'harvested-today' | 'one-day' | 'two-days' | 'three-plus-days';

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerRating?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  minOrderQty: number;
  qualityGrade: QualityGrade;
  harvestDate: string;
  freshness: FreshnessLevel;
  images: string[];
  location: string;
  district: string;
  state: string;
  status: ProductStatus;
  views: number;
  ordersCount: number;
  aiAnalysis?: AIProductAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  productCount: number;
  image?: string;
}

// Order types
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked-up'
  | 'in-transit'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'upi' | 'card' | 'netbanking';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  unit: string;
  subtotal: number;
  farmerId: string;
  farmerName: string;
}

export interface Order {
  id: string;
  consumerId: string;
  consumerName: string;
  farmerId: string;
  farmerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  timestamps: {
    placed: string;
    confirmed?: string;
    preparing?: string;
    ready?: string;
    pickedUp?: string;
    inTransit?: string;
    delivered?: string;
    completed?: string;
    cancelled?: string;
  };
  trackingInfo?: string;
  notes?: string;
}

// Cart types
export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  unit: string;
  quantity: number;
  farmerId: string;
  farmerName: string;
  maxQuantity: number;
}

// Review types
export interface Review {
  id: string;
  productId: string;
  farmerId: string;
  consumerId: string;
  consumerName: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerified: boolean;
}

// Notification types
export type NotificationType = 'order' | 'price' | 'ai' | 'system' | 'review' | 'weather';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  icon?: string;
}

// Market data types
export type DemandLevel = 'very-high' | 'high' | 'medium' | 'low' | 'very-low';
export type TrendDirection = 'up' | 'down' | 'stable';
export type RiskLevel = 'very-high' | 'high' | 'medium' | 'low' | 'very-low';

export interface MarketPrice {
  id: string;
  productName: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  weekAvgPrice: number;
  monthAvgPrice: number;
  trend: TrendDirection;
  changePercent: number;
  demandLevel: DemandLevel;
  unit: string;
  updatedAt: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

// AI types
export interface AIProductAnalysis {
  currentMarketPrice: number;
  recommendedPriceRange: { min: number; max: number };
  demandLevel: DemandLevel;
  expectedNetReturn: number;
  riskLevel: RiskLevel;
  recommendation: string;
  confidence: number;
  source: 'mock' | 'ai';
}

export interface AIPriceRecommendation {
  currentPrice: number;
  recommendedRange: { min: number; max: number };
  demandLevel: DemandLevel;
  sellRecommendation: string;
  reasoning: string;
  confidence: number;
  source: 'mock' | 'ai';
}

export interface AIRiskAnalysis {
  overallRisk: number; // 0-100
  overallLevel: RiskLevel;
  risks: {
    price: { score: number; level: RiskLevel; explanation: string };
    demand: { score: number; level: RiskLevel; explanation: string };
    weather: { score: number; level: RiskLevel; explanation: string };
    spoilage: { score: number; level: RiskLevel; explanation: string };
    transport: { score: number; level: RiskLevel; explanation: string };
    market: { score: number; level: RiskLevel; explanation: string };
  };
  summary: string;
  recommendations: string[];
  source: 'mock' | 'ai';
}

export interface AINetReturn {
  sellNow: {
    grossRevenue: number;
    transportation: number;
    packaging: number;
    platformFee: number;
    otherExpenses: number;
    netReturn: number;
  };
  waitScenario: {
    days: number;
    grossRevenue: number;
    transportation: number;
    packaging: number;
    platformFee: number;
    otherExpenses: number;
    additionalCosts: number;
    netReturn: number;
  };
  recommendation: string;
  reasoning: string;
  source: 'mock' | 'ai';
}

export interface AIBuyingAdvice {
  currentPrice: number;
  sevenDayAverage: number;
  expectedPrice: { min: number; max: number };
  buyScore: number; // 0-100
  recommendation: 'buy-now' | 'wait' | 'neutral';
  reasoning: string;
  factors: {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  source: 'mock' | 'ai';
}

export interface AIDemandForecast {
  productName: string;
  forecasts: {
    day: string;
    demandLevel: DemandLevel;
    estimatedPrice: number;
    confidence: number;
  }[];
  trend: TrendDirection;
  summary: string;
  source: 'mock' | 'ai';
}

export interface AIBuyerMatch {
  id: string;
  buyerName: string;
  businessType: string;
  requiredQuantity: number;
  offeredPrice: number;
  distance: number;
  trustScore: number;
  matchScore: number;
  requirements: string;
  location: string;
}

// Weather types
export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  condition: string;
  icon: string;
  rainProbability: number;
  windSpeed: number;
  forecast: {
    day: string;
    tempHigh: number;
    tempLow: number;
    condition: string;
    rainProbability: number;
  }[];
  alerts: string[];
  farmingAdvice: string;
}

// Buyer request types
export interface BuyerRequest {
  id: string;
  buyerName: string;
  businessType: string;
  productName: string;
  category: string;
  quantity: number;
  offeredPrice: number;
  unit: string;
  location: string;
  distance: number;
  trustScore: number;
  status: 'open' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  deliveryRequirements?: string;
}

// Collective selling types
export interface CollectiveSale {
  id: string;
  productName: string;
  category: string;
  farmers: {
    id: string;
    name: string;
    quantity: number;
    location: string;
  }[];
  totalQuantity: number;
  individualEstimate: number;
  collectiveEstimate: number;
  transportSavings: number;
  additionalEarnings: number;
  status: 'forming' | 'active' | 'completed' | 'cancelled';
  aiAnalysis?: string;
}

// Dashboard stat types
export interface DashboardStat {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: string;
}
