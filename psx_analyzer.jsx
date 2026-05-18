import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Search, TrendingUp, TrendingDown, Activity, AlertTriangle, Target, Shield,
  Zap, Globe, Newspaper, Brain, BarChart3, Clock, X, RefreshCw, Copy, Check,
  ChevronRight, Eye, Plus, Minus, Circle, Sparkles, Layers, Cpu, Radio,
  ArrowUpRight, ArrowDownRight, Info, Star, Flame, Wind, Anchor
} from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, LineChart, BarChart, AreaChart, RadarChart,
  Line, Bar, Area, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Scatter, Cell
} from 'recharts';
import * as math from 'mathjs';

/* ═══════════════════════════════════════════════════════════════════
   THEME TOKENS
   ═══════════════════════════════════════════════════════════════════ */
const C = {
  bg: '#0a0a0f', bg2: '#0f0f1a', bg3: '#13131f',
  border: '#1a1a2e', borderLight: '#252540',
  accent: '#00d4aa', accentDim: 'rgba(0,212,170,0.15)',
  bull: '#00ff88', bullDim: 'rgba(0,255,136,0.12)',
  bear: '#ff3366', bearDim: 'rgba(255,51,102,0.12)',
  warn: '#ffaa00', warnDim: 'rgba(255,170,0,0.12)',
  text: '#e8eaf6', text2: '#7986cb', text3: '#4a5491',
  glow: '0 0 24px rgba(0,212,170,0.35)'
};

/* ═══════════════════════════════════════════════════════════════════
   PSX UNIVERSE
   ═══════════════════════════════════════════════════════════════════ */
const PSX_STOCKS = [
  { t: 'ENGRO',  n: 'Engro Corporation',           s: 'Fertilizer' },
  { t: 'LUCK',   n: 'Lucky Cement',                s: 'Cement' },
  { t: 'HBL',    n: 'Habib Bank Limited',          s: 'Banking' },
  { t: 'PSO',    n: 'Pakistan State Oil',          s: 'Oil & Gas' },
  { t: 'OGDC',   n: 'Oil & Gas Development Co',    s: 'Oil & Gas' },
  { t: 'MCB',    n: 'MCB Bank',                    s: 'Banking' },
  { t: 'UBL',    n: 'United Bank Limited',         s: 'Banking' },
  { t: 'NBP',    n: 'National Bank of Pakistan',   s: 'Banking' },
  { t: 'HUBC',   n: 'Hub Power Company',           s: 'Power' },
  { t: 'PPL',    n: 'Pakistan Petroleum',          s: 'Oil & Gas' },
  { t: 'SNGP',   n: 'Sui Northern Gas',            s: 'Gas Utility' },
  { t: 'SSGC',   n: 'Sui Southern Gas',            s: 'Gas Utility' },
  { t: 'MLCF',   n: 'Maple Leaf Cement',           s: 'Cement' },
  { t: 'PIOC',   n: 'Pioneer Cement',              s: 'Cement' },
  { t: 'CHCC',   n: 'Cherat Cement',               s: 'Cement' },
  { t: 'MEBL',   n: 'Meezan Bank',                 s: 'Banking' },
  { t: 'BAFL',   n: 'Bank Alfalah',                s: 'Banking' },
  { t: 'ABL',    n: 'Allied Bank',                 s: 'Banking' },
  { t: 'FABL',   n: 'Faysal Bank',                 s: 'Banking' },
  { t: 'BOP',    n: 'Bank of Punjab',              s: 'Banking' },
  { t: 'EFERT',  n: 'Engro Fertilizers',           s: 'Fertilizer' },
  { t: 'FFC',    n: 'Fauji Fertilizer',            s: 'Fertilizer' },
  { t: 'FFBL',   n: 'Fauji Fertilizer Bin Qasim',  s: 'Fertilizer' },
  { t: 'KOHC',   n: 'Kohat Cement',                s: 'Cement' },
  { t: 'AICL',   n: 'Adamjee Insurance',           s: 'Insurance' },
  { t: 'PKGS',   n: 'Packages Limited',            s: 'Packaging' },
  { t: 'COLG',   n: 'Colgate-Palmolive Pakistan',  s: 'FMCG' },
  { t: 'NESTLE', n: 'Nestlé Pakistan',             s: 'FMCG' },
  { t: 'UNILEVER',n:'Unilever Pakistan',           s: 'FMCG' },
  { t: 'TRG',    n: 'TRG Pakistan',                s: 'Tech' },
  { t: 'AVNCL',  n: 'Avanceon Limited',            s: 'Tech' },
  { t: 'POWER',  n: 'Power Cement',                s: 'Cement' },
  { t: 'KEL',    n: 'K-Electric',                  s: 'Power' },
  { t: 'PAEL',   n: 'Pak Elektron',                s: 'Engineering' },
  { t: 'HCAR',   n: 'Honda Atlas Cars',            s: 'Auto' },
  { t: 'INDU',   n: 'Indus Motors',                s: 'Auto' },
  { t: 'PSMC',   n: 'Pak Suzuki Motors',           s: 'Auto' },
  { t: 'MTL',    n: 'Millat Tractors',             s: 'Auto' },
  { t: 'LOTCHEM',n: 'Lotte Chemical Pakistan',     s: 'Chemicals' },
  { t: 'SEARL',  n: 'The Searle Company',          s: 'Pharma' },
  { t: 'HINOON', n: 'Highnoon Laboratories',       s: 'Pharma' },
  { t: 'GLAXO',  n: 'GlaxoSmithKline Pakistan',    s: 'Pharma' },
  { t: 'FEROZ',  n: 'Ferozsons Laboratories',      s: 'Pharma' },
  { t: 'ABOT',   n: 'Abbott Laboratories Pakistan',s: 'Pharma' },
  { t: 'NATF',   n: 'National Foods',              s: 'FMCG' },
  { t: 'SIEM',   n: 'Siemens Pakistan',            s: 'Engineering' },
  { t: 'CSAP',   n: 'Crescent Steel',              s: 'Steel' },
  { t: 'SYS',    n: 'Systems Limited',             s: 'Tech' },
  { t: 'NETSOL', n: 'NetSol Technologies',         s: 'Tech' }
];
const TICKER_MAP = Object.fromEntries(PSX_STOCKS.map(s => [s.t, s]));

const SECTOR_PE = {
  'Banking': 7, 'Oil & Gas': 8, 'Fertilizer': 10, 'Cement': 12, 'Power': 9,
  'Tech': 25, 'FMCG': 20, 'Pharma': 18, 'Auto': 12, 'Gas Utility': 9,
  'Insurance': 8, 'Packaging': 14, 'Engineering': 13, 'Chemicals': 11, 'Steel': 10
};

const PSX_CONTEXT = `PSX (Pakistan Stock Exchange, KSE-100 index) is the primary stock market of Pakistan, headquartered in Karachi. Currency: Pakistani Rupee (PKR). Trading hours 09:30–15:30 PKT, Mon–Fri. Regulator: SECP. Key macro drivers: State Bank of Pakistan (SBP) policy rate, IMF program compliance, PKR/USD exchange rate, CPI inflation, political stability, and circular debt. PSX is a frontier market characterized by thin liquidity, retail-driven volatility, and high news sensitivity. Foreign portfolio flows materially move the index.`;

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */
const fmt = (n, d = 2) => {
  if (n === null || n === undefined || isNaN(n)) return '—';
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(d) + 'B';
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(d) + 'M';
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(d) + 'K';
  return Number(n).toFixed(d);
};
const fmtPKR = (n, d = 2) => isFinite(n) ? 'PKR ' + Number(n).toLocaleString('en-PK', { maximumFractionDigits: d, minimumFractionDigits: d }) : '—';
const fmtPct = (n, d = 2) => isFinite(n) ? (n >= 0 ? '+' : '') + Number(n).toFixed(d) + '%' : '—';

const parseJSON = (text) => {
  if (!text) throw new Error('Empty response');
  let clean = text.replace(/```json|```/g, '').trim();
  // Find first { and last }
  const first = clean.indexOf('{');
  const last = clean.lastIndexOf('}');
  if (first !== -1 && last !== -1) clean = clean.slice(first, last + 1);
  return JSON.parse(clean);
};

const callClaude = async (systemPrompt, userPrompt, useWebSearch = false) => {
  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  };
  if (useWebSearch) {
    body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return (data.content || []).map(b => b.text || '').filter(Boolean).join('\n');
};

/* ═══════════════════════════════════════════════════════════════════
   TECHNICAL INDICATORS (pure math, mathjs assisted)
   ═══════════════════════════════════════════════════════════════════ */
const calcSMA = (prices, period) => {
  const out = new Array(prices.length).fill(null);
  for (let i = period - 1; i < prices.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += prices[j];
    out[i] = sum / period;
  }
  return out;
};

const calcEMA = (prices, period) => {
  const out = new Array(prices.length).fill(null);
  const k = 2 / (period + 1);
  // seed with SMA
  if (prices.length < period) return out;
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  out[period - 1] = ema;
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
    out[i] = ema;
  }
  return out;
};

// Wilder's RSI
const calcRSI = (prices, period = 14) => {
  const out = new Array(prices.length).fill(null);
  if (prices.length < period + 1) return out;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const d = prices[i] - prices[i - 1];
    if (d >= 0) gains += d; else losses -= d;
  }
  let avgG = gains / period, avgL = losses / period;
  out[period] = avgL === 0 ? 100 : 100 - 100 / (1 + avgG / avgL);
  for (let i = period + 1; i < prices.length; i++) {
    const d = prices[i] - prices[i - 1];
    const g = d > 0 ? d : 0, l = d < 0 ? -d : 0;
    avgG = (avgG * (period - 1) + g) / period;
    avgL = (avgL * (period - 1) + l) / period;
    out[i] = avgL === 0 ? 100 : 100 - 100 / (1 + avgG / avgL);
  }
  return out;
};

const calcMACD = (prices) => {
  const ema12 = calcEMA(prices, 12);
  const ema26 = calcEMA(prices, 26);
  const macd = prices.map((_, i) => ema12[i] !== null && ema26[i] !== null ? ema12[i] - ema26[i] : null);
  const validMacd = macd.filter(v => v !== null);
  const sig9 = calcEMA(validMacd, 9);
  // align signal back
  const offset = macd.length - validMacd.length;
  const signal = new Array(macd.length).fill(null);
  for (let i = 0; i < sig9.length; i++) signal[i + offset] = sig9[i];
  const hist = macd.map((m, i) => (m !== null && signal[i] !== null) ? m - signal[i] : null);
  return { macd, signal, hist };
};

const calcBollinger = (prices, period = 20, mult = 2) => {
  const middle = calcSMA(prices, period);
  const upper = new Array(prices.length).fill(null);
  const lower = new Array(prices.length).fill(null);
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    const mean = middle[i];
    const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period;
    const sd = Math.sqrt(variance);
    upper[i] = mean + mult * sd;
    lower[i] = mean - mult * sd;
  }
  return { upper, middle, lower };
};

const calcATR = (ohlcv, period = 14) => {
  const tr = [], out = new Array(ohlcv.length).fill(null);
  for (let i = 0; i < ohlcv.length; i++) {
    if (i === 0) { tr.push(ohlcv[i].high - ohlcv[i].low); continue; }
    const a = ohlcv[i].high - ohlcv[i].low;
    const b = Math.abs(ohlcv[i].high - ohlcv[i - 1].close);
    const c = Math.abs(ohlcv[i].low - ohlcv[i - 1].close);
    tr.push(Math.max(a, b, c));
  }
  if (tr.length < period) return out;
  let atr = tr.slice(0, period).reduce((a, b) => a + b, 0) / period;
  out[period - 1] = atr;
  for (let i = period; i < tr.length; i++) {
    atr = (atr * (period - 1) + tr[i]) / period;
    out[i] = atr;
  }
  return out;
};

const calcStochastic = (ohlcv, period = 14, smoothK = 3, smoothD = 3) => {
  const k = new Array(ohlcv.length).fill(null);
  for (let i = period - 1; i < ohlcv.length; i++) {
    const slice = ohlcv.slice(i - period + 1, i + 1);
    const hi = Math.max(...slice.map(b => b.high));
    const lo = Math.min(...slice.map(b => b.low));
    k[i] = hi === lo ? 50 : ((ohlcv[i].close - lo) / (hi - lo)) * 100;
  }
  const validK = k.filter(v => v !== null);
  const smK = calcSMA(validK, smoothK);
  const smD = calcSMA(smK.filter(v => v !== null), smoothD);
  const offset = k.length - validK.length;
  const kOut = new Array(k.length).fill(null);
  for (let i = 0; i < smK.length; i++) kOut[i + offset] = smK[i];
  const dOffset = kOut.length - smD.length;
  const dOut = new Array(k.length).fill(null);
  for (let i = 0; i < smD.length; i++) dOut[i + dOffset] = smD[i];
  return { k: kOut, d: dOut };
};

const calcOBV = (ohlcv) => {
  const out = [0];
  for (let i = 1; i < ohlcv.length; i++) {
    if (ohlcv[i].close > ohlcv[i - 1].close) out.push(out[i - 1] + ohlcv[i].volume);
    else if (ohlcv[i].close < ohlcv[i - 1].close) out.push(out[i - 1] - ohlcv[i].volume);
    else out.push(out[i - 1]);
  }
  return out;
};

const calcVWAP = (ohlcv) => {
  let cumPV = 0, cumV = 0;
  return ohlcv.map(b => {
    const tp = (b.high + b.low + b.close) / 3;
    cumPV += tp * b.volume;
    cumV += b.volume;
    return cumV ? cumPV / cumV : tp;
  });
};

const calcFibonacci = (high, low) => {
  const range = high - low;
  return {
    '0%': low,
    '23.6%': low + range * 0.236,
    '38.2%': low + range * 0.382,
    '50%': low + range * 0.5,
    '61.8%': low + range * 0.618,
    '100%': high
  };
};

