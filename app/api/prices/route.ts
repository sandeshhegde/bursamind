import { NextRequest, NextResponse } from "next/server";

// Bursa Malaysia stock codes mapped to Yahoo Finance .KL symbols
const BURSA_SYMBOLS: Record<string, string> = {
  MAYBANK: "1155.KL",
  CIMB: "1023.KL",
  PBBANK: "1295.KL",
  TENAGA: "5347.KL",
  PCHEM: "5183.KL",
  MAXIS: "6012.KL",
  DIGI: "6947.KL",
  GENTING: "3182.KL",
  IOICORP: "1961.KL",
  KLKK: "2445.KL",
  SIME: "4197.KL",
  AXIATA: "6888.KL",
  RHBBANK: "1066.KL",
  HLFG: "1082.KL",
  MISC: "3816.KL",
  IHH: "5225.KL",
  HARTA: "5168.KL",
  TOPGLOV: "7113.KL",
  INARI: "0166.KL",
  MY: "5014.KL",
  // Indices
  "^KLSE": "^KLSE",
  "^FBM70": "^FBM70",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbols = searchParams.get("symbols")?.split(",") || [];

  if (symbols.length === 0) {
    return NextResponse.json({ error: "No symbols provided" }, { status: 400 });
  }

  const yahooSymbols = symbols
    .map(s => BURSA_SYMBOLS[s.toUpperCase()] || `${s}.KL`)
    .join(",");

  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketVolume,marketCap,trailingPE,fiftyTwoWeekHigh,fiftyTwoWeekLow,regularMarketOpen,regularMarketDayHigh,regularMarketDayLow`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
      },
      next: { revalidate: 60 }, // cache 60 seconds
    });

    if (!res.ok) {
      throw new Error(`Yahoo Finance returned ${res.status}`);
    }

    const data = await res.json();
    const quotes = data?.quoteResponse?.result || [];

    // Map back to our symbol format
    const result: Record<string, {
      price: number;
      change: number;
      changePct: number;
      volume: number;
      marketCap: number;
      pe: number;
      week52High: number;
      week52Low: number;
      open: number;
      dayHigh: number;
      dayLow: number;
      symbol: string;
    }> = {};

    quotes.forEach((q: Record<string, number | string>) => {
      // Reverse lookup: yahoo symbol → our symbol
      const ourSymbol = symbols.find(s =>
        (BURSA_SYMBOLS[s.toUpperCase()] || `${s}.KL`) === q.symbol
      ) || String(q.symbol).replace(".KL", "");

      result[ourSymbol] = {
        price: Number(q.regularMarketPrice) || 0,
        change: Number(q.regularMarketChange) || 0,
        changePct: Number(q.regularMarketChangePercent) || 0,
        volume: Number(q.regularMarketVolume) || 0,
        marketCap: Number(q.marketCap) ? Number(q.marketCap) / 1e6 : 0, // convert to MYR millions
        pe: Number(q.trailingPE) || 0,
        week52High: Number(q.fiftyTwoWeekHigh) || 0,
        week52Low: Number(q.fiftyTwoWeekLow) || 0,
        open: Number(q.regularMarketOpen) || 0,
        dayHigh: Number(q.regularMarketDayHigh) || 0,
        dayLow: Number(q.regularMarketDayLow) || 0,
        symbol: ourSymbol,
      };
    });

    return NextResponse.json({ data: result, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("Yahoo Finance error:", err);
    return NextResponse.json({ error: "Failed to fetch market data", data: {} }, { status: 200 });
  }
}
