import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbols = searchParams.get("symbols")?.split(",").filter(Boolean) || [];
  if (!symbols.length) return NextResponse.json({ error:"No symbols", data:{} }, { status:400 });

  // US stocks — no suffix needed for Yahoo Finance
  const yahooSymbols = symbols.map(s => s === "BRK.B" ? "BRK-B" : s).join(",");

  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketVolume,marketCap,trailingPE,fiftyTwoWeekHigh,fiftyTwoWeekLow,regularMarketOpen,regularMarketDayHigh,regularMarketDayLow`;
    const res = await fetch(url, {
      headers: { "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept:"application/json" },
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`Yahoo ${res.status}`);
    const data   = await res.json();
    const quotes = data?.quoteResponse?.result || [];
    const result: Record<string, object> = {};
    quotes.forEach((q: Record<string,number|string>) => {
      // Restore BRK.B from BRK-B
      const sym = String(q.symbol).replace("BRK-B","BRK.B");
      result[sym] = {
        price:      Number(q.regularMarketPrice)         || 0,
        change:     Number(q.regularMarketChange)        || 0,
        changePct:  Number(q.regularMarketChangePercent) || 0,
        volume:     Number(q.regularMarketVolume)        || 0,
        marketCap:  Number(q.marketCap) ? Number(q.marketCap)/1e6 : 0,
        pe:         Number(q.trailingPE)       || 0,
        week52High: Number(q.fiftyTwoWeekHigh) || 0,
        week52Low:  Number(q.fiftyTwoWeekLow)  || 0,
        open:       Number(q.regularMarketOpen)    || 0,
        dayHigh:    Number(q.regularMarketDayHigh) || 0,
        dayLow:     Number(q.regularMarketDayLow)  || 0,
        symbol: sym,
      };
    });
    return NextResponse.json({ data: result, timestamp: new Date().toISOString() });
  } catch(err) {
    console.error("Yahoo Finance error:", err);
    return NextResponse.json({ error:"Failed to fetch", data:{} }, { status:200 });
  }
}
