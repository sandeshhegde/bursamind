"use client";
import { useParams } from "next/navigation";
import { STOCKS, generateFinancials } from "@/lib/data";
import { useLivePrices } from "@/lib/useLivePrices";
import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Star, Share2, AlertCircle, Wifi, WifiOff } from "lucide-react";

// TradingView Widget loader
function TradingViewChart({ symbol }: { symbol: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Bursa Malaysia stocks use MYX: prefix on TradingView
  const tvSymbol = `MYX:${symbol}`;

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: "D",
      timezone: "Asia/Kuala_Lumpur",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(22, 28, 45, 0)",
      gridColor: "rgba(35, 45, 66, 0.6)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      studies: ["STD;MACD", "STD;RSI"],
      support_host: "https://www.tradingview.com",
    });
    containerRef.current.appendChild(script);
  }, [tvSymbol]);

  return (
    <div style={{ position: "relative" }}>
      <div style={{
        fontSize: 11, color: "var(--accent)", fontWeight: 600, marginBottom: 8,
        display: "flex", alignItems: "center", gap: 6
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
        TradingView Interactive Chart · MYX:{symbol} · Includes RSI + MACD
      </div>
      <div className="tradingview-widget-container" ref={containerRef}
        style={{ height: 420, borderRadius: 10, overflow: "hidden", background: "var(--card)" }} />
      <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 6, textAlign: "right" }}>
        Powered by TradingView · Real-time Bursa Malaysia data
      </div>
    </div>
  );
}

// TradingView Mini Symbol Overview
function TradingViewMini({ symbol }: { symbol: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tvSymbol = `MYX:${symbol}`;

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [[tvSymbol]],
      chartOnly: false,
      width: "100%",
      height: 200,
      locale: "en",
      colorTheme: "dark",
      autosize: false,
      showVolume: true,
      showMA: true,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily: "Plus Jakarta Sans, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      maLineColor: "#00c897",
      maLineWidth: 1,
      maLength: 9,
      backgroundColor: "rgba(22,28,45,0)",
      lineWidth: 2,
      lineType: 0,
      dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W"],
    });
    containerRef.current.appendChild(script);
  }, [tvSymbol]);

  return <div ref={containerRef} style={{ borderRadius: 8, overflow: "hidden" }} />;
}

const TABS = ["Chart", "Financials", "About"];

