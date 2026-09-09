// ==========================================
// K-Mart AI — Farmer AI Advisor
// ==========================================
'use client';

import React, { useState } from 'react';
import { sampleProducts, sampleMarketPrices } from '@/data/sampleData';
import { formatCurrency } from '@/lib/constants';
import {
  Brain, Send, Loader2, Sparkles, TrendingUp, Shield, Clock, ChevronRight,
  IndianRupee, Package, CheckCircle2, AlertTriangle, ArrowRight, Zap, Leaf,
} from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  data?: {
    sellNow?: number;
    waitReturn?: number;
    recommendation?: string;
    confidence?: number;
  };
}

const quickQuestions = [
  { icon: <IndianRupee size={14} />, label: 'What\'s the best price for my tomatoes?', color: '#2D6A4F' },
  { icon: <TrendingUp size={14} />, label: 'Should I sell now or wait?', color: '#0891B2' },
  { icon: <Shield size={14} />, label: 'What are the risks for my onions?', color: '#E9A319' },
  { icon: <Sparkles size={14} />, label: 'Show demand forecast for vegetables', color: '#8B5CF6' },
  { icon: <Package size={14} />, label: 'Which crop should I focus on?', color: '#10B981' },
  { icon: <Clock size={14} />, label: 'When is the best time to sell wheat?', color: '#EF4444' },
];

