"use client";
import Link from "next/link";
import { STOCKS, MARKET_INDICES, KLCI_HISTORY, CORPORATE_ACTIONS } from "@/lib/data";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown, Activity, BarChart2, ArrowRight, Zap } from "lucide-react";

export default function Dashboard() {
  const gainers = [...STOCKS].sort((a, b) => b.changePct - a.changePct).slice(0, 5);
  const losers = [...STOCKS].sort((a, b) => a.changePct - b.changePct).slice(0, 5);

  return (
    <div className="fade-in" style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
          Market Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)" }}>
          Bursa Malaysia · {new Date().toLocaleDateString("en-MY", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Index Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {MARKET_INDICES.map(idx => (
          <div key={idx.name} className="card" style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginBottom: 8 }}>{idx.name}</div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: "var(--text)", marginBottom: 4 }}>
              {idx.value.toLocaleString()}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {idx.changePct >= 0
                ? <TrendingUp size={13} color="var(--accent)" />
                : <TrendingDown size={13} color="var(--red)" />}
              <span style={{ fontSize: 12, fontWeight: 600 }} className={idx.changePct >= 0 ? "pos" : "neg"}>
                {idx.changePct >= 0 ? "+" : ""}{idx.changePct.toFixed(2)}% ({idx.change >= 0 ? "+" : ""}{idx.change.toFixed(2)})
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* KLCI Chart + Top Gainers/Losers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>FBM KLCI — 60 Day Chart</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>Composite Index Performance</div>
            </div>
            <span className="tag-green">+0.52% Today</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={KLCI_HISTORY}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text3)" }} interval={9} axisLine={false} tickLine={false} />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10, fill: "var(--text3)" }} axisLine={false} tickLine={false} width={55} />
              <Tooltip
                contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "var(--text3)" }}
                itemStyle={{ color: "var(--accent)" }}
              />
              <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <TrendingUp size={15} color="var(--accent)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Top Gainers</span>
            </div>
            {gainers.map(s => (
              <Link key={s.symbol} href={`/stock/${s.symbol}`}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--border)", textDecoration: "none" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{s.symbol}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>RM {s.price.toFixed(3)}</div>
                </div>
                <span className="tag-green">+{s.changePct.toFixed(2)}%</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Losers */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <TrendingDown size={15} color="var(--red)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Top Losers</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Stock</th><th>Sector</th><th>Price</th><th>Change</th>
              </tr>
            </thead>
            <tbody>
              {losers.map(s => (
                <tr key={s.symbol} onClick={() => window.location.href = `/stock/${s.symbol}`}>
                  <td style={{ fontWeight: 700 }}>{s.symbol}<br /><span style={{ fontSize: 10, fontWeight: 400, color: "var(--text3)" }}>{s.name.slice(0, 22)}</span></td>
                  <td>{s.sector}</td>
                  <td className="mono">RM {s.price.toFixed(3)}</td>
                  <td><span className="tag-red">{s.changePct.toFixed(2)}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Corporate Actions */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Zap size={15} color="var(--gold)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Corporate Actions</span>
            </div>
            <Link href="/market" style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CORPORATE_ACTIONS.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span className={a.action === "Dividend" ? "tag-green" : a.action === "AGM" ? "tag-blue" : "tag-gold"}>
                  {a.action}
                </span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{a.company} — {a.detail}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>Ex Date: {a.exDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 16 }}>
        {[
          { href: "/chat", label: "Ask Aria AI", sub: "Get stock insights", color: "var(--accent)" },
          { href: "/screener", label: "Stock Screener", sub: "Filter by fundamentals", color: "var(--blue)" },
          { href: "/ipo", label: "IPO Tracker", sub: "Upcoming listings", color: "var(--gold)" },
          { href: "/sectors", label: "Sector Analysis", sub: "Industry breakdown", color: "var(--purple)" },
        ].map(item => (
          <Link key={item.href} href={item.href}
            style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", textDecoration: "none", display: "block", transition: "all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = item.color; (e.currentTarget as HTMLElement).style.background = "var(--card2)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.background = "var(--card)"; }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>{item.sub}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
