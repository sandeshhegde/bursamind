"use client";
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { STOCKS } from "@/lib/data";
import Link from "next/link";

// TradingView Ticker Tape — US stocks, standard ticker symbols
function TickerTape() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName:"NASDAQ:AAPL",  title:"Apple"      },
        { proName:"NASDAQ:MSFT",  title:"Microsoft"  },
        { proName:"NASDAQ:NVDA",  title:"NVIDIA"     },
        { proName:"NASDAQ:AMZN",  title:"Amazon"     },
        { proName:"NASDAQ:GOOGL", title:"Alphabet"   },
        { proName:"NASDAQ:META",  title:"Meta"       },
        { proName:"NASDAQ:TSLA",  title:"Tesla"      },
        { proName:"NYSE:JPM",     title:"JPMorgan"   },
        { proName:"NYSE:V",       title:"Visa"       },
        { proName:"NYSE:XOM",     title:"ExxonMobil" },
        { proName:"NYSE:WMT",     title:"Walmart"    },
        { proName:"NASDAQ:COST",  title:"Costco"     },
        { proName:"NASDAQ:NFLX",  title:"Netflix"    },
        { proName:"NASDAQ:AVGO",  title:"Broadcom"   },
        { proName:"NYSE:MA",      title:"Mastercard" },
        { proName:"FOREXCOM:SPXUSD", title:"S&P 500" },
        { proName:"NASDAQ:NDX",   title:"NASDAQ 100" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });
    ref.current.appendChild(script);
  }, []);
  return <div className="tradingview-widget-container" ref={ref} style={{ width:"100%", height:46, overflow:"hidden" }}/>;
}

export default function Topbar() {
  const [query, setQuery]   = useState("");
  const [results, setResults] = useState<typeof STOCKS>([]);
  const [open, setOpen]     = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const q = query.toLowerCase();
      setResults(STOCKS.filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)).slice(0,6));
      setOpen(true);
    } else { setResults([]); setOpen(false); }
  }, [query]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div style={{ background:"var(--bg2)", borderBottom:"1px solid var(--border)", position:"sticky", top:0, zIndex:50 }}>
      <div style={{ borderBottom:"1px solid var(--border)", background:"var(--bg3)", overflow:"hidden", height:46 }}>
        <TickerTape/>
      </div>
      <header style={{ padding:"0 24px", height:50, display:"flex", alignItems:"center", gap:20 }}>
        <div ref={ref} style={{ position:"relative", flex:1, maxWidth:420 }}>
          <div style={{ position:"relative" }}>
            <Search size={15} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--text3)" }}/>
            <input className="input" placeholder="Search US stocks by ticker or name…" value={query}
              onChange={e => setQuery(e.target.value)} style={{ paddingLeft:36, paddingRight:36, fontSize:13 }}/>
            {query && <button onClick={() => { setQuery(""); setOpen(false); }} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--text3)" }}><X size={14}/></button>}
          </div>
          {open && results.length > 0 && (
            <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:"var(--card)", border:"1px solid var(--border)", borderRadius:10, boxShadow:"0 8px 32px rgba(0,0,0,0.4)", zIndex:100, overflow:"hidden" }}>
              {results.map(s => (
                <Link key={s.symbol} href={`/stock/${s.symbol}`} onClick={() => { setQuery(""); setOpen(false); }}
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", textDecoration:"none" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background="var(--card2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background="transparent"}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:30, height:30, borderRadius:8, overflow:"hidden", background:"var(--card2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <img src={`https://logo.clearbit.com/${s.name.toLowerCase().replace(/[^a-z]/g,"").slice(0,12)}.com`} width={30} height={30} style={{ objectFit:"contain", padding:4 }} alt={s.symbol}
                        onError={e => { const el=e.currentTarget as HTMLImageElement; el.style.display="none"; const p=el.parentElement; if(p) p.innerHTML=`<span style="font-size:10px;font-weight:800;color:var(--accent)">${s.symbol.slice(0,3)}</span>`; }}/>
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>{s.symbol}</div>
                      <div style={{ fontSize:11, color:"var(--text3)" }}>{s.name.slice(0,30)}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", fontFamily:"JetBrains Mono,monospace" }}>${s.price.toFixed(2)}</div>
                    <div style={{ fontSize:11 }} className={s.changePct>=0?"pos":"neg"}>{s.changePct>=0?"+":""}{s.changePct.toFixed(2)}%</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginLeft:"auto", fontSize:11, color:"var(--text3)" }}>
          {new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})} ET · NYSE / NASDAQ
        </div>
      </header>
    </div>
  );
}
