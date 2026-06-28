"use client";
import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp, TrendingDown, RefreshCw, Eye, Zap,
  AlertCircle, ChevronDown, ChevronUp, Sparkles,
  Activity, BarChart2, Users, Shield
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// ── Types ──────────────────────────────────────────────────────────────────
interface Transaction {
  stock: string;
  name: string;
  role: string;
  type: "Acquisition" | "Disposal";
  shares: number;
  price: number;
  value: number;
  date: string;
  directPct: number;
  indirectPct: number;
  totalPct: number;
  score: number;
  signal: "STRONG BUY" | "BUY" | "WATCH" | "SELL" | "STRONG SELL" | "NEUTRAL";
  signalColor: string;
  reasons: string[];
  annUrl?: string;
}

// ── Fallback demo data (shown if live fetch fails) ─────────────────────────
const DEMO_TRANSACTIONS: Transaction[] = [
  { stock:"INARI",   name:"Dato Tan Seng Leong",  role:"Managing Director",    type:"Acquisition", shares:2500000, price:3.42, value:8550000, date:"2025-04-17", directPct:12.48, indirectPct:2.10, totalPct:14.58, score:88, signal:"STRONG BUY", signalColor:"#00c897", reasons:["Very large buy >RM5M","C-Suite executive","Filed today"],            annUrl:"https://www.bursamalaysia.com/" },
  { stock:"MAYBANK", name:"Datuk Abdul Farid Alias",role:"Group President & CEO",type:"Acquisition", shares:500000,  price:9.58, value:4790000, date:"2025-04-16", directPct:0.02,  indirectPct:0.00, totalPct:0.02,  score:78, signal:"BUY",        signalColor:"#4caf7d", reasons:["Large buy >RM1M","C-Suite executive","Filed within 3 days"],       annUrl:"https://www.bursamalaysia.com/" },
  { stock:"HARTA",   name:"Kuan Mun Keng",          role:"Director",             type:"Acquisition", shares:3000000, price:2.82, value:8460000, date:"2025-04-17", directPct:5.14,  indirectPct:8.22, totalPct:13.36, score:85, signal:"STRONG BUY", signalColor:"#00c897", reasons:["Very large buy >RM5M","Substantial holder 13.4%","Filed today"],    annUrl:"https://www.bursamalaysia.com/" },
  { stock:"PCHEM",   name:"Tengku Muhammad Taufik", role:"President & CEO",      type:"Acquisition", shares:800000,  price:5.62, value:4496000, date:"2025-04-15", directPct:0.01,  indirectPct:0.00, totalPct:0.01,  score:74, signal:"BUY",        signalColor:"#4caf7d", reasons:["Large buy >RM1M","C-Suite executive"],                              annUrl:"https://www.bursamalaysia.com/" },
  { stock:"TOPGLOV", name:"Lim Cheong Guan",         role:"Executive Director",   type:"Disposal",    shares:5000000, price:0.945,value:4725000, date:"2025-04-16", directPct:3.20,  indirectPct:18.42,totalPct:21.62, score:22, signal:"SELL",       signalColor:"#ff5f6b", reasons:["Large sell >RM1M","Substantial holder 21.6%"],                      annUrl:"https://www.bursamalaysia.com/" },
  { stock:"IHH",     name:"Jill Margaret Watts",     role:"Non-Exec Director",    type:"Acquisition", shares:100000,  price:6.58, value:658000,  date:"2025-04-14", directPct:0.001, indirectPct:0.00, totalPct:0.001, score:58, signal:"WATCH",      signalColor:"#f5b942", reasons:["Meaningful buy >RM200K","Filed within 3 days"],                    annUrl:"https://www.bursamalaysia.com/" },
  { stock:"GENTING", name:"Lim Kok Thay",             role:"Executive Chairman",   type:"Acquisition", shares:4000000, price:4.22, value:16880000,date:"2025-04-15", directPct:31.40, indirectPct:14.80,totalPct:46.20, score:96, signal:"STRONG BUY", signalColor:"#00c897", reasons:["Very large buy >RM5M","Chairman","Substantial holder 46.2%"],       annUrl:"https://www.bursamalaysia.com/" },
  { stock:"CIMB",    name:"Datuk Mohd Nasir Ahmad",   role:"Group CEO",            type:"Disposal",    shares:1200000, price:7.44, value:8928000, date:"2025-04-13", directPct:0.03,  indirectPct:0.00, totalPct:0.03,  score:18, signal:"STRONG SELL",signalColor:"#ff3b4e", reasons:["Very large sell >RM5M","C-Suite executive"],                        annUrl:"https://www.bursamalaysia.com/" },
  { stock:"SIME",    name:"Dato Ahmad Zubir Murshid",  role:"Executive Director",   type:"Acquisition", shares:600000,  price:2.68, value:1608000, date:"2025-04-12", directPct:0.008, indirectPct:0.00, totalPct:0.008, score:62, signal:"WATCH",      signalColor:"#f5b942", reasons:["Meaningful buy >RM200K"],                                          annUrl:"https://www.bursamalaysia.com/" },
  { stock:"AXIATA",  name:"Vivek Sood",                role:"Group CEO",            type:"Acquisition", shares:1500000, price:2.48, value:3720000, date:"2025-04-11", directPct:0.016, indirectPct:0.00, totalPct:0.016, score:72, signal:"BUY",        signalColor:"#4caf7d", reasons:["Large buy >RM1M","C-Suite executive"],                              annUrl:"https://www.bursamalaysia.com/" },
];

