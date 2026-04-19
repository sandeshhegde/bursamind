"use client";
import { useState } from "react";
import { STOCKS } from "@/lib/data";
import { useLivePrices } from "@/lib/useLivePrices";
import { Plus, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
interface Holding { symbol:string; shares:number; avgCost:number; }
const DEMO: Holding[] = [{symbol:"AAPL",shares:50,avgCost:185.20},{symbol:"MSFT",shares:20,avgCost:390.00},{symbol:"NVDA",shares:10,avgCost:780.00},{symbol:"AMZN",shares:30,avgCost:178.50}];
const COLORS=["#00c897","#4d9fff","#f5b942","#9b73f8","#ff5f6b","#00e0c8"];
export default function Portfolio() {
  const { stocks } = useLivePrices();
  const [holdings, setHoldings] = useState<Holding[]>(DEMO);
  const [form, setForm] = useState({symbol:"",shares:"",avgCost:""});
  const [showAdd, setShowAdd] = useState(false);
  type EH = Holding & { stock: typeof STOCKS[0]; curVal:number; costBasis:number; pnl:number; pnlPct:number; };
  const enriched: EH[] = holdings.flatMap(h => {
    const stock = stocks.find(s=>s.symbol===h.symbol);
    if(!stock) return [];
    const curVal=stock.price*h.shares, costBasis=h.avgCost*h.shares, pnl=curVal-costBasis, pnlPct=(pnl/costBasis)*100;
    return [{...h,stock,curVal,costBasis,pnl,pnlPct}];
  });
  const totalValue=enriched.reduce((s,h)=>s+h.curVal,0), totalCost=enriched.reduce((s,h)=>s+h.costBasis,0), totalPnL=totalValue-totalCost, totalPct=((totalValue-totalCost)/totalCost)*100;
  const pieData=enriched.map(h=>({name:h.symbol,value:Math.round((h.curVal/totalValue)*100)}));
  const addHolding=()=>{if(!form.symbol||!form.shares||!form.avgCost)return;const stock=stocks.find(s=>s.symbol===form.symbol.toUpperCase());if(!stock)return alert("Symbol not found in our database.");setHoldings(p=>[...p.filter(h=>h.symbol!==form.symbol.toUpperCase()),{symbol:form.symbol.toUpperCase(),shares:parseFloat(form.shares),avgCost:parseFloat(form.avgCost)}]);setForm({symbol:"",shares:"",avgCost:""});setShowAdd(false);};
  return (
    <div className="fade-in" style={{maxWidth:1200}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div><h1 style={{fontSize:22,fontWeight:800,color:"var(--text)",marginBottom:4}}>Portfolio</h1><p style={{fontSize:13,color:"var(--text3)"}}>Track your US stock holdings and performance</p></div>
        <button onClick={()=>setShowAdd(v=>!v)} className="btn-primary" style={{display:"flex",alignItems:"center",gap:8}}><Plus size={14}/>Add Holding</button>
      </div>
      {showAdd&&<div className="card fade-in" style={{marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:700,color:"var(--text)",marginBottom:14}}>Add Holding</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:12,alignItems:"flex-end"}}>
          <div><label style={{fontSize:11,color:"var(--text3)",fontWeight:600,display:"block",marginBottom:6}}>Ticker Symbol</label><input className="input" placeholder="e.g. AAPL" value={form.symbol} onChange={e=>setForm(p=>({...p,symbol:e.target.value.toUpperCase()}))}/></div>
          <div><label style={{fontSize:11,color:"var(--text3)",fontWeight:600,display:"block",marginBottom:6}}>Shares</label><input className="input" type="number" placeholder="e.g. 100" value={form.shares} onChange={e=>setForm(p=>({...p,shares:e.target.value}))}/></div>
          <div><label style={{fontSize:11,color:"var(--text3)",fontWeight:600,display:"block",marginBottom:6}}>Avg Cost (USD)</label><input className="input" type="number" placeholder="e.g. 185.00" step="0.01" value={form.avgCost} onChange={e=>setForm(p=>({...p,avgCost:e.target.value}))}/></div>
          <button onClick={addHolding} className="btn-primary">Add</button>
        </div>
        <div style={{fontSize:11,color:"var(--text3)",marginTop:10}}>Available: {stocks.map(s=>s.symbol).join(", ")}</div>
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        {[{label:"Total Value",val:`$${totalValue.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`,color:"var(--text)"},{label:"Total Cost",val:`$${totalCost.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`,color:"var(--text)"},{label:"Total P&L",val:`${totalPnL>=0?"+":""}$${Math.abs(totalPnL).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`,color:totalPnL>=0?"var(--accent)":"var(--red)"},{label:"Return %",val:`${totalPct>=0?"+":""}${totalPct.toFixed(2)}%`,color:totalPct>=0?"var(--accent)":"var(--red)"}].map(c=><div key={c.label} className="card" style={{padding:"16px 18px"}}><div style={{fontSize:11,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>{c.label}</div><div style={{fontSize:18,fontWeight:800,fontFamily:"JetBrains Mono,monospace",color:c.color}}>{c.val}</div></div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:16}}>
        <div className="card" style={{padding:0}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",fontSize:13,fontWeight:700,color:"var(--text)"}}>Holdings ({enriched.length})</div>
          <table className="data-table"><thead><tr><th>Stock</th><th>Shares</th><th>Avg Cost</th><th>Cur Price</th><th>Value (USD)</th><th>P&L</th><th>Return</th><th></th></tr></thead>
          <tbody>{enriched.map(h=><tr key={h.symbol} onClick={()=>window.location.href=`/stock/${h.symbol}`} style={{cursor:"pointer"}}>
            <td><div style={{fontWeight:700,color:"var(--text)"}}>{h.symbol}</div><div style={{fontSize:10,color:"var(--text3)"}}>{h.stock.sector.split(" ")[0]}</div></td>
            <td className="mono">{h.shares.toLocaleString()}</td>
            <td className="mono">${h.avgCost.toFixed(2)}</td>
            <td className="mono">${h.stock.price.toFixed(2)}</td>
            <td className="mono">{h.curVal.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
            <td className="mono" style={{color:h.pnl>=0?"var(--accent)":"var(--red)"}}>{h.pnl>=0?"+":""}${Math.abs(h.pnl).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
            <td><span className={h.pnlPct>=0?"tag-green":"tag-red"}>{h.pnlPct>=0?"+":""}{h.pnlPct.toFixed(2)}%</span></td>
            <td><button onClick={e=>{e.stopPropagation();setHoldings(p=>p.filter(x=>x.symbol!==h.symbol));}} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text3)",padding:4}}><Trash2 size={13}/></button></td>
          </tr>)}</tbody></table>
        </div>
        <div className="card">
          <div style={{fontSize:13,fontWeight:700,color:"var(--text)",marginBottom:16}}>Allocation</div>
          <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">{pieData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip contentStyle={{background:"var(--card2)",border:"1px solid var(--border)",borderRadius:8,fontSize:12}} formatter={(v:unknown)=>[`${v}%`,"Weight"]}/></PieChart></ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>{pieData.map((d,i)=><div key={d.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:2,background:COLORS[i%COLORS.length]}}/><span style={{fontSize:12,color:"var(--text2)"}}>{d.name}</span></div><span style={{fontSize:12,fontWeight:700,fontFamily:"JetBrains Mono,monospace",color:"var(--text)"}}>{d.value}%</span></div>)}</div>
        </div>
      </div>
    </div>
  );
}
