import { NextRequest, NextResponse } from "next/server";

// Bursa Malaysia .KL suffix mapping for Yahoo Finance
const KL: Record<string,string> = {
  MAYBANK:"1155.KL", CIMB:"1023.KL",   PBBANK:"1295.KL",  TENAGA:"5347.KL",
  PCHEM:"5183.KL",   MAXIS:"6012.KL",  DIGI:"6947.KL",    GENTING:"3182.KL",
  IOICORP:"1961.KL", KLKK:"2445.KL",   SIME:"4197.KL",    AXIATA:"6888.KL",
  RHBBANK:"1066.KL", HLFG:"1082.KL",   MISC:"3816.KL",    IHH:"5225.KL",
  HARTA:"5168.KL",   TOPGLOV:"7113.KL",INARI:"0166.KL",   MY:"5014.KL",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbols = searchParams.get("symbols")?.split(",").filter(Boolean) || [];
  if (!symbols.length) return NextResponse.json({ error:"No symbols", data:{} });

  const yahooSymbols = symbols.map(s => KL[s.toUpperCase()] || `${s}.KL`).join(",");

  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketVolume,marketCap,trailingPE,fiftyTwoWeekHigh,fiftyTwoWeekLow`;
    const res = await fetch(url, {
      headers: { "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept:"application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Yahoo ${res.status}`);
    const data   = await res.json();
    const quotes = data?.quoteResponse?.result || [];
    const result: Record<string,object> = {};
    quotes.forEach((q: Record<string,number|string>) => {
      // Reverse-map yahoo symbol (e.g. "1155.KL") back to our symbol (e.g. "MAYBANK")
      const ourSym = symbols.find(s => (KL[s.toUpperCase()] || `${s}.KL`) === q.symbol) || String(q.symbol).replace(".KL","");
      result[ourSym] = {
        price:      Number(q.regularMarketPrice)         || 0,
        change:     Number(q.regularMarketChange)        || 0,
        changePct:  Number(q.regularMarketChangePercent) || 0,
        volume:     Number(q.regularMarketVolume)        || 0,
        marketCap:  Number(q.marketCap) ? Number(q.marketCap)/1e6 : 0,
        pe:         Number(q.trailingPE)       || 0,
        week52High: Number(q.fiftyTwoWeekHigh) || 0,
        week52Low:  Number(q.fiftyTwoWeekLow)  || 0,
      };
    });
    return NextResponse.json({ data: result, timestamp: new Date().toISOString() });
  } catch(err) {
    console.error("Yahoo Finance error:", err);
    return NextResponse.json({ error:"Failed", data:{} });
  }
}
