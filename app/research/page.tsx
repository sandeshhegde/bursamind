"use client";
import { useState } from "react";
import { ExternalLink, Search, BookOpen, Building2, TrendingUp, Globe, FileText, Newspaper } from "lucide-react";

interface Source {
  name: string;
  org: string;
  description: string;
  snippet: string;
  url: string;
  logoUrl: string;
  bgColor: string;
  accentColor: string;
  type: "Official" | "Bank" | "Academic" | "Data" | "News";
  tags: string[];
  badge?: string;
}

const SOURCES: Source[] = [
  // ── OFFICIAL ──
  {
    name: "Company Announcements",
    org: "Bursa Malaysia",
    description: "All official company announcements, quarterly results, annual reports, and material disclosures.",
    snippet: "Access every Bursa-listed company's filings in real-time. Filter by type: financial results, AGM notices, prospectuses, dividends.",
    url: "https://www.bursamalaysia.com/market_information/announcements/company_announcement",
    logoUrl: "https://logo.clearbit.com/bursamalaysia.com",
    bgColor: "#0a1628", accentColor: "#e8b84b",
    type: "Official", badge: "Primary Source",
    tags: ["Announcements", "Quarterly Results", "Annual Reports", "Free"],
  },
  {
    name: "Securities Commission Malaysia",
    org: "SC Malaysia",
    description: "Enforcement actions, Shariah screening list, licensing registers, investor education and capital market research.",
    snippet: "The SC publishes the bi-annual Shariah-compliant securities list — essential for Islamic investing on Bursa Malaysia.",
    url: "https://www.sc.com.my/",
    logoUrl: "https://logo.clearbit.com/sc.com.my",
    bgColor: "#0d1a10", accentColor: "#4caf7d",
    type: "Official", badge: "Regulatory",
    tags: ["Shariah List", "Regulatory", "Enforcement", "Free"],
  },
  {
    name: "Publications & Research",
    org: "Bank Negara Malaysia",
    description: "Monetary policy statements, Financial Stability Reviews, BNM Annual Report, interest rate decisions, financial data.",
    snippet: "BNM's Financial Stability Review provides deep analysis on banking sector health, household debt, and systemic risks in Malaysia.",
    url: "https://www.bnm.gov.my/publications",
    logoUrl: "https://logo.clearbit.com/bnm.gov.my",
    bgColor: "#100d1a", accentColor: "#9b73f8",
    type: "Official", badge: "Central Bank",
    tags: ["Monetary Policy", "FSR", "Interest Rates", "Free"],
  },
  {
    name: "Economic Statistics",
    org: "DOSM Malaysia",
    description: "Official GDP, CPI, trade data, employment and population statistics for Malaysia.",
    snippet: "Monthly and quarterly economic indicators — GDP growth, inflation (CPI), external trade, industrial production index.",
    url: "https://www.dosm.gov.my/",
    logoUrl: "https://logo.clearbit.com/dosm.gov.my",
    bgColor: "#0d1520", accentColor: "#4d9fff",
    type: "Official",
    tags: ["GDP", "CPI", "Trade Data", "Free"],
  },

  // ── BANK & BROKER ──
  {
    name: "Maybank IB Research",
    org: "Maybank Investment Bank",
    description: "Equity research reports on Bursa-listed stocks, sector notes, economic outlook. Malaysia's largest broker research team.",
    snippet: "Coverage includes FBM KLCI constituents, plantation sector, banking deep-dives, regional comparisons. Some reports freely accessible.",
    url: "https://www.maybank-ke.com.my/Research/Home",
    logoUrl: "https://logo.clearbit.com/maybank.com",
    bgColor: "#1a0d0d", accentColor: "#ff9f3f",
    type: "Bank", badge: "Top Broker",
    tags: ["Equity Research", "Sector Notes", "Free Access"],
  },
  {
    name: "RHB Research",
    org: "RHB Investment Bank",
    description: "Research notes on Malaysian equities, REITs, and fixed income. Strong coverage of mid-cap Bursa stocks.",
    snippet: "RHB Research covers 150+ Bursa stocks with buy/sell/hold ratings, target prices, and quarterly earnings previews.",
    url: "https://research.rhbtradesmart.com/",
    logoUrl: "https://logo.clearbit.com/rhbgroup.com",
    bgColor: "#0d0a1a", accentColor: "#9b73f8",
    type: "Bank",
    tags: ["Equity Research", "REITs", "Mid Cap"],
  },
  {
    name: "Kenanga Research",
    org: "Kenanga Investment Bank",
    description: "Known for strong small-cap and ACE Market coverage. Daily market reports and stock recommendations.",
    snippet: "Kenanga is one of the best Malaysian brokers for ACE and LEAP market research — covers companies other analysts miss.",
    url: "https://www.kenangaonline.com.my/research",
    logoUrl: "https://logo.clearbit.com/kenanga.com.my",
    bgColor: "#0d1a10", accentColor: "#00c897",
    type: "Bank", badge: "ACE Specialist",
    tags: ["ACE Market", "Small Cap", "Daily Reports"],
  },
  {
    name: "CIMB Research",
    org: "CIMB Investment Bank",
    description: "Regional equity research covering Malaysia, Singapore, Indonesia, Thailand. Strong sector thematic reports.",
    snippet: "CIMB Research provides cross-border analysis useful for comparing Bursa Malaysia valuations against regional peers.",
    url: "https://www.cimb.com/en/research.html",
    logoUrl: "https://logo.clearbit.com/cimb.com",
    bgColor: "#1a0d0d", accentColor: "#ff5f6b",
    type: "Bank",
    tags: ["Equity Research", "Regional", "Sector Themes"],
  },
  {
    name: "Hong Leong IB Research",
    org: "Hong Leong Investment Bank",
    description: "HLIB research on Bursa-listed companies with sector coverage, earnings forecasts, and dividend analysis.",
    snippet: "HLIB publishes comprehensive sector reports covering banking, utilities, consumer, and property sectors on Bursa Malaysia.",
    url: "https://www.hlib.com.my/research/",
    logoUrl: "https://logo.clearbit.com/hlbank.com.my",
    bgColor: "#0a1420", accentColor: "#4d9fff",
    type: "Bank",
    tags: ["Equity Research", "Earnings", "Dividends"],
  },
  {
    name: "Affin Hwang Research",
    org: "Affin Hwang Capital",
    description: "Malaysian equity research with economic outlook, budget impact analysis, and sector rotation calls.",
    snippet: "Affin Hwang Research is particularly strong on Malaysian budget analysis and government policy impact on Bursa-listed GLCs.",
    url: "https://www.affinhwang.com/capital/research",
    logoUrl: "https://logo.clearbit.com/affinhwang.com",
    bgColor: "#100d1a", accentColor: "#f5b942",
    type: "Bank",
    tags: ["Budget Analysis", "GLC Stocks", "Policy Impact"],
  },
  {
    name: "MIDF Research",
    org: "MIDF Amanah Investment",
    description: "Research on Bursa Main and ACE market companies. Known for plantation, construction, and Islamic finance coverage.",
    snippet: "MIDF provides Shariah-compliant investment research perspectives alongside conventional equity analysis.",
    url: "https://www.midf.com.my/research",
    logoUrl: "https://logo.clearbit.com/midf.com.my",
    bgColor: "#0d1a14", accentColor: "#4caf7d",
    type: "Bank",
    tags: ["Shariah Research", "Plantation", "Construction"],
  },

  // ── DATA PLATFORMS ──
  {
    name: "i3investor",
    org: "KLSE i3investor",
    description: "Malaysia's most popular investing community. Free stock financials, charts, analyst targets, forum discussions.",
    snippet: "Best free source for Malaysian stock historical data, analyst consensus targets, dividend history, and retail investor sentiment.",
    url: "https://klse.i3investor.com/",
    logoUrl: "https://logo.clearbit.com/i3investor.com",
    bgColor: "#0a1420", accentColor: "#4d9fff",
    type: "Data", badge: "Most Popular",
    tags: ["Financials", "Charts", "Community", "Analyst Targets", "Free"],
  },
  {
    name: "Bursa Malaysia Equities",
    org: "Bursa Malaysia",
    description: "Official delayed market data, historical prices, corporate actions, and order book data directly from Bursa.",
    snippet: "Download historical OHLCV data for any Bursa stock directly from the exchange — the most authoritative source for price data.",
    url: "https://www.bursamalaysia.com/market_information/equities_prices",
    logoUrl: "https://logo.clearbit.com/bursamalaysia.com",
    bgColor: "#0a1628", accentColor: "#e8b84b",
    type: "Data",
    tags: ["Official Prices", "Historical Data", "Corporate Actions", "Free"],
  },
  {
    name: "TradingView — Bursa Malaysia",
    org: "TradingView",
    description: "Free interactive charts with 100+ technical indicators for all Bursa stocks. Use MYX: prefix (e.g. MYX:1155).",
    snippet: "TradingView is the best free charting tool for Bursa Malaysia. Supports RSI, MACD, Bollinger Bands, Fibonacci, and custom scripts.",
    url: "https://www.tradingview.com/markets/stocks-malaysia/",
    logoUrl: "https://logo.clearbit.com/tradingview.com",
    bgColor: "#0d1a28", accentColor: "#2196f3",
    type: "Data", badge: "Used In This App",
    tags: ["Charts", "Technical Analysis", "Screener", "Free"],
  },
  {
    name: "Yahoo Finance Malaysia",
    org: "Yahoo Finance",
    description: "Real-time and historical data for all Bursa stocks. Use .KL suffix — e.g. 1155.KL for MAYBANK, 5347.KL for TENAGA.",
    snippet: "Yahoo Finance provides free delayed prices, financials, and news for all Bursa stocks. This app uses Yahoo Finance for live prices.",
    url: "https://finance.yahoo.com/quote/1155.KL/",
    logoUrl: "https://logo.clearbit.com/yahoo.com",
    bgColor: "#1a0d28", accentColor: "#9b73f8",
    type: "Data", badge: "Powers This App",
    tags: ["Live Prices", "Historical Data", "Financials", "Free"],
  },
  {
    name: "Simply Wall St",
    org: "Simply Wall St",
    description: "Visualised company analysis with free tier. Covers Bursa-listed companies with snowflake health rating.",
    snippet: "Unique visual approach to stock analysis — see dividend safety, debt levels, PE vs peers, and management quality at a glance.",
    url: "https://simplywall.st/markets/my",
    logoUrl: "https://logo.clearbit.com/simplywall.st",
    bgColor: "#0d1a14", accentColor: "#4caf7d",
    type: "Data",
    tags: ["Visual Analysis", "Fundamentals", "Free Tier"],
  },

  // ── ACADEMIC ──
  {
    name: "Working Papers",
    org: "Bank Negara Malaysia",
    description: "Academic-quality research papers on Malaysian monetary policy, banking sector, financial markets, and fintech.",
    snippet: "BNM working papers are peer-reviewed quality research on Malaysian financial markets — free and authoritative.",
    url: "https://www.bnm.gov.my/research-and-data/working-papers",
    logoUrl: "https://logo.clearbit.com/bnm.gov.my",
    bgColor: "#100d1a", accentColor: "#9b73f8",
    type: "Academic", badge: "Peer Reviewed",
    tags: ["Working Papers", "Monetary Policy", "Banking", "Free"],
  },
  {
    name: "Bursa Malaysia Research",
    org: "SSRN",
    description: "Thousands of free academic papers on Bursa Malaysia, FBM KLCI, market anomalies, and Malaysian equity research.",
    snippet: "Search SSRN for peer-reviewed papers on Bursa Malaysia market efficiency, IPO underpricing, dividend policy, and more.",
    url: "https://papers.ssrn.com/sol3/results.cfm?RequestTimeout=50000000&txtkey=bursa+malaysia",
    logoUrl: "https://logo.clearbit.com/ssrn.com",
    bgColor: "#0d1520", accentColor: "#4d9fff",
    type: "Academic",
    tags: ["Academic Papers", "Market Research", "Free Download"],
  },
  {
    name: "Malaysia Country Data",
    org: "World Bank",
    description: "Free macro research and data on Malaysian economy — GDP, poverty, financial inclusion, development indicators.",
    snippet: "World Bank provides decades of Malaysian economic data in downloadable format — ideal for long-term macro analysis.",
    url: "https://data.worldbank.org/country/MY",
    logoUrl: "https://logo.clearbit.com/worldbank.org",
    bgColor: "#0a1420", accentColor: "#4d9fff",
    type: "Academic",
    tags: ["World Bank", "Macro Data", "Long-term", "Free"],
  },
  {
    name: "Malaysia Article IV Report",
    org: "IMF",
    description: "IMF's annual independent economic assessment of Malaysia — includes financial sector stability analysis.",
    snippet: "The IMF Article IV consultation report gives an independent view of Malaysian economic risks and policy recommendations.",
    url: "https://www.imf.org/en/Publications/CR/Issues/2024/06/07/Malaysia-2024-Article-IV",
    logoUrl: "https://logo.clearbit.com/imf.org",
    bgColor: "#0d1a10", accentColor: "#4caf7d",
    type: "Academic",
    tags: ["IMF", "Economic Assessment", "Policy", "Free"],
  },

  // ── NEWS ──
  {
    name: "The Edge Markets",
    org: "The Edge Malaysia",
    description: "Malaysia's top financial newspaper. Daily market news, company profiles, interviews, and in-depth analysis.",
    snippet: "The Edge is the gold standard for Malaysian financial journalism — covers Bursa daily with company earnings, deal flow, and analysis.",
    url: "https://www.theedgemarkets.com/",
    logoUrl: "https://logo.clearbit.com/theedgemarkets.com",
    bgColor: "#1a0d0d", accentColor: "#ff9f3f",
    type: "News", badge: "Best in Class",
    tags: ["Financial News", "Daily", "Analysis", "Deals"],
  },
  {
    name: "Business News",
    org: "The Star",
    description: "The Star's business section covering Bursa Malaysia daily, company earnings, and corporate news.",
    snippet: "The Star provides free daily Bursa Malaysia market summaries, company results, and business news with broad coverage.",
    url: "https://www.thestar.com.my/business/business-news",
    logoUrl: "https://logo.clearbit.com/thestar.com.my",
    bgColor: "#1a0d0d", accentColor: "#ff5f6b",
    type: "News",
    tags: ["Business News", "Free", "Daily"],
  },
  {
    name: "Official Corporate News",
    org: "Bernama",
    description: "Malaysia's national news agency — official corporate announcements, regulatory news, economic data releases.",
    snippet: "Bernama is the most authoritative source for official Malaysian government and corporate press releases.",
    url: "https://www.bernama.com/en/business/",
    logoUrl: "https://logo.clearbit.com/bernama.com",
    bgColor: "#0a1420", accentColor: "#4d9fff",
    type: "News",
    tags: ["Official News", "Corporate", "Free"],
  },
];

