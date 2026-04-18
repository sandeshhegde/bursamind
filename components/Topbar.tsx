"use client";
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { STOCKS } from "@/lib/data";
import Link from "next/link";

export default function Topbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof STOCKS>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const q = query.toLowerCase();
      setResults(STOCKS.filter(s =>
        s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      ).slice(0, 6));
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const now = new Date();
  const klciValue = 1598.42;

  return (
    <header style={{
      background: "var(--bg2)", borderBottom: "1px solid var(--border)",
      padding: "0 24px", height: 58, display: "flex", alignItems: "center",
      gap: 20, position: "sticky", top: 0, zIndex: 50
    }}>
      {/* Search */}
      <div ref={ref} style={{ position: "relative", flex: 1, maxWidth: 400 }}>
        <div style={{ position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
          <input
            className="input"
            placeholder="Search stocks, sectors…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ paddingLeft: 36, paddingRight: 36, fontSize: 13 }}
          />
          {query && (
            <button onClick={() => { setQuery(""); setOpen(false); }}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
              <X size={14} />
            </button>
          )}
        </div>
        {open && results.length > 0 && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 100, overflow: "hidden"
          }}>
            {results.map(s => (
              <Link key={s.symbol} href={`/stock/${s.symbol}`}
                onClick={() => { setQuery(""); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", textDecoration: "none", transition: "background 0.1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--card2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{s.symbol}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{s.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "JetBrains Mono, monospace" }}>RM {s.price.toFixed(3)}</div>
                  <div style={{ fontSize: 11 }} className={s.changePct >= 0 ? "pos" : "neg"}>{s.changePct >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* KLCI Index mini */}
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{ display: "flex", flex: "column" }}>
          <span style={{ fontSize: 11, color: "var(--text3)", marginRight: 8 }}>FBM KLCI</span>
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: "var(--text)" }}>{klciValue.toLocaleString()}</span>
          <span style={{ fontSize: 11, color: "var(--accent)", marginLeft: 6 }}>+0.52%</span>
        </div>
        <div style={{
          width: 8, height: 8, borderRadius: "50%", background: "var(--accent)",
          boxShadow: "0 0 8px var(--accent)", flexShrink: 0
        }} title="Market Open" />
        <div style={{ fontSize: 11, color: "var(--text3)" }}>
          {now.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })} MYT
        </div>
      </div>
    </header>
  );
}
