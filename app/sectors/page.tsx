"use client";
import { SECTORS } from "@/lib/data";
import { useLivePrices } from "@/lib/useLivePrices";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
export default function Sectors() {
  const { stocks } = useLivePrices();
  const [selected, setSelected] = useState<string|null>(null);
  const barData = SECTORS.map(s=>({name:s.name.split(" ")[0],change:s.change}));
  const sectorStocks = selected ? stocks.filter(s=>s.sector===selected) : [];
  return (
    <div className="fade-in" style={{maxWidth:1300}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:800,color:"var(--text)",marginBottom:4}}>S&P 500 Sectors & Industries</h1><p style={{fontSize:13,color:"var(--text3)"}}>US market sector performance and breakdown — GICS classification</p></div>
      <div className="card" style={{marginBottom:20}}>
        <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:16}}>Today's Sector Performance (%)</div>
        <ResponsiveContainer width="100%" height={200}><BarChart data={barData} barSize={32}><XAxis dataKey="name" tick={{fontSize:10,fill:"var(--text3)"}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:"var(--text3)"}} axisLine={false} tickLine={false} width={40}/><Tooltip contentStyle={{background:"var(--card2)",border:"1px solid var(--border)",borderRadius:8,fontSize:12}} formatter={(v:unknown)=>[`${(v as number)>=0?"+":""}${(v as number).toFixed(2)}%`,"Change"]}/><Bar dataKey="change" radius={[4,4,0,0]}>{barData.map((d,i)=><Cell key={i} fill={d.change>=0?"var(--accent)":"var(--red)"} fillOpacity={0.8}/>)}</Bar></BarChart></ResponsiveContainer>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        {SECTORS.map(s=><div key={s.name} onClick={()=>setSelected(selected===s.name?null:s.name)} className="card" style={{cursor:"pointer",transition:"all 0.15s",border:selected===s.name?"1px solid var(--accent)":"1px solid var(--border)",background:selected===s.name?"rgba(0,200,151,0.05)":"var(--card)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div><div style={{fontSize:13,fontWeight:700,color:"var(--text)",marginBottom:4}}>{s.name}</div><div style={{fontSize:11,color:"var(--text3)"}}>{s.stocks} stocks · ${(s.marketCap/1000).toFixed(0)}B cap</div></div>
            <span className={s.change>=0?"tag-green":"tag-red"} style={{fontSize:13,padding:"4px 10px"}}>{s.change>=0?"+":""}{s.change.toFixed(2)}%</span>
          </div>
        </div>)}
      </div>
      {selected&&sectorStocks.length>0&&<div className="card fade-in" style={{padding:0}}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>{selected} — Stocks</span>
          <button onClick={()=>setSelected(null)} className="btn-ghost" style={{fontSize:11}}>✕ Close</button>
        </div>
        <table className="data-table"><thead><tr><th>Stock</th><th>Price</th><th>Change</th><th>Mkt Cap</th><th>P/E</th><th>Div Yield</th><th>Beta</th></tr></thead>
        <tbody>{sectorStocks.map(s=><tr key={s.symbol} onClick={()=>window.location.href=`/stock/${s.symbol}`} style={{cursor:"pointer"}}>
          <td><div style={{fontWeight:700,color:"var(--text)"}}>{s.symbol}</div><div style={{fontSize:10,color:"var(--text3)"}}>{s.name.slice(0,30)}</div></td>
          <td className="mono">${s.price.toFixed(2)}</td>
          <td><span className={s.changePct>=0?"tag-green":"tag-red"}>{s.changePct>=0?"+":""}{s.changePct.toFixed(2)}%</span></td>
          <td className="mono">${(s.marketCap/1000).toFixed(1)}B</td>
          <td className="mono">{s.pe?`${s.pe.toFixed(1)}x`:"—"}</td>
          <td className="mono">{s.dividendYield.toFixed(2)}%</td>
          <td className="mono">{s.beta.toFixed(2)}</td>
        </tr>)}</tbody></table>
      </div>}
    </div>
  );
}
