"use client";
import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw, ExternalLink, Wifi, WifiOff,
  Newspaper, Globe, Building2, TrendingUp,
  AlertCircle, Clock, Search
} from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  color: string;
  summary: string;
  isBursaRelated: boolean;
}

// ── Twitter / X embed (official embed, no API key) ─────────────────────────
function XFeed() {
  useEffect(() => {
    // Load Twitter widget script
    const existing = document.getElementById("twitter-wjs");
    if (!existing) {
      const s = document.createElement("script");
      s.id = "twitter-wjs";
      s.src = "https://platform.twitter.com/widgets.js";
      s.async = true;
      document.head.appendChild(s);
    } else {
      // Re-trigger widget loading for SPA navigation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).twttr?.widgets?.load();
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Bursa Malaysia official account */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#1d9bf0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> @BursaMalaysia
        </div>
        <a
          className="twitter-timeline"
          data-theme="dark"
          data-height="360"
          data-chrome="noheader nofooter noborders transparent"
          href="https://twitter.com/BursaMalaysia"
        >
          Tweets by @BursaMalaysia
        </a>
      </div>

      {/* The Edge Markets */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#1d9bf0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> @theedgemarkets
        </div>
        <a
          className="twitter-timeline"
          data-theme="dark"
          data-height="360"
          data-chrome="noheader nofooter noborders transparent"
          href="https://twitter.com/theedgemarkets"
        >
          Tweets by @theedgemarkets
        </a>
      </div>

      {/* KLSE Screener / Malaysia Finance community */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#1d9bf0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> @KinibizMY
        </div>
        <a
          className="twitter-timeline"
          data-theme="dark"
          data-height="360"
          data-chrome="noheader nofooter noborders transparent"
          href="https://twitter.com/KinibizMY"
        >
          Tweets by @KinibizMY
        </a>
      </div>
    </div>
  );
}

// ── Bursa Official iframe embed ────────────────────────────────────────────
function BursaOfficialSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[
        {
          label: "Company Announcements",
          url: "https://www.bursamalaysia.com/market_information/announcements/company_announcement",
          desc: "Official real-time filings — quarterly results, dividends, AGM notices, material disclosures",
          icon: Building2, color: "var(--gold)"
        },
        {
          label: "Bursa Research Reports",
          url: "https://www.bursamalaysia.com/market_information/research",
          desc: "In-house research analysis and market insights published by Bursa Malaysia",
          icon: TrendingUp, color: "var(--accent)"
        },
        {
          label: "Daily Market Summary",
          url: "https://www.bursamalaysia.com/market_information/equities_prices",
          desc: "Official end-of-day prices, market statistics, and trading data",
          icon: Globe, color: "var(--blue)"
        },
        {
          label: "Corporate Actions Calendar",
          url: "https://www.bursamalaysia.com/market_information/announcements/entitlement_by_ex-date",
          desc: "Ex-dates, dividends, rights issues, bonus shares for all Bursa-listed companies",
          icon: Clock, color: "var(--purple)"
        },
        {
          label: "Bursa Media Releases",
          url: "https://bursa.listedcompany.com/newsroom.html",
          desc: "Press releases, speeches, and official communications from Bursa Malaysia",
          icon: Newspaper, color: "var(--red)"
        },
        {
          label: "Market Statistics",
          url: "https://www.bursamalaysia.com/market_information/market_statistics/securities",
          desc: "Advancing/declining stocks, volume leaders, value leaders, short-selling data",
          icon: TrendingUp, color: "var(--accent)"
        },
      ].map(item => (
        <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: "var(--card2)", borderRadius: 10, border: "1px solid var(--border)", textDecoration: "none", transition: "all 0.15s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = item.color; (e.currentTarget as HTMLElement).style.background = "var(--bg2)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.background = "var(--card2)"; }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <item.icon size={16} color={item.color}/>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.5 }}>{item.desc}</div>
          </div>
          <ExternalLink size={12} color="var(--text3)" style={{ marginLeft: "auto", flexShrink: 0, marginTop: 2 }}/>
        </a>
      ))}
    </div>
  );
}

