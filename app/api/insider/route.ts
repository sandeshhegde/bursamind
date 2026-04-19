import { NextRequest, NextResponse } from "next/server";

// Fetches real Bursa Malaysia insider/director dealing announcements
// from Bursa's public announcement feed and i3investor's public data
// Both are 100% public — no API key required

const BURSA_ANN_URL =
  "https://www.bursamalaysia.com/api/v1/announcements/company_announcement" +
  "?per_page=50&page=1&category=Dealings+In+Listed+Securities&sub_category=Changes+In+Director%27s+Interest" +
  "&date_from=&date_to=&keyword=&stock_code=&announcement_type=";

// i3investor public substantial shareholder feed
const I3_SUBSTANTIAL_URL =
  "https://klse.i3investor.com/web/insider/substantialShareholder/list";

// Bursa XBRL announcement search for director dealings
const BURSA_SEARCH_URL =
  "https://www.bursamalaysia.com/api/v1/market/announcements?" +
  "category=Others&sub_category=&per_page=30&page=1" +
  "&keyword=director+interest&stock_code=&announcement_type=";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "all"; // director | substantial | all

  try {
    // Fetch Bursa Malaysia announcement feed — director dealings
    // Bursa provides a public JSON API for announcements
    const bursaRes = await fetch(
      "https://www.bursamalaysia.com/api/v1/market_announcements?" +
      "per_page=50&category=Dealings+In+Listed+Securities&page=1",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json, text/html",
          "Referer": "https://www.bursamalaysia.com/",
        },
        next: { revalidate: 120 }, // cache 2 min
      }
    );

    // Also fetch the i3investor insider feed (HTML, parse key data)
    const i3Res = await fetch(
      "https://klse.i3investor.com/web/insider/director/list",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "text/html,application/xhtml+xml",
          "Referer": "https://klse.i3investor.com/",
        },
        next: { revalidate: 120 },
      }
    );

    let bursaData: BursaAnnouncement[] = [];
    let i3Html = "";

    if (bursaRes.ok) {
      try {
        const json = await bursaRes.json();
        // Bursa API returns announcements in data.announcements or similar
        bursaData = json?.data?.announcements || json?.announcements || [];
      } catch {
        bursaData = [];
      }
    }

    if (i3Res.ok) {
      i3Html = await i3Res.text();
    }

    // Parse i3investor HTML table for director dealings
    const parsedI3 = parseI3DirectorTable(i3Html);

    // Score each transaction with signal strength
    const scoredTransactions = [...parsedI3, ...bursaData.map(mapBursaAnn)]
      .filter((t): t is RawTransaction => t !== null && Boolean(t.name))
      .map(scoreTransaction)
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({
      transactions: scoredTransactions.slice(0, 40),
      source: "Bursa Malaysia + i3investor (live)",
      count: scoredTransactions.length,
      timestamp: new Date().toISOString(),
      dataLive: parsedI3.length > 0 || bursaData.length > 0,
    });
  } catch (err) {
    console.error("Insider fetch error:", err);
    // Return empty so frontend shows fallback
    return NextResponse.json({
      transactions: [],
      source: "unavailable",
      count: 0,
      timestamp: new Date().toISOString(),
      dataLive: false,
    });
  }
}

interface RawTransaction {
  stock: string;
  name: string;
  role: string;
  type: string;
  shares: number;
  price: number;
  value: number;
  date: string;
  directPct: number;
  indirectPct: number;
  totalPct: number;
  annUrl?: string;
}

interface ScoredTransaction extends RawTransaction {
  score: number;
  signal: "STRONG BUY" | "BUY" | "WATCH" | "SELL" | "STRONG SELL" | "NEUTRAL";
  signalColor: string;
  reasons: string[];
}