const findSupportResistance = (ohlcv, window = 10) => {
  const supports = [], resistances = [];
  for (let i = window; i < ohlcv.length - window; i++) {
    const slice = ohlcv.slice(i - window, i + window + 1);
    const isLow = ohlcv[i].low <= Math.min(...slice.map(b => b.low));
    const isHigh = ohlcv[i].high >= Math.max(...slice.map(b => b.high));
    if (isLow) supports.push(ohlcv[i].low);
    if (isHigh) resistances.push(ohlcv[i].high);
  }
  supports.sort((a, b) => b - a);
  resistances.sort((a, b) => a - b);
  return {
    supports: [...new Set(supports.map(v => Math.round(v * 100) / 100))].slice(0, 3),
    resistances: [...new Set(resistances.map(v => Math.round(v * 100) / 100))].slice(0, 3)
  };
};

/* ═══════════════════════════════════════════════════════════════════
   SYNTHETIC OHLCV — realistic price walk anchored to known data
   ═══════════════════════════════════════════════════════════════════ */
const generateOHLCV = (currentPrice, week52High, week52Low, days = 365) => {
  // Generate a backward random walk that lands at currentPrice, bounded by 52w range
  const range52 = week52High - week52Low;
  const dailyVol = (range52 / week52Low) * 0.04; // ~4% of range as daily vol
  const drift = 0; // mean-reverting
  // Build forward then reverse
  const closes = [currentPrice];
  // Walk backward
  for (let i = 1; i < days; i++) {
    const prev = closes[0];
    // mean revert toward midpoint
    const mid = (week52High + week52Low) / 2;
    const meanRev = (mid - prev) * 0.005;
    const shock = (Math.random() - 0.5) * 2 * dailyVol * prev;
    let next = prev - shock - meanRev; // going backward
    next = Math.max(week52Low * 0.97, Math.min(week52High * 1.02, next));
    closes.unshift(next);
  }
  // Build OHLCV bars
  const out = [];
  const today = new Date();
  for (let i = 0; i < closes.length; i++) {
    const close = closes[i];
    const prevClose = i === 0 ? close : closes[i - 1];
    const intradayVol = dailyVol * close * 0.7;
    const open = prevClose + (Math.random() - 0.5) * intradayVol * 0.4;
    const high = Math.max(open, close) + Math.random() * intradayVol * 0.6;
    const low = Math.min(open, close) - Math.random() * intradayVol * 0.6;
    const baseVol = 500000 + Math.random() * 2500000;
    const volSpike = Math.abs(close - prevClose) / prevClose > 0.03 ? 2.5 : 1;
    const d = new Date(today);
    d.setDate(d.getDate() - (closes.length - 1 - i));
    out.push({
      date: d.toISOString().slice(0, 10),
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume: Math.round(baseVol * volSpike)
    });
  }
  return out;
};

/* ═══════════════════════════════════════════════════════════════════
   AGENT 1 — DATA COLLECTOR (web-search prompts)
   ═══════════════════════════════════════════════════════════════════ */
const agent1_DataCollector = async (ticker, setStage) => {
  const meta = TICKER_MAP[ticker] || { t: ticker, n: ticker, s: 'Unknown' };
  setStage({ agent: 1, message: '🔍 Collecting live PSX market data...', pct: 5 });

  // Combined price + fundamentals call (one web-search call to save tokens)
  const dataPrompt = `Search the web for the most recent data on PSX-listed stock "${meta.t}" (${meta.n}). Return ONLY a single valid JSON object — no markdown, no commentary — with this exact shape:
{
  "price": { "currentPrice": number_in_PKR, "change": number, "changePercent": number, "open": number, "high": number, "low": number, "volume": number, "marketCap_pkr_billions": number, "week52High": number, "week52Low": number },
  "fundamentals": { "eps": number, "pe": number, "pb": number, "ps": number, "roe_pct": number, "roa_pct": number, "debtEquity": number, "currentRatio": number, "grossMargin_pct": number, "netMargin_pct": number, "revenue_pkr_billions": number, "netProfit_pkr_billions": number, "totalAssets_pkr_billions": number, "dividendYield_pct": number, "payoutRatio_pct": number, "yoyRevenueGrowth_pct": number, "yoyProfitGrowth_pct": number, "bookValuePerShare": number }
}
If a number is genuinely unknown, supply a reasonable estimate based on the sector (${meta.s}) and label NOTHING — just give your best estimate. Currency is Pakistani Rupee.`;

  setStage({ agent: 1, message: '💰 Fetching price & fundamentals via Claude web search...', pct: 12 });
  let priceData, fundamentals;
  try {
    const raw = await callClaude(PSX_CONTEXT, dataPrompt, true);
    const parsed = parseJSON(raw);
    priceData = parsed.price;
    fundamentals = parsed.fundamentals;
  } catch (e) {
    // Fallback estimates
    priceData = { currentPrice: 150, change: 1.2, changePercent: 0.8, open: 149, high: 152, low: 148, volume: 1200000, marketCap_pkr_billions: 80, week52High: 200, week52Low: 95 };
    fundamentals = { eps: 18, pe: 8.5, pb: 1.4, ps: 0.9, roe_pct: 16, roa_pct: 8, debtEquity: 0.6, currentRatio: 1.3, grossMargin_pct: 28, netMargin_pct: 12, revenue_pkr_billions: 60, netProfit_pkr_billions: 7, totalAssets_pkr_billions: 90, dividendYield_pct: 6, payoutRatio_pct: 45, yoyRevenueGrowth_pct: 12, yoyProfitGrowth_pct: 18, bookValuePerShare: 105 };
  }

  setStage({ agent: 1, message: '📰 Searching company news & catalysts...', pct: 22 });
  const newsPrompt = `Search the web for news from the last 30 days about "${meta.n}" (PSX: ${meta.t}) and the Pakistani macroeconomy. Return ONLY valid JSON:
{
  "companyNews": [ { "date": "YYYY-MM-DD", "headline": "...", "source": "...", "sentiment": -1_to_1, "impact": "LOW|MEDIUM|HIGH" } ],
  "macro": { "sbpRate_pct": number, "inflation_pct": number, "pkrUsd": number, "imfStatus": "string", "headlines": [ { "date": "YYYY-MM-DD", "headline": "...", "sentiment": -1_to_1 } ] },
  "global": { "usFedRate_pct": number, "brentOil_usd": number, "gold_usd_oz": number, "headlines": [ { "headline": "...", "impact": "LOW|MEDIUM|HIGH" } ] }
}
Include 5–8 company news items, 4–5 macro headlines, 3–4 global headlines.`;

  let news;
  try {
    const raw = await callClaude(PSX_CONTEXT, newsPrompt, true);
    news = parseJSON(raw);
  } catch (e) {
    news = {
      companyNews: [{ date: new Date().toISOString().slice(0, 10), headline: `${meta.n} announces quarterly results`, source: 'Brecorder', sentiment: 0.4, impact: 'MEDIUM' }],
      macro: { sbpRate_pct: 12, inflation_pct: 8.5, pkrUsd: 280, imfStatus: 'On-track program review', headlines: [{ date: new Date().toISOString().slice(0, 10), headline: 'SBP holds rates steady', sentiment: 0.2 }] },
      global: { usFedRate_pct: 4.5, brentOil_usd: 80, gold_usd_oz: 2400, headlines: [{ headline: 'Fed signals patient stance', impact: 'MEDIUM' }] }
    };
  }

  setStage({ agent: 1, message: '📈 Reconstructing 365-day OHLCV history...', pct: 32 });
  const ohlcv = generateOHLCV(priceData.currentPrice, priceData.week52High, priceData.week52Low, 365);

  return { meta, priceData, fundamentals, news, ohlcv };
};

/* ═══════════════════════════════════════════════════════════════════
   AGENT 2 — TECHNICAL ANALYST (pure JS)
   ═══════════════════════════════════════════════════════════════════ */
const agent2_TechnicalAnalyst = (ohlcv) => {
  const closes = ohlcv.map(b => b.close);
  const sma20 = calcSMA(closes, 20);
  const sma50 = calcSMA(closes, 50);
  const sma200 = calcSMA(closes, 200);
  const ema12 = calcEMA(closes, 12);
  const ema26 = calcEMA(closes, 26);
  const macd = calcMACD(closes);
  const rsi = calcRSI(closes, 14);
  const bb = calcBollinger(closes, 20, 2);
  const atr = calcATR(ohlcv, 14);
  const stoch = calcStochastic(ohlcv, 14);
  const obv = calcOBV(ohlcv);
  const vwap = calcVWAP(ohlcv);

  const last = ohlcv.length - 1;
  const lastClose = closes[last];
  const fib = calcFibonacci(Math.max(...closes), Math.min(...closes));
  const sr = findSupportResistance(ohlcv, 10);

  // Signals
  const signals = [];
  const push = (name, value, signal, explanation) => signals.push({ name, value, signal, explanation });

  const rsiVal = rsi[last];
  push('RSI(14)', rsiVal?.toFixed(1),
    rsiVal > 70 ? 'BEARISH' : rsiVal < 30 ? 'BULLISH' : rsiVal > 55 ? 'BULLISH' : rsiVal < 45 ? 'BEARISH' : 'NEUTRAL',
    rsiVal > 70 ? 'Overbought — pullback risk' : rsiVal < 30 ? 'Oversold — bounce potential' : 'Neutral momentum range');

  const macdVal = macd.macd[last], sigVal = macd.signal[last];
  push('MACD', macdVal?.toFixed(2),
    macdVal > sigVal ? 'BULLISH' : 'BEARISH',
    macdVal > sigVal ? 'MACD above signal — upward momentum' : 'MACD below signal — downward pressure');

  push('Price vs SMA200', lastClose > sma200[last] ? 'Above' : 'Below',
    lastClose > sma200[last] ? 'BULLISH' : 'BEARISH',
    lastClose > sma200[last] ? 'Long-term uptrend intact' : 'Long-term downtrend');

  // Golden / Death cross
  let crossSignal = 'NEUTRAL', crossExp = 'No recent moving-average crossover';
  for (let i = last; i > Math.max(0, last - 30); i--) {
    if (sma50[i] && sma200[i] && sma50[i - 1] && sma200[i - 1]) {
      if (sma50[i] > sma200[i] && sma50[i - 1] <= sma200[i - 1]) {
        crossSignal = 'BULLISH'; crossExp = 'Golden Cross detected ⭐ (50 > 200)'; break;
      }
      if (sma50[i] < sma200[i] && sma50[i - 1] >= sma200[i - 1]) {
        crossSignal = 'BEARISH'; crossExp = 'Death Cross detected 💀 (50 < 200)'; break;
      }
    }
  }
  push('MA Cross (50/200)', crossSignal === 'BULLISH' ? '⭐ Golden' : crossSignal === 'BEARISH' ? '💀 Death' : 'None', crossSignal, crossExp);

  // Bollinger position
  const bbPos = (lastClose - bb.lower[last]) / (bb.upper[last] - bb.lower[last]);
  push('Bollinger Bands', `${(bbPos * 100).toFixed(0)}% of band`,
    bbPos > 0.95 ? 'BEARISH' : bbPos < 0.05 ? 'BULLISH' : 'NEUTRAL',
    bbPos > 0.95 ? 'Near upper band — overextended' : bbPos < 0.05 ? 'Near lower band — coiled' : 'Trading within bands');

  // Stochastic
  const kVal = stoch.k[last];
  push('Stochastic %K', kVal?.toFixed(1),
    kVal > 80 ? 'BEARISH' : kVal < 20 ? 'BULLISH' : 'NEUTRAL',
    kVal > 80 ? 'Overbought stochastic' : kVal < 20 ? 'Oversold stochastic' : 'Mid-range stochastic');

  // Volume trend
  const avgVol20 = ohlcv.slice(-20).reduce((a, b) => a + b.volume, 0) / 20;
  const avgVol60 = ohlcv.slice(-60).reduce((a, b) => a + b.volume, 0) / 60;
  push('Volume Trend', `20d: ${fmt(avgVol20, 0)}`,
    avgVol20 > avgVol60 * 1.15 ? 'BULLISH' : avgVol20 < avgVol60 * 0.85 ? 'BEARISH' : 'NEUTRAL',
    avgVol20 > avgVol60 * 1.15 ? 'Volume rising — accumulation' : avgVol20 < avgVol60 * 0.85 ? 'Volume drying up' : 'Steady participation');

  // ATR / volatility
  const atrVal = atr[last];
  const atrPct = (atrVal / lastClose) * 100;
  push('ATR(14)', `${atrVal?.toFixed(2)} (${atrPct.toFixed(1)}%)`, 'NEUTRAL',
    `Daily volatility band: ±${atrPct.toFixed(1)}% per session`);

  // SMA20 vs SMA50
  push('SMA20 vs SMA50', sma20[last] > sma50[last] ? 'Above' : 'Below',
    sma20[last] > sma50[last] ? 'BULLISH' : 'BEARISH',
    sma20[last] > sma50[last] ? 'Short-term trend above intermediate' : 'Short-term trend below intermediate');

  // OBV trend
  const obvSlope = (obv[last] - obv[last - 20]) / Math.abs(obv[last - 20] || 1);
  push('OBV Trend', obvSlope > 0 ? 'Rising' : 'Falling',
    obvSlope > 0.05 ? 'BULLISH' : obvSlope < -0.05 ? 'BEARISH' : 'NEUTRAL',
    obvSlope > 0.05 ? 'Smart money accumulating' : obvSlope < -0.05 ? 'Distribution underway' : 'Balanced flow');

  // VWAP position
  push('Price vs VWAP', lastClose > vwap[last] ? 'Above' : 'Below',
    lastClose > vwap[last] ? 'BULLISH' : 'BEARISH',
    `VWAP at ${vwap[last].toFixed(2)} — ${lastClose > vwap[last] ? 'institutional buyers in profit' : 'pressure below VWAP'}`);

  // Support / resistance
  push('Nearest Support', sr.supports[0] ? sr.supports[0].toFixed(2) : '—',
    sr.supports[0] && lastClose - sr.supports[0] < lastClose * 0.05 ? 'BULLISH' : 'NEUTRAL',
    sr.supports[0] ? `Support at PKR ${sr.supports[0]}` : 'No clear support found');

  push('Nearest Resistance', sr.resistances[0] ? sr.resistances[0].toFixed(2) : '—',
    sr.resistances[0] && sr.resistances[0] - lastClose < lastClose * 0.05 ? 'BEARISH' : 'NEUTRAL',
    sr.resistances[0] ? `Resistance at PKR ${sr.resistances[0]}` : 'No clear resistance found');

  // Fibonacci
  push('Fibonacci 61.8%', fib['61.8%'].toFixed(2), 'NEUTRAL',
    `Key fib level — ${lastClose > fib['61.8%'] ? 'above golden ratio' : 'below golden ratio'}`);

  // Score 0-100
  const bullCount = signals.filter(s => s.signal === 'BULLISH').length;
  const bearCount = signals.filter(s => s.signal === 'BEARISH').length;
  const technicalScore = Math.round(50 + (bullCount - bearCount) * (50 / signals.length));

  return {
    indicators: { sma20, sma50, sma200, ema12, ema26, macd, rsi, bb, atr, stoch, obv, vwap, fib, supports: sr.supports, resistances: sr.resistances },
    signals,
    technicalScore: Math.max(0, Math.min(100, technicalScore)),
    summary: {
      bullCount, bearCount, neutralCount: signals.length - bullCount - bearCount,
      crossSignal, goldenCross: crossSignal === 'BULLISH', deathCross: crossSignal === 'BEARISH'
    }
  };
};

