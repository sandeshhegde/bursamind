"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, TrendingUp, Search, MessageSquare, Briefcase,
  Eye, BarChart2, Building2, Zap, ArrowUpDown, ChevronDown, Star
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/chat", icon: MessageSquare, label: "Ask Aria (AI)" },
  {
    label: "Market Pulse", icon: Zap, children: [
      { href: "/market", label: "Market Overview" },
      { href: "/movers", label: "Market Movers" },
      { href: "/sectors", label: "Sectors & Industries" },
    ]
  },
  {
    label: "Market Explorer", icon: Search, children: [
      { href: "/screener", label: "Stock Screener" },
      { href: "/ipo", label: "IPO Tracker" },
    ]
  },
  {
    label: "Investor's Suite", icon: Briefcase, children: [
      { href: "/portfolio", label: "Portfolio" },
      { href: "/watchlist", label: "Watchlists" },
    ]
  },
];

export default function Sidebar() {
  const path = usePathname();
  const [open, setOpen] = useState<string[]>(["Market Pulse", "Market Explorer", "Investor's Suite"]);

  const toggle = (label: string) =>
    setOpen(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);

  return (
    <aside style={{
      width: 220, minWidth: 220, background: "var(--bg2)",
      borderRight: "1px solid var(--border)", display: "flex",
      flexDirection: "column", padding: "0", height: "100vh",
      position: "sticky", top: 0, overflow: "hidden"
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, var(--accent), var(--blue))",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <TrendingUp size={16} color="#000" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>BursaMind</div>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 500 }}>AI Research Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
        {NAV.map(item => {
          if (item.children) {
            const isOpen = open.includes(item.label);
            return (
              <div key={item.label} style={{ marginBottom: 4 }}>
                <div
                  onClick={() => toggle(item.label)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "7px 10px", borderRadius: 8, cursor: "pointer",
                    color: "var(--text3)", fontSize: 11, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    userSelect: "none"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <item.icon size={14} />
                    {item.label}
                  </div>
                  <ChevronDown size={12} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                </div>
                {isOpen && item.children.map(child => (
                  <Link key={child.href} href={child.href} className={`sidebar-link${path === child.href ? " active" : ""}`}
                    style={{ paddingLeft: 28, fontSize: 13 }}>
                    {child.label}
                  </Link>
                ))}
              </div>
            );
          }
          return (
            <Link key={item.href} href={item.href!}
              className={`sidebar-link${path === item.href ? " active" : ""}`}>
              <item.icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid var(--border)" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(0,200,151,0.1), rgba(77,159,255,0.1))",
          border: "1px solid rgba(0,200,151,0.2)", borderRadius: 10, padding: "12px 14px"
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>Bursa Malaysia</div>
          <div style={{ fontSize: 10, color: "var(--text3)", lineHeight: 1.5 }}>
            Main Market · ACE Market · LEAP Market
          </div>
        </div>
      </div>
    </aside>
  );
}