const aiResponses: Record<string, { text: string; data?: AIMessage['data'] }> = {
  'price': {
    text: '📊 **Tomato Market Analysis**\n\nCurrent market price: ₹28/kg\n\n**AI Recommended Price Range: ₹30 – ₹32/kg**\n\nYour tomatoes are Grade A+ with "Harvested Today" freshness, which commands a premium of 7-15% above market rate. Current demand is HIGH with 342 active buyers in your region.\n\n💡 **Tip:** List at ₹31/kg for optimal balance between speed of sale and profit.',
    data: { sellNow: 15500, waitReturn: 17200, recommendation: 'Sell 60% now, hold 40%', confidence: 87 },
  },
  'sell': {
    text: '🤔 **Sell Now vs Wait Analysis**\n\n**Sell Now (₹28/kg):**\n- Gross Revenue: ₹14,000 (500kg)\n- Transport & Fees: ₹1,850\n- Net Return: ₹12,150\n\n**Wait 3 Days (Expected ₹32/kg):**\n- Gross Revenue: ₹16,000\n- Additional Storage: ₹400\n- Spoilage Risk: ~5%\n- Net Return: ₹13,800\n\n✅ **AI Recommendation:** Split your inventory. Sell 300kg now and hold 200kg. Weekend prices typically rise 8-12% for tomatoes due to restaurant demand.',
    data: { sellNow: 12150, waitReturn: 13800, recommendation: 'Split inventory 60/40', confidence: 85 },
  },
  'risk': {
    text: '⚠️ **Risk Analysis — Onions**\n\n**Overall Risk Score: 42/100 (Medium)**\n\n• 🌧️ Weather Risk: **HIGH** — Rain forecast in 2 days may affect transport\n• 📈 Price Risk: **LOW** — Stable upward trend (+16.7% this week)\n• 📦 Spoilage Risk: **LOW** — Onions have good shelf life\n• 🚛 Transport Risk: **MEDIUM** — Monsoon road conditions\n• 📊 Demand Risk: **VERY LOW** — Very high demand, 456 views\n\n💡 **Recommendations:**\n1. Prioritize selling before the rain hits\n2. Use covered transport to prevent moisture damage\n3. Current price is favorable — good time to sell',
  },
  'demand': {
    text: '📈 **7-Day Demand Forecast — Vegetables**\n\n| Day | Tomato | Onion | Potato | Cauliflower |\n|------|---------|---------|---------|-------------|\n| Today | 🟢 High | 🟢 V.High | 🟡 Med | 🟡 Med |\n| Tomorrow | 🟢 High | 🟢 V.High | 🟡 Med | 🟢 High |\n| Day 3 | 🟢 High | 🟢 High | 🟡 Med | 🟢 High |\n| Day 4 | 🟡 Med | 🟢 High | 🟡 Med | 🟡 Med |\n| Day 5 | 🟢 High | 🟡 Med | 🟢 High | 🟡 Med |\n| Weekend | 🟢 V.High | 🟢 V.High | 🟢 High | 🟢 High |\n\n💡 Weekend demand peaks due to restaurant orders and retail shopping.',
  },
  'crop': {
    text: '🌾 **Crop Recommendation Analysis**\n\nBased on current market data, demand patterns, and your region (UP):\n\n**Top 3 Profitable Crops Right Now:**\n\n1. 🧅 **Onions** — ₹35/kg, Very High demand, Low risk\n   Expected return: ₹28,000 per 800kg batch\n\n2. 🍅 **Tomatoes** — ₹28/kg, High demand, Medium risk\n   Expected return: ₹14,000 per 500kg batch\n\n3. 🌾 **Basmati Rice** — ₹85/kg, High demand, Low risk\n   Expected return: ₹1,70,000 per 2000kg batch\n\n⚡ **Quick Win:** Onions have the best demand-to-risk ratio this week.',
  },
  'wheat': {
    text: '🌾 **Wheat Selling Window Analysis**\n\n**Current Price: ₹28/kg** (↑3.7% this week)\n\n**Best Selling Windows:**\n- ✅ **Now — Next 10 days**: High demand from festivals (Navratri season). Prices expected stable at ₹27-29/kg\n- ⚠️ **After 2 weeks**: New harvest arrivals may push prices down 5-8%\n- 🔴 **Next month**: Expected ₹25-26/kg as supply increases\n\n💡 **AI Recommendation:** Sell within the next 7-10 days to capture current premium pricing. Hold minimum stock for personal use only.',
    data: { sellNow: 140000, waitReturn: 125000, recommendation: 'Sell within 7-10 days', confidence: 82 },
  },
};

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');

  const sendMessage = async (text: string) => {
    const userMsg: AIMessage = { id: Date.now().toString(), type: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));

    const lowerText = text.toLowerCase();
    let response = aiResponses['price'];
    if (lowerText.includes('sell') || lowerText.includes('wait')) response = aiResponses['sell'];
    else if (lowerText.includes('risk')) response = aiResponses['risk'];
    else if (lowerText.includes('demand') || lowerText.includes('forecast')) response = aiResponses['demand'];
    else if (lowerText.includes('crop') || lowerText.includes('focus')) response = aiResponses['crop'];
    else if (lowerText.includes('wheat') || lowerText.includes('time')) response = aiResponses['wheat'];

    const aiMsg: AIMessage = {
      id: (Date.now() + 1).toString(), type: 'ai',
      content: response.text, timestamp: new Date(), data: response.data,
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-2xl" style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #0891B2, #06B6D4)' }}>
          <Brain size={24} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            AI Advisor 🧠
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Get AI-powered insights for smarter selling decisions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-3 card flex flex-col" style={{ height: '600px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(8,145,178,0.1), rgba(6,182,212,0.1))' }}>
                  <Sparkles size={28} style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                  Ask me anything about selling!
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                  I can help with pricing, demand forecasts, risk analysis, and more.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {quickQuestions.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => sendMessage(q.label)}
                      className="flex items-center gap-2 p-3 rounded-xl text-left transition-all hover:shadow-sm"
                      style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer' }}
                    >
                      <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 28, height: 28, background: `${q.color}15` }}>
                        {React.cloneElement(q.icon as React.ReactElement, { color: q.color })}
                      </div>
                      <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-lg rounded-2xl p-4 animate-fade-in"
                      style={{
                        background: msg.type === 'user' ? 'var(--color-primary)' : 'var(--color-bg-alt)',
                        color: msg.type === 'user' ? 'white' : 'var(--color-text)',
                        borderBottomRightRadius: msg.type === 'user' ? '4px' : undefined,
                        borderBottomLeftRadius: msg.type === 'ai' ? '4px' : undefined,
                      }}
                    >
                      {msg.type === 'ai' && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <Brain size={14} style={{ color: 'var(--color-accent)' }} />
                          <span className="text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>AI Advisor</span>
                        </div>
                      )}
                      <div className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</div>

                      {msg.data && (
                        <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: msg.type === 'user' ? 'rgba(255,255,255,0.2)' : 'var(--color-border-light)' }}>
                          {msg.data.sellNow && msg.data.waitReturn && (
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 rounded-lg text-center" style={{ background: msg.type === 'user' ? 'rgba(255,255,255,0.1)' : '#D1FAE5' }}>
                                <p className="text-xs mb-0.5" style={{ color: msg.type === 'user' ? 'rgba(255,255,255,0.7)' : '#065F46' }}>Sell Now</p>
                                <p className="text-sm font-bold" style={{ color: msg.type === 'user' ? 'white' : '#059669' }}>{formatCurrency(msg.data.sellNow)}</p>
                              </div>
                              <div className="p-2 rounded-lg text-center" style={{ background: msg.type === 'user' ? 'rgba(255,255,255,0.1)' : '#DBEAFE' }}>
                                <p className="text-xs mb-0.5" style={{ color: msg.type === 'user' ? 'rgba(255,255,255,0.7)' : '#1E40AF' }}>Wait Return</p>
                                <p className="text-sm font-bold" style={{ color: msg.type === 'user' ? 'white' : '#2563EB' }}>{formatCurrency(msg.data.waitReturn)}</p>
                              </div>
                            </div>
                          )}
                          {msg.data.confidence && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs" style={{ color: msg.type === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)' }}>Confidence:</span>
                              <div className="flex-1 h-1.5 rounded-full" style={{ background: msg.type === 'user' ? 'rgba(255,255,255,0.2)' : '#E2E8F0' }}>
                                <div className="h-full rounded-full" style={{ width: `${msg.data.confidence}%`, background: '#10B981' }} />
                              </div>
                              <span className="text-xs font-bold" style={{ color: msg.type === 'user' ? 'white' : '#10B981' }}>{msg.data.confidence}%</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl p-4" style={{ background: 'var(--color-bg-alt)' }}>
                      <div className="flex items-center gap-2">
                        <Brain size={14} style={{ color: 'var(--color-accent)' }} />
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)' }} />
                          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)', animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)', animationDelay: '0.4s' }} />
                        </div>
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pricing, demand, risks, or best selling strategies..."
                className="input flex-1"
                disabled={isTyping}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!input.trim() || isTyping}
                style={{ borderRadius: 'var(--radius-xl)' }}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Quick Stats */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Your Products</h3>
            <div className="space-y-2">
              {sampleProducts.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => sendMessage(`Analyze pricing for my ${p.name}`)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#D8F3DC' }}>
                    <Leaf size={14} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--color-text)' }}>{p.name}</p>
                    <p className="text-xs" style={{ color: 'var(--color-primary)' }}>{formatCurrency(p.price)}/{p.unit}</p>
                  </div>
                  <ChevronRight size={12} style={{ color: 'var(--color-text-muted)' }} />
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Market Highlights</h3>
            <div className="space-y-3">
              {sampleMarketPrices.slice(0, 4).map((mp) => (
                <div key={mp.id} className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{mp.productName}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>₹{mp.currentPrice}</span>
                    <span className="text-xs" style={{ color: mp.changePercent > 0 ? '#10B981' : '#EF4444' }}>
                      {mp.changePercent > 0 ? '↑' : '↓'}{Math.abs(mp.changePercent)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
