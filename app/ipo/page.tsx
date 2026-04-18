"use client";
import { IPO_LIST } from "@/lib/data";
import { useState } from "react";
import { Calendar, TrendingUp, AlertCircle } from "lucide-react";

export default function IPO() {
  const [tab, setTab] = useState<"All" | "Listed" | "Upcoming">("All");
  const filtered = IPO_LIST.filter(i => tab === "All" || i.status === tab);

  return (
    <div className="fade-in" style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>IPO Tracker</h1>
        <p style={{ fontSize: 13, color: "var(--text3)" }}>Bursa Malaysia new listings — Main Market, ACE Market & LEAP Market</p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total IPOs (2025)", value: IPO_LIST.length, color: "var(--blue)" },
          { label: "Listed", value: IPO_LIST.filter(i => i.status === "Listed").length, color: "var(--accent)" },
          { label: "Upcoming", value: IPO_LIST.filter(i => i.status === "Upcoming").length, color: "var(--gold)" },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["All", "Listed", "Upcoming"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "7px 18px", borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: "none", cursor: "pointer",
            background: tab === t ? "var(--accent)" : "var(--card)",
            color: tab === t ? "#000" : "var(--text2)",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(ipo => (
          <div key={ipo.symbol} className="card" style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{ipo.name}</div>
                <span className="tag-blue">{ipo.symbol}</span>
                <span className={ipo.status === "Listed" ? "tag-green" : "tag-gold"}>{ipo.status}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>{ipo.sector}</div>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, marginBottom: 4 }}>ISSUE PRICE</div>
                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: "var(--text)" }}>RM {ipo.issue.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, marginBottom: 4 }}>LISTING DATE</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", gap: 5 }}>
                  <Calendar size={12} /> {ipo.listing}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, marginBottom: 4 }}>MARKET CAP</div>
                <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: "var(--text)" }}>
                  MYR {ipo.marketCap}M
                </div>
              </div>
              {ipo.status === "Listed" && (
                <div>
                  <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, marginBottom: 4 }}>LISTING GAIN</div>
                  <div className={ipo.gain >= 0 ? "tag-green" : "tag-red"} style={{ fontSize: 14, padding: "4px 10px" }}>
                    {ipo.gain >= 0 ? "+" : ""}{ipo.gain.toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(77,159,255,0.08)", border: "1px solid rgba(77,159,255,0.2)", borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <AlertCircle size={15} color="var(--blue)" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>
          IPO data is for educational purposes only. Always refer to the official Bursa Malaysia prospectus and consult a licensed financial advisor before investing in IPOs. Past listing performance does not guarantee future results.
        </div>
      </div>
    </div>
  );
}