const CATS = [
  { key: "All",      label: "All",          icon: Globe,      color: "var(--text2)"   },
  { key: "Official", label: "Official",     icon: Building2,  color: "var(--gold)"    },
  { key: "Bank",     label: "Bank Research",icon: TrendingUp, color: "var(--blue)"    },
  { key: "Data",     label: "Data & Charts",icon: FileText,   color: "var(--accent)"  },
  { key: "Academic", label: "Research Papers",icon: BookOpen, color: "var(--purple)"  },
  { key: "News",     label: "News",         icon: Newspaper,  color: "var(--red)"     },
];

const TYPE_COLOR: Record<string, string> = {
  Official: "var(--gold)", Bank: "var(--blue)", Data: "var(--accent)",
  Academic: "var(--purple)", News: "var(--red)",
};

export default function Research() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = SOURCES.filter(s =>
    (cat === "All" || s.type === cat) &&
    (search === "" || s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.org.toLowerCase().includes(search.toLowerCase()) ||
      s.snippet.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="fade-in" style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>
          Free Research Library
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.6, maxWidth: 680 }}>
          Curated free research for Bursa Malaysia investors — official filings, bank equity reports, academic papers, data platforms, and financial news. Everything listed here is 100% free to access.
        </p>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {CATS.map(c => {
          const count = c.key === "All" ? SOURCES.length : SOURCES.filter(s => s.type === c.key).length;
          const active = cat === c.key;
          return (
            <button key={c.key} onClick={() => setCat(c.key)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "8px 16px", borderRadius: 24, fontSize: 13, fontWeight: 600,
                border: active ? "none" : "1px solid var(--border)",
                background: active ? c.color : "var(--card)",
                color: active ? (c.key === "All" ? "var(--bg)" : "#000") : "var(--text2)",
                cursor: "pointer", transition: "all 0.15s",
              }}>
              <c.icon size={13} />
              {c.label}
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 12,
                background: active ? "rgba(0,0,0,0.2)" : "var(--card2)", color: active ? "#fff" : "var(--text3)"
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
        <input className="input" placeholder="Search by name, topic, tag…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 40, fontSize: 14 }} />
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>
        {filtered.length} source{filtered.length !== 1 ? "s" : ""}
        {cat !== "All" && ` in ${cat}`}
        {search && ` matching "${search}"`}
      </div>

      {/* Cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 16 }}>
        {filtered.map(source => (
          <SourceCard key={source.name + source.org} source={source} />
        ))}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(77,159,255,0.07)", border: "1px solid rgba(77,159,255,0.15)", borderRadius: 12 }}>
        <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.8 }}>
          <strong style={{ color: "var(--blue)" }}>📚 Note</strong> — All sources are publicly available. Some bank research portals require a free brokerage account. Academic papers on SSRN and ResearchGate are free to download. Always verify data from official Bursa Malaysia and SC sources before investing. Not financial advice.
        </div>
      </div>
    </div>
  );
}

function SourceCard({ source }: { source: Source }) {
  const accentColor = TYPE_COLOR[source.type];

  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14,
      overflow: "hidden", display: "flex", flexDirection: "column",
      transition: "all 0.18s", cursor: "default",
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = accentColor;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.3)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.transform = "none";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}>

      {/* Card header strip */}
      <div style={{
        padding: "16px 18px", background: source.bgColor,
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 14
      }}>
        {/* Logo */}
        <div style={{
          width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0,
          background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.08)"
        }}>
          <img src={source.logoUrl} alt={source.org} width={44} height={44}
            style={{ objectFit: "contain", padding: 6 }}
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.style.display = "none";
              const p = el.parentElement;
              if (p) p.innerHTML = `<span style="font-size:14px;font-weight:800;color:${source.accentColor}">${source.org.slice(0,2).toUpperCase()}</span>`;
            }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 2, lineHeight: 1.3 }}>{source.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{source.org}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
            background: `${accentColor}20`, color: accentColor,
            border: `1px solid ${accentColor}40`, flexShrink: 0
          }}>{source.type}</span>
          {source.badge && (
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: `${source.accentColor}25`, color: source.accentColor, border: `1px solid ${source.accentColor}40` }}>
              {source.badge}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>{source.description}</p>

        {/* Snippet box */}
        <div style={{
          background: "var(--bg2)", borderRadius: 8, padding: "10px 12px",
          borderLeft: `3px solid ${accentColor}`,
        }}>
          <div style={{ fontSize: 10, color: accentColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>
            Why it's useful
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>{source.snippet}</div>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {source.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 10, padding: "3px 9px", borderRadius: 20,
              background: "var(--card2)", color: "var(--text3)",
              border: "1px solid var(--border)"
            }}>{tag}</span>
          ))}
        </div>

        {/* CTA */}
        <a href={source.url} target="_blank" rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontSize: 13, fontWeight: 700, color: accentColor, textDecoration: "none",
            padding: "10px 16px", borderRadius: 8, marginTop: "auto",
            background: `${accentColor}12`, border: `1px solid ${accentColor}30`,
            transition: "all 0.15s"
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${accentColor}22`}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${accentColor}12`}>
          <ExternalLink size={13} />
          Open {source.org}
        </a>
      </div>
    </div>
  );
}
