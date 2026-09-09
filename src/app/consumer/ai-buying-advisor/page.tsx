// ==========================================
// K-Mart AI — Consumer AI Buying Advisor
// ==========================================
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sampleMarketPrices } from '@/data/sampleData';
import { formatCurrency } from '@/lib/constants';
import {
  Brain, Send, Loader2, Sparkles, TrendingUp, TrendingDown,
  Clock, CheckCircle2, AlertTriangle, Zap,
  RotateCcw, Bot, User, MessageSquarePlus, ShoppingCart, Tag,
} from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const quickQuestions = [
  { icon: <TrendingDown size={14} />, label: 'Which vegetables are cheapest this week?', color: '#10B981' },
  { icon: <Clock size={14} />, label: 'Should I buy onions now or wait?', color: '#F59E0B' },
  { icon: <Tag size={14} />, label: 'Find me the best deal on organic potatoes', color: '#8B5CF6' },
  { icon: <ShoppingCart size={14} />, label: 'What is a good price for Basmati Rice?', color: '#3B82F6' },
];

const suggestedFollowUps = [
  'How do I check for freshness?',
  'What are the seasonal fruits right now?',
  'How much can I save buying in bulk?',
  'Show me more price trends',
];

export default function AIBuyingAdvisorPage() {
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

    const allMessages = [...messages, userMsg].map((m) => ({
      type: m.type,
      content: m.content,
    }));

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages, role: 'consumer' }), // Important: role='consumer'
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
    const lastUserMsg = [...messages].reverse().find((m) => m.type === 'user');
    if (lastUserMsg) {
      setMessages((prev) => {
        const lastUserIdx = prev.findLastIndex((m) => m.type === 'user');
        return prev.slice(0, lastUserIdx);
      });
      setError(null);
      sendMessage(lastUserMsg.content);
    }
  };

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processed = processed.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
      processed = processed.replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.06);padding:1px 4px;border-radius:3px;font-size:0.85em">$1</code>');

      if (line.trim() === '') return <br key={i} />;

      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <div key={i} className="flex gap-2 ml-2 my-0.5">
            <span className="flex-shrink-0 mt-1" style={{ color: '#8B5CF6' }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: processed.replace(/^[\s]*[-•]\s*/, '') }} />
          </div>
        );
      }

      const numberedMatch = line.trim().match(/^(\d+)\.\s*(.*)/);
      if (numberedMatch) {
        return (
          <div key={i} className="flex gap-2 ml-2 my-0.5">
            <span className="flex-shrink-0 font-semibold" style={{ color: '#8B5CF6', minWidth: '18px' }}>
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
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              boxShadow: '0 4px 14px rgba(139,92,246,0.3)',
            }}
          >
            <Brain size={24} color="white" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              AI Buying Intelligence
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: 'white' }}
              >
                Powered by Gemini
              </span>
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Smart recommendations on when to buy and what to wait for
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
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.15))',
                    boxShadow: '0 0 0 1px rgba(139,92,246,0.1)',
                  }}
                >
                  <Sparkles size={32} style={{ color: '#8B5CF6' }} />
                </div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                  Smart Shopping Assistant
                </h3>
                <p className="text-sm mb-6 max-w-md" style={{ color: 'var(--color-text-muted)' }}>
                  I analyze live market prices to help you find the best deals. Ask me what to buy now, or what to hold off on.
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
                        style={{ width: 30, height: 30, background: `${q.color}15` }}
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
                            background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                          }}
                        >
                          <Bot size={16} color="white" />
                        </div>
                      )}
                      <div
                        className="rounded-2xl p-4 animate-fade-in"
                        style={{
                          background: msg.type === 'user'
                            ? 'linear-gradient(135deg, #8B5CF6, #6366F1)'
                            : 'var(--color-bg-alt)',
                          color: msg.type === 'user' ? 'white' : 'var(--color-text)',
                          borderBottomRightRadius: msg.type === 'user' ? '6px' : undefined,
                          borderBottomLeftRadius: msg.type === 'ai' ? '6px' : undefined,
                          boxShadow: msg.type === 'user'
                            ? '0 2px 8px rgba(139,92,246,0.2)'
                            : '0 1px 4px rgba(0,0,0,0.04)',
                        }}
                      >
                        <div className="text-sm leading-relaxed">
                          {msg.type === 'ai' ? renderContent(msg.content) : msg.content}
                        </div>
                        {msg.isStreaming && (
                          <span className="inline-block w-2 h-4 ml-0.5 animate-pulse" style={{ background: '#8B5CF6', borderRadius: 1 }} />
                        )}
                      </div>
                      {msg.type === 'user' && (
                        <div
                          className="flex items-center justify-center rounded-full flex-shrink-0 mt-1"
                          style={{
                            width: 32, height: 32,
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                          }}
                        >
                          <User size={16} style={{ color: 'var(--color-text-secondary)' }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {error && (
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl mx-auto max-w-lg"
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
                  >
                    <AlertTriangle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#991B1B' }}>{error}</p>
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

                {messages.length > 0 && !isStreaming && messages[messages.length - 1].type === 'ai' && !error && (
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

          <form onSubmit={handleSubmit} className="p-4 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about deals, price drops, or quality..."
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
                  className="btn"
                  disabled={!input.trim()}
                  style={{ 
                    borderRadius: 'var(--radius-xl)', 
                    background: input.trim() ? '#8B5CF6' : 'var(--color-border)',
                    color: 'white',
                    border: 'none',
                    cursor: input.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  <Send size={16} />
                </button>
              )}
            </div>
            <p className="text-center mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              AI insights are based on live platform data. Prices may vary.
            </p>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5" style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: '1px solid #BBF7D0' }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#065F46' }}>Top Savings Opportunity</h3>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold" style={{ color: '#059669' }}>Organic Potatoes</span>
            </div>
            <p className="text-xs mb-3" style={{ color: '#065F46' }}>Price is 15% below weekly average.</p>
            <button 
              onClick={() => sendMessage("Tell me more about the current deal on Organic Potatoes. Is it worth buying in bulk?")}
              className="btn btn-sm w-full"
              style={{ background: '#10B981', color: 'white', border: 'none' }}
              disabled={isStreaming}
            >
              Analyze Deal
            </button>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} style={{ color: '#F59E0B' }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Price Alerts</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Fresh Tomatoes', target: 'Below ₹25/kg', current: '₹28/kg' },
                { name: 'Alphonso Mangoes', target: 'Below ₹300/dz', current: '₹350/dz' },
              ].map((alert) => (
                <button 
                  key={alert.name} 
                  onClick={() => sendMessage(`My target price for ${alert.name} is ${alert.target}, but it's currently at ${alert.current}. When do you predict it will hit my target?`)}
                  className="w-full flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-gray-100" 
                  style={{ background: 'var(--color-bg-alt)', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  disabled={isStreaming}
                >
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{alert.name}</p>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Target: {alert.target}</p>
                  </div>
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{alert.current}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Market Intelligence Snippets */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Market Trends
            </h3>
            <div className="space-y-3">
              {sampleMarketPrices.slice(0, 3).map((mp) => (
                <button
                  key={mp.id}
                  onClick={() =>
                    sendMessage(
                      `The price of ${mp.productName} is trending ${mp.trend} (${mp.changePercent}%). Should I buy now or wait?`
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
                    <span
                      className="text-xs font-bold"
                      style={{ color: mp.changePercent > 0 ? '#EF4444' : '#10B981' }} // Reversed colors: red for price up (bad for consumer), green for down
                    >
                      {mp.changePercent > 0 ? '↑' : '↓'}
                      {Math.abs(mp.changePercent)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
