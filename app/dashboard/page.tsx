"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { MARKET_INDICES, KLCI_HISTORY, CORPORATE_ACTIONS } from "@/lib/data";
import { useLivePrices } from "@/lib/useLivePrices";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  TrendingUp, TrendingDown, ArrowRight, RefreshCw, Wifi, WifiOff,
  Newspaper, Eye, Search, Sparkles, Clock, ExternalLink, Zap
} from "lucide-react";

interface InsiderTx {
  stock: string; name: string; type: string; value: number;
  score: number; signal: string; signalColor: string;
}
interface NewsItem {
  title: string; link: string; source: string; color: string; pubDate: string;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function marketStatus() {
  const now = new Date();
  const myt = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }));
  const day = myt.getDay();
  const hour = myt.getHours();
  const min = myt.getMinutes();
  const mins = hour * 60 + min;
  const isWeekday = day >= 1 && day <= 5;
  const isOpen = isWeekday && mins >= 540 && mins <= 1020; // 9:00–17:00 MYT (approx incl lunch)
  return isOpen ? { label: "Bursa Malaysia is open", live: true } : { label: "Bursa Malaysia is closed", live: false };
}

export default function Dashboard() {
  const { stocks, loading, lastUpdated, refresh, isLive } = useLivePrices();
  const [search, setSearch] = useState("");
  const [insiderTop, setInsiderTop] = useState<InsiderTx[]>([]);
  const [newsTop, setNewsTop] = useState<NewsItem[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const status = marketStatus();

  const loadFeeds = useCallback(async () => {
    setFeedLoading(true);
    try {
      const [insRes, newsRes] = await Promise.all([
        fetch("/api/insider").then(r => r.json()).catch(() => null),
        fetch("/api/news").then(r => r.json()).catch(() => null),
      ]);
      if (insRes?.transactions?.length) setInsiderTop(insRes.transactions.slice(0, 4));
      if (newsRes?.items?.length) setNewsTop(newsRes.items.slice(0, 5));
    } catch { /* keep empty, sections will show fallback link */ }
    setFeedLoading(false);
  }, []);

  useEffect(() => { loadFeeds(); }, [loadFeeds]);

  const gainers = [...stocks].sort((a, b) => b.changePct - a.changePct).slice(0, 5);
  const losers  = [...stocks].sort((a, b) => a.changePct - b.changePct).slice(0, 5);
  const klci    = MARKET_INDICES[0];

  const fmtTime = lastUpdated ? new Date(lastUpdated).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" }) : null;

  return (
    <div className="fade-in" style={{ maxWidth: 1320, margin: "0 auto" }}>

      {/* ── Hero: greeting + big search, Google-homepage style ── */}
      <div style={{ textAlign: "center", padding: "28px 0 36px" }}>
        <div style={{ fontSize: 14, color: "var(--text2)", fontWeight: 500, marginBottom: 6 }}>
          {greeting()} · {new Date().toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long" })}
        </div>
        <h1 style={{
          fontSize: 38, fontWeight: 700, marginBottom: 18,
          fontFamily: "'Google Sans', Roboto, sans-serif",
        }}>
          <span style={{ color: "var(--blue)" }}>Bursa</span><span style={{ color: "var(--accent)" }}>Mind</span>
        </h1>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <form onSubmit={e => { e.preventDefault(); if (search.trim()) window.location.href = `/stock/${search.trim().toUpperCase()}`; }}>
            <div style={{ position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}/>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search any Bursa stock — try MAYBANK, TENAGA, INARI…"
                style={{
                  width: "100%", padding: "15px 20px 15px 48px", borderRadius: 28,
                  border: "1px solid var(--border2)", fontSize: 15, outline: "none",
                  boxShadow: "0 1px 6px rgba(32,33,36,0.12)", fontFamily: "inherit",
                  transition: "box-shadow 0.15s",
                }}
                onFocus={e => (e.target as HTMLInputElement).style.boxShadow = "0 2px 10px rgba(32,33,36,0.2)"}
                onBlur={e => (e.target as HTMLInputElement).style.boxShadow = "0 1px 6px rgba(32,33,36,0.12)"}
              />
            </div>
          </form>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
            {["MAYBANK","TENAGA","INARI","GENTING","IHH"].map(s => (
              <Link key={s} href={`/stock/${s}`} className="btn-ghost" style={{ textDecoration: "none", fontSize: 12, padding: "6px 14px" }}>{s}</Link>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 22 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: status.live ? "var(--accent)" : "var(--text3)", boxShadow: status.live ? "0 0 0 3px #e6f4ea" : "none" }}/>
          <span style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500 }}>{status.label}</span>
          <span style={{ color: "var(--border2)" }}>·</span>
          <span style={{ fontSize: 13, color: isLive ? "var(--accent)" : "var(--gold)", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
            {isLive ? <Wifi size={12}/> : <WifiOff size={12}/>} {isLive ? `Live prices${fmtTime ? " · " + fmtTime + " MYT" : ""}` : "Demo data"}
          </span>
          <button onClick={refresh} disabled={loading} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex", alignItems: "center" }}>
            <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }}/>
          </button>
        </div>
      </div>

      {/* ── Hero index card: FBM KLCI big chart, Google Finance style ── */}
      <div className="card" style={{ marginBottom: 20, padding: "24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500, marginBottom: 4 }}>{klci.name} · Bursa Malaysia</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 36, fontWeight: 700, fontFamily: "Roboto Mono, monospace" }}>{klci.value.toLocaleString()}</span>
              <span style={{ fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }} className={klci.changePct >= 0 ? "pos" : "neg"}>
                {klci.changePct >= 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                {klci.changePct >= 0 ? "+" : ""}{klci.change.toFixed(2)} ({klci.changePct >= 0 ? "+" : ""}{klci.changePct.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["1W","1M","3M","1Y"].map((p,i) => (
              <button key={p} style={{
                padding: "5px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                background: i === 1 ? "#e8f0fe" : "transparent", color: i === 1 ? "var(--blue)" : "var(--text3)",
              }}>{p}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={KLCI_HISTORY} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="klciGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.18}/>
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text3)" }} interval={9} axisLine={false} tickLine={false}/>
            <YAxis domain={["auto","auto"]} tick={{ fontSize: 11, fill: "var(--text3)" }} axisLine={false} tickLine={false} width={50}/>
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}/>
            <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2.5} fill="url(#klciGrad)"/>
          </AreaChart>
        </ResponsiveContainer>

        {/* Mini index strip below the hero chart */}
        <div style={{ display: "flex", gap: 0, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
          {MARKET_INDICES.slice(1).map((idx, i) => (
            <div key={idx.name} style={{ flex: 1, padding: "0 20px", borderLeft: i > 0 ? "1px solid var(--border)" : "none", minWidth: 140 }}>
              <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 500, marginBottom: 3 }}>{idx.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "Roboto Mono, monospace" }}>{idx.value.toLocaleString()}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }} className={idx.changePct >= 0 ? "pos" : "neg"}>
                  {idx.changePct >= 0 ? "+" : ""}{idx.changePct.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main grid: movers (left) + insider & news feed (right) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, marginBottom: 20 }}>

        {/* Movers */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
            <div style={{ flex: 1, padding: "16px 20px 14px", borderRight: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700 }}>
                <TrendingUp size={15} color="var(--accent)"/> Top Gainers
              </div>
            </div>
            <div style={{ flex: 1, padding: "16px 20px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700 }}>
                <TrendingDown size={15} color="var(--red)"/> Top Losers
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ borderRight: "1px solid var(--border)" }}>
              {gainers.map(s => (
                <Link key={s.symbol} href={`/stock/${s.symbol}`} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 20px", textDecoration: "none", borderBottom: "1px solid var(--border)",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{s.symbol}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Roboto Mono, monospace" }}>RM {s.price.toFixed(3)}</div>
                  </div>
                  <span className="tag-green">+{s.changePct.toFixed(2)}%</span>
                </Link>
              ))}
            </div>
            <div>
              {losers.map(s => (
                <Link key={s.symbol} href={`/stock/${s.symbol}`} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 20px", textDecoration: "none", borderBottom: "1px solid var(--border)",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{s.symbol}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Roboto Mono, monospace" }}>RM {s.price.toFixed(3)}</div>
                  </div>
                  <span className="tag-red">{s.changePct.toFixed(2)}%</span>
                </Link>
              ))}
            </div>
          </div>
          <Link href="/movers" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px", fontSize: 12, fontWeight: 600, color: "var(--blue)", textDecoration: "none", borderTop: "1px solid var(--border)" }}>
            View all market movers <ArrowRight size={13}/>
          </Link>
        </div>

        {/* Right column: insider + news live feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Insider feed */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700 }}>
                <Eye size={14} color="var(--purple)"/> Insider Activity
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 20, background: "#fef7e0", color: "var(--gold)" }}>LIVE</span>
            </div>
            <div>
              {feedLoading ? (
                <div style={{ padding: "20px", textAlign: "center", fontSize: 12, color: "var(--text3)" }}>Loading…</div>
              ) : insiderTop.length === 0 ? (
                <div style={{ padding: "16px 18px", fontSize: 12, color: "var(--text3)" }}>No recent signals.</div>
              ) : insiderTop.map((t, i) => (
                <div key={i} style={{ padding: "11px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{t.stock}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>{t.name?.slice(0, 22)} · RM{(t.value/1000).toFixed(0)}K</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 20, background: `${t.signalColor}18`, color: t.signalColor }}>{t.signal}</span>
                </div>
              ))}
            </div>
            <Link href="/insider" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px", fontSize: 12, fontWeight: 600, color: "var(--blue)", textDecoration: "none", borderTop: "1px solid var(--border)" }}>
              Full Insider Intel <ArrowRight size={12}/>
            </Link>
          </div>

          {/* News feed */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700 }}>
              <Newspaper size={14} color="var(--blue)"/> Latest News
            </div>
            <div>
              {feedLoading ? (
                <div style={{ padding: "20px", textAlign: "center", fontSize: 12, color: "var(--text3)" }}>Loading…</div>
              ) : newsTop.length === 0 ? (
                <div style={{ padding: "16px 18px", fontSize: 12, color: "var(--text3)" }}>Feed unavailable. <a href="https://theedgemarkets.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)" }}>Visit The Edge →</a></div>
              ) : newsTop.map((n, i) => (
                <a key={i} href={n.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "11px 18px", borderBottom: "1px solid var(--border)", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", lineHeight: 1.4, marginBottom: 4 }}>{n.title.slice(0, 80)}{n.title.length > 80 ? "…" : ""}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ color: n.color, fontWeight: 700 }}>{n.source}</span>
                  </div>
                </a>
              ))}
            </div>
            <Link href="/news" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px", fontSize: 12, fontWeight: 600, color: "var(--blue)", textDecoration: "none", borderTop: "1px solid var(--border)" }}>
              Open News Hub <ArrowRight size={12}/>
            </Link>
          </div>
        </div>
      </div>

      {/* Corporate actions */}
      <div className="card" style={{ marginBottom: 20, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700 }}>
            <Zap size={15} color="var(--gold)"/> Upcoming Corporate Actions
          </div>
          <Link href="/market" style={{ fontSize: 12, color: "var(--blue)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
            View all <ArrowRight size={12}/>
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {CORPORATE_ACTIONS.slice(0, 6).map((a, i) => (
            <div key={i} style={{ padding: "14px 20px", borderBottom: i < 3 ? "1px solid var(--border)" : "none", borderRight: (i % 3 !== 2) ? "1px solid var(--border)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className={a.action === "Dividend" ? "tag-green" : a.action === "AGM" ? "tag-blue" : "tag-gold"}>{a.action}</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{a.company}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 3 }}>{a.detail}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", display: "flex", alignItems: "center", gap: 4 }}>
                <Clock size={10}/> Ex-Date: {a.exDate}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick action tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[
          { href: "/chat",             label: "Ask Aria AI",      sub: "Get instant insights",       icon: Sparkles, color: "var(--blue)"   },
          { href: "/markets/malaysia", label: "Live Markets",     sub: "Full Bursa screener",         icon: TrendingUp, color: "var(--accent)" },
          { href: "/insider",          label: "Insider Intel",    sub: "Director dealings",           icon: Eye, color: "var(--purple)" },
          { href: "/news",             label: "News Hub",         sub: "Headlines & social",           icon: Newspaper, color: "var(--gold)"   },
        ].map(item => (
          <Link key={item.href} href={item.href} className="card" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14, padding: "18px 20px" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${item.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <item.icon size={19} color={item.color}/>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{item.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
