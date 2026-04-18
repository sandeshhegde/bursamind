"use client";
import { useParams } from "next/navigation";
import { STOCKS, generatePriceHistory, generateFinancials } from "@/lib/data";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, Star, Share2, AlertCircle } from "lucide-react";

const PERIODS = ["1W", "1M", "3M", "6M", "1Y"];

export default function StockPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const stock = STOCKS.find(s => s.symbol === symbol);
  const [period, setPeriod] = useState("3M");
  const [tab, setTab] = useState("Overview");
  const [watchlisted, setWatchlisted] = useState(false);

  if (!stock) return (
    <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>
      <AlertCircle size={32} style={{ margin: "0 auto 12px", display: "block" }} />
      Stock "{symbol}" not found in Bursa Malaysia database.
    </div>
  );

  const days = period === "1W" ? 7 : period === "1M" ? 30 : period === "3M" ? 90 : period === "6M" ? 180 : 365;
  const priceData = generatePriceHistory(stock.price, Math.min(days, 90));
  const financials = generateFinancials(stock);

  const TABS = ["Overview", "Financials", "About"];

  const Stat = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginBottom: 4 }}>{label}</div>
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
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "linear-gradient(135deg, var(--card2), var(--border2))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 800, color: "var(--accent)"
              }}>{stock.symbol.slice(0, 2)}</div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)" }}>{stock.symbol}</h1>
                <div style={{ fontSize: 13, color: "var(--text3)" }}>{stock.name}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tag-blue">{stock.sector}</span>
              <span className="tag-blue">{stock.industry}</span>
              <span className="tag-gold">Bursa Malaysia</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: "var(--text)", marginBottom: 6 }}>
              RM {stock.price.toFixed(3)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
              {stock.changePct >= 0
                ? <TrendingUp size={16} color="var(--accent)" />
                : <TrendingDown size={16} color="var(--red)" />}
              <span className={stock.changePct >= 0 ? "pos" : "neg"} style={{ fontSize: 16, fontWeight: 700 }}>
                {stock.changePct >= 0 ? "+" : ""}{stock.change.toFixed(3)} ({stock.changePct >= 0 ? "+" : ""}{stock.changePct.toFixed(2)}%)
              </span>
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>As of market close · Prices delayed</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={() => setWatchlisted(v => !v)}
            className={watchlisted ? "btn-primary" : "btn-ghost"}
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

      {tab === "Overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
          <div>
            {/* Chart */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Price Chart</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {PERIODS.map(p => (
                    <button key={p} onClick={() => setPeriod(p)} style={{
                      padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                      border: "none", cursor: "pointer",
                      background: period === p ? "var(--accent)" : "var(--card2)",
                      color: period === p ? "#000" : "var(--text3)"
                    }}>{p}</button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text3)" }} interval={Math.floor(priceData.length / 6)} axisLine={false} tickLine={false} />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="price" stroke="var(--accent)" fill="url(#priceGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Volume chart */}
            <div className="card">
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Volume</div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={priceData.slice(-30)}>
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--text3)" }} interval={5} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "var(--text3)" }} axisLine={false} tickLine={false} width={45} tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} />
                  <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} formatter={(v: unknown) => [`${((v as number) / 1e6).toFixed(2)}M`, "Vol"]} />
                  <Bar dataKey="volume" fill="rgba(77,159,255,0.5)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key stats sidebar */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
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
                <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="var(--blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Net Profit (MYR M)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={financials}>
                <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false} width={55} />
                <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="netProfit" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ gridColumn: "span 2" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Quarterly Summary (MYR M)</div>
            <table className="data-table">
              <thead>
                <tr><th>Quarter</th><th>Revenue</th><th>Net Profit</th><th>EPS (sen)</th><th>Margin</th></tr>
              </thead>
              <tbody>
                {financials.map((q, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{q.quarter}</td>
                    <td className="mono">{q.revenue.toLocaleString()}</td>
                    <td className="mono">{q.netProfit.toLocaleString()}</td>
                    <td className="mono">{(q.eps * 100).toFixed(1)} sen</td>
                    <td className="mono">{((q.netProfit / q.revenue) * 100).toFixed(1)}%</td>
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
                ["Stock Code", stock.symbol],
                ["Exchange", "Bursa Malaysia Main Market"],
                ["Sector", stock.sector],
                ["Industry", stock.industry],
                ["Currency", "Malaysian Ringgit (MYR)"],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>{k}</span>
                  <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              {[
                ["Market Cap", `MYR ${(stock.marketCap / 1000).toFixed(2)}B`],
                ["Shares Outstanding", `${(stock.shares / 1e9).toFixed(3)}B shares`],
                ["Fiscal Year End", "December 31"],
                ["Annual Revenue", `MYR ${(stock.revenue / 1000).toFixed(2)}B`],
                ["Annual Net Profit", `MYR ${(stock.netProfit / 1000).toFixed(2)}B`],
                ["Net Profit Margin", `${((stock.netProfit / stock.revenue) * 100).toFixed(1)}%`],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>{k}</span>
                  <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
