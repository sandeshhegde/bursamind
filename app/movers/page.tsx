"use client";
import { useState } from "react";
import { useLivePrices } from "@/lib/useLivePrices";
import Link from "next/link";
import { TrendingUp, TrendingDown, Activity, Volume2 } from "lucide-react";
type Tab = "Gainers"|"Losers"|"Volume"|"Value";
export default function Movers() {
  const { stocks, isLive } = useLivePrices();
  const [tab, setTab] = useState<Tab>("Gainers");
  const sorted = { Gainers:[...stocks].filter(s=>s.changePct>0).sort((a,b)=>b.changePct-a.changePct), Losers:[...stocks].filter(s=>s.changePct<0).sort((a,b)=>a.changePct-b.changePct), Volume:[...stocks].sort((a,b)=>b.volume-a.volume), Value:[...stocks].sort((a,b)=>(b.price*b.volume)-(a.price*a.volume)) };
  const list = sorted[tab];
  return (
    <div className="fade-in" style={{maxWidth:1100}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:800,color:"var(--text)",marginBottom:4}}>US Market Movers</h1><p style={{fontSize:13,color:"var(--text3)"}}>Top moving stocks on NYSE & NASDAQ today{isLive&&<span className="tag-green" style={{marginLeft:8,fontSize:10}}>Live</span>}</p></div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {(["Gainers","Losers","Volume","Value"] as Tab[]).map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"8px 20px",borderRadius:8,fontSize:13,fontWeight:600,border:"none",cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",gap:6,background:tab===t?(t==="Gainers"?"var(--accent)":t==="Losers"?"var(--red)":"var(--blue)"):"var(--card)",color:tab===t?"#000":"var(--text2)"}}>
          {t==="Gainers"&&<TrendingUp size={13}/>}{t==="Losers"&&<TrendingDown size={13}/>}{t==="Volume"&&<Activity size={13}/>}{t==="Value"&&<Volume2 size={13}/>}{t}
        </button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14,marginBottom:24}}>
        {list.slice(0,6).map((s,i)=>(
          <Link key={s.symbol} href={`/stock/${s.symbol}`} style={{textDecoration:"none"}}>
            <div className="card" style={{cursor:"pointer",transition:"all 0.15s",borderLeft:`3px solid ${s.changePct>=0?"var(--accent)":"var(--red)"}`}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform="translateY(-2px)"} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform="none"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div><div style={{fontSize:14,fontWeight:800,color:"var(--text)"}}>{s.symbol}</div><div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{s.name.slice(0,24)}</div></div>
                <span style={{fontSize:22,fontWeight:300,color:"var(--text3)"}}>#{i+1}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                <div><div style={{fontSize:20,fontWeight:800,fontFamily:"Roboto Mono,monospace",color:"var(--text)"}}>${s.price.toFixed(2)}</div><div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>Vol: {(s.volume/1e6).toFixed(1)}M · MCap: ${(s.marketCap/1000).toFixed(0)}B</div></div>
                <span className={s.changePct>=0?"tag-green":"tag-red"} style={{fontSize:14,padding:"4px 10px"}}>{s.changePct>=0?"+":""}{s.changePct.toFixed(2)}%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="card" style={{padding:0}}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",fontSize:13,fontWeight:700,color:"var(--text)"}}>All {tab} — Full List</div>
        <table className="data-table"><thead><tr><th>#</th><th>Stock</th><th>Exchange</th><th>Price (USD)</th><th>Change $</th><th>Chg %</th><th>Volume</th><th>Mkt Cap</th></tr></thead>
        <tbody>{list.map((s,i)=><tr key={s.symbol} onClick={()=>window.location.href=`/stock/${s.symbol}`} style={{cursor:"pointer"}}>
          <td style={{color:"var(--text3)",fontWeight:700}}>{i+1}</td>
          <td><div style={{fontWeight:700,color:"var(--text)"}}>{s.symbol}</div><div style={{fontSize:10,color:"var(--text3)"}}>{s.name.slice(0,28)}</div></td>
          <td><span className="tag-blue">{s.sector.split(" ")[0]}</span></td>
          <td className="mono">${s.price.toFixed(2)}</td>
          <td className="mono" style={{color:s.change>=0?"var(--accent)":"var(--red)"}}>{s.change>=0?"+":""}{s.change.toFixed(2)}</td>
          <td><span className={s.changePct>=0?"tag-green":"tag-red"}>{s.changePct>=0?"+":""}{s.changePct.toFixed(2)}%</span></td>
          <td className="mono">{(s.volume/1e6).toFixed(1)}M</td>
          <td className="mono">${(s.marketCap/1000).toFixed(1)}B</td>
        </tr>)}</tbody></table>
      </div>
    </div>
  );
}
