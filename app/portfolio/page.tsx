"use client";
import { useState } from "react";
import { STOCKS } from "@/lib/data";
import { Plus, Trash2, TrendingUp, TrendingDown, Briefcase } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Holding {
  symbol: string;
  shares: number;
  avgCost: number;
}

const DEMO: Holding[] = [
  { symbol: "MAYBANK", shares: 1000, avgCost: 9.20 },
  { symbol: "PBBANK", shares: 2000, avgCost: 4.10 },
  { symbol: "TENAGA", shares: 500, avgCost: 12.50 },
  { symbol: "IHH", shares: 800, avgCost: 6.30 },
];

const COLORS = ["#00c897", "#4d9fff", "#f5b942", "#9b73f8", "#ff5f6b", "#00e0c8"];

export default function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>(DEMO);
  const [form, setForm] = useState({ symbol: "", shares: "", avgCost: "" });
  const [showAdd, setShowAdd] = useState(false);

  type EnrichedHolding = Holding & { stock: typeof STOCKS[0]; curVal: number; costBasis: number; pnl: number; pnlPct: number; };
  const enriched: EnrichedHolding[] = holdings.flatMap(h => {
    const stock = STOCKS.find(s => s.symbol === h.symbol);
    if (!stock) return [];
    const curVal = stock.price * h.shares;
    const costBasis = h.avgCost * h.shares;
    const pnl = curVal - costBasis;
    const pnlPct = ((curVal - costBasis) / costBasis) * 100;
    return [{ ...h, stock, curVal, costBasis, pnl, pnlPct }];
  });

  const totalValue = enriched.reduce((s, h) => s + h.curVal, 0);
  const totalCost = enriched.reduce((s, h) => s + h.costBasis, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPct = ((totalValue - totalCost) / totalCost) * 100;

  const pieData = enriched.map(h => ({ name: h.symbol, value: Math.round((h.curVal / totalValue) * 100) }));

  const addHolding = () => {
    if (!form.symbol || !form.shares || !form.avgCost) return;
    const stock = STOCKS.find(s => s.symbol === form.symbol.toUpperCase());
    if (!stock) return alert("Stock not found. Check the symbol.");
    setHoldings(prev => [...prev.filter(h => h.symbol !== form.symbol.toUpperCase()), {
      symbol: form.symbol.toUpperCase(),
      shares: parseFloat(form.shares),
      avgCost: parseFloat(form.avgCost),
    }]);
    setForm({ symbol: "", shares: "", avgCost: "" });
    setShowAdd(false);
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>Portfolio</h1>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>Track your Bursa Malaysia holdings and performance</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={14} /> Add Holding
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="card fade-in" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>Add Holding</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>
            <div>
              <label style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, display: "block", marginBottom: 6 }}>Stock Symbol</label>
              <input className="input" placeholder="e.g. MAYBANK" value={form.symbol} onChange={e => setForm(p => ({ ...p, symbol: e.target.value.toUpperCase() }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, display: "block", marginBottom: 6 }}>Shares</label>
              <input className="input" type="number" placeholder="e.g. 1000" value={form.shares} onChange={e => setForm(p => ({ ...p, shares: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, display: "block", marginBottom: 6 }}>Avg Cost (RM)</label>
              <input className="input" type="number" placeholder="e.g. 9.20" step="0.001" value={form.avgCost} onChange={e => setForm(p => ({ ...p, avgCost: e.target.value }))} />
            </div>
            <button onClick={addHolding} className="btn-primary">Add</button>
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 10 }}>
            Available symbols: {STOCKS.map(s => s.symbol).join(", ")}
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Value", val: `MYR ${totalValue.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: "var(--text)" },
          { label: "Total Cost", val: `MYR ${totalCost.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: "var(--text)" },
          { label: "Total P&L", val: `${totalPnL >= 0 ? "+" : ""}MYR ${Math.abs(totalPnL).toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: totalPnL >= 0 ? "var(--accent)" : "var(--red)" },
          { label: "Return %", val: `${totalPnLPct >= 0 ? "+" : ""}${totalPnLPct.toFixed(2)}%`, color: totalPnLPct >= 0 ? "var(--accent)" : "var(--red)" },
        ].map(c => (
          <div key={c.label} className="card" style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: c.color }}>{c.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 16 }}>
        {/* Holdings table */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
            Holdings ({enriched.length})
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Stock</th><th>Shares</th><th>Avg Cost</th><th>Cur Price</th><th>Value (MYR)</th><th>P&L</th><th>Return</th><th></th></tr>
            </thead>
            <tbody>
              {enriched.map(h => (
                <tr key={h.symbol} onClick={() => window.location.href = `/stock/${h.symbol}`} style={{ cursor: "pointer" }}>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--text)" }}>{h.symbol}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>{h.stock.sector}</div>
                  </td>
                  <td className="mono">{h.shares.toLocaleString()}</td>
                  <td className="mono">RM {h.avgCost.toFixed(3)}</td>
                  <td className="mono">RM {h.stock.price.toFixed(3)}</td>
                  <td className="mono">{h.curVal.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="mono" style={{ color: h.pnl >= 0 ? "var(--accent)" : "var(--red)" }}>
                    {h.pnl >= 0 ? "+" : ""}{h.pnl.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td><span className={h.pnlPct >= 0 ? "tag-green" : "tag-red"}>{h.pnlPct >= 0 ? "+" : ""}{h.pnlPct.toFixed(2)}%</span></td>
                  <td>
                    <button onClick={e => { e.stopPropagation(); setHoldings(prev => prev.filter(x => x.symbol !== h.symbol)); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", padding: 4 }}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Allocation pie */}
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Allocation</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v: unknown) => [`${v}%`, "Weight"]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {pieData.map((d, i) => (
              <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i % COLORS.length] }} />
                  <span style={{ fontSize: 12, color: "var(--text2)" }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: "var(--text)" }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
