"use client";
import { useState } from "react";
import { useLivePrices } from "@/lib/useLivePrices";
import { Plus, Trash2, Eye, Star } from "lucide-react";
import Link from "next/link";
const DEFAULT = ["AAPL","MSFT","NVDA","GOOGL","META"];
export default function Watchlist() {
  const { stocks, isLive } = useLivePrices();
  const [watched, setWatched] = useState<string[]>(DEFAULT);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const watchedStocks = stocks.filter(s=>watched.includes(s.symbol));
  const searchResults = stocks.filter(s=>(s.symbol.toLowerCase().includes(search.toLowerCase())||s.name.toLowerCase().includes(search.toLowerCase()))&&!watched.includes(s.symbol)).slice(0,6);
  const remove=(sym:string)=>setWatched(p=>p.filter(s=>s!==sym));
  const add=(sym:string)=>{setWatched(p=>[...p,sym]);setSearch("");setShowSearch(false);};
  return (
    <div className="fade-in" style={{maxWidth:1000}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div><h1 style={{fontSize:22,fontWeight:800,color:"var(--text)",marginBottom:4}}>Watchlist</h1><p style={{fontSize:13,color:"var(--text3)"}}>Monitor your favourite US stocks{isLive&&<span className="tag-green" style={{marginLeft:8,fontSize:10}}>Live</span>}</p></div>
        <button onClick={()=>setShowSearch(v=>!v)} className="btn-primary" style={{display:"flex",alignItems:"center",gap:8}}><Plus size={14}/>Add Stock</button>
      </div>
      {showSearch&&<div className="card fade-in" style={{marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:700,color:"var(--text)",marginBottom:10}}>Search to add</div>
        <input className="input" placeholder="Type ticker or company name…" value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:12}}/>
        {searchResults.length>0&&<div style={{display:"flex",flexDirection:"column",gap:2}}>{searchResults.map(s=><div key={s.symbol} onClick={()=>add(s.symbol)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",borderRadius:8,cursor:"pointer"}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="var(--card2)"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
          <div><span style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>{s.symbol}</span><span style={{fontSize:12,color:"var(--text3)",marginLeft:10}}>{s.name}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontFamily:"Roboto Mono,monospace",fontSize:13,color:"var(--text)"}}>${s.price.toFixed(2)}</span><span className={s.changePct>=0?"tag-green":"tag-red"}>{s.changePct>=0?"+":""}{s.changePct.toFixed(2)}%</span><Plus size={14} color="var(--accent)"/></div>
        </div>)}</div>}
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[{label:"Watching",val:watched.length},{label:"Advancers",val:watchedStocks.filter(s=>s.changePct>0).length},{label:"Decliners",val:watchedStocks.filter(s=>s.changePct<0).length},{label:"Avg Change",val:watchedStocks.length?`${(watchedStocks.reduce((a,s)=>a+s.changePct,0)/watchedStocks.length).toFixed(2)}%`:"—"}].map(c=><div key={c.label} className="card" style={{padding:"14px 16px"}}><div style={{fontSize:11,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",marginBottom:6}}>{c.label}</div><div style={{fontSize:22,fontWeight:800,color:"var(--text)",fontFamily:"Roboto Mono,monospace"}}>{c.val}</div></div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {watchedStocks.map(s=><div key={s.symbol} className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div><div style={{fontSize:15,fontWeight:800,color:"var(--text)",marginBottom:2}}>{s.symbol}</div><div style={{fontSize:11,color:"var(--text3)"}}>{s.name.slice(0,28)}</div></div>
            <div style={{display:"flex",gap:8}}>
              <Link href={`/stock/${s.symbol}`} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text3)",padding:4,display:"flex",textDecoration:"none"}}><Eye size={14}/></Link>
              <button onClick={()=>remove(s.symbol)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text3)",padding:4}}><Trash2 size={14}/></button>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div><div style={{fontSize:22,fontWeight:800,fontFamily:"Roboto Mono,monospace",color:"var(--text)"}}>${s.price.toFixed(2)}</div><div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>P/E {s.pe?`${s.pe.toFixed(1)}x`:"—"} · DY {s.dividendYield.toFixed(2)}%</div></div>
            <div style={{textAlign:"right"}}><span className={s.changePct>=0?"tag-green":"tag-red"} style={{fontSize:13,display:"block",marginBottom:4}}>{s.changePct>=0?"+":""}{s.changePct.toFixed(2)}%</span><div style={{fontSize:11,color:"var(--text3)"}}>Vol: {(s.volume/1e6).toFixed(1)}M</div></div>
          </div>
          <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid var(--border)"}}><span className="tag-blue" style={{fontSize:10}}>{s.sector.split(" ")[0]}</span></div>
        </div>)}
      </div>
      {watched.length===0&&<div style={{textAlign:"center",padding:"60px 20px",color:"var(--text3)"}}><Star size={32} style={{margin:"0 auto 12px",display:"block",opacity:0.4}}/><div style={{fontSize:14,fontWeight:600,marginBottom:6}}>No stocks in your watchlist</div><div style={{fontSize:12}}>Click "Add Stock" to start tracking US stocks</div></div>}
    </div>
  );
}
