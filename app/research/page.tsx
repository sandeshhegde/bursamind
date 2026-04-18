"use client";
import { useState } from "react";
import { ExternalLink, Search, BookOpen, Building2, TrendingUp, Globe, FileText, ChevronDown, ChevronRight } from "lucide-react";

interface ResearchSource {
  name: string;
  description: string;
  url: string;
  type: "Official" | "Bank" | "Academic" | "News" | "Data";
  free: boolean;
  language?: string;
  tags: string[];
}

const RESEARCH_SOURCES: ResearchSource[] = [
  // ── OFFICIAL BURSA & REGULATORY ──
  { name: "Bursa Malaysia Announcements", description: "All official company announcements, quarterly results, annual reports, material disclosures filed with Bursa Malaysia.", url: "https://www.bursamalaysia.com/market_information/announcements/company_announcement", type: "Official", free: true, tags: ["Announcements", "Results", "Annual Reports"] },
  { name: "Bursa LINK (Company Filings)", description: "Full filing portal — prospectuses, circulars, rights issue documents, AGM notices for all listed companies.", url: "https://www.bursamalaysia.com/trade/trading_resources/listing_directory/main-market", type: "Official", free: true, tags: ["Filings", "Prospectus", "Circulars"] },
  { name: "Securities Commission Malaysia", description: "SC enforcement actions, licensing, Shariah advisories, annual reports, and investor education materials.", url: "https://www.sc.com.my/", type: "Official", free: true, tags: ["Regulatory", "Shariah", "Enforcement"] },
  { name: "SC Shariah Screening List", description: "Official list of Shariah-compliant securities updated twice yearly. Essential for Islamic investing in Malaysia.", url: "https://www.sc.com.my/regulation/guidelines/securities-laws/list-of-shariah-compliant-securities", type: "Official", free: true, tags: ["Shariah", "Islamic Finance"] },
  { name: "Bank Negara Malaysia (BNM)", description: "Monetary policy statements, financial stability reports, BNM Annual Report, interest rate decisions.", url: "https://www.bnm.gov.my/publications", type: "Official", free: true, tags: ["Macro", "Monetary Policy", "Interest Rates"] },
  { name: "BNM Financial Stability Review", description: "Bi-annual report on Malaysian financial system risks, banking sector health, household debt data.", url: "https://www.bnm.gov.my/financial-stability-review", type: "Official", free: true, tags: ["Financial Stability", "Banking", "Risk"] },
  { name: "Statistics Department Malaysia (DOSM)", description: "GDP, CPI, trade data, employment statistics. Critical macroeconomic data for market context.", url: "https://www.dosm.gov.my/", type: "Official", free: true, tags: ["GDP", "CPI", "Macro Data"] },
  { name: "MIDA (Investment Authority)", description: "FDI data, approved investments by sector, manufacturing statistics — useful for sector investment trends.", url: "https://www.mida.gov.my/", type: "Official", free: true, tags: ["FDI", "Investment", "Sector Data"] },

  // ── BANK & BROKER RESEARCH (FREE) ──
  { name: "Maybank Investment Bank Research", description: "Free equity research reports on Bursa-listed stocks, sector notes, economic outlook. Login required for full access.", url: "https://www.maybank-ke.com.my/Research/Home", type: "Bank", free: true, tags: ["Equity Research", "Sector Notes", "Economics"] },
  { name: "CIMB Research", description: "CIMB's research portal covering regional markets including Bursa Malaysia. Some reports freely accessible.", url: "https://www.cimbbank.com.my/en/personal/investment/research.html", type: "Bank", free: true, tags: ["Equity Research", "Regional"] },
  { name: "RHB Research", description: "RHB Investment Bank research notes on Malaysian equities, REITs, and fixed income.", url: "https://research.rhbtradesmart.com/", type: "Bank", free: true, tags: ["Equity Research", "REITs", "Fixed Income"] },
  { name: "Hong Leong Investment Bank Research", description: "HLIB research reports on Bursa-listed companies with sector coverage and earnings forecasts.", url: "https://www.hlib.com.my/research/", type: "Bank", free: true, tags: ["Equity Research", "Earnings"] },
  { name: "Public Bank Research (PBB)", description: "PBB research coverage of Malaysian equities. Access via their brokerage portal.", url: "https://www.pbebank.com/", type: "Bank", free: true, tags: ["Equity Research"] },
  { name: "AmInvestment Research", description: "AmBank's equity research on Bursa Malaysia stocks including small and mid-cap coverage.", url: "https://www.aminvestment.com/", type: "Bank", free: true, tags: ["Equity Research", "Small Cap", "Mid Cap"] },
  { name: "Kenanga Research", description: "Kenanga Investment Bank equity research, known for strong small-cap and ACE Market coverage.", url: "https://www.kenangaonline.com.my/research", type: "Bank", free: true, tags: ["Equity Research", "ACE Market", "Small Cap"] },
  { name: "TA Securities Research", description: "TA Research daily market reports and stock recommendations for Bursa Malaysia.", url: "https://www.ta.com.my/research-reports", type: "Bank", free: true, tags: ["Daily Reports", "Recommendations"] },
  { name: "Affin Hwang Research", description: "Affin Hwang research covering Malaysian equities, economic outlook, and sector analysis.", url: "https://www.affinhwang.com/capital/research", type: "Bank", free: true, tags: ["Equity Research", "Economics"] },
  { name: "Midf Research", description: "MIDF Amanah Investment Bank research — strong coverage of Bursa Main and ACE market companies.", url: "https://www.midf.com.my/research", type: "Bank", free: true, tags: ["Equity Research", "ACE Market"] },

  // ── DATA & ANALYSIS PLATFORMS (FREE TIERS) ──
  { name: "i3investor.com", description: "Malaysia's most popular investing community. Free stock financials, charts, analyst targets, forum discussions.", url: "https://klse.i3investor.com/", type: "Data", free: true, tags: ["Financials", "Charts", "Community", "Analyst Targets"] },
  { name: "StockBit Malaysia", description: "Social investing platform with financial data, news, and community analysis for Bursa stocks.", url: "https://stockbit.com/", type: "Data", free: true, tags: ["Social Investing", "Financials", "News"] },
  { name: "Bursa Market Data (Bloomberg equivalent)", description: "Free delayed market data, order book, and historical prices directly from Bursa Malaysia.", url: "https://www.bursamalaysia.com/market_information/equities_prices", type: "Data", free: true, tags: ["Prices", "Market Data", "Historical"] },
  { name: "Yahoo Finance Malaysia", description: "Free real-time and historical data for all Bursa stocks using .KL suffix (e.g. 1155.KL for MAYBANK).", url: "https://finance.yahoo.com/quote/1155.KL/", type: "Data", free: true, tags: ["Real-time Prices", "Historical Data", "Financials"] },
  { name: "TradingView — Bursa Malaysia", description: "Free interactive charts with 100+ technical indicators. All Bursa stocks available under MYX: prefix.", url: "https://www.tradingview.com/markets/stocks-malaysia/", type: "Data", free: true, tags: ["Charts", "Technical Analysis", "Screener"] },
  { name: "Macrotrends Malaysia Data", description: "Long-term historical data on Malaysian economic indicators, interest rates, currency, stock market.", url: "https://www.macrotrends.net/countries/MYS/malaysia/", type: "Data", free: true, tags: ["Historical Data", "Macro", "Long-term"] },
  { name: "Simply Wall St (Malaysia)", description: "Visualised company analysis with free tier. Covers Bursa-listed companies with snowflake rating.", url: "https://simplywall.st/markets/my", type: "Data", free: true, tags: ["Visualised Analysis", "Fundamentals"] },

  // ── ACADEMIC & RESEARCH PAPERS ──
  { name: "Bank Negara Working Papers", description: "Free academic-quality research papers on Malaysian monetary policy, banking, financial markets, fintech.", url: "https://www.bnm.gov.my/research-and-data/working-papers", type: "Academic", free: true, tags: ["Working Papers", "Monetary Policy", "Research"] },
  { name: "Securities Commission Research Papers", description: "SC publishes free research on capital markets, Islamic finance, corporate governance, market microstructure.", url: "https://www.sc.com.my/resources/media-releases-and-announcements", type: "Academic", free: true, tags: ["Capital Markets", "Islamic Finance", "Governance"] },
  { name: "SSRN — Malaysia Finance Papers", description: "Search SSRN for thousands of free academic papers on Bursa Malaysia, FBM KLCI, Malaysian market anomalies.", url: "https://papers.ssrn.com/sol3/results.cfm?RequestTimeout=50000000&txtkey=bursa+malaysia", type: "Academic", free: true, tags: ["Academic Papers", "Market Research", "Free"] },
  { name: "ResearchGate — Malaysia Equities", description: "Academic papers on Malaysian stock market, pricing anomalies, dividend policy, corporate governance.", url: "https://www.researchgate.net/search?q=bursa+malaysia+stock+market", type: "Academic", free: true, tags: ["Academic Papers", "Free Access"] },
  { name: "Asian Development Bank Research", description: "ADB research on Malaysian economy, financial sector development, infrastructure, sustainability.", url: "https://www.adb.org/countries/malaysia/publications", type: "Academic", free: true, tags: ["Economic Research", "Development", "Free"] },
  { name: "World Bank Open Data — Malaysia", description: "Free macro data and research reports on Malaysian economy, poverty, financial inclusion.", url: "https://data.worldbank.org/country/MY", type: "Academic", free: true, tags: ["Macro Data", "Economic Research", "Free"] },
  { name: "IMF Country Report — Malaysia", description: "IMF Article IV consultation reports providing independent economic assessment of Malaysia.", url: "https://www.imf.org/en/Publications/CR/Issues/2024/06/07/Malaysia-2024-Article-IV", type: "Academic", free: true, tags: ["IMF", "Economic Assessment", "Free"] },
  { name: "Perdana Leadership Foundation", description: "Malaysian think-tank research on economic policy, governance, and development.", url: "https://www.perdana.org.my/research", type: "Academic", free: true, tags: ["Policy Research", "Governance"] },

  // ── FINANCIAL NEWS (FREE) ──
  { name: "The Edge Markets", description: "Malaysia's top financial newspaper. Daily market news, company profiles, interviews, analysis.", url: "https://www.theedgemarkets.com/", type: "News", free: true, tags: ["Financial News", "Daily", "Analysis"] },
  { name: "The Star Business", description: "Business and markets section of The Star — broad market news coverage, company earnings.", url: "https://www.thestar.com.my/business/business-news", type: "News", free: true, tags: ["Business News", "Markets"] },
  { name: "Bernama Market News", description: "Official Malaysian national news agency — corporate announcements, regulatory news, economic data.", url: "https://www.bernama.com/en/business/", type: "News", free: true, tags: ["Official News", "Corporate", "Economic"] },
  { name: "New Straits Times Business", description: "NST business desk covering Bursa Malaysia, corporate actions, mergers, and acquisitions.", url: "https://www.nst.com.my/business", type: "News", free: true, tags: ["Business News", "M&A"] },
  { name: "Malaysiakini Business", description: "Independent media covering business and economic news with critical analysis.", url: "https://www.malaysiakini.com/business", type: "News", free: true, tags: ["Business News", "Independent"] },
];