// ── News card ──────────────────────────────────────────────────────────────
function NewsCard({ item }: { item: NewsItem }) {
  const timeAgo = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const m = Math.floor(diff / 60000);
      if (m < 60)  return `${m}m ago`;
      const h = Math.floor(m / 60);
      if (h < 24)  return `${h}h ago`;
      return `${Math.floor(h/24)}d ago`;
    } catch { return ""; }
  };

  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer"
      style={{ display: "block", padding: "14px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, textDecoration: "none", transition: "all 0.15s", borderLeft: `3px solid ${item.color}` }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--card2)"; (e.currentTarget as HTMLElement).style.transform = "translateX(2px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--card)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.5, flex: 1 }}>{item.title}</div>
        <ExternalLink size={12} color="var(--text3)" style={{ flexShrink: 0, marginTop: 2 }}/>
      </div>
      {item.summary && (
        <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.6, marginBottom: 8 }}>
          {item.summary.slice(0, 140)}{item.summary.length > 140 ? "…" : ""}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: `${item.color}18`, color: item.color }}>
          {item.source}
        </span>
        {item.pubDate && (
          <span style={{ fontSize: 10, color: "var(--text3)" }}>{timeAgo(item.pubDate)}</span>
        )}
        {item.isBursaRelated && (
          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 20, background: "rgba(0,200,151,0.1)", color: "var(--accent)" }}>Bursa</span>
        )}
      </div>
    </a>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function NewsHub() {
  const [news, setNews]         = useState<NewsItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [isLive, setIsLive]     = useState(false);
  const [filter, setFilter]     = useState<"all"|"bursa">("bursa");
  const [search, setSearch]     = useState("");
  const [tab, setTab]           = useState<"news"|"social"|"bursa">("news");
  const [error, setError]       = useState("");
  const [lastUpdated, setLast]  = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/news");
      const data = await res.json();
      if (data.items?.length > 0) {
        setNews(data.items);
        setIsLive(data.sourcesLive > 0);
        setLast(data.timestamp);
      } else {
        setError("News feeds temporarily unavailable. Check links in Bursa Official section.");
        setIsLive(false);
      }
    } catch {
      setError("Could not load news feeds.");
      setIsLive(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = news
    .filter(n => filter === "all" || n.isBursaRelated)
    .filter(n => search === "" ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.source.toLowerCase().includes(search.toLowerCase())
    );

  const bySource: Record<string, number> = {};
  news.forEach(n => { bySource[n.source] = (bySource[n.source] || 0) + 1; });

  return (
    <div className="fade-in" style={{ maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
            Bursa Malaysia News Hub
          </h1>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>
            One place for Bursa news, market tweets, official announcements, and research — all live
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: isLive ? "rgba(0,200,151,0.12)" : "rgba(245,185,66,0.12)", border: `1px solid ${isLive ? "rgba(0,200,151,0.3)" : "rgba(245,185,66,0.3)"}`, color: isLive ? "var(--accent)" : "var(--gold)" }}>
            {isLive ? <Wifi size={11}/> : <WifiOff size={11}/>}
            {isLive ? "Live feeds" : "Feeds offline"}
          </div>
          <button onClick={load} disabled={loading} className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <RefreshCw size={12} style={{ animation: loading ? "spin 1s linear infinite" : "none" }}/> Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
        {[
          { key: "news",   label: "📰 Market News",          desc: "RSS feeds" },
          { key: "social", label: "𝕏 Social Feed",           desc: "Twitter/X" },
          { key: "bursa",  label: "🏛️ Bursa Official",       desc: "Direct links" },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            style={{
              padding: "10px 18px", borderRadius: "8px 8px 0 0", fontSize: 13, fontWeight: 600,
              border: "1px solid var(--border)", borderBottom: tab === t.key ? "1px solid var(--bg)" : "1px solid var(--border)",
              cursor: "pointer", background: tab === t.key ? "var(--bg)" : "var(--card2)",
              color: tab === t.key ? "var(--accent)" : "var(--text2)",
              marginBottom: tab === t.key ? "-1px" : "0",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── NEWS TAB ── */}
      {tab === "news" && (
        <div>
          {/* Controls */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
              <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}/>
              <input className="input" placeholder="Search news…" value={search}
                onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, fontSize: 13 }}/>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[{k:"bursa",l:"Bursa Relevant"},{k:"all",l:"All News"}].map(f => (
                <button key={f.k} onClick={() => setFilter(f.k as "all"|"bursa")} style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", background: filter === f.k ? "var(--accent)" : "var(--card)", color: filter === f.k ? "#000" : "var(--text2)" }}>{f.l}</button>
              ))}
            </div>
            {lastUpdated && (
              <span style={{ fontSize: 11, color: "var(--text3)", marginLeft: "auto" }}>
                Updated: {new Date(lastUpdated).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })} MYT
              </span>
            )}
          </div>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(245,185,66,0.08)", border: "1px solid rgba(245,185,66,0.25)", borderRadius: 8, display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 16 }}>
              <AlertCircle size={14} color="var(--gold)" style={{ flexShrink: 0, marginTop: 1 }}/>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>{error} <a href="https://www.theedgemarkets.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Visit The Edge Markets directly →</a></div>
            </div>
          )}

          {/* Source pills */}
          {!loading && Object.keys(bySource).length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {Object.entries(bySource).map(([src, count]) => (
                <span key={src} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "var(--card2)", color: "var(--text3)", border: "1px solid var(--border)" }}>
                  {src} · {count}
                </span>
              ))}
            </div>
          )}

          <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>
            {loading ? "Loading…" : `${filtered.length} articles`}
          </div>

          {/* News grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text3)" }}>
              <RefreshCw size={28} style={{ margin: "0 auto 12px", display: "block", animation: "spin 1s linear infinite" }}/>
              <div style={{ fontSize: 13 }}>Fetching live news from The Edge, The Star, Bernama…</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
              {filtered.map((item, i) => <NewsCard key={i} item={item}/>)}
            </div>
          )}

          {!loading && filtered.length === 0 && !error && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text3)" }}>
              <Newspaper size={28} style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }}/>
              <div>No articles match your filters</div>
            </div>
          )}
        </div>
      )}

      {/* ── SOCIAL TAB ── */}
      {tab === "social" && (
        <div>
          <div style={{ padding: "12px 16px", background: "rgba(29,155,240,0.08)", border: "1px solid rgba(29,155,240,0.2)", borderRadius: 10, marginBottom: 20, fontSize: 12, color: "var(--text3)", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1d9bf0" style={{ flexShrink: 0 }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Live Twitter/X timelines — official Bursa Malaysia, The Edge Markets, and Kinibiz feeds embedded directly.
            Twitter loads may take a few seconds. If blocked, use the direct links below.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { handle: "BursaMalaysia",  label: "Bursa Malaysia Official", color: "#f5b942", desc: "Exchange news, trading updates, listings" },
              { handle: "theedgemarkets", label: "The Edge Markets",         color: "#ff9f3f", desc: "Malaysia's top financial newspaper" },
              { handle: "KinibizMY",      label: "KiniBiz Malaysia",         color: "#4d9fff", desc: "Business & markets news in Malaysia" },
            ].map(t => (
              <div key={t.handle} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                {/* Header */}
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, background: "var(--card2)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${t.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={t.color}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>@{t.handle}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>{t.desc}</div>
                  </div>
                  <a href={`https://x.com/${t.handle}`} target="_blank" rel="noopener noreferrer"
                    style={{ marginLeft: "auto", fontSize: 10, color: t.color, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                    Open <ExternalLink size={10}/>
                  </a>
                </div>
                {/* Embed */}
                <div style={{ padding: "8px", minHeight: 400 }}>
                  <a
                    className="twitter-timeline"
                    data-theme="dark"
                    data-height="400"
                    data-chrome="noheader nofooter noborders transparent"
                    data-tweet-limit="5"
                    href={`https://twitter.com/${t.handle}`}
                    style={{ fontSize: 12, color: "var(--text3)" }}
                  >
                    Loading @{t.handle}…
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Additional accounts */}
          <div style={{ marginTop: 20, padding: "16px 18px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>More Bursa Market Accounts</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                { handle:"StarBizMY",      desc:"The Star Business"      },
                { handle:"BernaMalaysia",  desc:"Bernama News"           },
                { handle:"NST_Online",     desc:"New Straits Times"      },
                { handle:"MalayMailNews",  desc:"Malay Mail Business"    },
                { handle:"i3investorKLSE", desc:"i3investor Community"   },
                { handle:"MalaysiaKini",   desc:"Malaysiakini Business"  },
                { handle:"DuitNowMY",      desc:"Personal Finance MY"    },
                { handle:"RinggitPlus",    desc:"Ringgit Plus Finance"   },
              ].map(a => (
                <a key={a.handle} href={`https://x.com/${a.handle}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "var(--card2)", borderRadius: 8, border: "1px solid var(--border)", textDecoration: "none", transition: "all 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1d9bf0"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#1d9bf0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>@{a.handle}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>{a.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BURSA OFFICIAL TAB ── */}
      {tab === "bursa" && (
        <div>
          <div style={{ padding: "12px 16px", background: "rgba(245,185,66,0.08)", border: "1px solid rgba(245,185,66,0.2)", borderRadius: 10, marginBottom: 20, fontSize: 12, color: "var(--text3)", display: "flex", alignItems: "center", gap: 8 }}>
            <Building2 size={14} color="var(--gold)" style={{ flexShrink: 0 }}/>
            Direct links to official Bursa Malaysia data sources — all free, no login required for most sections.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Building2 size={14} color="var(--gold)"/> Market Data & Announcements
              </div>
              <BursaOfficialSection/>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingUp size={14} color="var(--accent)"/> Research & Analysis
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label:"Bursa In-House Research",    url:"https://www.bursamalaysia.com/market_information/research",                 desc:"Free analysis and market commentary from Bursa Malaysia's research team", color:"var(--accent)" },
                  { label:"Maybank IB Research",        url:"https://www.maybank-ke.com.my/Research/Home",                              desc:"Free equity research on Bursa-listed stocks", color:"var(--blue)" },
                  { label:"Kenanga Research",           url:"https://www.kenangaonline.com.my/research",                               desc:"ACE & Main Market coverage, daily reports", color:"var(--blue)" },
                  { label:"RHB Research Portal",        url:"https://research.rhbtradesmart.com/",                                      desc:"Malaysian equity research and sector notes", color:"var(--blue)" },
                  { label:"SC Shariah List",            url:"https://www.sc.com.my/regulation/guidelines/securities-laws/list-of-shariah-compliant-securities", desc:"Updated bi-annually — official Shariah-compliant stocks", color:"var(--accent)" },
                  { label:"BNM Publications",           url:"https://www.bnm.gov.my/publications",                                     desc:"OPR decisions, FSR, monetary policy statements", color:"var(--purple)" },
                  { label:"i3investor Insider Feed",    url:"https://klse.i3investor.com/web/insider/director/list",                   desc:"Director dealings and substantial shareholder changes", color:"var(--gold)" },
                  { label:"SSRN Bursa Research Papers", url:"https://papers.ssrn.com/sol3/results.cfm?RequestTimeout=50000000&txtkey=bursa+malaysia", desc:"Free academic papers on Bursa Malaysia", color:"var(--text3)" },
                ].map(item => (
                  <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "var(--card2)", borderRadius: 8, border: "1px solid var(--border)", textDecoration: "none", transition: "all 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = item.color; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{item.desc}</div>
                    </div>
                    <ExternalLink size={12} color="var(--text3)" style={{ flexShrink: 0, marginTop: 2 }}/>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
