"use client";
import { useState } from "react";
import { useLivePrices } from "@/lib/useLivePrices";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import { Stock } from "@/lib/data";
const SECTORS = ["All","Finance","Communications","Utilities","Healthcare","Consumer Staples","Industrials","Materials","Technology","Consumer Discretionary"];
type SK = keyof Stock;
export default function Screener() {
  const { stocks, isLive } = useLivePrices();
  const [sector, setSector] = useState("All");
  const [sortKey, setSortKey] = useState<SK>("marketCap");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc");
  const [filters, setFilters] = useState({minPE:"",maxPE:"",minDY:"",maxPB:""});
  const [showF, setShowF] = useState(false);
  const handleSort = (k:SK) => { if(sortKey===k) setSortDir(d=>d==="asc"?"desc":"asc"); else{setSortKey(k);setSortDir("desc");} };
  const filtered = stocks.filter(s=>sector==="All"||s.sector===sector).filter(s=>!filters.minPE||s.pe>=parseFloat(filters.minPE)).filter(s=>!filters.maxPE||s.pe<=parseFloat(filters.maxPE)).filter(s=>!filters.minDY||s.dividendYield>=parseFloat(filters.minDY)).filter(s=>!filters.maxPB||s.pb<=parseFloat(filters.maxPB)).sort((a,b)=>{const av=a[sortKey] as number,bv=b[sortKey] as number;return sortDir==="asc"?av-bv:bv-av;});
  const SI = ({k}:{k:SK}) => sortKey===k?(sortDir==="asc"?<SortAsc size={12}/>:<SortDesc size={12}/>):<span style={{opacity:0.3}}><SortAsc size={12}/></span>;
  return (
    <div className="fade-in">
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:800,color:"var(--text)",marginBottom:4}}>Stock Screener</h1><p style={{fontSize:13,color:"var(--text3)"}}>Filter and sort Bursa Malaysia stocks by fundamentals {isLive&&<span className="tag-green" style={{marginLeft:8}}>Live Prices</span>}</p></div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {SECTORS.map(s=><button key={s} onClick={()=>setSector(s)} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,border:sector===s?"none":"1px solid var(--border)",background:sector===s?"var(--accent)":"var(--card)",color:sector===s?"#000":"var(--text2)",cursor:"pointer",transition:"all 0.15s"}}>{s}</button>)}
        <button onClick={()=>setShowF(v=>!v)} className="btn-ghost" style={{display:"flex",alignItems:"center",gap:6,marginLeft:"auto"}}><Filter size={13}/>Filters {showF?"▲":"▼"}</button>
      </div>
      {showF&&<div className="card" style={{marginBottom:16}}><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>{[{label:"Min P/E",key:"minPE"},{label:"Max P/E",key:"maxPE"},{label:"Min Div Yield (%)",key:"minDY"},{label:"Max P/B",key:"maxPB"}].map(f=><div key={f.key}><label style={{fontSize:11,color:"var(--text3)",fontWeight:600,display:"block",marginBottom:6}}>{f.label}</label><input className="input" type="number" placeholder="Any" value={filters[f.key as keyof typeof filters]} onChange={e=>setFilters(p=>({...p,[f.key]:e.target.value}))} style={{fontSize:13}}/></div>)}</div><button onClick={()=>setFilters({minPE:"",maxPE:"",minDY:"",maxPB:""})} className="btn-ghost" style={{marginTop:12,fontSize:12}}>Clear</button></div>}
      <div className="card" style={{padding:0}}>
        <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border)"}}><span style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{filtered.length} stocks found</span></div>
        <div style={{overflowX:"auto"}}>
          <table className="data-table"><thead><tr><th>Stock</th>{[{label:"Price (RM)",k:"price"},{label:"Chg %",k:"changePct"},{label:"Mkt Cap (MRM)",k:"marketCap"},{label:"P/E",k:"pe"},{label:"P/B",k:"pb"},{label:"Div Yield",k:"dividendYield"},{label:"ROE %",k:"roe"},{label:"Volume",k:"volume"}].map(c=><th key={c.k} onClick={()=>handleSort(c.k as SK)} style={{cursor:"pointer",userSelect:"none"}}><span style={{display:"flex",alignItems:"center",gap:4}}>{c.label}<SI k={c.k as SK}/></span></th>)}</tr></thead>
          <tbody>{filtered.map(s=><tr key={s.symbol} onClick={()=>window.location.href=`/stock/${s.symbol}`} style={{cursor:"pointer"}}>
            <td><div style={{fontWeight:700,color:"var(--text)"}}>{s.symbol}</div><div style={{fontSize:11,color:"var(--text3)"}}>{s.name.slice(0,28)}</div></td>
            <td className="mono">RM {s.price.toFixed(3)}</td>
            <td><span className={s.changePct>=0?"tag-green":"tag-red"}>{s.changePct>=0?"+":""}{s.changePct.toFixed(2)}%</span></td>
            <td className="mono">{(s.marketCap/1000).toFixed(1)}B</td>
            <td className="mono">{s.pe.toFixed(1)}x</td>
            <td className="mono">{s.pb.toFixed(2)}x</td>
            <td className="mono">{s.dividendYield.toFixed(2)}%</td>
            <td className="mono">{s.roe.toFixed(1)}%</td>
            <td className="mono">{(s.volume/1e6).toFixed(2)}M</td>
          </tr>)}</tbody></table>
        </div>
      </div>
    </div>
  );
}
