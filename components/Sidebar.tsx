"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, TrendingUp, Search, MessageSquare, Briefcase, BookOpen, Zap, ChevronDown, Eye, Newspaper } from "lucide-react";

const NAV = [
  { href:"/dashboard", icon:LayoutDashboard, label:"Dashboard" },
  { href:"/chat",      icon:MessageSquare,   label:"Ask Aria (AI)" },
  { href:"/news",      icon:Newspaper,       label:"News Hub",      badge:"LIVE" },
  { href:"/insider",   icon:Eye,             label:"Insider Intel",  badge:"NEW" },
  { href:"/research",  icon:BookOpen,        label:"Research Library" },
  { label:"Market Pulse", icon:Zap, children:[
    { href:"/market",   label:"Market Overview"      },
    { href:"/movers",   label:"Market Movers"        },
    { href:"/sectors",  label:"Sectors & Industries" },
  ]},
  { label:"Market Explorer", icon:Search, children:[
    { href:"/screener", label:"Stock Screener" },
    { href:"/ipo",      label:"IPO Tracker"    },
  ]},
  { label:"Investor's Suite", icon:Briefcase, children:[
    { href:"/portfolio", label:"Portfolio"  },
    { href:"/watchlist", label:"Watchlists" },
  ]},
];

export default function Sidebar() {
  const path = usePathname();
  const [open, setOpen] = useState<string[]>(["Market Pulse","Market Explorer","Investor's Suite"]);
  const toggle = (l:string) => setOpen(p => p.includes(l)?p.filter(x=>x!==l):[...p,l]);

  return (
    <aside style={{ width:224, minWidth:224, background:"var(--bg2)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0, overflow:"hidden" }}>
      {/* Logo */}
      <div style={{ padding:"20px 16px 16px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,var(--accent),var(--blue))", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <TrendingUp size={16} color="#000" strokeWidth={2.5}/>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:"var(--text)" }}>BursaMind</div>
            <div style={{ fontSize:10, color:"var(--text3)", fontWeight:500 }}>AI Research Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:"auto", padding:"12px 10px" }}>
        {NAV.map(item => {
          if ("children" in item && item.children) {
            const isOpen = open.includes(item.label);
            return (
              <div key={item.label} style={{ marginBottom:4 }}>
                <div onClick={()=>toggle(item.label)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 10px", borderRadius:8, cursor:"pointer", color:"var(--text3)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", userSelect:"none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}><item.icon size={14}/>{item.label}</div>
                  <ChevronDown size={12} style={{ transform:isOpen?"rotate(180deg)":"none", transition:"0.2s" }}/>
                </div>
                {isOpen && item.children.map(c=>(
                  <Link key={c.href} href={c.href} className={`sidebar-link${path===c.href?" active":""}`} style={{ paddingLeft:28, fontSize:13 }}>{c.label}</Link>
                ))}
              </div>
            );
          }
          if ("href" in item) {
            const isSpecial = "badge" in item && item.badge;
            const badgeColor = item.badge === "LIVE" ? "var(--accent)" : "var(--gold)";
            return (
              <Link key={item.href} href={item.href}
                className={`sidebar-link${path===item.href?" active":""}`}
                style={isSpecial ? { marginBottom:2 } : {}}>
                <item.icon size={15}/>
                {item.label}
                {isSpecial && (
                  <span style={{ marginLeft:"auto", fontSize:9, fontWeight:800, padding:"2px 6px", borderRadius:20, background:badgeColor, color:"#000" }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          }
          return null;
        })}
      </nav>

      {/* Bottom badge */}
      <div style={{ padding:"12px 10px", borderTop:"1px solid var(--border)" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(0,200,151,0.1),rgba(77,159,255,0.1))", border:"1px solid rgba(0,200,151,0.2)", borderRadius:10, padding:"12px 14px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"var(--accent)", marginBottom:4 }}>🇲🇾 Bursa Malaysia</div>
          <div style={{ fontSize:10, color:"var(--text3)", lineHeight:1.5 }}>Main · ACE · LEAP Market<br/>Powered by Groq AI</div>
        </div>
      </div>
    </aside>
  );
}