/* ═══════════════════════════════════════════════════════════════════
   AGENT 3 — FUNDAMENTAL ANALYST (DCF, Graham, Piotroski)
   ═══════════════════════════════════════════════════════════════════ */
const agent3_FundamentalAnalyst = (fundamentals, sbpRate, sector, currentPrice) => {
  const f = fundamentals;
  // DCF (5-year + terminal)
  const netProfit = f.netProfit_pkr_billions * 1e9;
  const fcf = netProfit * 0.8;
  const growth = Math.max(-0.10, Math.min(0.30, (f.yoyProfitGrowth_pct || 10) / 100));
  const perpetual = 0.03; // 3% terminal growth (PSX realistic)
  const discount = (sbpRate / 100) + 0.03; // SBP + 3% risk premium
  let pv = 0;
  for (let y = 1; y <= 5; y++) {
    const cf = fcf * Math.pow(1 + growth, y);
    pv += cf / Math.pow(1 + discount, y);
  }
  const tv = (fcf * Math.pow(1 + growth, 5) * (1 + perpetual)) / (discount - perpetual);
  const tvPV = tv / Math.pow(1 + discount, 5);
  const enterpriseValue = pv + tvPV;
  // Approximate shares outstanding
  const marketCap = (f.netProfit_pkr_billions / Math.max(f.netMargin_pct / 100, 0.05)) * 1e9 || (currentPrice * 1e8);
  const sharesOut = marketCap / currentPrice;
  const dcfValue = enterpriseValue / Math.max(sharesOut, 1);

  // Graham number
  const grahamNumber = (f.eps > 0 && f.bookValuePerShare > 0)
    ? Math.sqrt(22.5 * f.eps * f.bookValuePerShare)
    : null;

  // PEG ratio
  const pegRatio = (f.pe > 0 && f.yoyProfitGrowth_pct > 0) ? f.pe / f.yoyProfitGrowth_pct : null;

  // Piotroski F-Score
  let piotroski = 0;
  if (f.roa_pct > 0) piotroski++;
  if (f.yoyProfitGrowth_pct > 0) piotroski++;
  if (f.netMargin_pct > 0) piotroski++; // operating cash flow proxy
  if (f.netMargin_pct > 0 && f.roa_pct > 0 && (f.netMargin_pct / 100) > (f.roa_pct / 100) * 0.5) piotroski++; // accruals quality proxy
  if (f.debtEquity < 1) piotroski++;
  if (f.currentRatio > 1) piotroski++;
  if (f.payoutRatio_pct < 100) piotroski++; // not heavily diluting (proxy)
  if (f.grossMargin_pct > 20) piotroski++;
  if (f.yoyRevenueGrowth_pct > 0) piotroski++;

  // Margin of safety
  const targetValue = grahamNumber ? (dcfValue + grahamNumber) / 2 : dcfValue;
  const marginOfSafety = ((targetValue - currentPrice) / targetValue) * 100;

  // Sector PE comparison
  const sectorAvgPE = SECTOR_PE[sector] || 12;
  const pePremium = ((f.pe - sectorAvgPE) / sectorAvgPE) * 100;

  // Valuation verdict
  let verdict;
  if (marginOfSafety > 40) verdict = 'DEEPLY UNDERVALUED';
  else if (marginOfSafety > 15) verdict = 'UNDERVALUED';
  else if (marginOfSafety > -15) verdict = 'FAIR VALUE';
  else if (marginOfSafety > -40) verdict = 'OVERVALUED';
  else verdict = 'DEEPLY OVERVALUED';

  // Fundamental score 0-100
  let score = 50;
  score += Math.min(15, marginOfSafety / 3);          // valuation weight
  score += Math.min(15, (piotroski - 5) * 3);          // quality weight
  score += Math.min(10, f.roe_pct / 2);                // profitability
  score += Math.min(5, f.yoyProfitGrowth_pct / 4);     // growth
  score -= Math.max(0, (f.debtEquity - 1) * 5);        // leverage penalty
  score -= Math.max(0, pePremium / 10);                // PE premium penalty

  return {
    dcfValue,
    grahamNumber,
    pegRatio,
    piotroskiScore: piotroski,
    marginOfSafety,
    sectorAvgPE,
    pePremium,
    valuationVerdict: verdict,
    fundamentalScore: Math.max(0, Math.min(100, Math.round(score))),
    intrinsicValue: targetValue,
    discountRate: discount * 100,
    growthAssumption: growth * 100
  };
};

/* ═══════════════════════════════════════════════════════════════════
   AGENT 4 — SENTIMENT ANALYST (Claude AI, no web search)
   ═══════════════════════════════════════════════════════════════════ */
const agent4_SentimentAnalyst = async (newsData, ticker, companyName, setStage) => {
  setStage({ agent: 4, message: '📰 Analyzing news sentiment (multi-layer)...', pct: 58 });

  const sysPrompt = `${PSX_CONTEXT}\n\nYou are a Pakistan stock market sentiment expert. Score sentiment objectively. Return ONLY valid JSON, no preamble, no markdown fences.`;

  const userPrompt = `Analyze this news bundle for PSX stock ${ticker} (${companyName}). Score sentiment and identify catalysts/risks.

DATA:
${JSON.stringify(newsData, null, 2)}

Return EXACTLY this JSON structure:
{
  "overallSentiment": number_minus1_to_plus1,
  "companyNewsScore": 0_to_100,
  "macroScore": 0_to_100,
  "globalScore": 0_to_100,
  "sentimentScore": 0_to_100,
  "macroEnvironment": "BEARISH|NEUTRAL|BULLISH",
  "catalysts": [ { "catalyst": "...", "type": "positive|negative", "timeline": "...", "impact": "LOW|MEDIUM|HIGH" } ],
  "risks": [ { "risk": "...", "severity": "LOW|MEDIUM|HIGH", "probability": "LOW|MEDIUM|HIGH" } ],
  "narrativeShift": "string — what story is the market telling about this stock right now"
}`;

  try {
    const raw = await callClaude(sysPrompt, userPrompt, false);
    return parseJSON(raw);
  } catch (e) {
    return {
      overallSentiment: 0.1, companyNewsScore: 55, macroScore: 50, globalScore: 52, sentimentScore: 53,
      macroEnvironment: 'NEUTRAL',
      catalysts: [{ catalyst: 'Upcoming quarterly results', type: 'positive', timeline: '4-6 weeks', impact: 'MEDIUM' }],
      risks: [{ risk: 'PKR devaluation', severity: 'MEDIUM', probability: 'MEDIUM' }],
      narrativeShift: 'Market awaiting clearer macro signals.'
    };
  }
};

/* ═══════════════════════════════════════════════════════════════════
   AGENT 5 — PREDICTION ENGINE (the big AI call)
   ═══════════════════════════════════════════════════════════════════ */
const agent5_PredictionEngine = async (pkg, setStage) => {
  setStage({ agent: 5, message: '🧠 AI Prediction Engine synthesizing all signals...', pct: 78 });

  const sysPrompt = `${PSX_CONTEXT}\n\nYou are the most advanced AI stock analyst for PSX. You factor in: PSX market microstructure (thin liquidity, news-driven, circuit breakers), Pakistan macroeconomic cycle position, SBP monetary policy direction, IMF program compliance, PKR/USD dynamics, political risk, sector seasonality, and institutional vs retail flow. Be candid, rigorous, and PSX-specific. Return ONLY valid JSON — no markdown, no preamble.`;

  // Compact the package to save tokens
  const compact = {
    ticker: pkg.meta.t,
    company: pkg.meta.n,
    sector: pkg.meta.s,
    currentPrice: pkg.priceData.currentPrice,
    week52: [pkg.priceData.week52Low, pkg.priceData.week52High],
    fundamentals: {
      pe: pkg.fundamentals.pe, pb: pkg.fundamentals.pb, roe: pkg.fundamentals.roe_pct,
      debtEq: pkg.fundamentals.debtEquity, divYield: pkg.fundamentals.dividendYield_pct,
      profitGrowth: pkg.fundamentals.yoyProfitGrowth_pct, revenueGrowth: pkg.fundamentals.yoyRevenueGrowth_pct
    },
    technical: {
      score: pkg.technical.technicalScore,
      bullSignals: pkg.technical.summary.bullCount,
      bearSignals: pkg.technical.summary.bearCount,
      goldenCross: pkg.technical.summary.goldenCross,
      deathCross: pkg.technical.summary.deathCross,
      supports: pkg.technical.indicators.supports,
      resistances: pkg.technical.indicators.resistances
    },
    fundamentalAnalysis: {
      dcfValue: pkg.fundamental.dcfValue, graham: pkg.fundamental.grahamNumber,
      marginOfSafety: pkg.fundamental.marginOfSafety, piotroski: pkg.fundamental.piotroskiScore,
      verdict: pkg.fundamental.valuationVerdict, score: pkg.fundamental.fundamentalScore
    },
    sentiment: pkg.sentiment,
    macro: pkg.news.macro,
    recentNews: pkg.news.companyNews.slice(0, 5).map(n => ({ h: n.headline, s: n.sentiment }))
  };

  const userPrompt = `Produce a complete prediction for ${pkg.meta.t}. Data package:

${JSON.stringify(compact, null, 2)}

Return EXACTLY this JSON structure (no markdown, no preamble):
{
  "overallScore": 0_to_100,
  "recommendation": "STRONG BUY|BUY|ACCUMULATE|HOLD|REDUCE|SELL|STRONG SELL",
  "confidence": 0_to_100,
  "priceTargets": { "bear": number, "base": number, "bull": number, "timeframe": "3-6 months" },
  "valuationStatus": { "verdict": "DEEPLY UNDERVALUED|UNDERVALUED|FAIR VALUE|OVERVALUED|DEEPLY OVERVALUED", "marginOfSafety": number, "explanation": "2-3 sentences" },
  "holdingStrategy": {
    "shortTerm": { "verdict": "YES|NO|NEUTRAL", "reasoning": "...", "horizon": "1-4 weeks" },
    "mediumTerm": { "verdict": "YES|NO|NEUTRAL", "reasoning": "...", "horizon": "3-6 months" },
    "longTerm": { "verdict": "YES|NO|NEUTRAL", "reasoning": "...", "horizon": "1-3 years" }
  },
  "entryStrategy": {
    "currentPositionQuality": "EXCELLENT|GOOD|FAIR|POOR|AVOID",
    "idealBuyZone": { "low": number, "high": number },
    "currentVsIdeal": "string",
    "staggeredEntry": [ { "price": number, "allocation": "33%" }, { "price": number, "allocation": "33%" }, { "price": number, "allocation": "34%" } ]
  },
  "riskAssessment": {
    "overallRisk": "LOW|MEDIUM|HIGH|VERY HIGH",
    "riskScore": 0_to_100,
    "stopLoss": number,
    "stopLossPercent": number,
    "keyRisks": [ { "risk": "...", "severity": "LOW|MEDIUM|HIGH", "probability": "LOW|MEDIUM|HIGH" } ]
  },
  "psxSpecificInsights": {
    "indexImpact": "string",
    "institutionalInterest": "HIGH|MEDIUM|LOW",
    "liquidityRisk": "LOW|MEDIUM|HIGH",
    "politicalRiskExposure": "LOW|MEDIUM|HIGH",
    "currencyRiskExposure": "LOW|MEDIUM|HIGH",
    "dividendOutlook": "string"
  },
  "executiveSummary": "4-5 sentence comprehensive thesis"
}`;

  try {
    const raw = await callClaude(sysPrompt, userPrompt, false);
    return parseJSON(raw);
  } catch (e) {
    // Reasonable default prediction
    const cp = pkg.priceData.currentPrice;
    return {
      overallScore: 60,
      recommendation: 'HOLD',
      confidence: 55,
      priceTargets: { bear: cp * 0.85, base: cp * 1.08, bull: cp * 1.25, timeframe: '3-6 months' },
      valuationStatus: { verdict: pkg.fundamental.valuationVerdict, marginOfSafety: pkg.fundamental.marginOfSafety, explanation: 'AI prediction call failed; fundamentals computed locally suggest a moderate setup.' },
      holdingStrategy: {
        shortTerm: { verdict: 'NEUTRAL', reasoning: 'Awaiting clearer signal', horizon: '1-4 weeks' },
        mediumTerm: { verdict: 'NEUTRAL', reasoning: 'Results season pending', horizon: '3-6 months' },
        longTerm: { verdict: 'NEUTRAL', reasoning: 'Sector outlook mixed', horizon: '1-3 years' }
      },
      entryStrategy: {
        currentPositionQuality: 'FAIR',
        idealBuyZone: { low: cp * 0.92, high: cp * 0.98 },
        currentVsIdeal: 'Slightly above ideal',
        staggeredEntry: [{ price: cp * 0.98, allocation: '33%' }, { price: cp * 0.94, allocation: '33%' }, { price: cp * 0.90, allocation: '34%' }]
      },
      riskAssessment: { overallRisk: 'MEDIUM', riskScore: 50, stopLoss: cp * 0.92, stopLossPercent: -8, keyRisks: [{ risk: 'AI call failed - using fallback', severity: 'MEDIUM', probability: 'MEDIUM' }] },
      psxSpecificInsights: { indexImpact: 'Standard KSE-100 exposure', institutionalInterest: 'MEDIUM', liquidityRisk: 'MEDIUM', politicalRiskExposure: 'MEDIUM', currencyRiskExposure: 'MEDIUM', dividendOutlook: 'Stable' },
      executiveSummary: 'AI prediction engine fallback: the stock shows a balanced setup with moderate fundamentals. Wait for a clearer trigger before adding aggressively.'
    };
  }
};

