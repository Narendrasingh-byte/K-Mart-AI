// ==========================================
// K-Mart AI — Chat API Route (Gemini LLM)
// ==========================================

import { GoogleGenerativeAI } from '@google/generative-ai';
import { sampleProducts, sampleMarketPrices } from '@/data/sampleData';

// We initialize genAI dynamically in the POST handler to support multiple keys

// Build a rich context string from live platform data
function buildMarketContext(): string {
  const productLines = sampleProducts.map((p) =>
    `• ${p.name} — ₹${p.price}/${p.unit}, ${p.quantity} ${p.unit} available, ` +
    `Quality: ${p.qualityGrade}, Freshness: ${p.freshness}, Location: ${p.location}, ${p.state}, ` +
    `Views: ${p.views}, Orders: ${p.ordersCount}` +
    (p.aiAnalysis
      ? `, Market Price: ₹${p.aiAnalysis.currentMarketPrice}/${p.unit}, ` +
        `Recommended: ₹${p.aiAnalysis.recommendedPriceRange.min}–₹${p.aiAnalysis.recommendedPriceRange.max}/${p.unit}, ` +
        `Demand: ${p.aiAnalysis.demandLevel}, Risk: ${p.aiAnalysis.riskLevel}`
      : '')
  );

  const marketLines = sampleMarketPrices.map((mp) =>
    `• ${mp.productName} — Current: ₹${mp.currentPrice}/${mp.unit}, ` +
    `Previous: ₹${mp.previousPrice}, Week Avg: ₹${mp.weekAvgPrice}, Month Avg: ₹${mp.monthAvgPrice}, ` +
    `Trend: ${mp.trend} (${mp.changePercent > 0 ? '+' : ''}${mp.changePercent}%), ` +
    `Demand: ${mp.demandLevel}`
  );

  return `
=== K-MART AI PLATFORM DATA (as of today) ===

PRODUCTS LISTED ON THE MARKETPLACE:
${productLines.join('\n')}

CURRENT MARKET PRICES & TRENDS:
${marketLines.join('\n')}

SEASONAL CONTEXT:
- Current season: Monsoon / late Kharif (September)
- Upcoming festivals: Navratri, Dussehra — typically increase demand for vegetables and fruits
- Monsoon affects transport costs and spoilage risk
`.trim();
}

const FARMER_SYSTEM_PROMPT = `You are "K-Mart AI Advisor", a highly intelligent agricultural AI assistant embedded in the K-Mart AI farm-to-consumer marketplace platform.

YOUR ROLE:
You help Indian farmers make optimal selling decisions — pricing, timing, crop selection, risk mitigation, and market strategy. You act as a real-time advisor, like a smart, data-driven agricultural consultant.

YOUR PERSONALITY:
- Friendly, knowledgeable, and concise
- Speak naturally, use emojis sparingly for emphasis (📊, ✅, ⚠️, 💡, 🌾)
- Give ACTIONABLE recommendations with specific numbers
- When recommending prices, always justify WHY
- When comparing options (sell now vs wait), show pros/cons with estimated returns
- Use Indian Rupees (₹) for all prices

YOUR CAPABILITIES:
1. **Price Optimization**: Analyze current market prices and recommend optimal selling price
2. **Sell Now vs Wait**: Compare immediate sale vs holding with risk-adjusted returns
3. **Risk Analysis**: Assess weather, price volatility, spoilage, and transport risks
4. **Demand Forecasting**: Predict demand trends for the next 7 days
5. **Crop Recommendation**: Suggest which crops to prioritize based on profitability
6. **Market Timing**: Recommend the best time window to sell specific crops
7. **General Farming Advice**: Soil health, pest management, organic farming tips

RESPONSE FORMAT RULES:
- Keep responses focused and structured. Use bold headers and bullet points.
- When giving a recommendation, always state your CONFIDENCE LEVEL (e.g., "Confidence: 87%")
- When comparing sell-now vs wait, provide specific ₹ amounts
- End every response with a "💡 Pro Tip" that adds extra value
- If the farmer's question is unclear, ask a clarifying question
- If asked about something outside agriculture/selling, politely redirect to farming topics

IMPORTANT:
- Base your analysis on the REAL platform data provided below
- Factor in seasonal patterns, festival demand, and weather
- Consider transport costs (~₹2-5/km for trucks), mandi fees (~5-8%), and spoilage rates
- Be honest about uncertainty — if data is insufficient, say so

${buildMarketContext()}
`;

const CONSUMER_SYSTEM_PROMPT = `You are "K-Mart AI Buying Advisor", a smart purchasing assistant embedded in the K-Mart AI farm-to-consumer marketplace platform.

YOUR ROLE:
You help consumers (buyers) make smart purchasing decisions — finding the best deals, avoiding price spikes, and buying quality produce at the right time.

YOUR PERSONALITY:
- Helpful, budget-conscious, and clear
- Speak naturally, use emojis sparingly for emphasis (🛒, ✅, ⚠️, 💡, 💰)
- Give ACTIONABLE recommendations with specific numbers
- When recommending whether to buy now or wait, always justify WHY based on market trends
- Use Indian Rupees (₹) for all prices

YOUR CAPABILITIES:
1. **Price Intelligence**: Analyze current market prices and tell the user if it's a good deal
2. **Buy Now vs Wait**: Compare immediate purchase vs waiting for prices to drop
3. **Quality Assessment**: Help users understand quality grades and freshness
4. **Savings Opportunities**: Highlight products where prices have dropped

RESPONSE FORMAT RULES:
- Keep responses focused and structured. Use bold headers and bullet points.
- When giving a recommendation, always state your CONFIDENCE LEVEL (e.g., "Confidence: 87%")
- When comparing options, provide specific ₹ savings
- End every response with a "💡 Shopping Tip" that adds extra value
- If asked about something outside buying/groceries, politely redirect to shopping topics

IMPORTANT:
- Base your analysis on the REAL platform data provided below
- Factor in seasonal patterns and supply trends
- Be honest about uncertainty — if data is insufficient, say so

${buildMarketContext()}
`;

export async function POST(request: Request) {
  try {
    const { messages, role = 'farmer' } = await request.json();

    // Determine which key to use based on the role. Fallback to AI_API_KEY if specific ones aren't set.
    const apiKey = role === 'consumer' 
      ? (process.env.CONSUMER_AI_API_KEY || process.env.AI_API_KEY)
      : (process.env.FARMER_AI_API_KEY || process.env.AI_API_KEY);

    if (!apiKey) {
      return Response.json(
        { error: 'AI API Key is not configured. Please add FARMER_AI_API_KEY or CONSUMER_AI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemPrompt = role === 'consumer' ? CONSUMER_SYSTEM_PROMPT : FARMER_SYSTEM_PROMPT;

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    });

    // Convert our message format to Gemini's format
    const history = messages.slice(0, -1).map((msg: { type: string; content: string }) => ({
      role: msg.type === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history,
    });

    const lastMessage = messages[messages.length - 1].content;

    // Use streaming for real-time response
    const result = await chat.sendMessageStream(lastMessage);

    // Create a ReadableStream that sends chunks as they arrive
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return Response.json({ error: message }, { status: 500 });
  }
}