// ── Signal badge ────────────────────────────────────────────────────────────
function SignalBadge({ signal, color }: { signal: string; color: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 20,
      background: `${color}18`, color, border: `1px solid ${color}40`,
      letterSpacing: "0.04em", flexShrink: 0,
    }}>{signal}</span>
  );
}

// ── Score ring ─────────────────────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 16, c = 2 * Math.PI * r;
  const fill = (score / 100) * c;
  return (
    <svg width={42} height={42} style={{ flexShrink: 0 }}>
      <circle cx={21} cy={21} r={r} fill="none" stroke="var(--border)" strokeWidth={3}/>
      <circle cx={21} cy={21} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={`${fill} ${c}`} strokeLinecap="round"
        transform="rotate(-90 21 21)"/>
      <text x={21} y={25} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{score}</text>
    </svg>
  );
}

// ── AI Analysis panel ──────────────────────────────────────────────────────
function AIAnalysis({ stock, transactions }: { stock: string; transactions: Transaction[] }) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const analyse = useCallback(async () => {
    setLoading(true);
    setAnalysis("");
    try {
      const res = await fetch("/api/insider-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock, transactions }),
      });
      const data = await res.json();
      setAnalysis(data.analysis || "No analysis returned.");
    } catch {
      setAnalysis("AI analysis unavailable. Check GROQ_API_KEY in Vercel settings.");
    }
    setLoading(false);
  }, [stock, transactions]);

  return (
    <div style={{ marginTop: 12, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
      {!analysis && !loading && (
        <button onClick={analyse} style={{
          display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700,
          color: "var(--accent)", background: "rgba(0,200,151,0.08)",
          border: "1px solid rgba(0,200,151,0.2)", borderRadius: 8, padding: "7px 12px",
          cursor: "pointer", fontFamily: "inherit",
        }}>
          <Sparkles size={13}/> Analyse with AI
        </button>
      )}
      {loading && (
        <div style={{ fontSize: 12, color: "var(--text3)", display: "flex", alignItems: "center", gap: 8 }}>
          <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }}/> Aria is analysing insider patterns…
        </div>
      )}
      {analysis && (
        <div style={{ background: "rgba(0,200,151,0.05)", border: "1px solid rgba(0,200,151,0.15)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={11}/> Aria — AI Signal Analysis
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{analysis}</div>
        </div>
      )}
    </div>
  );
}

// ── Stock group card ───────────────────────────────────────────────────────
function StockCard({ stock, txs }: { stock: string; txs: Transaction[] }) {
  const [expanded, setExpanded] = useState(false);
  const best     = txs.reduce((a, b) => (b.score > a.score ? b : a), txs[0]);
  const acqCount = txs.filter(t => t.type === "Acquisition").length;
  const dispCount = txs.filter(t => t.type === "Disposal").length;
  const totalVal  = txs.reduce((s, t) => s + t.value, 0);

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
          cursor: "pointer", background: best.type === "Acquisition" ? "rgba(0,200,151,0.04)" : "rgba(255,95,107,0.04)",
          borderBottom: expanded ? "1px solid var(--border)" : "none",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = best.type === "Acquisition" ? "rgba(0,200,151,0.08)" : "rgba(255,95,107,0.08)"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = best.type === "Acquisition" ? "rgba(0,200,151,0.04)" : "rgba(255,95,107,0.04)"}
      >
        <ScoreRing score={best.score} color={best.signalColor}/>

        {/* Logo */}
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--card2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
          <img
            src={`https://logo.clearbit.com/${stock.toLowerCase()}.com`}
            width={38} height={38} style={{ objectFit: "contain", padding: 4 }}
            alt={stock}
            onError={e => {
              const el = e.currentTarget as HTMLImageElement;
              el.style.display = "none";
              const p = el.parentElement;
              if (p) p.innerHTML = `<span style="font-size:12px;font-weight:800;color:var(--accent)">${stock.slice(0, 3)}</span>`;
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{stock}</span>
            <SignalBadge signal={best.signal} color={best.signalColor}/>
            <span style={{ fontSize: 10, color: "var(--text3)", background: "var(--card2)", padding: "2px 8px", borderRadius: 20 }}>
              {txs.length} transaction{txs.length > 1 ? "s" : ""}
            </span>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--text3)" }}>
            {acqCount > 0 && <span style={{ color: "var(--accent)" }}>↑ {acqCount} buy{acqCount > 1 ? "s" : ""}</span>}
            {dispCount > 0 && <span style={{ color: "var(--red)" }}>↓ {dispCount} sell{dispCount > 1 ? "s" : ""}</span>}
            <span>Total: RM {(totalVal / 1000000).toFixed(2)}M</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href={`/stock/${stock}`} onClick={e => e.stopPropagation()}
            style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--blue)", textDecoration: "none", padding: "5px 10px", borderRadius: 6, border: "1px solid rgba(77,159,255,0.3)", background: "rgba(77,159,255,0.08)" }}>
            <Eye size={11}/> View Stock
          </a>
          {expanded ? <ChevronUp size={16} color="var(--text3)"/> : <ChevronDown size={16} color="var(--text3)"/>}
        </div>
      </div>

      {/* Expanded transactions */}
      {expanded && (
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {txs.map((t, i) => (
              <div key={i} style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                padding: "12px 14px", borderRadius: 10,
                background: t.type === "Acquisition" ? "rgba(0,200,151,0.05)" : "rgba(255,95,107,0.05)",
                border: `1px solid ${t.type === "Acquisition" ? "rgba(0,200,151,0.15)" : "rgba(255,95,107,0.15)"}`,
              }}>
                <div style={{ paddingTop: 2 }}>
                  {t.type === "Acquisition"
                    ? <TrendingUp size={16} color="var(--accent)"/>
                    : <TrendingDown size={16} color="var(--red)"/>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{t.role} · {t.date}</div>
                    </div>
                    <SignalBadge signal={t.signal} color={t.signalColor}/>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 8 }}>
                    {[
                      { label: "Shares", value: t.shares.toLocaleString() },
                      { label: "Price",  value: t.price > 0 ? `RM ${t.price.toFixed(3)}` : "N/A" },
                      { label: "Value",  value: `RM ${(t.value/1000).toFixed(0)}K` },
                      { label: "Holding",value: `${t.totalPct.toFixed(2)}%` },
                    ].map(s => (
                      <div key={s.label} style={{ background: "var(--bg2)", borderRadius: 6, padding: "6px 8px" }}>
                        <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>{s.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", fontFamily: "Roboto Mono, monospace" }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                  {t.reasons.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {t.reasons.map(r => (
                        <span key={r} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: "var(--card2)", color: "var(--text3)", border: "1px solid var(--border)" }}>{r}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <AIAnalysis stock={stock} transactions={txs}/>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function InsiderIntelligence() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading]           = useState(true);
  const [isLive, setIsLive]             = useState(false);
  const [lastUpdated, setLastUpdated]   = useState("");
  const [filter, setFilter]             = useState<"all"|"buy"|"sell">("all");
  const [minScore, setMinScore]         = useState(0);
  const [sortBy, setSortBy]             = useState<"score"|"value"|"date">("score");
  const [error, setError]               = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/insider");
      const data = await res.json();
      if (data.transactions && data.transactions.length > 0) {
        setTransactions(data.transactions);
        setIsLive(data.dataLive);
        setLastUpdated(data.timestamp);
      } else {
        // Use demo data with a notice
        setTransactions(DEMO_TRANSACTIONS);
        setIsLive(false);
        setLastUpdated(new Date().toISOString());
        if (!data.dataLive) {
          setError("Live data temporarily unavailable — showing recent sample data. Bursa's public feed may be rate-limited.");
        }
      }
    } catch {
      setTransactions(DEMO_TRANSACTIONS);
      setIsLive(false);
      setLastUpdated(new Date().toISOString());
      setError("Could not reach data source. Showing sample insider transactions.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Filter + sort
  const filtered = transactions
    .filter(t => filter === "all" || (filter === "buy" && t.type === "Acquisition") || (filter === "sell" && t.type === "Disposal"))
    .filter(t => t.score >= minScore)
    .sort((a, b) => sortBy === "score" ? b.score - a.score : sortBy === "value" ? b.value - a.value : new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group by stock for display
  const grouped: Record<string, Transaction[]> = {};
  filtered.forEach(t => { (grouped[t.stock] = grouped[t.stock] || []).push(t); });

  // Stats
  const totalAcq   = transactions.filter(t => t.type === "Acquisition").length;
  const totalDisp  = transactions.filter(t => t.type === "Disposal").length;
  const totalValAcq = transactions.filter(t => t.type === "Acquisition").reduce((s, t) => s + t.value, 0);
  const highSignals = transactions.filter(t => t.score >= 70).length;

  // Bar chart data — signal distribution
  const signalDist = [
    { label: "Strong Buy", count: transactions.filter(t => t.signal === "STRONG BUY").length,  color: "#00c897" },
    { label: "Buy",        count: transactions.filter(t => t.signal === "BUY").length,          color: "#4caf7d" },
    { label: "Watch",      count: transactions.filter(t => t.signal === "WATCH").length,        color: "#f5b942" },
    { label: "Neutral",    count: transactions.filter(t => t.signal === "NEUTRAL").length,      color: "#8a96b0" },
    { label: "Sell",       count: transactions.filter(t => t.signal === "SELL").length,         color: "#ff5f6b" },
    { label: "Strong Sell",count: transactions.filter(t => t.signal === "STRONG SELL").length,  color: "#ff3b4e" },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: 1300 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: 0 }}>
                Bursa Insider Intelligence
              </h1>
              <span style={{
                fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20,
                background: "linear-gradient(135deg, rgba(0,200,151,0.2), rgba(77,159,255,0.2))",
                color: "var(--accent)", border: "1px solid rgba(0,200,151,0.3)",
                letterSpacing: "0.06em",
              }}>BETA · REAL DATA</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.6, maxWidth: 620 }}>
              Track every director dealing and substantial shareholder change filed on Bursa Malaysia in real-time. Each transaction is AI-scored for signal strength — the only tool built specifically for this data gap.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20,
              fontSize: 11, fontWeight: 700,
              background: isLive ? "rgba(0,200,151,0.12)" : "rgba(245,185,66,0.12)",
              border: `1px solid ${isLive ? "rgba(0,200,151,0.3)" : "rgba(245,185,66,0.3)"}`,
              color: isLive ? "var(--accent)" : "var(--gold)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: isLive ? "var(--accent)" : "var(--gold)", display: "inline-block" }}/>
              {isLive ? "Live · Bursa + i3investor" : "Sample Data"}
            </div>
            <button onClick={load} disabled={loading} className="btn-ghost"
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <RefreshCw size={12} style={{ animation: loading ? "spin 1s linear infinite" : "none" }}/>
              Refresh
            </button>
          </div>
        </div>

        {/* Error notice */}
        {error && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(245,185,66,0.08)", border: "1px solid rgba(245,185,66,0.25)", borderRadius: 8, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <AlertCircle size={14} color="var(--gold)" style={{ flexShrink: 0, marginTop: 1 }}/>
            <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5 }}>{error}</div>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Acquisitions",     value: totalAcq,                                         icon: TrendingUp,  color: "var(--accent)" },
          { label: "Disposals",         value: totalDisp,                                         icon: TrendingDown,color: "var(--red)"    },
          { label: "Buy Value (RM)",    value: `${(totalValAcq/1000000).toFixed(1)}M`,            icon: BarChart2,   color: "var(--blue)"   },
          { label: "High-Signal Alerts",value: highSignals,                                       icon: Zap,         color: "var(--gold)"   },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <s.icon size={18} color={s.color}/>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: "Roboto Mono, monospace" }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 16, marginBottom: 20 }}>
        {/* Signal distribution chart */}
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>Signal Distribution</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={signalDist} barSize={28}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false} width={20}/>
              <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}/>
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {signalDist.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.85}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* How it works */}
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
            <Shield size={14} color="var(--accent)"/> Signal Scoring
          </div>
          {[
            { score: "80–100", signal: "STRONG BUY", color: "#00c897", desc: "CEO/Chairman + large value" },
            { score: "65–79",  signal: "BUY",         color: "#4caf7d", desc: "Director + meaningful buy" },
            { score: "50–64",  signal: "WATCH",        color: "#f5b942", desc: "Monitor closely" },
            { score: "35–49",  signal: "SELL",         color: "#ff5f6b", desc: "Insider reducing stake" },
            { score: "0–34",   signal: "STRONG SELL",  color: "#ff3b4e", desc: "Major disposal signal" },
          ].map(r => (
            <div key={r.signal} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <span style={{ fontSize: 9, fontFamily: "Roboto Mono, monospace", color: "var(--text3)", width: 44 }}>{r.score}</span>
              <SignalBadge signal={r.signal} color={r.color}/>
              <span style={{ fontSize: 10, color: "var(--text3)" }}>{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {(["all", "buy", "sell"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: "none", cursor: "pointer", transition: "all 0.15s",
              background: filter === f ? (f === "buy" ? "var(--accent)" : f === "sell" ? "var(--red)" : "var(--blue)") : "var(--card)",
              color: filter === f ? "#000" : "var(--text2)",
            }}>
              {f === "all" ? "All Transactions" : f === "buy" ? "↑ Acquisitions" : "↓ Disposals"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>Min score:</span>
          {[0, 50, 65, 80].map(s => (
            <button key={s} onClick={() => setMinScore(s)} style={{
              padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
              border: "none", cursor: "pointer",
              background: minScore === s ? "var(--accent)" : "var(--card)",
              color: minScore === s ? "#000" : "var(--text2)",
            }}>{s === 0 ? "Any" : `${s}+`}</button>
          ))}
          <span style={{ width: 1, height: 20, background: "var(--border)", display: "inline-block" }}/>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>Sort:</span>
          {(["score", "value", "date"] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)} style={{
              padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
              border: "none", cursor: "pointer",
              background: sortBy === s ? "var(--purple)" : "var(--card)",
              color: sortBy === s ? "#fff" : "var(--text2)",
            }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>
        {Object.keys(grouped).length} stocks · {filtered.length} transactions · Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" }) : "—"} MYT
      </div>

      {/* Grouped stock cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text3)" }}>
          <RefreshCw size={28} style={{ margin: "0 auto 12px", display: "block", animation: "spin 1s linear infinite" }}/>
          <div style={{ fontSize: 13 }}>Fetching live Bursa insider transactions…</div>
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text3)" }}>
          <Activity size={28} style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }}/>
          <div style={{ fontSize: 13 }}>No transactions match your filters.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.entries(grouped).map(([stock, txs]) => (
            <StockCard key={stock} stock={stock} txs={txs}/>
          ))}
        </div>
      )}

      {/* Data source footer */}
      <div style={{ marginTop: 28, padding: "14px 18px", background: "rgba(77,159,255,0.06)", border: "1px solid rgba(77,159,255,0.15)", borderRadius: 10 }}>
        <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.8 }}>
          <strong style={{ color: "var(--blue)" }}>📡 Data Sources</strong> — Director dealings sourced from Bursa Malaysia's public announcement portal and i3investor's public insider feed. All transactions are mandated disclosures under Bursa Malaysia Main Market / ACE Market Listing Requirements (Chapter 14) and must be filed within 3 market days. Substantial shareholder changes are filed under Section 138 of the Companies Act 2016. Signal scores are algorithmic and for informational purposes only — not financial advice. Always verify via official Bursa Malaysia announcements at bursamalaysia.com.
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