export default function StockPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const { stocks, isLive } = useLivePrices([symbol]);
  const stock = stocks.find(s => s.symbol === symbol) || STOCKS.find(s => s.symbol === symbol);
  const [tab, setTab] = useState("Chart");
  const [watchlisted, setWatchlisted] = useState(false);

  if (!stock) return (
    <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>
      <AlertCircle size={32} style={{ margin: "0 auto 12px", display: "block" }} />
      Stock "{symbol}" not found.
    </div>
  );

  const financials = generateFinancials(stock);

  const Stat = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div style={{ padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "JetBrains Mono, monospace" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{sub}</div>}
    </div>
  );

  return (
    <div className="fade-in" style={{ maxWidth: 1300 }}>
      {/* Header */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, var(--card2), var(--border2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "var(--accent)" }}>
                {symbol.slice(0, 2)}
              </div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)" }}>{symbol}</h1>
                <div style={{ fontSize: 13, color: "var(--text3)" }}>{stock.name}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span className="tag-blue">{stock.sector}</span>
              <span className="tag-blue">{stock.industry}</span>
              <span className="tag-gold">MYX:{symbol}</span>
              <span style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4, color: isLive ? "var(--accent)" : "var(--gold)" }}>
                {isLive ? <Wifi size={10}/> : <WifiOff size={10}/>}
                {isLive ? "Live price" : "Demo price"}
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: "var(--text)", marginBottom: 6 }}>
              RM {stock.price.toFixed(3)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
              {stock.changePct >= 0 ? <TrendingUp size={16} color="var(--accent)" /> : <TrendingDown size={16} color="var(--red)" />}
              <span className={stock.changePct >= 0 ? "pos" : "neg"} style={{ fontSize: 16, fontWeight: 700 }}>
                {stock.changePct >= 0 ? "+" : ""}{stock.change.toFixed(3)} ({stock.changePct >= 0 ? "+" : ""}{stock.changePct.toFixed(2)}%)
              </span>
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>Bursa Malaysia · MYR</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={() => setWatchlisted(v => !v)} className={watchlisted ? "btn-primary" : "btn-ghost"}
            style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Star size={13} fill={watchlisted ? "#000" : "none"} /> {watchlisted ? "Watchlisted" : "Add to Watchlist"}
          </button>
          <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Share2 size={13} /> Share
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            border: "none", cursor: "pointer", transition: "all 0.15s",
            background: tab === t ? "var(--accent)" : "var(--card)",
            color: tab === t ? "#000" : "var(--text2)",
          }}>{t}</button>
        ))}
      </div>

      {tab === "Chart" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
          <div>
            {/* TradingView advanced chart */}
            <div className="card" style={{ marginBottom: 16 }}>
              <TradingViewChart symbol={symbol} />
            </div>
            {/* TradingView mini overview */}
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Price Overview</div>
              <TradingViewMini symbol={symbol} />
            </div>
          </div>

          {/* Key stats */}
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Key Statistics</div>
            <Stat label="Market Cap" value={`MYR ${(stock.marketCap / 1000).toFixed(2)}B`} />
            <Stat label="P/E Ratio" value={`${stock.pe.toFixed(1)}x`} />
            <Stat label="P/B Ratio" value={`${stock.pb.toFixed(2)}x`} />
            <Stat label="EPS" value={`RM ${stock.eps.toFixed(3)}`} />
            <Stat label="Dividend Yield" value={`${stock.dividendYield.toFixed(2)}%`} />
            <Stat label="ROE" value={`${stock.roe.toFixed(1)}%`} />
            <Stat label="ROA" value={`${stock.roa.toFixed(2)}%`} />
            <Stat label="Debt/Equity" value={`${stock.debtEquity.toFixed(2)}x`} />
            <Stat label="Beta" value={stock.beta.toFixed(2)} sub="vs FBM KLCI" />
            <Stat label="52W High" value={`RM ${stock.week52High.toFixed(3)}`} />
            <Stat label="52W Low" value={`RM ${stock.week52Low.toFixed(3)}`} />
            <Stat label="Volume" value={`${(stock.volume / 1e6).toFixed(2)}M`} />
            <Stat label="Shares Outstanding" value={`${(stock.shares / 1e9).toFixed(2)}B`} />
          </div>
        </div>
      )}

      {tab === "Financials" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Revenue (MYR M)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={financials}>
                <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false} width={55} />
                <Tooltip contentStyle={{ background:"var(--card2)", border:"1px solid var(--border)", borderRadius:8, fontSize:12 }} />
                <Bar dataKey="revenue" fill="var(--blue)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Net Profit (MYR M)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={financials}>
                <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false} width={55} />
                <Tooltip contentStyle={{ background:"var(--card2)", border:"1px solid var(--border)", borderRadius:8, fontSize:12 }} />
                <Bar dataKey="netProfit" fill="var(--accent)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ gridColumn:"span 2" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Quarterly Summary (MYR M)</div>
            <table className="data-table">
              <thead><tr><th>Quarter</th><th>Revenue</th><th>Net Profit</th><th>EPS (sen)</th><th>Margin</th></tr></thead>
              <tbody>
                {financials.map((q, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight:700 }}>{q.quarter}</td>
                    <td className="mono">{q.revenue.toLocaleString()}</td>
                    <td className="mono">{q.netProfit.toLocaleString()}</td>
                    <td className="mono">{(q.eps*100).toFixed(1)} sen</td>
                    <td className="mono">{((q.netProfit/q.revenue)*100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "About" && (
        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Company Profile</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              {[
                ["Company Name", stock.name],
                ["Stock Code", symbol],
                ["TradingView Symbol", `MYX:${symbol}`],
                ["Exchange", "Bursa Malaysia Main Market"],
                ["Sector", stock.sector],
                ["Industry", stock.industry],
                ["Currency", "Malaysian Ringgit (MYR)"],
              ].map(([k,v]) => (
                <div key={k} style={{ padding:"10px 0", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, color:"var(--text3)" }}>{k}</span>
                  <span style={{ fontSize:12, color:"var(--text)", fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              {[
                ["Market Cap", `MYR ${(stock.marketCap/1000).toFixed(2)}B`],
                ["Shares Outstanding", `${(stock.shares/1e9).toFixed(3)}B shares`],
                ["Fiscal Year End", "December 31"],
                ["Annual Revenue", `MYR ${(stock.revenue/1000).toFixed(2)}B`],
                ["Annual Net Profit", `MYR ${(stock.netProfit/1000).toFixed(2)}B`],
                ["Net Profit Margin", `${((stock.netProfit/stock.revenue)*100).toFixed(1)}%`],
              ].map(([k,v]) => (
                <div key={k} style={{ padding:"10px 0", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, color:"var(--text3)" }}>{k}</span>
                  <span style={{ fontSize:12, color:"var(--text)", fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
