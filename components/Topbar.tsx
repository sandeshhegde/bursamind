"use client";
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { STOCKS } from "@/lib/data";
import Link from "next/link";

// TradingView Ticker Tape
function TickerTape() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "MYX:1155", title: "MAYBANK" },
        { proName: "MYX:1023", title: "CIMB" },
        { proName: "MYX:1295", title: "PBBANK" },
        { proName: "MYX:5347", title: "TENAGA" },
        { proName: "MYX:6012", title: "MAXIS" },
        { proName: "MYX:5225", title: "IHH" },
        { proName: "MYX:0166", title: "INARI" },
        { proName: "MYX:3182", title: "GENTING" },
        { proName: "MYX:5183", title: "PCHEM" },
        { proName: "MYX:6888", title: "AXIATA" },
      ],
      showSymbolLogo: false,
      isTransparent: true,
      displayMode: "compact",
      colorTheme: "dark",
      locale: "en",
    });
    ref.current.appendChild(script);
  }, []);
  return <div ref={ref} style={{ flex: 1, height: 36, overflow: "hidden" }} />;
}

export default function Topbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof STOCKS>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const q = query.toLowerCase();
      setResults(STOCKS.filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)).slice(0, 6));
      setOpen(true);
    } else { setResults([]); setOpen(false); }
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 50 }}>
      {/* TradingView ticker tape */}
      <div style={{ height: 36, borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <TickerTape />
      </div>

      {/* Main topbar */}
      <header style={{ padding: "0 24px", height: 50, display: "flex", alignItems: "center", gap: 20 }}>
        {/* Search */}
        <div ref={ref} style={{ position: "relative", flex: 1, maxWidth: 380 }}>
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
            <input className="input" placeholder="Search Bursa stocks…" value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ paddingLeft: 36, paddingRight: 36, fontSize: 13 }} />
            {query && (
              <button onClick={() => { setQuery(""); setOpen(false); }}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
                <X size={14} />
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

        <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--text3)" }}>
          {new Date().toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })} MYT · Bursa Malaysia
        </div>
      </header>
    </div>
  );
}
