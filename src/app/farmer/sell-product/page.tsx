// ==========================================
// K-Mart AI — Sell Product (Multi-Step Form)
// ==========================================
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, PRODUCT_UNITS, QUALITY_GRADES, FRESHNESS_LEVELS, formatCurrency } from '@/lib/constants';
import { toast } from 'sonner';
import {
  ArrowLeft, ArrowRight, Package, IndianRupee, Brain, CheckCircle2,
  Leaf, TrendingUp, AlertTriangle, Shield, Sparkles, Loader2, Info,
  ImagePlus, X,
} from 'lucide-react';

type Step = 'details' | 'pricing' | 'ai-analysis' | 'review';

interface ProductForm {
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  minOrderQty: number;
  qualityGrade: string;
  harvestDate: string;
  freshness: string;
}

const initialForm: ProductForm = {
  name: '',
  category: '',
  description: '',
  price: 0,
  unit: 'kg',
  quantity: 0,
  minOrderQty: 1,
  qualityGrade: 'A',
  harvestDate: new Date().toISOString().split('T')[0],
  freshness: 'harvested-today',
};

export default function SellProductPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('details');
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    recommendedRange: { min: number; max: number };
    demandLevel: string;
    riskLevel: string;
    expectedReturn: number;
    recommendation: string;
    confidence: number;
  } | null>(null);

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: 'details', label: 'Product Details', icon: <Package size={16} /> },
    { key: 'pricing', label: 'Pricing', icon: <IndianRupee size={16} /> },
    { key: 'ai-analysis', label: 'AI Analysis', icon: <Brain size={16} /> },
    { key: 'review', label: 'Review & Publish', icon: <CheckCircle2 size={16} /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const updateForm = (field: keyof ProductForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateDetails = () => {
    if (!form.name.trim()) { toast.error('Please enter a product name'); return false; }
    if (!form.category) { toast.error('Please select a category'); return false; }
    if (!form.description.trim()) { toast.error('Please add a description'); return false; }
    return true;
  };

  const validatePricing = () => {
    if (form.price <= 0) { toast.error('Please enter a valid price'); return false; }
    if (form.quantity <= 0) { toast.error('Please enter available quantity'); return false; }
    if (form.minOrderQty <= 0) { toast.error('Minimum order quantity must be at least 1'); return false; }
    return true;
  };

  const runAiAnalysis = async () => {
    setAnalyzing(true);
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const basePrice = form.price;
    setAiResult({
      recommendedRange: {
        min: Math.round(basePrice * 0.95),
        max: Math.round(basePrice * 1.15),
      },
      demandLevel: basePrice > 50 ? 'high' : 'medium',
      riskLevel: form.freshness === 'harvested-today' ? 'low' : 'medium',
      expectedReturn: Math.round(form.price * form.quantity * 0.88),
      recommendation: basePrice > 50
        ? `Strong demand for ${form.name}. Your price of ${formatCurrency(basePrice)}/${form.unit} is competitive. Consider selling 70% now and holding 30% for potential price increase this weekend.`
        : `Moderate demand for ${form.name}. Price is within market range. List now to capture current buyers. Consider bundling with complementary products.`,
      confidence: Math.floor(Math.random() * 15) + 80,
    });
    setAnalyzing(false);
  };

  const handleNext = () => {
    if (step === 'details' && !validateDetails()) return;
    if (step === 'pricing' && !validatePricing()) return;
    if (step === 'pricing') {
      setStep('ai-analysis');
      runAiAnalysis();
      return;
    }
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex].key);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex].key);
    }
  };

  const handlePublish = () => {
    toast.success('Product listed successfully! 🎉');
    router.push('/farmer/my-products');
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'very-high': case 'high': return { bg: '#D1FAE5', text: '#059669' };
      case 'medium': return { bg: '#FEF3C7', text: '#B45309' };
      default: return { bg: '#FEE2E2', text: '#DC2626' };
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': case 'very-low': return { bg: '#D1FAE5', text: '#059669' };
      case 'medium': return { bg: '#FEF3C7', text: '#B45309' };
      default: return { bg: '#FEE2E2', text: '#DC2626' };
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm font-medium mb-4"
          style={{ color: 'var(--color-primary)', border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Sell a Product 🌾
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          List your produce with AI-powered pricing intelligence
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <React.Fragment key={s.key}>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap transition-all"
              style={{
                background: i <= currentStepIndex ? 'var(--color-primary)' : 'var(--color-surface)',
                color: i <= currentStepIndex ? 'white' : 'var(--color-text-muted)',
                border: i <= currentStepIndex ? 'none' : '1px solid var(--color-border)',
                fontSize: '0.8125rem',
                fontWeight: 600,
              }}
            >
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-8 h-0.5 flex-shrink-0" style={{ background: i < currentStepIndex ? 'var(--color-primary)' : 'var(--color-border)' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="card p-6 animate-fade-in">
        {step === 'details' && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Product Information</h2>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="e.g., Fresh Tomatoes, Basmati Rice"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Category *</label>
              <select value={form.category} onChange={(e) => updateForm('category', e.target.value)} className="select">
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="Describe your produce — quality, growing method, specialties..."
                className="input"
                rows={4}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Quality Grade</label>
                <select value={form.qualityGrade} onChange={(e) => updateForm('qualityGrade', e.target.value)} className="select">
                  {QUALITY_GRADES.map((g) => (
                    <option key={g.value} value={g.value}>{g.label} — {g.description}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Freshness</label>
                <select value={form.freshness} onChange={(e) => updateForm('freshness', e.target.value)} className="select">
                  {FRESHNESS_LEVELS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Harvest Date</label>
              <input
                type="date"
                value={form.harvestDate}
                onChange={(e) => updateForm('harvestDate', e.target.value)}
                className="input"
              />
            </div>

            <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg-alt)', border: '1px solid var(--color-border-light)' }}>
              <div className="flex items-center gap-2 mb-2">
                <ImagePlus size={16} style={{ color: 'var(--color-text-muted)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Product Images</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--color-border)' }}
                  onClick={() => toast.info('Image upload will use Firebase Storage in production')}
                >
                  <ImagePlus size={24} style={{ color: 'var(--color-text-muted)' }} />
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Click to upload product photos. High-quality images increase buyer trust.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 'pricing' && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Pricing & Quantity</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Price (₹) *</label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                  <input
                    type="number"
                    value={form.price || ''}
                    onChange={(e) => updateForm('price', Number(e.target.value))}
                    placeholder="0"
                    className="input pl-9"
                    min={1}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Unit *</label>
                <select value={form.unit} onChange={(e) => updateForm('unit', e.target.value)} className="select">
                  {PRODUCT_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Available Quantity *</label>
                <input
                  type="number"
                  value={form.quantity || ''}
                  onChange={(e) => updateForm('quantity', Number(e.target.value))}
                  placeholder="e.g., 500"
                  className="input"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Minimum Order Qty</label>
                <input
                  type="number"
                  value={form.minOrderQty || ''}
                  onChange={(e) => updateForm('minOrderQty', Number(e.target.value))}
                  placeholder="e.g., 5"
                  className="input"
                  min={1}
                />
              </div>
            </div>

            {form.price > 0 && form.quantity > 0 && (
              <div className="p-4 rounded-xl" style={{ background: 'var(--color-primary-pale)', border: '1px solid #B7E4C7' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Info size={16} style={{ color: 'var(--color-primary)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Estimated Revenue</span>
                </div>
                <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                  {formatCurrency(form.price * form.quantity)}
                </p>
                <p className="text-xs mt-1" style={{ color: '#065F46' }}>
                  {form.quantity} {form.unit} × {formatCurrency(form.price)}/{form.unit}
                </p>
              </div>
            )}
          </div>
        )}

        {step === 'ai-analysis' && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Brain size={20} style={{ color: 'var(--color-accent)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>AI Market Analysis</h2>
              <span className="badge badge-info" style={{ fontSize: '0.625rem' }}>AI POWERED</span>
            </div>

            {analyzing ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0891B2, #06B6D4)' }}>
                    <Brain size={32} color="white" className="animate-pulse" />
                  </div>
                  <Loader2 size={18} className="animate-spin absolute -bottom-1 -right-1" style={{ color: 'var(--color-accent)' }} />
                </div>
                <p className="text-sm font-medium mt-4" style={{ color: 'var(--color-text)' }}>Analyzing market data...</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Checking prices, demand, and competition</p>
              </div>
            ) : aiResult ? (
              <div className="space-y-4 animate-fade-in">
                {/* Price Recommendation */}
                <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: '1px solid #BBF7D0' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Recommended Price Range</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                      {formatCurrency(aiResult.recommendedRange.min)} – {formatCurrency(aiResult.recommendedRange.max)}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>/{form.unit}</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: '#065F46' }}>
                    Your price: {formatCurrency(form.price)}/{form.unit} —
                    {form.price >= aiResult.recommendedRange.min && form.price <= aiResult.recommendedRange.max
                      ? ' ✅ Within recommended range'
                      : form.price < aiResult.recommendedRange.min
                        ? ' ⚠️ Below recommended range — you could earn more'
                        : ' ⚠️ Above recommended range — may reduce sales'}
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl text-center" style={{ background: getDemandColor(aiResult.demandLevel).bg }}>
                    <p className="text-xs font-medium mb-1" style={{ color: getDemandColor(aiResult.demandLevel).text }}>Demand</p>
                    <p className="text-sm font-bold capitalize" style={{ color: getDemandColor(aiResult.demandLevel).text }}>
                      {aiResult.demandLevel}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl text-center" style={{ background: getRiskColor(aiResult.riskLevel).bg }}>
                    <p className="text-xs font-medium mb-1" style={{ color: getRiskColor(aiResult.riskLevel).text }}>Risk</p>
                    <p className="text-sm font-bold capitalize" style={{ color: getRiskColor(aiResult.riskLevel).text }}>
                      {aiResult.riskLevel}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl text-center" style={{ background: '#DBEAFE' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: '#2563EB' }}>Confidence</p>
                    <p className="text-sm font-bold" style={{ color: '#2563EB' }}>{aiResult.confidence}%</p>
                  </div>
                  <div className="p-3 rounded-xl text-center" style={{ background: '#F3E8FF' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: '#7C3AED' }}>Est. Return</p>
                    <p className="text-sm font-bold" style={{ color: '#7C3AED' }}>{formatCurrency(aiResult.expectedReturn)}</p>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(8, 145, 178, 0.06)', border: '1px solid rgba(8, 145, 178, 0.15)' }}>
                  <Sparkles size={18} style={{ color: 'var(--color-accent)' }} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-accent)' }}>AI Recommendation</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {aiResult.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Review Your Listing</h2>

            <div className="space-y-4">
              {/* Product Summary */}
              <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D8F3DC, #B7E4C7)' }}>
                    <Leaf size={28} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>{form.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {CATEGORIES.find((c) => c.id === form.category)?.name || form.category} • Grade {form.qualityGrade}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Price', value: `${formatCurrency(form.price)}/${form.unit}` },
                    { label: 'Quantity', value: `${form.quantity} ${form.unit}` },
                    { label: 'Min Order', value: `${form.minOrderQty} ${form.unit}` },
                    { label: 'Freshness', value: FRESHNESS_LEVELS.find((f) => f.value === form.freshness)?.label || '' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.label}</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Description</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{form.description}</p>
              </div>

              {aiResult && (
                <div className="p-4 rounded-xl" style={{ background: '#D1FAE5', border: '1px solid #6EE7B7' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} style={{ color: '#059669' }} />
                    <span className="text-sm font-semibold" style={{ color: '#059669' }}>AI Analysis Summary</span>
                  </div>
                  <p className="text-xs" style={{ color: '#065F46' }}>
                    Recommended range: {formatCurrency(aiResult.recommendedRange.min)}–{formatCurrency(aiResult.recommendedRange.max)}/{form.unit} •
                    Demand: {aiResult.demandLevel} • Risk: {aiResult.riskLevel} • Confidence: {aiResult.confidence}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="btn btn-outline"
          style={{ visibility: currentStepIndex === 0 ? 'hidden' : 'visible' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {step === 'review' ? (
          <button onClick={handlePublish} className="btn btn-primary btn-lg">
            <CheckCircle2 size={18} />
            Publish Listing
          </button>
        ) : (
          <button onClick={handleNext} className="btn btn-primary" disabled={analyzing}>
            {analyzing ? (
              <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
            ) : (
              <>Next <ArrowRight size={16} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