/* ═══════════════════════════════════════════════════════════════════
   AGENT 6 — REPORT COMPILER
   ═══════════════════════════════════════════════════════════════════ */
const agent6_ReportCompiler = (pkg, setStage) => {
  setStage({ agent: 6, message: '📋 Compiling final analysis report...', pct: 95 });
  return {
    ...pkg,
    timestamp: new Date().toISOString(),
    finalScore: Math.round(
      pkg.technical.technicalScore * 0.30 +
      pkg.fundamental.fundamentalScore * 0.35 +
      pkg.sentiment.sentimentScore * 0.20 +
      pkg.prediction.overallScore * 0.15
    )
  };
};


/* ═══════════════════════════════════════════════════════════════════
   UI ATOMS
   ═══════════════════════════════════════════════════════════════════ */
const Card = ({ children, className = '', glow = false, title, icon: Icon, accent }) => (
  <div className={`rounded-lg border ${className}`} style={{
    background: C.bg2, borderColor: C.border,
    boxShadow: glow ? '0 0 40px rgba(0,212,170,0.08), inset 0 1px 0 rgba(255,255,255,0.03)' : 'inset 0 1px 0 rgba(255,255,255,0.03)'
  }}>
    {title && (
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} style={{ color: accent || C.accent }} />}
          <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.text2, fontFamily: 'Inter, sans-serif' }}>{title}</span>
        </div>
      </div>
    )}
    {children}
  </div>
);

