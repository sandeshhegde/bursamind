"use client";
import { useState } from "react";
import TVWidget from "@/components/TVWidget";
import { BarChart3, Grid3x3, Newspaper, TrendingUp, Activity } from "lucide-react";

const SCREENS = [
  { key: "overview",    label: "Overview"    },
  { key: "performance", label: "Performance" },
  { key: "valuation",   label: "Valuation"   },
  { key: "dividends",   label: "Dividends"   },
  { key: "oscillators", label: "Technicals"  },
];

const HEATMAP_DATASETS = [
  { key: "AllUSA",   label: "All US Stocks" },
  { key: "SPX500",   label: "S&P 500"       },
  { key: "NASDAQ100",label: "NASDAQ 100"    },
  { key: "DJ",       label: "Dow Jones"     },
];

export default function USMarkets() {
  const [view, setView]     = useState<"screener"|"heatmap"|"overview">("overview");
  const [screen, setScreen] = useState("overview");
  const [heatSet, setHeatSet] = useState("SPX500");

  return (
    <div className="fade-in" style={{ maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 20 }}>🇺🇸</span>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: 0 }}>
            US Markets — NYSE / NASDAQ
          </h1>
          <span style={{
            fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20,
            background: "rgba(77,159,255,0.15)", color: "var(--blue)",
            border: "1px solid rgba(77,159,255,0.3)", letterSpacing: "0.06em",
          }}>LIVE · TRADINGVIEW DATA</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text3)", maxWidth: 680 }}>
          A complete view of US equities — S&P 500, NASDAQ 100, Dow Jones — for context alongside your
          Bursa Malaysia portfolio. Useful for tracking global sentiment that moves Malaysian markets.
        </p>
      </div>

      {/* View tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[
          { key: "overview", label: "Market Overview", icon: Activity   },
          { key: "screener", label: "Screener Table",  icon: BarChart3  },
          { key: "heatmap",  label: "Heatmap",          icon: Grid3x3    },
        ].map(t => (
          <button key={t.key} onClick={() => setView(t.key as typeof view)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
            fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
            background: view === t.key ? "var(--blue)" : "var(--card)",
            color: view === t.key ? "#fff" : "var(--text2)",
          }}><t.icon size={14} />{t.label}</button>
        ))}
      </div>

      {/* OVERVIEW — multi-panel dashboard layout */}
      {view === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, marginBottom: 16 }}>
          <div className="card" style={{ padding: 4 }}>
            <div style={{ padding: "12px 16px 0", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
              Market Overview — Indices, Futures, Bonds
            </div>
            <TVWidget
              scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
              config={{
                colorTheme: "light",
                dateRange: "12M",
                showChart: true,
                locale: "en",
                width: "100%",
                height: 520,
                largeChartUrl: "",
                isTransparent: true,
                showSymbolLogo: true,
                showFloatingTooltip: true,
                plotLineColorGrowing: "rgba(0, 200, 151, 1)",
                plotLineColorFalling: "rgba(255, 95, 107, 1)",
                gridLineColor: "rgba(232, 234, 237, 0.9)",
                scaleFontColor: "rgba(95, 99, 104, 1)",
                belowLineFillColorGrowing: "rgba(0, 200, 151, 0.12)",
                belowLineFillColorFalling: "rgba(255, 95, 107, 0.12)",
                tabs: [
                  {
                    title: "Indices",
                    symbols: [
                      { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
                      { s: "NASDAQ:NDX",      d: "NASDAQ 100" },
                      { s: "DJ:DJI",          d: "Dow Jones" },
                      { s: "FOREXCOM:RTYUSD", d: "Russell 2000" },
                    ],
                  },
                  {
                    title: "Mega Caps",
                    symbols: [
                      { s: "NASDAQ:AAPL", d: "Apple"     },
                      { s: "NASDAQ:MSFT", d: "Microsoft" },
                      { s: "NASDAQ:NVDA", d: "NVIDIA"    },
                      { s: "NASDAQ:AMZN", d: "Amazon"    },
                      { s: "NASDAQ:GOOGL",d: "Alphabet"  },
                      { s: "NASDAQ:META", d: "Meta"      },
                    ],
                  },
                ],
              }}
              height={520}
            />
          </div>

          <div className="card" style={{ padding: 4 }}>
            <div style={{ padding: "12px 16px 0", fontSize: 13, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
              <Newspaper size={14} color="var(--blue)" /> US Market News
            </div>
            <TVWidget
              scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
              config={{
                feedMode: "market",
                market: "stock",
                colorTheme: "light",
                isTransparent: true,
                displayMode: "regular",
                width: "100%",
                height: 480,
                locale: "en",
              }}
              height={480}
            />
          </div>
        </div>
      )}

      {/* SCREENER */}
      {view === "screener" && (
        <>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {SCREENS.map(s => (
              <button key={s.key} onClick={() => setScreen(s.key)} style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: screen === s.key ? "none" : "1px solid var(--border)",
                background: screen === s.key ? "var(--blue)" : "var(--card)",
                color: screen === s.key ? "#fff" : "var(--text2)", cursor: "pointer",
              }}>{s.label}</button>
            ))}
          </div>
          <div className="card" style={{ padding: 4 }}>
            <TVWidget
              scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-screener.js"
              config={{
                width: "100%",
                height: 650,
                defaultColumn: screen,
                defaultScreen: "general",
                market: "america",
                showToolbar: true,
                colorTheme: "light",
                locale: "en",
              }}
              height={650}
            />
          </div>
        </>
      )}

      {/* HEATMAP */}
      {view === "heatmap" && (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {HEATMAP_DATASETS.map(h => (
              <button key={h.key} onClick={() => setHeatSet(h.key)} style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: heatSet === h.key ? "none" : "1px solid var(--border)",
                background: heatSet === h.key ? "var(--blue)" : "var(--card)",
                color: heatSet === h.key ? "#fff" : "var(--text2)", cursor: "pointer",
              }}>{h.label}</button>
            ))}
          </div>
          <div className="card" style={{ padding: 4 }}>
            <TVWidget
              scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
              config={{
                exchanges: [],
                dataSource: heatSet,
                grouping: "sector",
                blockSize: "market_cap_basic",
                blockColor: "change",
                locale: "en",
                symbolUrl: "",
                colorTheme: "light",
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
          </div>
        </>
      )}

      <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(77,159,255,0.06)", border: "1px solid rgba(77,159,255,0.15)", borderRadius: 10, fontSize: 11, color: "var(--text3)", display: "flex", gap: 8, alignItems: "flex-start" }}>
        <TrendingUp size={13} color="var(--blue)" style={{ flexShrink: 0, marginTop: 1 }} />
        US market movements often drive overnight sentiment on Bursa Malaysia the next trading day, particularly for tech-linked stocks like INARI and semiconductor-exposed names. Keep this tab open alongside your Bursa dashboard.
      </div>
    </div>
  );
}
