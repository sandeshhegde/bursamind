"use client";
import { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp, TrendingDown } from "lucide-react";
import { STOCKS, MARKET_INDICES } from "@/lib/data";
import Link from "next/link";

export default function Topbar() {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState<typeof STOCKS>([]);
  const [open, setOpen]       = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const q = query.toLowerCase();
      setResults(STOCKS.filter(s =>
        s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      ).slice(0, 6));
      setOpen(true);
    } else { setResults([]); setOpen(false); }
  }, [query]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 50 }}>
      {/* Index bar — replaces broken TradingView tape */}
      <div style={{
        display: "flex", alignItems: "center", gap: 0,
        borderBottom: "1px solid var(--border)", background: "var(--bg3)",
        padding: "0 20px", height: 36, overflowX: "auto",
      }}>
        {MARKET_INDICES.map((idx, i) => (
          <div key={idx.name} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "0 18px", height: "100%",
            borderRight: i < MARKET_INDICES.length - 1 ? "1px solid var(--border)" : "none",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{idx.name}</span>
            <span style={{ fontSize: 12, fontWeight: 800, fontFamily: "JetBrains Mono,monospace", color: "var(--text)" }}>
              {idx.value.toLocaleString()}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 2,
              color: idx.changePct >= 0 ? "var(--accent)" : "var(--red)"
            }}>
              {idx.changePct >= 0
                ? <TrendingUp size={10}/>
                : <TrendingDown size={10}/>}
              {idx.changePct >= 0 ? "+" : ""}{idx.changePct.toFixed(2)}%
            </span>
          </div>
        ))}
        {/* Live dot */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }}/>
          <span style={{ fontSize: 10, color: "var(--text3)" }}>
            {new Date().toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })} MYT
          </span>
        </div>
      </div>

      {/* Main topbar row */}
      <header style={{ padding: "0 24px", height: 50, display: "flex", alignItems: "center", gap: 16 }}>
        {/* Search */}
        <div ref={ref} style={{ position: "relative", flex: 1, maxWidth: 400 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}/>
            <input className="input" placeholder="Search Bursa stocks — MAYBANK, TENAGA, INARI…"
              value={query} onChange={e => setQuery(e.target.value)}
              style={{ paddingLeft: 34, paddingRight: 36, fontSize: 13 }}/>
            {query && (
              <button onClick={() => { setQuery(""); setOpen(false); }}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
                <X size={14}/>
              </button>
            )}
          </div>
          {open && results.length > 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 100, overflow: "hidden" }}>
              {results.map(s => (
                <Link key={s.symbol} href={`/stock/${s.symbol}`}
                  onClick={() => { setQuery(""); setOpen(false); }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--card2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, overflow: "hidden", background: "var(--card2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <img
                        src={`https://logo.clearbit.com/${s.name.toLowerCase().replace(/\s+(bhd|berhad|group|holdings|corporation|corp)\.*$/i,"").replace(/\s+/g,"")}.com`}
                        width={30} height={30} style={{ objectFit: "contain", padding: 4 }} alt={s.symbol}
                        onError={e => { const el = e.currentTarget as HTMLImageElement; el.style.display = "none"; const p = el.parentElement; if (p) p.innerHTML = `<span style="font-size:10px;font-weight:800;color:var(--accent)">${s.symbol.slice(0,3)}</span>`; }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{s.symbol}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{s.name.slice(0, 32)}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "JetBrains Mono,monospace" }}>RM {s.price.toFixed(3)}</div>
                    <div style={{ fontSize: 11 }} className={s.changePct >= 0 ? "pos" : "neg"}>{s.changePct >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick nav pills */}
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          {[
            { href: "/news",    label: "📰 News Hub" },
            { href: "/insider", label: "🔥 Insider Intel" },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{
              fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20,
              background: "var(--card)", border: "1px solid var(--border)",
              color: "var(--text2)", textDecoration: "none", transition: "all 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text2)"; }}>
              {l.label}
            </Link>
          ))}
        </div>
      </header>
    </div>
  );
}