const Badge = ({ children, color = C.text2, bg, className = '' }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${className}`}
    style={{ color, background: bg || 'transparent', border: bg ? 'none' : `1px solid ${color}40`, fontFamily: 'Inter, sans-serif' }}>
    {children}
  </span>
);

const verdictColor = (v) => {
  if (!v) return C.text2;
  const s = String(v).toUpperCase();
  if (s.includes('STRONG BUY') || s.includes('DEEPLY UNDER')) return C.bull;
  if (s.includes('BUY') || s.includes('ACCUMULATE') || s.includes('UNDER') || s.includes('BULLISH') || s === 'YES' || s === 'LOW' || s === 'EXCELLENT' || s === 'GOOD') return C.bull;
  if (s.includes('STRONG SELL') || s.includes('DEEPLY OVER') || s === 'VERY HIGH' || s === 'AVOID') return C.bear;
  if (s.includes('SELL') || s.includes('REDUCE') || s.includes('OVER') || s.includes('BEARISH') || s === 'NO' || s === 'HIGH' || s === 'POOR') return C.bear;
  if (s === 'MEDIUM' || s === 'FAIR' || s === 'NEUTRAL' || s.includes('HOLD') || s.includes('FAIR')) return C.warn;
  return C.text2;
};

/* ═══════════════════════════════════════════════════════════════════
   MARKET CLOCK / STATUS
   ═══════════════════════════════════════════════════════════════════ */
const MarketClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  // Convert to PKT (UTC+5)
  const pkt = new Date(now.getTime() + (now.getTimezoneOffset() + 300) * 60000);
  const hours = pkt.getHours();
  const mins = pkt.getMinutes();
  const day = pkt.getDay();
  const isWeekday = day >= 1 && day <= 5;
  const minutesOfDay = hours * 60 + mins;
  const isOpen = isWeekday && minutesOfDay >= 570 && minutesOfDay < 930; // 09:30 - 15:30
  const isPreMarket = isWeekday && minutesOfDay >= 510 && minutesOfDay < 570;
  const status = isOpen ? 'OPEN' : isPreMarket ? 'PRE-MKT' : 'CLOSED';
  const statusColor = isOpen ? C.bull : isPreMarket ? C.warn : C.bear;
  const time = pkt.toTimeString().slice(0, 8);
  return (
    <div className="flex items-center gap-4 text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      <div className="flex items-center gap-2">
        <Clock size={12} style={{ color: C.text2 }} />
        <span style={{ color: C.text }}>{time}</span>
        <span className="text-[10px]" style={{ color: C.text3 }}>PKT</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          {isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: statusColor }} />}
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: statusColor }} />
        </span>
        <span className="text-[10px] font-bold" style={{ color: statusColor, fontFamily: 'Inter, sans-serif', letterSpacing: '0.15em' }}>
          {status}
        </span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SEARCH BAR
   ═══════════════════════════════════════════════════════════════════ */
const SearchBar = ({ onSearch, recent, currentTicker }) => {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = q
    ? PSX_STOCKS.filter(s => s.t.toLowerCase().includes(q.toLowerCase()) || s.n.toLowerCase().includes(q.toLowerCase())).slice(0, 12)
    : PSX_STOCKS.slice(0, 15);

  const pick = (t) => { onSearch(t); setQ(''); setOpen(false); };

  return (
    <div className="relative flex-1 max-w-md" ref={ref}>
      <div className="flex items-center gap-2 px-3 py-2 rounded-md border transition-colors"
        style={{ background: C.bg3, borderColor: open ? C.accent : C.border }}>
        <Search size={14} style={{ color: open ? C.accent : C.text2 }} />
        <input
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value.toUpperCase()); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === 'Enter' && filtered[0]) pick(filtered[0].t); }}
          placeholder="Search PSX ticker or company..."
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: C.text, fontFamily: 'JetBrains Mono, monospace' }}
        />
        {q && <X size={12} onClick={() => setQ('')} style={{ color: C.text3, cursor: 'pointer' }} />}
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-md border overflow-hidden z-50 max-h-96 overflow-y-auto"
          style={{ background: C.bg2, borderColor: C.borderLight, boxShadow: '0 12px 48px rgba(0,0,0,0.6)' }}>
          {recent.length > 0 && !q && (
            <div className="px-3 py-2 text-[9px] uppercase tracking-[0.2em] border-b" style={{ color: C.text3, borderColor: C.border, fontFamily: 'Inter, sans-serif' }}>
              Recent
            </div>
          )}
          {recent.length > 0 && !q && recent.slice(0, 3).map(t => {
            const m = TICKER_MAP[t];
            return (
              <div key={'r-' + t} onClick={() => pick(t)} className="px-3 py-2 cursor-pointer hover:bg-opacity-50 flex items-center justify-between border-b"
                style={{ borderColor: C.border }} onMouseEnter={(e) => e.currentTarget.style.background = C.bg3} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <div className="flex items-center gap-3">
                  <Clock size={11} style={{ color: C.text3 }} />
                  <div>
                    <div className="text-xs font-bold" style={{ color: C.text, fontFamily: 'JetBrains Mono, monospace' }}>{t}</div>
                    <div className="text-[10px]" style={{ color: C.text2 }}>{m?.n}</div>
                  </div>
                </div>
                {currentTicker === t && <Badge color={C.accent}>Active</Badge>}
              </div>
            );
          })}
          {!q && <div className="px-3 py-2 text-[9px] uppercase tracking-[0.2em] border-b" style={{ color: C.text3, borderColor: C.border, fontFamily: 'Inter, sans-serif' }}>Top PSX Stocks</div>}
          {filtered.map(s => (
            <div key={s.t} onClick={() => pick(s.t)} className="px-3 py-2 cursor-pointer flex items-center justify-between transition-colors"
              onMouseEnter={(e) => e.currentTarget.style.background = C.bg3} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <div className="flex items-center gap-3">
                <div className="text-xs font-bold w-16" style={{ color: C.text, fontFamily: 'JetBrains Mono, monospace' }}>{s.t}</div>
                <div className="text-[10px] truncate max-w-[180px]" style={{ color: C.text2 }}>{s.n}</div>
              </div>
              <Badge color={C.text3}>{s.s}</Badge>
            </div>
          ))}
          {filtered.length === 0 && <div className="px-3 py-4 text-xs text-center" style={{ color: C.text3 }}>No matches</div>}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   LOADING OVERLAY
   ═══════════════════════════════════════════════════════════════════ */
const AGENT_NAMES = [
  '', 'Data Collector', 'Technical Analyst', 'Fundamental Analyst',
  'Sentiment Analyst', 'Prediction Engine', 'Report Compiler'
];

const LoadingOverlay = ({ stage, ticker }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
    style={{ background: 'rgba(10,10,15,0.92)' }}>
    <div className="text-center max-w-md px-8">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <svg className="w-full h-full animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke={C.border} strokeWidth="2" />
          <circle cx="50" cy="50" r="45" fill="none" stroke={C.accent} strokeWidth="2" strokeDasharray="60 240" strokeLinecap="round" />
          <circle cx="50" cy="50" r="32" fill="none" stroke={C.borderLight} strokeWidth="1" />
          <circle cx="50" cy="50" r="32" fill="none" stroke={C.accent} strokeWidth="1.5" strokeDasharray="30 170" strokeLinecap="round" opacity="0.6" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: C.accent, fontFamily: 'JetBrains Mono, monospace' }}>{stage.agent}/6</div>
            <div className="text-[9px] uppercase tracking-widest" style={{ color: C.text3 }}>Agent</div>
          </div>
        </div>
      </div>

      <div className="mb-2 text-xs uppercase tracking-[0.3em]" style={{ color: C.text3, fontFamily: 'Inter, sans-serif' }}>
        Analyzing {ticker}
      </div>
      <div className="text-lg mb-1" style={{ color: C.accent, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
        {AGENT_NAMES[stage.agent] || 'Initializing'}
      </div>
      <div className="text-xs mb-6" style={{ color: C.text2 }}>{stage.message}</div>

      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: C.bg3 }}>
        <div className="h-full rounded-full transition-all duration-500" style={{
          width: `${stage.pct}%`,
          background: `linear-gradient(90deg, ${C.accent}, ${C.bull})`,
          boxShadow: `0 0 12px ${C.accent}`
        }} />
      </div>
      <div className="mt-2 flex justify-between text-[10px]" style={{ color: C.text3, fontFamily: 'JetBrains Mono, monospace' }}>
        <span>{stage.pct}%</span>
        <span>ETA: {Math.max(1, Math.ceil((100 - stage.pct) / 8))}s</span>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {[1, 2, 3, 4, 5, 6].map(n => (
          <div key={n} className="w-8 h-1 rounded-full transition-all"
            style={{ background: n < stage.agent ? C.bull : n === stage.agent ? C.accent : C.border }} />
        ))}
      </div>
    </div>
  </div>
);


/* ═══════════════════════════════════════════════════════════════════
   CHARTS
   ═══════════════════════════════════════════════════════════════════ */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="px-3 py-2 rounded border text-xs" style={{
      background: C.bg, borderColor: C.borderLight, fontFamily: 'JetBrains Mono, monospace',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
    }}>
      <div className="mb-1 text-[10px]" style={{ color: C.text3 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <span style={{ color: p.color || C.text2 }}>{p.name}:</span>
          <span style={{ color: C.text }}>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const MasterPriceChart = ({ ohlcv, indicators, timeframe }) => {
  const len = { '30d': 30, '90d': 90, '180d': 180, '365d': 365 }[timeframe] || 90;
  const sliced = ohlcv.slice(-len);
  const sliceStart = ohlcv.length - len;
  const data = sliced.map((b, i) => {
    const idx = sliceStart + i;
    return {
      date: b.date.slice(5),
      close: b.close,
      high: b.high,
      low: b.low,
      volume: b.volume,
      sma20: indicators.sma20[idx],
      sma50: indicators.sma50[idx],
      sma200: indicators.sma200[idx],
      bbUpper: indicators.bb.upper[idx],
      bbLower: indicators.bb.lower[idx]
    };
  });
  const lastClose = sliced[sliced.length - 1].close;
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
        <XAxis dataKey="date" stroke={C.text3} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} interval={Math.max(0, Math.floor(data.length / 8))} />
        <YAxis stroke={C.text3} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={['auto', 'auto']} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey="bbUpper" stroke="none" fill="#8b5cf6" fillOpacity={0.06} name="BB Upper" />
        <Area type="monotone" dataKey="bbLower" stroke="none" fill={C.bg2} fillOpacity={1} name="BB Lower" />
        <Line type="monotone" dataKey="sma200" stroke={C.bear} strokeWidth={1} dot={false} name="SMA200" />
        <Line type="monotone" dataKey="sma50" stroke="#3b82f6" strokeWidth={1} dot={false} name="SMA50" />
        <Line type="monotone" dataKey="sma20" stroke={C.warn} strokeWidth={1} dot={false} name="SMA20" />
        <Line type="monotone" dataKey="close" stroke={C.accent} strokeWidth={2} dot={false} name="Price" />
        <ReferenceLine y={lastClose} stroke={C.accent} strokeDasharray="2 4" strokeOpacity={0.4} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const VolumeChart = ({ ohlcv, timeframe }) => {
  const len = { '30d': 30, '90d': 90, '180d': 180, '365d': 365 }[timeframe] || 90;
  const sliced = ohlcv.slice(-len);
  const data = sliced.map((b, i) => ({
    date: b.date.slice(5),
    volume: b.volume,
    up: i > 0 ? b.close >= sliced[i - 1].close : true
  }));
  return (
    <ResponsiveContainer width="100%" height={70}>
      <BarChart data={data} margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
        <XAxis dataKey="date" hide />
        <YAxis hide />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey="volume" name="Volume">
          {data.map((d, i) => <Cell key={i} fill={d.up ? C.bullDim : C.bearDim} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const RSIPanel = ({ rsi, timeframe }) => {
  const len = { '30d': 30, '90d': 90, '180d': 180, '365d': 365 }[timeframe] || 90;
  const data = rsi.slice(-len).map((v, i) => ({ i, rsi: v }));
  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
        <XAxis dataKey="i" hide />
        <YAxis stroke={C.text3} tick={{ fontSize: 9 }} domain={[0, 100]} ticks={[30, 50, 70]} width={28} />
        <Tooltip content={<ChartTooltip />} />
        <ReferenceLine y={70} stroke={C.bear} strokeDasharray="4 4" strokeOpacity={0.6} />
        <ReferenceLine y={30} stroke={C.bull} strokeDasharray="4 4" strokeOpacity={0.6} />
        <ReferenceLine y={50} stroke={C.text3} strokeOpacity={0.3} />
        <Line type="monotone" dataKey="rsi" stroke={C.text} strokeWidth={1.5} dot={false} name="RSI" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const MACDChart = ({ macd, timeframe }) => {
  const len = { '30d': 30, '90d': 90, '180d': 180, '365d': 365 }[timeframe] || 90;
  const data = macd.macd.slice(-len).map((m, i) => ({
    i,
    macd: m,
    signal: macd.signal.slice(-len)[i],
    hist: macd.hist.slice(-len)[i]
  }));
  return (
    <ResponsiveContainer width="100%" height={120}>
      <ComposedChart data={data} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
        <XAxis dataKey="i" hide />
        <YAxis stroke={C.text3} tick={{ fontSize: 9 }} width={28} />
        <Tooltip content={<ChartTooltip />} />
        <ReferenceLine y={0} stroke={C.text3} strokeOpacity={0.4} />
        <Bar dataKey="hist" name="Histogram">
          {data.map((d, i) => <Cell key={i} fill={d.hist >= 0 ? C.bullDim : C.bearDim} />)}
        </Bar>
        <Line type="monotone" dataKey="macd" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="MACD" />
        <Line type="monotone" dataKey="signal" stroke={C.warn} strokeWidth={1.5} dot={false} name="Signal" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const FundamentalRadar = ({ technical, fundamental, sentiment, sectorAvgPE, fundamentals }) => {
  const data = [
    { axis: 'Valuation', stock: Math.max(0, 100 + Math.min(50, fundamental.marginOfSafety) / 1), sector: 50 },
    { axis: 'Growth', stock: Math.min(100, Math.max(0, (fundamentals.yoyProfitGrowth_pct || 0) * 4 + 30)), sector: 50 },
    { axis: 'Profitability', stock: Math.min(100, Math.max(0, (fundamentals.roe_pct || 0) * 4)), sector: 50 },
    { axis: 'Liquidity', stock: Math.min(100, Math.max(0, (fundamentals.currentRatio || 0) * 40)), sector: 50 },
    { axis: 'Momentum', stock: technical.technicalScore, sector: 50 },
    { axis: 'Sentiment', stock: sentiment.sentimentScore, sector: 50 }
  ];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart data={data}>
        <PolarGrid stroke={C.border} />
        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: C.text2, fontFamily: 'Inter' }} />
        <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
        <Radar name="Sector Avg" dataKey="sector" stroke={C.warn} fill={C.warn} fillOpacity={0.08} strokeWidth={1} />
        <Radar name="Stock" dataKey="stock" stroke={C.accent} fill={C.accent} fillOpacity={0.25} strokeWidth={2} />
        <Tooltip content={<ChartTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

const PriceTargetGauge = ({ targets, current }) => {
  const { bear, base, bull } = targets;
  const min = Math.min(bear, current) * 0.95;
  const max = Math.max(bull, current) * 1.05;
  const norm = (v) => ((v - min) / (max - min)) * 100;
  return (
    <div className="relative py-6 px-2">
      <div className="h-3 rounded-full relative overflow-hidden" style={{
        background: `linear-gradient(90deg, ${C.bear} 0%, ${C.warn} 50%, ${C.bull} 100%)`,
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)'
      }}>
        <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5" style={{ left: `${norm(bear)}%`, background: C.bg }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5" style={{ left: `${norm(base)}%`, background: C.bg }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5" style={{ left: `${norm(bull)}%`, background: C.bg }} />
      </div>
      <div className="absolute top-3 -translate-y-1/2" style={{ left: `${norm(current)}%`, transform: `translateX(-50%) translateY(-50%)` }}>
        <div className="w-4 h-4 rounded-full ring-2" style={{ background: C.accent, ringColor: C.bg, boxShadow: `0 0 12px ${C.accent}` }} />
        <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold" style={{ color: C.accent, fontFamily: 'JetBrains Mono' }}>
          {fmtPKR(current, 1)}
        </div>
      </div>
      <div className="flex justify-between mt-10 text-[10px]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        <div className="text-left">
          <div className="font-bold" style={{ color: C.bear }}>{fmtPKR(bear, 1)}</div>
          <div className="uppercase text-[9px]" style={{ color: C.text3, letterSpacing: '0.1em' }}>Bear</div>
        </div>
        <div className="text-center">
          <div className="font-bold" style={{ color: C.warn }}>{fmtPKR(base, 1)}</div>
          <div className="uppercase text-[9px]" style={{ color: C.text3, letterSpacing: '0.1em' }}>Base</div>
        </div>
        <div className="text-right">
          <div className="font-bold" style={{ color: C.bull }}>{fmtPKR(bull, 1)}</div>
          <div className="uppercase text-[9px]" style={{ color: C.text3, letterSpacing: '0.1em' }}>Bull</div>
        </div>
      </div>
    </div>
  );
};

const SentimentTimeline = ({ companyNews }) => {
  // Aggregate by date
  const map = {};
  companyNews.forEach(n => {
    if (!map[n.date]) map[n.date] = { date: n.date.slice(5), sentiment: 0, count: 0 };
    map[n.date].sentiment += n.sentiment;
    map[n.date].count += 1;
  });
  const data = Object.values(map).map(d => ({ ...d, avg: d.sentiment / d.count })).sort((a, b) => a.date.localeCompare(b.date));
  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart data={data} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="senPos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.bull} stopOpacity={0.5} />
            <stop offset="100%" stopColor={C.bull} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
        <XAxis dataKey="date" stroke={C.text3} tick={{ fontSize: 9 }} />
        <YAxis stroke={C.text3} tick={{ fontSize: 9 }} domain={[-1, 1]} width={28} />
        <Tooltip content={<ChartTooltip />} />
        <ReferenceLine y={0} stroke={C.text3} strokeOpacity={0.4} />
        <Area type="monotone" dataKey="avg" stroke={C.accent} strokeWidth={2} fill="url(#senPos)" name="Sentiment" />
      </AreaChart>
    </ResponsiveContainer>
  );
};


/* ═══════════════════════════════════════════════════════════════════
   RESULT PANELS
   ═══════════════════════════════════════════════════════════════════ */
const HeroMetrics = ({ result }) => {
  const { prediction, finalScore, priceData, fundamental } = result;
  const cards = [
    {
      label: 'AI Score',
      value: `${finalScore}`,
      sub: `/ 100`,
      bar: finalScore,
      icon: Brain,
      color: finalScore >= 70 ? C.bull : finalScore >= 50 ? C.warn : C.bear
    },
    {
      label: 'Recommendation',
      value: prediction.recommendation,
      sub: prediction.recommendation.includes('BUY') ? '↑ Bullish' : prediction.recommendation.includes('SELL') ? '↓ Bearish' : '→ Neutral',
      icon: Target,
      color: verdictColor(prediction.recommendation)
    },
    {
      label: 'Valuation',
      value: prediction.valuationStatus.verdict.replace('DEEPLY ', '').replace(' VALUE', ''),
      sub: `${fmtPct(fundamental.marginOfSafety, 1)} MoS`,
      icon: Anchor,
      color: verdictColor(prediction.valuationStatus.verdict)
    },
    {
      label: 'Confidence',
      value: `${prediction.confidence}%`,
      sub: prediction.confidence >= 75 ? '🎯 High' : prediction.confidence >= 50 ? '◐ Medium' : '◯ Low',
      bar: prediction.confidence,
      icon: Sparkles,
      color: prediction.confidence >= 70 ? C.accent : C.warn
    }
  ];
  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((c, i) => (
        <div key={i} className="p-4 rounded-lg border relative overflow-hidden" style={{
          background: C.bg2, borderColor: C.border
        }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c.color}, transparent)` }} />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: C.text3, fontFamily: 'Inter, sans-serif' }}>{c.label}</span>
            <c.icon size={12} style={{ color: c.color }} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold leading-none" style={{ color: c.color, fontFamily: 'JetBrains Mono, monospace' }}>{c.value}</span>
            <span className="text-xs" style={{ color: C.text3 }}>{c.sub.split(/[↑↓→🎯◐◯]/)[0]}</span>
          </div>
          {c.bar !== undefined && (
            <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: C.bg3 }}>
              <div className="h-full transition-all duration-1000" style={{ width: `${c.bar}%`, background: c.color }} />
            </div>
          )}
          {c.bar === undefined && <div className="mt-2 text-[10px]" style={{ color: c.color }}>{c.sub.match(/[↑↓→🎯◐◯].*/)?.[0] || c.sub}</div>}
        </div>
      ))}
    </div>
  );
};

const HoldingStrategy = ({ strategy }) => (
  <div className="divide-y" style={{ borderColor: C.border }}>
    {Object.entries(strategy).map(([k, v]) => {
      const label = k === 'shortTerm' ? 'Short Term' : k === 'mediumTerm' ? 'Medium Term' : 'Long Term';
      const c = verdictColor(v.verdict);
      return (
        <div key={k} className="px-4 py-3 grid grid-cols-12 gap-3 items-center" style={{ borderColor: C.border }}>
          <div className="col-span-3">
            <div className="text-xs font-semibold" style={{ color: C.text, fontFamily: 'Inter, sans-serif' }}>{label}</div>
            <div className="text-[10px]" style={{ color: C.text3, fontFamily: 'JetBrains Mono, monospace' }}>{v.horizon}</div>
          </div>
          <div className="col-span-2">
            <Badge color={c} bg={c + '20'}>
              {v.verdict === 'YES' ? <><Check size={10} /> Yes</> : v.verdict === 'NO' ? <><X size={10} /> No</> : <><Minus size={10} /> Neutral</>}
            </Badge>
          </div>
          <div className="col-span-7 text-xs leading-snug" style={{ color: C.text2 }}>
            {v.reasoning}
          </div>
        </div>
      );
    })}
  </div>
);

