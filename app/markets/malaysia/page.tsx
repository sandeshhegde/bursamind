"use client";
import { useState } from "react";
import Link from "next/link";
import TVWidget from "@/components/TVWidget";
import { Flag, BarChart3, Grid3x3, Newspaper, Info } from "lucide-react";

const SCREENS = [
  { key: "overview",    label: "Overview"     },
  { key: "performance", label: "Performance"  },
  { key: "valuation",   label: "Valuation"    },
  { key: "dividends",   label: "Dividends"    },
  { key: "oscillators", label: "Technicals"   },
];

export default function MalaysiaMarkets() {
  const [screen, setScreen] = useState("overview");
  const [view, setView] = useState<"screener" | "heatmap">("screener");

  return (
    <div className="fade-in" style={{ maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Flag size={18} color="var(--accent)" />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: 0 }}>
            Bursa Malaysia — Live Markets
          </h1>
          <span style={{
            fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20,
            background: "rgba(0,200,151,0.15)", color: "var(--accent)",
            border: "1px solid rgba(0,200,151,0.3)", letterSpacing: "0.06em",
          }}>LIVE · TRADINGVIEW DATA</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text3)", maxWidth: 680 }}>
          Every stock listed on Bursa Malaysia (Main, ACE, LEAP) ranked and sortable by price, performance,
          valuation, and dividends — powered directly by TradingView's market data, no mock data.
        </p>
      </div>

      {/* View toggle + screen tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setView("screener")} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
            fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
            background: view === "screener" ? "var(--accent)" : "var(--card)",
            color: view === "screener" ? "#000" : "var(--text2)",
          }}><BarChart3 size={14} />Screener Table</button>
          <button onClick={() => setView("heatmap")} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
            fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
            background: view === "heatmap" ? "var(--accent)" : "var(--card)",
            color: view === "heatmap" ? "#000" : "var(--text2)",
          }}><Grid3x3 size={14} />Sector Heatmap</button>
        </div>

        {view === "screener" && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SCREENS.map(s => (
              <button key={s.key} onClick={() => setScreen(s.key)} style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: screen === s.key ? "none" : "1px solid var(--border)",
                background: screen === s.key ? "var(--blue)" : "var(--card)",
                color: screen === s.key ? "#fff" : "var(--text2)", cursor: "pointer",
              }}>{s.label}</button>
            ))}
          </div>
        )}
      </div>

      {/* Main widget */}
      <div className="card" style={{ padding: 4, marginBottom: 16 }}>
        {view === "screener" ? (
          <TVWidget
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-screener.js"
            config={{
              width: "100%",
              height: 650,
              defaultColumn: screen,
              defaultScreen: "general",
              market: "malaysia",
              showToolbar: true,
              colorTheme: "dark",
              locale: "en",
            }}
            height={650}
          />
        ) : (
          <TVWidget
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
            config={{
              exchanges: [],
              dataSource: "MYX",
              grouping: "sector",
              blockSize: "market_cap_basic",
              blockColor: "change",
              locale: "en",
              symbolUrl: "",
              colorTheme: "dark",
              hasTopBar: true,
              isDataSetEnabled: true,
              isZoomEnabled: true,
              hasSymbolTooltip: true,
              isMonoSize: false,
              width: "100%",
              height: 650,
            }}
            height={650}
          />
        )}
      </div>

      {/* Bottom: Bursa-specific news + info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div className="card" style={{ padding: 4 }}>
          <div style={{ padding: "12px 16px 0", fontSize: 13, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
            <Newspaper size={14} color="var(--accent)" /> Malaysia Market News
          </div>
          <TVWidget
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
            config={{
              feedMode: "market",
              market: "malaysia",
              colorTheme: "dark",
              isTransparent: true,
              displayMode: "regular",
              width: "100%",
              height: 420,
              locale: "en",
            }}
            height={420}
          />
        </div>

        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
            <Info size={14} color="var(--blue)" /> About This View
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.7, marginBottom: 14 }}>
            This replicates TradingView's own Malaysia markets screener — same live data, same ranking engine,
            embedded directly so you don't need a separate tab. Click any row to open it on TradingView for
            deeper analysis, or use the search bar above to jump to that stock's dedicated page in BursaMind.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Stock Screener",  href: "/screener",  desc: "BursaMind's own filterable screener" },
              { label: "Sector Analysis", href: "/sectors",   desc: "Drill into sector-level performance" },
              { label: "Insider Intel",   href: "/insider",   desc: "Director dealings & signal scoring" },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                display: "block", padding: "10px 12px", background: "var(--card2)", borderRadius: 8,
                border: "1px solid var(--border)", textDecoration: "none",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>{l.label}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{l.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