const CATEGORIES = [
  { key: "All", label: "All Sources", icon: Globe },
  { key: "Official", label: "Official / Regulatory", icon: Building2 },
  { key: "Bank", label: "Bank & Broker Research", icon: TrendingUp },
  { key: "Data", label: "Data Platforms", icon: FileText },
  { key: "Academic", label: "Research Papers", icon: BookOpen },
  { key: "News", label: "Financial News", icon: Globe },
];

export default function Research() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = RESEARCH_SOURCES.filter(s =>
    (category === "All" || s.type === category) &&
    (search === "" ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  const grouped = CATEGORIES.filter(c => c.key !== "All").map(c => ({
    ...c,
    items: filtered.filter(s => s.type === c.key),
  })).filter(g => g.items.length > 0);

  return (
    <div className="fade-in" style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
          Free Research Library
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.6 }}>
          Curated free research sources for Bursa Malaysia investors — official filings, bank reports, academic papers, data platforms, and financial news. All 100% free.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {CATEGORIES.filter(c => c.key !== "All").map(c => {
          const count = RESEARCH_SOURCES.filter(s => s.type === c.key).length;
          return (
            <div key={c.key}
              onClick={() => setCategory(category === c.key ? "All" : c.key)}
              className="card"
              style={{
                padding: "14px 16px", cursor: "pointer", transition: "all 0.15s",
                border: category === c.key ? "1px solid var(--accent)" : "1px solid var(--border)",
                background: category === c.key ? "rgba(0,200,151,0.05)" : "var(--card)",
              }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: category === c.key ? "var(--accent)" : "var(--text)", fontFamily: "JetBrains Mono, monospace" }}>{count}</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, lineHeight: 1.4 }}>{c.label}</div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
        <input className="input" placeholder="Search by source name, topic, or tag…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 40, fontSize: 14 }} />
      </div>

      {/* Results */}
      {category === "All" && search === "" ? (
        // Grouped view
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {grouped.map(group => (
            <div key={group.key}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <group.icon size={16} color="var(--accent)" />
                <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{group.label}</h2>
                <span style={{ fontSize: 11, color: "var(--text3)", background: "var(--card2)", padding: "2px 8px", borderRadius: 20 }}>{group.items.length}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
                {group.items.map(source => (
                  <SourceCard key={source.name} source={source} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Flat search results
        <div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>
            {filtered.length} source{filtered.length !== 1 ? "s" : ""} found
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
            {filtered.map(source => (
              <SourceCard key={source.name} source={source} />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(77,159,255,0.07)", border: "1px solid rgba(77,159,255,0.2)", borderRadius: 12 }}>
        <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.8 }}>
          <strong style={{ color: "var(--blue)" }}>📚 About this library</strong> — All sources listed are publicly available and free to access. Some require free account registration. Bank research portals may offer limited free reports with a brokerage account. Academic papers on SSRN and ResearchGate are generally free to download. Always verify data from official Bursa Malaysia and SC sources before making investment decisions. This is not financial advice.
        </div>
      </div>
    </div>
  );
}

function SourceCard({ source }: { source: ResearchSource }) {
  const typeColor: Record<string, string> = {
    Official: "var(--accent)",
    Bank: "var(--blue)",
    Academic: "var(--purple)",
    Data: "var(--gold)",
    News: "var(--red)",
  };

  return (
    <div className="card" style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, transition: "all 0.15s" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = typeColor[source.type]}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", lineHeight: 1.4 }}>{source.name}</div>
        <span style={{
          flexShrink: 0, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
          background: `${typeColor[source.type]}18`, color: typeColor[source.type], border: `1px solid ${typeColor[source.type]}30`
        }}>{source.type}</span>
      </div>
      <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>{source.description}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {source.tags.map(tag => (
          <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "var(--card2)", color: "var(--text3)", border: "1px solid var(--border)" }}>{tag}</span>
        ))}
      </div>
      <a href={source.url} target="_blank" rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600,
          color: typeColor[source.type], textDecoration: "none", marginTop: 2,
          padding: "7px 12px", borderRadius: 8, background: `${typeColor[source.type]}10`,
          border: `1px solid ${typeColor[source.type]}25`, transition: "all 0.15s", width: "fit-content"
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${typeColor[source.type]}20`}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${typeColor[source.type]}10`}>
        <ExternalLink size={12} /> Open Source
      </a>
    </div>
  );
}