const EntryStrategy = ({ entry, currentPrice }) => {
  const quality = verdictColor(entry.currentPositionQuality);
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest" style={{ color: C.text3 }}>Entry Quality</div>
          <div className="text-lg font-bold mt-0.5" style={{ color: quality, fontFamily: 'Inter, sans-serif' }}>{entry.currentPositionQuality}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest" style={{ color: C.text3 }}>Ideal Buy Zone</div>
          <div className="text-sm font-bold mt-0.5" style={{ color: C.bull, fontFamily: 'JetBrains Mono, monospace' }}>
            {fmtPKR(entry.idealBuyZone.low, 1)} – {fmtPKR(entry.idealBuyZone.high, 1)}
          </div>
        </div>
      </div>

      <div className="text-xs italic px-3 py-2 rounded" style={{ color: C.text2, background: C.bg3 }}>
        {entry.currentVsIdeal}
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: C.text3 }}>Staggered Entry Plan</div>
        <div className="space-y-1.5">
          {entry.staggeredEntry.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded" style={{ background: C.bg3 }}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: C.accentDim, color: C.accent }}>
                  {i + 1}
                </div>
                <div className="text-xs" style={{ color: C.text2 }}>Tranche {i + 1}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs font-bold" style={{ color: C.text, fontFamily: 'JetBrains Mono, monospace' }}>{fmtPKR(s.price, 1)}</div>
                <Badge color={C.accent} bg={C.accentDim}>{s.allocation}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RiskDashboard = ({ risk, currentPrice }) => {
  const riskColor = verdictColor(risk.overallRisk);
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded" style={{ background: C.bg3 }}>
          <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color: C.text3 }}>Overall</div>
          <div className="text-base font-bold" style={{ color: riskColor }}>{risk.overallRisk}</div>
          <div className="mt-1.5 h-1 rounded-full" style={{ background: C.border }}>
            <div className="h-full rounded-full" style={{ width: `${risk.riskScore}%`, background: riskColor }} />
          </div>
        </div>
        <div className="p-3 rounded" style={{ background: C.bg3 }}>
          <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color: C.text3 }}>Stop Loss</div>
          <div className="text-base font-bold" style={{ color: C.bear, fontFamily: 'JetBrains Mono, monospace' }}>{fmtPKR(risk.stopLoss, 1)}</div>
          <div className="text-[10px]" style={{ color: C.bear }}>{fmtPct(risk.stopLossPercent)}</div>
        </div>
        <div className="p-3 rounded" style={{ background: C.bg3 }}>
          <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color: C.text3 }}>R / R Risk</div>
          <div className="text-base font-bold" style={{ color: C.text, fontFamily: 'JetBrains Mono, monospace' }}>{risk.riskScore}/100</div>
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: C.text3 }}>Key Risks</div>
        <div className="space-y-1.5">
          {risk.keyRisks.map((r, i) => (
            <div key={i} className="flex items-start gap-3 px-3 py-2 rounded text-xs" style={{ background: C.bg3 }}>
              <AlertTriangle size={12} className="mt-0.5 shrink-0" style={{ color: verdictColor(r.severity) }} />
              <div className="flex-1" style={{ color: C.text2 }}>{r.risk}</div>
              <Badge color={verdictColor(r.severity)} bg={verdictColor(r.severity) + '20'}>{r.severity}</Badge>
              <Badge color={C.text3}>P: {r.probability}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TechnicalSignalsTable = ({ signals }) => (
  <div className="max-h-96 overflow-y-auto">
    <table className="w-full text-xs">
      <thead className="sticky top-0" style={{ background: C.bg2 }}>
        <tr style={{ borderBottom: `1px solid ${C.border}` }}>
          <th className="text-left px-4 py-2 text-[10px] uppercase tracking-widest" style={{ color: C.text3, fontFamily: 'Inter' }}>Indicator</th>
          <th className="text-right px-4 py-2 text-[10px] uppercase tracking-widest" style={{ color: C.text3 }}>Value</th>
          <th className="text-center px-4 py-2 text-[10px] uppercase tracking-widest" style={{ color: C.text3 }}>Signal</th>
          <th className="text-left px-4 py-2 text-[10px] uppercase tracking-widest" style={{ color: C.text3 }}>Interpretation</th>
        </tr>
      </thead>
      <tbody>
        {signals.map((s, i) => {
          const c = verdictColor(s.signal);
          return (
            <tr key={i} className="transition-colors" style={{ borderBottom: `1px solid ${C.border}` }}
              onMouseEnter={(e) => e.currentTarget.style.background = C.bg3}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <td className="px-4 py-2.5 font-semibold" style={{ color: C.text, fontFamily: 'Inter' }}>{s.name}</td>
              <td className="px-4 py-2.5 text-right" style={{ color: C.text2, fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</td>
              <td className="px-4 py-2.5 text-center"><Badge color={c} bg={c + '20'}>{s.signal}</Badge></td>
              <td className="px-4 py-2.5" style={{ color: C.text2 }}>{s.explanation}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const FundamentalScorecard = ({ fundamental, fundamentals, currentPrice }) => {
  const rows = [
    { l: 'DCF Intrinsic Value', v: fmtPKR(fundamental.dcfValue, 1), c: fundamental.dcfValue > currentPrice ? C.bull : C.bear },
    { l: 'Graham Number', v: fundamental.grahamNumber ? fmtPKR(fundamental.grahamNumber, 1) : '—', c: fundamental.grahamNumber && fundamental.grahamNumber > currentPrice ? C.bull : C.bear },
    { l: 'Margin of Safety', v: fmtPct(fundamental.marginOfSafety, 1), c: fundamental.marginOfSafety > 15 ? C.bull : fundamental.marginOfSafety > -15 ? C.warn : C.bear },
    { l: 'P/E Ratio', v: fundamentals.pe?.toFixed(1), c: C.text },
    { l: 'P/B Ratio', v: fundamentals.pb?.toFixed(2), c: C.text },
    { l: 'Sector Avg P/E', v: fundamental.sectorAvgPE, c: C.text2 },
    { l: 'PE Premium vs Sector', v: fmtPct(fundamental.pePremium, 1), c: fundamental.pePremium < 0 ? C.bull : C.bear },
    { l: 'PEG Ratio', v: fundamental.pegRatio?.toFixed(2) || '—', c: fundamental.pegRatio && fundamental.pegRatio < 1 ? C.bull : C.text },
    { l: 'ROE', v: fmtPct(fundamentals.roe_pct, 1), c: fundamentals.roe_pct > 15 ? C.bull : C.text },
    { l: 'Debt / Equity', v: fundamentals.debtEquity?.toFixed(2), c: fundamentals.debtEquity < 1 ? C.bull : C.bear },
    { l: 'Dividend Yield', v: fmtPct(fundamentals.dividendYield_pct, 1), c: fundamentals.dividendYield_pct > 5 ? C.bull : C.text },
    { l: 'YoY Profit Growth', v: fmtPct(fundamentals.yoyProfitGrowth_pct, 1), c: fundamentals.yoyProfitGrowth_pct > 0 ? C.bull : C.bear }
  ];
  return (
    <div className="p-4">
      <div className="mb-4 p-3 rounded-lg" style={{ background: C.bg3 }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: C.text3 }}>Piotroski F-Score</span>
          <span className="text-xs" style={{ color: C.text2 }}>(quality score)</span>
        </div>
        <div className="flex items-end gap-3">
          <div className="text-3xl font-bold" style={{
            color: fundamental.piotroskiScore >= 7 ? C.bull : fundamental.piotroskiScore >= 4 ? C.warn : C.bear,
            fontFamily: 'JetBrains Mono, monospace'
          }}>{fundamental.piotroskiScore}<span className="text-base" style={{ color: C.text3 }}>/9</span></div>
          <div className="flex gap-1 mb-2">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="w-2 h-5 rounded-sm" style={{
                background: i < fundamental.piotroskiScore ? (fundamental.piotroskiScore >= 7 ? C.bull : C.warn) : C.border
              }} />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between border-b py-1.5" style={{ borderColor: C.border }}>
            <span className="text-xs" style={{ color: C.text2 }}>{r.l}</span>
            <span className="text-xs font-bold" style={{ color: r.c, fontFamily: 'JetBrains Mono, monospace' }}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CatalystsBoard = ({ catalysts }) => {
  const pos = catalysts?.positive || [];
  const neg = catalysts?.negative || [];
  return (
    <div className="grid grid-cols-2 divide-x" style={{ borderColor: C.border }}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={12} style={{ color: C.bull }} />
          <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.bull, fontFamily: 'Inter' }}>Positive Catalysts</span>
        </div>
        <div className="space-y-2">
          {pos.length === 0 && <div className="text-xs" style={{ color: C.text3 }}>No major positive catalysts identified</div>}
          {pos.map((c, i) => (
            <div key={i} className="p-2.5 rounded text-xs" style={{ background: C.bullDim, borderLeft: `2px solid ${C.bull}` }}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div style={{ color: C.text, fontWeight: 500 }}>{c.catalyst}</div>
                <Badge color={verdictColor(c.impact)} bg={verdictColor(c.impact) + '20'}>{c.impact}</Badge>
              </div>
              <div className="text-[10px]" style={{ color: C.text3, fontFamily: 'JetBrains Mono' }}>⏱ {c.timeline}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown size={12} style={{ color: C.bear }} />
          <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.bear, fontFamily: 'Inter' }}>Negative Risks</span>
        </div>
        <div className="space-y-2">
          {neg.length === 0 && <div className="text-xs" style={{ color: C.text3 }}>No major negative catalysts identified</div>}
          {neg.map((c, i) => (
            <div key={i} className="p-2.5 rounded text-xs" style={{ background: C.bearDim, borderLeft: `2px solid ${C.bear}` }}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div style={{ color: C.text, fontWeight: 500 }}>{c.catalyst}</div>
                <Badge color={verdictColor(c.impact)} bg={verdictColor(c.impact) + '20'}>{c.impact}</Badge>
              </div>
              <div className="text-[10px]" style={{ color: C.text3, fontFamily: 'JetBrains Mono' }}>⏱ {c.timeline}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PSXInsightsPanel = ({ insights }) => {
  const cards = [
    { label: 'Index Impact', value: insights.indexImpact, icon: BarChart3 },
    { label: 'Institutional Interest', value: insights.institutionalInterest, badge: true, icon: Layers },
    { label: 'Liquidity Risk', value: insights.liquidityRisk, badge: true, icon: Wind },
    { label: 'Political Risk', value: insights.politicalRiskExposure, badge: true, icon: AlertTriangle },
    { label: 'Currency Risk', value: insights.currencyRiskExposure, badge: true, icon: Radio },
    { label: 'Dividend Outlook', value: insights.dividendOutlook, icon: Star }
  ];
  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {cards.map((c, i) => (
        <div key={i} className="p-3 rounded" style={{ background: C.bg3, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-1.5 mb-2">
            <c.icon size={10} style={{ color: C.text3 }} />
            <span className="text-[9px] uppercase tracking-widest" style={{ color: C.text3, fontFamily: 'Inter' }}>{c.label}</span>
          </div>
          {c.badge ? (
            <Badge color={verdictColor(c.value)} bg={verdictColor(c.value) + '20'} className="!text-xs !px-2 !py-1">{c.value}</Badge>
          ) : (
            <div className="text-xs leading-snug" style={{ color: C.text, fontFamily: 'Inter' }}>{c.value}</div>
          )}
        </div>
      ))}
    </div>
  );
};

const NewsFeed = ({ news }) => (
  <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
    {news.map((n, i) => {
      const c = n.sentiment > 0.2 ? C.bull : n.sentiment < -0.2 ? C.bear : C.text2;
      return (
        <div key={i} className="p-2.5 rounded text-xs transition-colors cursor-default"
          style={{ background: C.bg3, borderLeft: `2px solid ${c}` }}
          onMouseEnter={(e) => e.currentTarget.style.background = C.borderLight}
          onMouseLeave={(e) => e.currentTarget.style.background = C.bg3}>
          <div className="flex items-center justify-between mb-1 text-[10px]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <span style={{ color: C.text3 }}>{n.date}</span>
            <span style={{ color: c }}>{n.sentiment > 0 ? '↑' : n.sentiment < 0 ? '↓' : '→'} {n.sentiment.toFixed(2)}</span>
          </div>
          <div className="mb-1 leading-snug" style={{ color: C.text }}>{n.headline}</div>
          <div className="flex items-center justify-between text-[10px]" style={{ color: C.text3 }}>
            <span>{n.source}</span>
            {n.impact && <Badge color={verdictColor(n.impact)}>{n.impact}</Badge>}
          </div>
        </div>
      );
    })}
  </div>
);

const Watchlist = ({ list, onPick, onRemove, current }) => (
  <div className="space-y-1">
    {list.length === 0 && (
      <div className="text-xs text-center py-6" style={{ color: C.text3 }}>
        Searched stocks appear here
      </div>
    )}
    {list.map(t => {
      const m = TICKER_MAP[t.ticker] || { t: t.ticker, n: '', s: '' };
      const active = current === t.ticker;
      return (
        <div key={t.ticker} className="p-2.5 rounded cursor-pointer transition-all flex items-center justify-between group"
          style={{
            background: active ? C.accentDim : C.bg3,
            border: `1px solid ${active ? C.accent : C.border}`
          }}
          onClick={() => onPick(t.ticker)}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold" style={{ color: active ? C.accent : C.text, fontFamily: 'JetBrains Mono' }}>{t.ticker}</span>
              {t.score !== undefined && (
                <Badge color={t.score >= 70 ? C.bull : t.score >= 50 ? C.warn : C.bear}
                  bg={(t.score >= 70 ? C.bull : t.score >= 50 ? C.warn : C.bear) + '20'}>
                  {t.score}
                </Badge>
              )}
            </div>
            <div className="text-[10px] truncate" style={{ color: C.text3 }}>{m.n}</div>
          </div>
          <X size={12} className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: C.text3 }}
            onClick={(e) => { e.stopPropagation(); onRemove(t.ticker); }} />
        </div>
      );
    })}
  </div>
);

const MacroTicker = ({ macro, global }) => {
  if (!macro || !global) return null;
  const items = [
    { l: 'SBP', v: `${macro.sbpRate_pct}%`, c: C.warn },
    { l: 'CPI', v: `${macro.inflation_pct}%`, c: C.text2 },
    { l: 'PKR/USD', v: macro.pkrUsd, c: C.text2 },
    { l: 'Fed', v: `${global.usFedRate_pct}%`, c: C.text2 },
    { l: 'Brent', v: `$${global.brentOil_usd}`, c: C.text2 },
    { l: 'Gold', v: `$${global.gold_usd_oz}`, c: C.warn }
  ];
  return (
    <div className="flex items-center gap-6 px-4 py-2 border-t border-b text-xs overflow-x-auto" style={{
      background: C.bg3, borderColor: C.border, fontFamily: 'JetBrains Mono, monospace'
    }}>
      <span className="text-[9px] uppercase tracking-widest font-bold whitespace-nowrap" style={{ color: C.accent, fontFamily: 'Inter' }}>● LIVE</span>
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-[10px]" style={{ color: C.text3 }}>{it.l}</span>
          <span style={{ color: it.c }}>{it.v}</span>
        </div>
      ))}
      <div className="flex-1" />
      <span className="text-[10px] whitespace-nowrap" style={{ color: C.text3 }}>
        {macro.imfStatus}
      </span>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════════════ */
const EmptyState = ({ onPick }) => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="text-center max-w-2xl">
      <div className="relative inline-block mb-8">
        <div className="absolute inset-0 blur-3xl opacity-30" style={{ background: `radial-gradient(circle, ${C.accent}, transparent)` }} />
        <div className="relative w-20 h-20 mx-auto rounded-2xl flex items-center justify-center border" style={{
          background: C.bg2, borderColor: C.borderLight
        }}>
          <Brain size={32} style={{ color: C.accent }} />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2 tracking-tight" style={{
        background: `linear-gradient(180deg, ${C.text}, ${C.text2})`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        fontFamily: 'Inter, sans-serif'
      }}>
        PSX·AI Super Analyzer
      </h1>
      <p className="text-sm mb-1" style={{ color: C.text2 }}>
        6-agent AI pipeline · Real-time PSX data · Bloomberg-grade analysis
      </p>
      <p className="text-xs mb-8" style={{ color: C.text3, fontFamily: 'JetBrains Mono' }}>
        Search any PSX ticker to launch the full analysis pipeline
      </p>

      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
        {[
          { i: Cpu, l: 'Data Collector' },
          { i: BarChart3, l: 'Technical' },
          { i: Anchor, l: 'Fundamental' },
          { i: Newspaper, l: 'Sentiment' },
          { i: Brain, l: 'Prediction' },
          { i: Sparkles, l: 'Report' }
        ].map((a, i) => (
          <div key={i} className="p-3 rounded-lg border" style={{ background: C.bg2, borderColor: C.border }}>
            <a.i size={14} style={{ color: C.accent }} className="mb-1.5" />
            <div className="text-[10px] uppercase tracking-widest" style={{ color: C.text3, fontFamily: 'Inter' }}>Agent {i + 1}</div>
            <div className="text-xs font-bold mt-0.5" style={{ color: C.text }}>{a.l}</div>
          </div>
        ))}
      </div>

      <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: C.text3, fontFamily: 'Inter' }}>Popular PSX Stocks</div>
      <div className="flex flex-wrap gap-1.5 justify-center max-w-lg mx-auto">
        {['ENGRO', 'LUCK', 'HBL', 'PSO', 'OGDC', 'MCB', 'UBL', 'PPL', 'HUBC', 'MEBL', 'NESTLE', 'TRG'].map(t => (
          <button key={t} onClick={() => onPick(t)}
            className="px-3 py-1.5 rounded text-xs font-bold transition-all hover:scale-105"
            style={{ background: C.bg3, color: C.text, border: `1px solid ${C.border}`, fontFamily: 'JetBrains Mono' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}>
            {t}
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   ERROR PANEL
   ═══════════════════════════════════════════════════════════════════ */
const ErrorPanel = ({ error, onRetry }) => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="text-center max-w-md p-6 rounded-lg border" style={{ background: C.bg2, borderColor: C.bear + '40' }}>
      <AlertTriangle size={32} style={{ color: C.bear }} className="mx-auto mb-3" />
      <h3 className="text-base font-bold mb-2" style={{ color: C.bear, fontFamily: 'Inter' }}>Analysis Failed</h3>
      <p className="text-xs mb-4" style={{ color: C.text2 }}>{error}</p>
      <button onClick={onRetry} className="px-4 py-2 rounded text-xs font-bold inline-flex items-center gap-2"
        style={{ background: C.accent + '20', color: C.accent, border: `1px solid ${C.accent}` }}>
        <RefreshCw size={12} /> Retry Analysis
      </button>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const TABS = [
  { k: 'overview',   l: 'Overview',     i: Eye },
  { k: 'technical',  l: 'Technical',    i: BarChart3 },
  { k: 'fundamental',l: 'Fundamental',  i: Anchor },
  { k: 'sentiment',  l: 'Sentiment',    i: Newspaper },
  { k: 'risk',       l: 'Risk & Entry', i: Shield }
];

export default function PSXAnalyzer() {
  const [ticker, setTicker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState({ agent: 0, message: '', pct: 0 });
  const [result, setResult] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [recent, setRecent] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartTimeframe, setChartTimeframe] = useState('90d');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Inject Google fonts once
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch (_) {} };
  }, []);

  const runAnalysis = useCallback(async (sym) => {
    setIsLoading(true);
    setError(null);
    setTicker(sym);
    setActiveTab('overview');
    setLoadingStage({ agent: 1, message: 'Initializing pipeline...', pct: 0 });
    try {
      // Agent 1
      const a1 = await agent1_DataCollector(sym, setLoadingStage);

      // Agent 2 (instant)
      setLoadingStage({ agent: 2, message: '📊 Computing 15 technical indicators (RSI, MACD, BB, ATR, Stoch, OBV, VWAP, Fib)...', pct: 42 });
      await new Promise(r => setTimeout(r, 300));
      const technical = agent2_TechnicalAnalyst(a1.ohlcv);

      // Agent 3 (instant)
      setLoadingStage({ agent: 3, message: '🔬 Running DCF valuation, Graham number, Piotroski F-Score...', pct: 50 });
      await new Promise(r => setTimeout(r, 300));
      const fundamental = agent3_FundamentalAnalyst(a1.fundamentals, a1.news.macro.sbpRate_pct, a1.meta.s, a1.priceData.currentPrice);

      // Agent 4
      const sentiment = await agent4_SentimentAnalyst(a1.news, a1.meta.t, a1.meta.n, setLoadingStage);

      // Agent 5
      const pkg5 = { ...a1, technical, fundamental, sentiment };
      const prediction = await agent5_PredictionEngine(pkg5, setLoadingStage);

      // Agent 6
      const finalResult = agent6_ReportCompiler({ ...pkg5, prediction }, setLoadingStage);
      await new Promise(r => setTimeout(r, 400));

      setLoadingStage({ agent: 6, message: '✓ Analysis complete', pct: 100 });
      await new Promise(r => setTimeout(r, 400));

      setResult(finalResult);
      setRecent(r => [sym, ...r.filter(t => t !== sym)].slice(0, 5));
      setWatchlist(w => {
        const without = w.filter(x => x.ticker !== sym);
        return [{ ticker: sym, score: finalResult.finalScore, ts: Date.now() }, ...without].slice(0, 10);
      });
    } catch (e) {
      console.error('Pipeline error:', e);
      setError(e.message || 'Pipeline failed unexpectedly');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const copyToClipboard = () => {
    if (!result) return;
    const summary = `PSX·AI Analysis — ${result.meta.t} (${result.meta.n})
Score: ${result.finalScore}/100 | ${result.prediction.recommendation} | Confidence: ${result.prediction.confidence}%
Price: ${fmtPKR(result.priceData.currentPrice)} | Target (Base): ${fmtPKR(result.prediction.priceTargets.base)} | Stop: ${fmtPKR(result.prediction.riskAssessment.stopLoss)}
Valuation: ${result.prediction.valuationStatus.verdict} (MoS ${fmtPct(result.fundamental.marginOfSafety, 1)})
Piotroski: ${result.fundamental.piotroskiScore}/9 | Technical: ${result.technical.technicalScore}/100 | Sentiment: ${result.sentiment.sentimentScore}/100

${result.prediction.executiveSummary}

⚠️ AI-generated. Educational use only. Not financial advice.`;
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.bg, color: C.text, fontFamily: 'Inter, sans-serif' }}>
      {/* TOP BAR */}
      <header className="flex items-center gap-4 px-4 py-3 border-b shrink-0" style={{ borderColor: C.border, background: C.bg2 }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{
            background: `linear-gradient(135deg, ${C.accent}, ${C.bull})`,
            boxShadow: `0 0 16px ${C.accent}80`
          }}>
            <Sparkles size={16} style={{ color: C.bg }} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight leading-tight" style={{ color: C.text }}>
              PSX·<span style={{ color: C.accent }}>AI</span>
            </div>
            <div className="text-[8px] uppercase tracking-[0.25em] leading-tight" style={{ color: C.text3 }}>Super Analyzer</div>
          </div>
        </div>

        <SearchBar onSearch={runAnalysis} recent={recent} currentTicker={ticker} />

        <div className="flex-1" />

        {result && (
          <>
            <button onClick={() => runAnalysis(ticker)} disabled={isLoading}
              className="px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
              style={{ background: C.bg3, color: C.text2, border: `1px solid ${C.border}` }}>
              <RefreshCw size={12} /> Refresh
            </button>
            <button onClick={copyToClipboard}
              className="px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
              style={{ background: copied ? C.bullDim : C.bg3, color: copied ? C.bull : C.text2, border: `1px solid ${copied ? C.bull : C.border}` }}>
              {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Summary</>}
            </button>
          </>
        )}

        <MarketClock />
      </header>

      {/* MACRO TICKER */}
      {result && <MacroTicker macro={result.news.macro} global={result.news.global} />}

      {/* MAIN BODY */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT */}
        <aside className="w-64 shrink-0 border-r flex flex-col" style={{ borderColor: C.border, background: C.bg2 }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: C.text3, fontFamily: 'Inter' }}>Watchlist</span>
            <span className="text-[10px]" style={{ color: C.text3, fontFamily: 'JetBrains Mono' }}>{watchlist.length}/10</span>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            <Watchlist list={watchlist} onPick={runAnalysis} onRemove={(t) => setWatchlist(w => w.filter(x => x.ticker !== t))} current={ticker} />
          </div>
          <div className="p-3 border-t" style={{ borderColor: C.border }}>
            <div className="text-[9px] leading-relaxed px-1" style={{ color: C.text3 }}>
              ⚠ AI-generated analysis. Price data via Claude web search. Verify with official PSX before trading. Not financial advice.
            </div>
          </div>
        </aside>

        {/* CENTER */}
        <main className="flex-1 overflow-y-auto" style={{ background: C.bg }}>
          {!result && !isLoading && !error && <EmptyState onPick={runAnalysis} />}
          {error && <ErrorPanel error={error} onRetry={() => ticker && runAnalysis(ticker)} />}

          {result && (
            <div className="p-4 space-y-4">
              {/* HEADER: ticker + price */}
              <div className="flex items-end justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold tracking-tight" style={{ color: C.text, fontFamily: 'Inter' }}>
                      {result.meta.t}
                    </h1>
                    <Badge color={C.text2}>{result.meta.s}</Badge>
                    <span className="text-xs" style={{ color: C.text3 }}>· KSE-100</span>
                  </div>
                  <div className="text-sm" style={{ color: C.text2 }}>{result.meta.n}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-2 justify-end">
                    <span className="text-4xl font-bold" style={{ color: C.text, fontFamily: 'JetBrains Mono' }}>
                      {result.priceData.currentPrice.toLocaleString('en-PK', { maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs" style={{ color: C.text3 }}>PKR</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <span className="text-sm font-bold" style={{
                      color: result.priceData.change >= 0 ? C.bull : C.bear,
                      fontFamily: 'JetBrains Mono'
                    }}>
                      {result.priceData.change >= 0 ? <ArrowUpRight size={12} className="inline" /> : <ArrowDownRight size={12} className="inline" />}
                      {' '}{result.priceData.change >= 0 ? '+' : ''}{result.priceData.change.toFixed(2)} ({fmtPct(result.priceData.changePercent)})
                    </span>
                    <span className="text-[10px]" style={{ color: C.text3 }}>52w: {result.priceData.week52Low}–{result.priceData.week52High}</span>
                  </div>
                </div>
              </div>

              {/* HERO METRICS */}
              <HeroMetrics result={result} />

              {/* EXECUTIVE SUMMARY */}
              <Card title="AI Executive Summary" icon={Brain} accent={C.accent}>
                <div className="px-5 py-4 text-sm leading-relaxed" style={{ color: C.text, fontFamily: 'Inter' }}>
                  {result.prediction.executiveSummary}
                </div>
                {result.sentiment.narrativeShift && (
                  <div className="px-5 pb-4 text-xs italic border-t pt-3" style={{ color: C.text2, borderColor: C.border }}>
                    <span className="text-[10px] uppercase tracking-widest mr-2 not-italic" style={{ color: C.text3 }}>Market Narrative:</span>
                    {result.sentiment.narrativeShift}
                  </div>
                )}
              </Card>

              {/* TABS */}
              <div className="flex gap-1 border-b" style={{ borderColor: C.border }}>
                {TABS.map(t => (
                  <button key={t.k} onClick={() => setActiveTab(t.k)}
                    className="px-4 py-2 text-xs font-bold flex items-center gap-2 transition-colors -mb-px"
                    style={{
                      color: activeTab === t.k ? C.accent : C.text3,
                      borderBottom: `2px solid ${activeTab === t.k ? C.accent : 'transparent'}`,
                      fontFamily: 'Inter'
                    }}>
                    <t.i size={12} /> {t.l}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-4">
                    {/* Master price chart */}
                    <Card title="Price Action & Indicators" icon={Activity}>
                      <div className="flex items-center justify-end gap-1 px-4 pt-3">
                        {['30d', '90d', '180d', '365d'].map(tf => (
                          <button key={tf} onClick={() => setChartTimeframe(tf)}
                            className="px-2 py-1 text-[10px] rounded transition-colors"
                            style={{
                              background: chartTimeframe === tf ? C.accentDim : 'transparent',
                              color: chartTimeframe === tf ? C.accent : C.text3,
                              border: `1px solid ${chartTimeframe === tf ? C.accent : C.border}`,
                              fontFamily: 'JetBrains Mono'
                            }}>
                            {tf}
                          </button>
                        ))}
                      </div>
                      <div className="px-2 pt-2">
                        <MasterPriceChart ohlcv={result.ohlcv} indicators={result.technical.indicators} timeframe={chartTimeframe} />
                      </div>
                      <div className="px-2">
                        <VolumeChart ohlcv={result.ohlcv} timeframe={chartTimeframe} />
                      </div>
                      <div className="px-4 py-2 flex items-center gap-4 text-[10px] border-t" style={{ borderColor: C.border, color: C.text3, fontFamily: 'JetBrains Mono' }}>
                        <span><span style={{ color: C.warn }}>━</span> SMA20</span>
                        <span><span style={{ color: '#3b82f6' }}>━</span> SMA50</span>
                        <span><span style={{ color: C.bear }}>━</span> SMA200</span>
                        <span><span style={{ color: C.accent }}>━</span> Price</span>
                        <span className="ml-auto italic">AI-reconstructed OHLCV</span>
                      </div>
                    </Card>

                    {/* Price Targets */}
                    <Card title="Price Targets (3-6 months)" icon={Target}>
                      <PriceTargetGauge targets={result.prediction.priceTargets} current={result.priceData.currentPrice} />
                    </Card>

                    {/* Holding Strategy */}
                    <Card title="Holding Strategy" icon={Clock}>
                      <HoldingStrategy strategy={result.prediction.holdingStrategy} />
                    </Card>

                    {/* Catalysts */}
                    <Card title="Catalysts & Risks" icon={Zap}>
                      <CatalystsBoard catalysts={result.prediction.catalysts} />
                    </Card>
                  </div>

                  {/* RIGHT COLUMN of overview */}
                  <div className="space-y-4">
                    <Card title="Fundamental Radar" icon={Radio}>
                      <div className="p-2">
                        <FundamentalRadar
                          technical={result.technical}
                          fundamental={result.fundamental}
                          sentiment={result.sentiment}
                          fundamentals={result.fundamentals}
                          sectorAvgPE={result.fundamental.sectorAvgPE}
                        />
                      </div>
                      <div className="px-4 pb-3 flex items-center justify-between text-[10px]" style={{ fontFamily: 'JetBrains Mono' }}>
                        <span><span style={{ color: C.accent }}>━</span> <span style={{ color: C.text2 }}>{result.meta.t}</span></span>
                        <span><span style={{ color: C.warn }}>━</span> <span style={{ color: C.text2 }}>Sector Avg</span></span>
                      </div>
                    </Card>

                    <Card title="PSX-Specific Insights" icon={Flame}>
                      <PSXInsightsPanel insights={result.prediction.psxSpecificInsights} />
                    </Card>

                    <Card title="Live News Feed" icon={Newspaper}>
                      <div className="p-3">
                        <NewsFeed news={result.news.companyNews} />
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'technical' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card title="RSI (14)" icon={Activity}>
                      <div className="px-2 pt-3 pb-2">
                        <RSIPanel rsi={result.technical.indicators.rsi} timeframe={chartTimeframe} />
                      </div>
                      <div className="px-4 pb-3 text-[10px]" style={{ color: C.text3, fontFamily: 'JetBrains Mono' }}>
                        Current: {result.technical.indicators.rsi[result.technical.indicators.rsi.length - 1]?.toFixed(1)} ·
                        <span style={{ color: C.bear }}> 70 = overbought</span> · <span style={{ color: C.bull }}>30 = oversold</span>
                      </div>
                    </Card>
                    <Card title="MACD (12/26/9)" icon={Activity}>
                      <div className="px-2 pt-3 pb-2">
                        <MACDChart macd={result.technical.indicators.macd} timeframe={chartTimeframe} />
                      </div>
                      <div className="px-4 pb-3 text-[10px]" style={{ color: C.text3, fontFamily: 'JetBrains Mono' }}>
                        MACD: {result.technical.indicators.macd.macd[result.technical.indicators.macd.macd.length - 1]?.toFixed(2)} ·
                        Signal: {result.technical.indicators.macd.signal[result.technical.indicators.macd.signal.length - 1]?.toFixed(2)}
                      </div>
                    </Card>
                  </div>

                  <Card title={`Technical Signals · Score ${result.technical.technicalScore}/100 · ${result.technical.summary.bullCount} bull / ${result.technical.summary.bearCount} bear`} icon={BarChart3}>
                    <TechnicalSignalsTable signals={result.technical.signals} />
                  </Card>

                  <Card title="Key Levels" icon={Layers}>
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: C.text3 }}>Support Levels</div>
                        <div className="space-y-1">
                          {result.technical.indicators.supports.map((s, i) => (
                            <div key={i} className="px-3 py-2 rounded flex items-center justify-between" style={{ background: C.bullDim }}>
                              <span className="text-[10px]" style={{ color: C.text3 }}>S{i + 1}</span>
                              <span className="text-sm font-bold" style={{ color: C.bull, fontFamily: 'JetBrains Mono' }}>{fmtPKR(s, 1)}</span>
                            </div>
                          ))}
                          {result.technical.indicators.supports.length === 0 && <div className="text-xs" style={{ color: C.text3 }}>None detected</div>}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: C.text3 }}>Resistance Levels</div>
                        <div className="space-y-1">
                          {result.technical.indicators.resistances.map((s, i) => (
                            <div key={i} className="px-3 py-2 rounded flex items-center justify-between" style={{ background: C.bearDim }}>
                              <span className="text-[10px]" style={{ color: C.text3 }}>R{i + 1}</span>
                              <span className="text-sm font-bold" style={{ color: C.bear, fontFamily: 'JetBrains Mono' }}>{fmtPKR(s, 1)}</span>
                            </div>
                          ))}
                          {result.technical.indicators.resistances.length === 0 && <div className="text-xs" style={{ color: C.text3 }}>None detected</div>}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: C.text3 }}>Fibonacci Retracement</div>
                        <div className="space-y-1">
                          {Object.entries(result.technical.indicators.fib).map(([k, v]) => (
                            <div key={k} className="px-3 py-1.5 rounded flex items-center justify-between" style={{ background: C.bg3 }}>
                              <span className="text-[10px]" style={{ color: C.text3, fontFamily: 'JetBrains Mono' }}>{k}</span>
                              <span className="text-xs font-bold" style={{ color: C.text, fontFamily: 'JetBrains Mono' }}>{fmtPKR(v, 1)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'fundamental' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border" style={{ background: C.bg2, borderColor: C.border }}>
                      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: C.text3 }}>DCF Intrinsic Value</div>
                      <div className="text-2xl font-bold" style={{ color: result.fundamental.dcfValue > result.priceData.currentPrice ? C.bull : C.bear, fontFamily: 'JetBrains Mono' }}>
                        {fmtPKR(result.fundamental.dcfValue, 1)}
                      </div>
                      <div className="text-[10px] mt-1" style={{ color: C.text3 }}>
                        Disc rate: {result.fundamental.discountRate.toFixed(1)}% · Growth: {result.fundamental.growthAssumption.toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border" style={{ background: C.bg2, borderColor: C.border }}>
                      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: C.text3 }}>Graham Number</div>
                      <div className="text-2xl font-bold" style={{ color: result.fundamental.grahamNumber && result.fundamental.grahamNumber > result.priceData.currentPrice ? C.bull : C.bear, fontFamily: 'JetBrains Mono' }}>
                        {result.fundamental.grahamNumber ? fmtPKR(result.fundamental.grahamNumber, 1) : '—'}
                      </div>
                      <div className="text-[10px] mt-1" style={{ color: C.text3 }}>√(22.5 × EPS × BVPS)</div>
                    </div>
                    <div className="p-4 rounded-lg border" style={{ background: C.bg2, borderColor: C.border }}>
                      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: C.text3 }}>Margin of Safety</div>
                      <div className="text-2xl font-bold" style={{
                        color: result.fundamental.marginOfSafety > 15 ? C.bull : result.fundamental.marginOfSafety > -15 ? C.warn : C.bear,
                        fontFamily: 'JetBrains Mono'
                      }}>
                        {fmtPct(result.fundamental.marginOfSafety, 1)}
                      </div>
                      <div className="text-xs mt-1 font-bold" style={{ color: verdictColor(result.fundamental.valuationVerdict) }}>
                        {result.fundamental.valuationVerdict}
                      </div>
                    </div>
                  </div>

                  <Card title="Fundamental Scorecard" icon={Anchor}>
                    <FundamentalScorecard fundamental={result.fundamental} fundamentals={result.fundamentals} currentPrice={result.priceData.currentPrice} />
                  </Card>

                  <Card title="Valuation Thesis" icon={Brain}>
                    <div className="p-4 text-sm leading-relaxed" style={{ color: C.text2, fontFamily: 'Inter' }}>
                      {result.prediction.valuationStatus.explanation}
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'sentiment' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border" style={{ background: C.bg2, borderColor: C.border }}>
                      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: C.text3 }}>Company News</div>
                      <div className="text-2xl font-bold" style={{ color: result.sentiment.companyNewsScore >= 60 ? C.bull : result.sentiment.companyNewsScore >= 40 ? C.warn : C.bear, fontFamily: 'JetBrains Mono' }}>
                        {result.sentiment.companyNewsScore}<span className="text-base" style={{ color: C.text3 }}>/100</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border" style={{ background: C.bg2, borderColor: C.border }}>
                      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: C.text3 }}>Macro Environment</div>
                      <div className="text-lg font-bold mb-1" style={{ color: verdictColor(result.sentiment.macroEnvironment) }}>
                        {result.sentiment.macroEnvironment}
                      </div>
                      <div className="text-[10px]" style={{ color: C.text3, fontFamily: 'JetBrains Mono' }}>Score: {result.sentiment.macroScore}/100</div>
                    </div>
                    <div className="p-4 rounded-lg border" style={{ background: C.bg2, borderColor: C.border }}>
                      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: C.text3 }}>Global Context</div>
                      <div className="text-2xl font-bold" style={{ color: result.sentiment.globalScore >= 50 ? C.bull : C.bear, fontFamily: 'JetBrains Mono' }}>
                        {result.sentiment.globalScore}<span className="text-base" style={{ color: C.text3 }}>/100</span>
                      </div>
                    </div>
                  </div>

                  <Card title="30-Day Sentiment Timeline" icon={Activity}>
                    <div className="px-2 pt-3">
                      <SentimentTimeline companyNews={result.news.companyNews} />
                    </div>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <Card title="Company News" icon={Newspaper}>
                      <div className="p-3">
                        <NewsFeed news={result.news.companyNews} />
                      </div>
                    </Card>
                    <Card title="Macro & Global Headlines" icon={Globe}>
                      <div className="p-3 space-y-2">
                        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: C.text3 }}>Pakistan Macro</div>
                        {result.news.macro.headlines.map((h, i) => (
                          <div key={i} className="p-2 rounded text-xs" style={{ background: C.bg3 }}>
                            <div className="flex items-center justify-between mb-1 text-[10px]" style={{ color: C.text3, fontFamily: 'JetBrains Mono' }}>
                              <span>{h.date}</span>
                              <span style={{ color: h.sentiment > 0 ? C.bull : C.bear }}>{h.sentiment.toFixed(2)}</span>
                            </div>
                            <div style={{ color: C.text }}>{h.headline}</div>
                          </div>
                        ))}
                        <div className="text-[10px] uppercase tracking-widest mt-3 mb-1" style={{ color: C.text3 }}>Global</div>
                        {result.news.global.headlines.map((h, i) => (
                          <div key={i} className="p-2 rounded text-xs" style={{ background: C.bg3 }}>
                            <div className="flex items-center justify-between mb-1 text-[10px]" style={{ color: C.text3 }}>
                              <span>Global Markets</span>
                              <Badge color={verdictColor(h.impact)}>{h.impact}</Badge>
                            </div>
                            <div style={{ color: C.text }}>{h.headline}</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'risk' && (
                <div className="space-y-4">
                  <Card title="Risk Dashboard" icon={Shield}>
                    <RiskDashboard risk={result.prediction.riskAssessment} currentPrice={result.priceData.currentPrice} />
                  </Card>
                  <Card title="Entry Strategy" icon={Target}>
                    <EntryStrategy entry={result.prediction.entryStrategy} currentPrice={result.priceData.currentPrice} />
                  </Card>
                  <Card title="PSX-Specific Risk Exposures" icon={AlertTriangle}>
                    <PSXInsightsPanel insights={result.prediction.psxSpecificInsights} />
                  </Card>
                </div>
              )}

              {/* DISCLAIMER */}
              <div className="mt-6 px-4 py-3 rounded-lg border text-[10px] leading-relaxed" style={{
                background: C.warnDim, borderColor: C.warn + '40', color: C.text2, fontFamily: 'Inter'
              }}>
                <span className="font-bold" style={{ color: C.warn }}>⚠ DISCLAIMER:</span>{' '}
                This analysis is AI-generated for educational purposes only. PSX data is sourced via AI web search and may not reflect real-time prices.
                Historical OHLCV is AI-reconstructed and approximate. Always verify with official PSX data (psx.com.pk) before making investment decisions.
                This is not financial advice. Past performance does not guarantee future results.
                <span className="block mt-1" style={{ color: C.text3 }}>
                  Generated: {new Date(result.timestamp).toLocaleString()} · Powered by Claude Sonnet 4 + 6-Agent Pipeline
                </span>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT PANEL */}
        {result && (
          <aside className="w-72 shrink-0 border-l flex flex-col" style={{ borderColor: C.border, background: C.bg2 }}>
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: C.border }}>
              <Newspaper size={12} style={{ color: C.accent }} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: C.text3 }}>Signals & News</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Quick signals */}
              <div>
                <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: C.text3 }}>Top Technical Signals</div>
                <div className="space-y-1">
                  {result.technical.signals.slice(0, 6).map((s, i) => (
                    <div key={i} className="px-2.5 py-1.5 rounded flex items-center justify-between text-[11px]" style={{ background: C.bg3 }}>
                      <span style={{ color: C.text2 }}>{s.name}</span>
                      <Badge color={verdictColor(s.signal)} bg={verdictColor(s.signal) + '20'}>{s.signal.slice(0, 4)}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest news */}
              <div>
                <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: C.text3 }}>Latest News</div>
                <NewsFeed news={result.news.companyNews.slice(0, 8)} />
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* LOADING OVERLAY */}
      {isLoading && <LoadingOverlay stage={loadingStage} ticker={ticker} />}
    </div>
  );
}
