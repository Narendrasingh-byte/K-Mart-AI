// ==========================================
// K-Mart AI — Farmer AI Advisor (Gemini LLM)
// ==========================================
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sampleProducts, sampleMarketPrices } from '@/data/sampleData';
import { formatCurrency } from '@/lib/constants';
import {
  Brain, Send, Loader2, Sparkles, TrendingUp, Shield, Clock, ChevronRight,
  IndianRupee, Package, CheckCircle2, AlertTriangle, ArrowRight, Zap, Leaf,
  RotateCcw, Trash2, Bot, User, Mic, MessageSquarePlus,
} from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const quickQuestions = [
  { icon: <IndianRupee size={14} />, label: 'What\'s the best price for my tomatoes?', color: '#2D6A4F' },
  { icon: <TrendingUp size={14} />, label: 'Should I sell my onions now or wait?', color: '#0891B2' },
  { icon: <Shield size={14} />, label: 'What are the risks for my crops this week?', color: '#E9A319' },
  { icon: <Sparkles size={14} />, label: 'Show demand forecast for the next 7 days', color: '#8B5CF6' },
  { icon: <Package size={14} />, label: 'Which crop has the best profit margin right now?', color: '#10B981' },
  { icon: <Clock size={14} />, label: 'When is the best time to sell wheat before prices drop?', color: '#EF4444' },
];