function parseI3DirectorTable(html: string): RawTransaction[] {
  if (!html || html.length < 100) return [];
  const results: RawTransaction[] = [];
  // Parse table rows from i3investor director dealings page
  // The table has columns: Stock | Ann.Date | Name | Date | Type | No.Shares | Price | Direct% | Indirect% | Total%
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i;
  const rows = html.match(rowRegex) || [];

  for (const row of rows) {
    const cells: string[] = [];
    let m;
    const cellPat = new RegExp(cellRegex.source, "gi");
    while ((m = cellPat.exec(row)) !== null) {
      cells.push(m[1].replace(/<[^>]+>/g, "").trim());
    }
    if (cells.length < 8) continue;

    // Extract stock symbol from first cell
    const stockMatch = linkRegex.exec(cells[0]);
    const stock = stockMatch ? stockMatch[2].trim() : cells[0].trim();
    if (!stock || stock.length > 10 || !/^[A-Z0-9\-\.]+$/i.test(stock.replace(/\s/g,""))) continue;

    const type = cells[4]?.toLowerCase() || "";
    const isAcq = type.includes("acqui") || type.includes("buy") || type.includes("purchased");
    const isDisp = type.includes("dispos") || type.includes("sell") || type.includes("sold");
    if (!isAcq && !isDisp) continue;

    const shares = parseNum(cells[5]);
    const price  = parseNum(cells[6]);
    if (shares <= 0) continue;

    results.push({
      stock:       stock.toUpperCase().replace(/\s+/g,""),
      name:        cells[2]?.trim() || "Director",
      role:        "Director",
      type:        isAcq ? "Acquisition" : "Disposal",
      shares,
      price,
      value:       shares * price,
      date:        cells[1]?.trim() || new Date().toISOString().split("T")[0],
      directPct:   parseNum(cells[7]),
      indirectPct: parseNum(cells[8] || "0"),
      totalPct:    parseNum(cells[9] || cells[7]),
      annUrl:      `https://klse.i3investor.com/web/insider/director/${stock}`,
    });
  }
  return results;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBursaAnn(ann: any): RawTransaction | null {
  if (!ann) return null;
  const title: string = ann.announcement_type || ann.title || "";
  const stock: string = ann.stock_code || ann.code || "";
  const isAcq  = /acqui|buy|purchas/i.test(title);
  const isDisp  = /dispos|sell|sold/i.test(title);
  if (!stock || (!isAcq && !isDisp)) return null;
  return {
    stock:       stock.trim().toUpperCase(),
    name:        ann.director_name || "Director",
    role:        "Director",
    type:        isAcq ? "Acquisition" : "Disposal",
    shares:      Number(ann.shares) || 0,
    price:       Number(ann.price) || 0,
    value:       (Number(ann.shares) || 0) * (Number(ann.price) || 0),
    date:        ann.announcement_date || new Date().toISOString().split("T")[0],
    directPct:   Number(ann.direct_pct) || 0,
    indirectPct: Number(ann.indirect_pct) || 0,
    totalPct:    Number(ann.total_pct) || 0,
    annUrl:      ann.url || `https://www.bursamalaysia.com/market_information/announcements/company_announcement`,
  };
}

function scoreTransaction(t: RawTransaction): ScoredTransaction {
  let score = 50;
  const reasons: string[] = [];
  const isAcq = t.type === "Acquisition";

  // Value-based scoring
  if (t.value > 5000000) { score += isAcq ? 25 : -25; reasons.push(isAcq ? "Very large buy >RM5M" : "Very large sell >RM5M"); }
  else if (t.value > 1000000) { score += isAcq ? 15 : -15; reasons.push(isAcq ? "Large buy >RM1M" : "Large sell >RM1M"); }
  else if (t.value > 200000) { score += isAcq ? 8 : -8; reasons.push(isAcq ? "Meaningful buy >RM200K" : "Meaningful sell >RM200K"); }

  // Role
  if (/ceo|managing director|md|chief/i.test(t.role)) { score += isAcq ? 15 : -15; reasons.push("C-Suite executive"); }
  else if (/chairman/i.test(t.role)) { score += isAcq ? 12 : -12; reasons.push("Chairman"); }

  // Substantial holding change
  if (t.totalPct > 20) { score += isAcq ? 10 : -10; reasons.push(`Substantial holder ${t.totalPct.toFixed(1)}%`); }

  // Recency
  const daysAgo = Math.floor((Date.now() - new Date(t.date).getTime()) / 86400000);
  if (daysAgo <= 1)  { score += 10; reasons.push("Filed today"); }
  else if (daysAgo <= 3) { score += 5; reasons.push("Filed within 3 days"); }

  // Cap score
  score = Math.max(0, Math.min(100, score));

  let signal: ScoredTransaction["signal"];
  let signalColor: string;
  if (isAcq) {
    if (score >= 80)      { signal = "STRONG BUY"; signalColor = "#00c897"; }
    else if (score >= 65) { signal = "BUY";        signalColor = "#4caf7d"; }
    else if (score >= 50) { signal = "WATCH";      signalColor = "#f5b942"; }
    else                  { signal = "NEUTRAL";    signalColor = "#8a96b0"; }
  } else {
    if (score <= 20)      { signal = "STRONG SELL"; signalColor = "#ff3b4e"; }
    else if (score <= 35) { signal = "SELL";         signalColor = "#ff5f6b"; }
    else                  { signal = "NEUTRAL";      signalColor = "#8a96b0"; }
  }

  return { ...t, score, signal, signalColor, reasons };
}

function parseNum(s: string): number {
  if (!s) return 0;
  return parseFloat(s.replace(/[^0-9.\-]/g, "")) || 0;
}

type BursaAnnouncement = Record<string, string | number | undefined>;
