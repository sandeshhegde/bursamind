"use client";
import { MARKET_INDICES, SP500_HISTORY, CORPORATE_ACTIONS, SECTORS } from "@/lib/data";
import { useLivePrices } from "@/lib/useLivePrices";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
export default function Market() {
  const { stocks, isLive } = useLivePrices();
  const adv = stocks.filter(s=>s.changePct>0).length, dec = stocks.filter(s=>s.changePct<0).length, unch = stocks.length-adv-dec;
  return (
    <div className="fade-in" style={{maxWidth:1300}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:800,color:"var(--text)",marginBottom:4}}>US Market Overview</h1><p style={{fontSize:13,color:"var(--text3)"}}>NYSE · NASDAQ · Real-time market summary{isLive&&<span className="tag-green" style={{marginLeft:8,fontSize:10}}>Live</span>}</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        {MARKET_INDICES.map(idx=><div key={idx.name} className="card" style={{padding:"16px 18px"}}>
          <div style={{fontSize:11,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>{idx.name}</div>
          <div style={{fontSize:22,fontWeight:800,fontFamily:"JetBrains Mono,monospace",color:"var(--text)",marginBottom:6}}>{idx.value.toLocaleString()}</div>
          <div style={{fontSize:12}} className={idx.changePct>=0?"pos":"neg"}>{idx.changePct>=0?"▲":"▼"} {Math.abs(idx.change).toFixed(2)} ({Math.abs(idx.changePct).toFixed(2)}%)</div>
        </div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div className="card">
          <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:16}}>S&P 500 — 60 Day Performance</div>
          <ResponsiveContainer width="100%" height={200}><LineChart data={SP500_HISTORY}><XAxis dataKey="date" tick={{fontSize:10,fill:"var(--text3)"}} interval={9} axisLine={false} tickLine={false}/><YAxis domain={["auto","auto"]} tick={{fontSize:10,fill:"var(--text3)"}} axisLine={false} tickLine={false} width={55}/><Tooltip contentStyle={{background:"var(--card2)",border:"1px solid var(--border)",borderRadius:8,fontSize:12}}/><Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer>
        </div>
        <div className="card">
          <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:16}}>Market Breadth</div>
          <div style={{display:"flex",alignItems:"center",gap:24}}>
            <ResponsiveContainer width={160} height={160}><PieChart><Pie data={[{name:"Adv",value:adv},{name:"Dec",value:dec},{name:"Unch",value:unch}]} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">{["var(--accent)","var(--red)","var(--text3)"].map((c,i)=><Cell key={i} fill={c}/>)}</Pie></PieChart></ResponsiveContainer>
            <div>{[{label:"Advancers",val:adv,color:"var(--accent)"},{label:"Decliners",val:dec,color:"var(--red)"},{label:"Unchanged",val:unch,color:"var(--text3)"}].map(b=><div key={b.label} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{width:10,height:10,borderRadius:2,background:b.color,flexShrink:0}}/><div><div style={{fontSize:20,fontWeight:800,color:b.color,fontFamily:"JetBrains Mono,monospace"}}>{b.val}</div><div style={{fontSize:11,color:"var(--text3)"}}>{b.label}</div></div></div>)}</div>
          </div>
        </div>
      </div>
      <div className="card" style={{marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:16}}>S&P 500 Sector Performance Today</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {SECTORS.map(s=><div key={s.name} style={{padding:"14px 16px",borderRadius:10,background:s.change>=0?`rgba(0,200,151,${Math.min(0.05+Math.abs(s.change)*0.05,0.28)})`:`rgba(255,95,107,${Math.min(0.05+Math.abs(s.change)*0.05,0.28)})`,border:`1px solid ${s.change>=0?"rgba(0,200,151,0.2)":"rgba(255,95,107,0.2)"}`}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--text)",marginBottom:4}}>{s.name}</div>
            <div style={{fontSize:18,fontWeight:800,fontFamily:"JetBrains Mono,monospace"}} className={s.change>=0?"pos":"neg"}>{s.change>=0?"+":""}{s.change.toFixed(2)}%</div>
            <div style={{fontSize:10,color:"var(--text3)",marginTop:4}}>{s.stocks} stocks · ${(s.marketCap/1000).toFixed(0)}B cap</div>
          </div>)}
        </div>
      </div>
      <div className="card">
        <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:16}}>Upcoming Corporate Actions</div>
        <table className="data-table"><thead><tr><th>Company</th><th>Action</th><th>Details</th><th>Ex-Date</th></tr></thead>
        <tbody>{CORPORATE_ACTIONS.map((a,i)=><tr key={i}><td style={{fontWeight:700,color:"var(--text)"}}>{a.company}</td><td><span className={a.action==="Dividend"?"tag-green":a.action==="Stock Split"?"tag-blue":"tag-gold"}>{a.action}</span></td><td>{a.detail}</td><td style={{fontFamily:"JetBrains Mono,monospace",fontSize:12}}>{a.exDate}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