const suggestedFollowUps = [
  'How can I reduce spoilage during transport?',
  'What organic certifications increase my price?',
  'Compare selling at mandi vs on K-Mart AI',
  'Help me plan my next season\'s crops',
];

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (text: string) => {
    if (isStreaming) return;
    setError(null);

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg: AIMessage = {
      id: aiMsgId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
    setIsStreaming(true);

    // Prepare messages for the API (full conversation history)
    const allMessages = [...messages, userMsg].map((m) => ({
      type: m.type,
      content: m.content,
    }));

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                accumulated += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId
                      ? { ...m, content: accumulated, isStreaming: true }
                      : m
                  )
                );
              }
            } catch (parseErr) {
              // Skip malformed JSON lines
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId ? { ...m, isStreaming: false } : m
        )
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? { ...m, content: m.content + '\n\n⚠️ *Response cancelled*', isStreaming: false }
              : m
          )
        );
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
        setError(errorMessage);
        // Remove the empty AI message on error
        setMessages((prev) => prev.filter((m) => m.id !== aiMsgId));
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input.trim());
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
    inputRef.current?.focus();
  };

  const handleRetry = () => {
    // Find the last user message and resend
    const lastUserMsg = [...messages].reverse().find((m) => m.type === 'user');
    if (lastUserMsg) {
      // Remove the last AI response (if any) and resend
      setMessages((prev) => {
        const lastUserIdx = prev.findLastIndex((m) => m.type === 'user');
        return prev.slice(0, lastUserIdx);
      });
      setError(null);
      sendMessage(lastUserMsg.content);
    }
  };

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    // Split by lines and process
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold headers: **text**
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic: *text*
      processed = processed.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
      // Inline code: `text`
      processed = processed.replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.06);padding:1px 4px;border-radius:3px;font-size:0.85em">$1</code>');

      if (line.trim() === '') return <br key={i} />;

      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <div key={i} className="flex gap-2 ml-2 my-0.5">
            <span className="flex-shrink-0 mt-1" style={{ color: 'var(--color-primary)' }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: processed.replace(/^[\s]*[-•]\s*/, '') }} />
          </div>
        );
      }

      // Numbered lists
      const numberedMatch = line.trim().match(/^(\d+)\.\s*(.*)/);
      if (numberedMatch) {
        return (
          <div key={i} className="flex gap-2 ml-2 my-0.5">
            <span className="flex-shrink-0 font-semibold" style={{ color: 'var(--color-primary)', minWidth: '18px' }}>
              {numberedMatch[1]}.
            </span>
            <span dangerouslySetInnerHTML={{ __html: processed.replace(/^\d+\.\s*/, '') }} />
          </div>
        );
      }

      return <div key={i} dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{
              width: 48, height: 48,
              background: 'linear-gradient(135deg, #0891B2, #06B6D4)',
              boxShadow: '0 4px 14px rgba(8,145,178,0.3)',
            }}
          >
            <Brain size={24} color="white" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              AI Advisor
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white' }}
              >
                Powered by Gemini
              </span>
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Get AI-powered insights for smarter selling decisions
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:shadow-sm"
              style={{
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
              }}
              title="New conversation"
            >
              <MessageSquarePlus size={14} />
              New Chat
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-3 card flex flex-col" style={{ height: '650px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(8,145,178,0.1), rgba(6,182,212,0.15))',
                    boxShadow: '0 0 0 1px rgba(8,145,178,0.1)',
                  }}
                >
                  <Sparkles size={32} style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                  How can I help you today?
                </h3>
                <p className="text-sm mb-6 max-w-md" style={{ color: 'var(--color-text-muted)' }}>
                  I&apos;m your AI farming advisor. Ask me about pricing strategies, demand forecasts,
                  risk analysis, crop recommendations, and more.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {quickQuestions.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => sendMessage(q.label)}
                      className="flex items-center gap-2 p-3 rounded-xl text-left transition-all hover:shadow-md"
                      style={{
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ width: 30, height: 30, background: `${q.color}12` }}
                      >
                        {React.cloneElement(q.icon as React.ReactElement, { color: q.color })}
                      </div>
                      <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>
                        {q.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex gap-2.5 max-w-2xl">
                      {msg.type === 'ai' && (
                        <div
                          className="flex items-center justify-center rounded-full flex-shrink-0 mt-1"
                          style={{
                            width: 32, height: 32,
                            background: 'linear-gradient(135deg, #0891B2, #06B6D4)',
                          }}
                        >
                          <Bot size={16} color="white" />
                        </div>
                      )}
                      <div
                        className="rounded-2xl p-4 animate-fade-in"
                        style={{
                          background: msg.type === 'user'
                            ? 'linear-gradient(135deg, var(--color-primary), #40916C)'
                            : 'var(--color-bg-alt)',
                          color: msg.type === 'user' ? 'white' : 'var(--color-text)',
                          borderBottomRightRadius: msg.type === 'user' ? '6px' : undefined,
                          borderBottomLeftRadius: msg.type === 'ai' ? '6px' : undefined,
                          boxShadow: msg.type === 'user'
                            ? '0 2px 8px rgba(45,106,79,0.2)'
                            : '0 1px 4px rgba(0,0,0,0.04)',
                        }}
                      >
                        <div className="text-sm leading-relaxed">
                          {msg.type === 'ai' ? renderContent(msg.content) : msg.content}
                        </div>

                        {/* Streaming cursor */}
                        {msg.isStreaming && (
                          <span className="inline-block w-2 h-4 ml-0.5 animate-pulse" style={{ background: 'var(--color-accent)', borderRadius: 1 }} />
                        )}
                      </div>
                      {msg.type === 'user' && (
                        <div
                          className="flex items-center justify-center rounded-full flex-shrink-0 mt-1"
                          style={{
                            width: 32, height: 32,
                            background: 'linear-gradient(135deg, #E9A319, #F5C842)',
                          }}
                        >
                          <User size={16} color="white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Error state */}
                {error && (
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl mx-auto max-w-lg"
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
                  >
                    <AlertTriangle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#991B1B' }}>
                        {error}
                      </p>
                      {error.includes('AI_API_KEY') && (
                        <p className="text-xs mt-1" style={{ color: '#B91C1C' }}>
                          Add <code style={{ background: '#FEE2E2', padding: '1px 4px', borderRadius: 3 }}>AI_API_KEY=your_key</code> to your <code style={{ background: '#FEE2E2', padding: '1px 4px', borderRadius: 3 }}>.env.local</code> file and restart the dev server.
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ background: '#FEE2E2', color: '#DC2626', cursor: 'pointer', border: 'none' }}
                    >
                      <RotateCcw size={12} />
                      Retry
                    </button>
                  </div>
                )}

                {/* Suggested follow-ups after AI response */}
                {messages.length > 0 &&
                  !isStreaming &&
                  messages[messages.length - 1].type === 'ai' &&
                  !error && (
                    <div className="flex flex-wrap gap-2 pl-10">
                      {suggestedFollowUps
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3)
                        .map((q) => (
                          <button
                            key={q}
                            onClick={() => sendMessage(q)}
                            className="text-xs px-3 py-1.5 rounded-full transition-all hover:shadow-sm"
                            style={{
                              border: '1px solid var(--color-border)',
                              background: 'var(--color-surface)',
                              color: 'var(--color-text-secondary)',
                              cursor: 'pointer',
                            }}
                          >
                            {q}
                          </button>
                        ))}
                    </div>
                  )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t"
            style={{ borderColor: 'var(--color-border-light)' }}
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pricing, demand, risks, or strategies..."
                className="input flex-1"
                disabled={isStreaming}
                autoFocus
              />
              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStop}
                  className="btn"
                  style={{
                    borderRadius: 'var(--radius-xl)',
                    background: '#EF4444',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  title="Stop generating"
                >
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ background: 'white' }} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!input.trim()}
                  style={{ borderRadius: 'var(--radius-xl)' }}
                >
                  <Send size={16} />
                </button>
              )}
            </div>
            <p className="text-center mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              AI responses are based on platform market data. Always verify critical decisions.
            </p>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Your Products */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Your Products
            </h3>
            <div className="space-y-2">
              {sampleProducts.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    sendMessage(
                      `Analyze the best selling strategy for my ${p.name}. I have ${p.quantity} ${p.unit} at ₹${p.price}/${p.unit}, quality grade ${p.qualityGrade}. What's the optimal price and timing?`
                    )
                  }
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                  disabled={isStreaming}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#D8F3DC' }}
                  >
                    <Leaf size={14} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--color-text)' }}>
                      {p.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-primary)' }}>
                      {formatCurrency(p.price)}/{p.unit}
                    </p>
                  </div>
                  <ChevronRight size={12} style={{ color: 'var(--color-text-muted)' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Market Highlights */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Market Highlights
            </h3>
            <div className="space-y-3">
              {sampleMarketPrices.slice(0, 4).map((mp) => (
                <button
                  key={mp.id}
                  onClick={() =>
                    sendMessage(
                      `Give me a detailed market analysis for ${mp.productName}. Current price is ₹${mp.currentPrice}/${mp.unit}, trend is ${mp.trend} (${mp.changePercent}%). Should I sell now?`
                    )
                  }
                  className="w-full flex items-center justify-between transition-colors hover:bg-gray-50 rounded-lg p-1.5"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                  disabled={isStreaming}
                >
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>
                    {mp.productName}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                      ₹{mp.currentPrice}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: mp.changePercent > 0 ? '#10B981' : '#EF4444' }}
                    >
                      {mp.changePercent > 0 ? '↑' : '↓'}
                      {Math.abs(mp.changePercent)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Capabilities */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              I Can Help With
            </h3>
            <div className="space-y-2">
              {[
                { icon: <IndianRupee size={12} />, label: 'Price optimization', color: '#2D6A4F' },
                { icon: <TrendingUp size={12} />, label: 'Demand forecasting', color: '#0891B2' },
                { icon: <Shield size={12} />, label: 'Risk assessment', color: '#E9A319' },
                { icon: <Zap size={12} />, label: 'Crop recommendations', color: '#8B5CF6' },
                { icon: <Clock size={12} />, label: 'Market timing', color: '#EF4444' },
                { icon: <Leaf size={12} />, label: 'Farming best practices', color: '#10B981' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center rounded-md"
                    style={{ width: 22, height: 22, background: `${item.color}12` }}
                  >
                    {React.cloneElement(item.icon as React.ReactElement, { color: item.color })}
                  </div>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
