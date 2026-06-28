"use client";
import { useState } from "react";
import TVWidget from "@/components/TVWidget";
import { BarChart3, Grid3x3, Bitcoin, Newspaper } from "lucide-react";

const TOP_COINS = [
  { symbol: "BINANCE:BTCUSDT", label: "Bitcoin",  short: "BTC" },
  { symbol: "BINANCE:ETHUSDT", label: "Ethereum", short: "ETH" },
  { symbol: "BINANCE:SOLUSDT", label: "Solana",   short: "SOL" },
  { symbol: "BINANCE:BNBUSDT", label: "BNB",      short: "BNB" },
  { symbol: "BINANCE:XRPUSDT", label: "XRP",      short: "XRP" },
  { symbol: "BINANCE:ADAUSDT", label: "Cardano",  short: "ADA" },
];

export default function CryptoMarkets() {
  const [view, setView] = useState<"overview"|"screener"|"heatmap">("overview");

  return (
    <div className="fade-in" style={{ maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Bitcoin size={18} color="var(--gold)" />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: 0 }}>
            Crypto Markets
          </h1>
          <span style={{
            fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20,
            background: "rgba(245,185,66,0.15)", color: "var(--gold)",
            border: "1px solid rgba(245,185,66,0.3)", letterSpacing: "0.06em",
          }}>LIVE · TRADINGVIEW DATA</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text3)", maxWidth: 680 }}>
          Live cryptocurrency prices and market structure — useful context given growing Malaysian retail
          interest in crypto and Securities Commission-regulated digital asset exchanges (Luno, Tokenize, MX Global).
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[
          { key: "overview", label: "Top Coins",      icon: Bitcoin    },
          { key: "screener", label: "Full Screener",  icon: BarChart3  },
          { key: "heatmap",  label: "Heatmap",          icon: Grid3x3    },
        ].map(t => (
          <button key={t.key} onClick={() => setView(t.key as typeof view)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
            fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
            background: view === t.key ? "var(--gold)" : "var(--card)",
            color: view === t.key ? "#000" : "var(--text2)",
          }}><t.icon size={14} />{t.label}</button>
        ))}
      </div>

      {/* OVERVIEW — grid of mini charts for top coins */}
      {view === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 16 }}>
            {TOP_COINS.map(coin => (
              <div key={coin.symbol} className="card" style={{ padding: 4 }}>
                <div style={{ padding: "10px 14px 0", fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
                  {coin.label} <span style={{ color: "var(--text3)", fontWeight: 500 }}>({coin.short})</span>
                </div>
                <TVWidget
                  scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js"
                  config={{
                    symbol: coin.symbol,
                    width: "100%",
                    height: 160,
                    locale: "en",
                    dateRange: "1M",
                    colorTheme: "light",
                    isTransparent: true,
                    autosize: false,
                    largeChartUrl: "",
                  }}
                  height={160}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
            <div className="card" style={{ padding: 4 }}>
              <div style={{ padding: "12px 16px 0", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                Bitcoin — Advanced Chart
              </div>
              <TVWidget
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
                config={{
                  autosize: true,
                  symbol: "BINANCE:BTCUSDT",
                  interval: "D",
                  timezone: "Asia/Kuala_Lumpur",
                  theme: "light",
                  style: "1",
                  locale: "en",
                  backgroundColor: "#ffffff",
                  gridColor: "rgba(35,45,66,0.5)",
                  hide_top_toolbar: false,
                  save_image: false,
                  studies: ["STD;MACD", "STD;RSI"],
                }}
                height={460}
              />
            </div>
            <div className="card" style={{ padding: 4 }}>
              <div style={{ padding: "12px 16px 0", fontSize: 13, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
                <Newspaper size={14} color="var(--gold)" /> Crypto News
              </div>
              <TVWidget
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
                config={{
                  feedMode: "market",
                  market: "crypto",
                  colorTheme: "light",
                  isTransparent: true,
                  displayMode: "regular",
                  width: "100%",
                  height: 420,
                  locale: "en",
                }}
                height={420}
              />
            </div>
          </div>
        </>
      )}

      {/* SCREENER */}
      {view === "screener" && (
        <div className="card" style={{ padding: 4 }}>
          <TVWidget
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-screener.js"
            config={{
              width: "100%",
              height: 650,
              defaultColumn: "overview",
              screener_type: "crypto_mkt",
              displayCurrency: "USD",
              colorTheme: "light",
              locale: "en",
            }}
            height={650}
          />
        </div>
      )}

      {/* HEATMAP */}
      {view === "heatmap" && (
        <div className="card" style={{ padding: 4 }}>
          <TVWidget
            scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js"
            config={{
              dataSource: "Crypto",
              blockSize: "market_cap_calc",
              blockColor: "change",
              locale: "en",
              symbolUrl: "",
              colorTheme: "light",
              hasTopBar: true,
              isDataSetEnabled: true,
              isZoomEnabled: true,
              hasSymbolTooltip: true,
              width: "100%",
              height: 650,
            }}
            height={650}
          />
        </div>
      )}

      <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(245,185,66,0.06)", border: "1px solid rgba(245,185,66,0.15)", borderRadius: 10, fontSize: 11, color: "var(--text3)" }}>
        ⚠️ Crypto assets are highly volatile and unregulated in most contexts. In Malaysia, only digital asset exchanges registered with the Securities Commission (e.g. Luno Malaysia, Tokenize Xchange, MX Global) are legal for trading. Not financial advice.
      </div>
    </div>
  );
}
