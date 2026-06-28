import { NextResponse } from "next/server";

// ── Reliable feeds ───────────────────────────────────────────────────────
// Google News RSS is used as the primary source because it's a stable,
// well-formed XML endpoint that works reliably from serverless functions
// (no bot-blocking, no auth, always returns valid RSS for any query).
// Direct publisher feeds are attempted as a bonus but may fail/404 —
// failures are caught silently and don't affect the result.

const GOOGLE_NEWS_QUERIES = [
  { q: "Bursa Malaysia stock market",        label: "Google News" },
  { q: "KLCI Malaysia shares",               label: "Google News" },
  { q: "Malaysia stock market dividend IPO", label: "Google News" },
];

const DIRECT_FEEDS = [
  { name: "The Edge Markets",   url: "https://www.theedgemarkets.com/rss",                 color: "#ff9f3f" },
  { name: "The Star Business",  url: "https://www.thestar.com.my/rss/business",             color: "#ff5f6b" },
  { name: "Bernama",            url: "https://www.bernama.com/en/rss/general.php",          color: "#4d9fff" },
];

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  color: string;
  summary: string;
  isBursaRelated: boolean;
}

function parseRSS(xml: string, fallbackSource: string, color: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    let title  = stripCDATA(extract(block, "title")).trim();
    const link   = stripCDATA(extract(block, "link")).trim() || stripCDATA(extract(block, "guid")).trim();
    const pubDate = extract(block, "pubDate").trim() || extract(block, "dc:date").trim();
    const desc   = decodeEntities(stripCDATA(extract(block, "description"))).replace(/<[^>]+>/g, "").trim().slice(0, 180);
    const srcTag = stripCDATA(extract(block, "source")).trim();

    if (!title || title.length < 5) continue;

    // Google News RSS appends " - Publisher Name" to the title — split it out.
    // Its <description> is just "<a>Title</a> Source" again (redundant), so
    // we discard it for Google News items rather than show a duplicate snippet.
    let source = srcTag || fallbackSource;
    let cleanDesc = desc;
    const dashSplit = title.match(/^(.*)\s-\s([^-]+)$/);
    if (!srcTag && dashSplit) {
      title = dashSplit[1].trim();
      source = dashSplit[2].trim();
      cleanDesc = "";
    }

    const full = (title + " " + cleanDesc).toLowerCase();
    const isBursaRelated = /bursa|klci|klse|ringgit|myr|saham|malaysia stock|fbm|maybank|cimb|tenaga|petronas|axiata|maxis|genting|ipo|dividend|earnings|quarter|profit|revenue|analyst|invest|fund|epf|pnb|bnm|opr|rate|inflation|malaysia/i.test(full);

    items.push({ title, link, pubDate, source, category: "News", color, summary: cleanDesc, isBursaRelated });
  }
  return items;
}

function extract(s: string, tag: string): string {
  const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i").exec(s);
  return m ? m[1] : "";
}
function stripCDATA(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
}
function decodeEntitiesOnce(s: string): string {
  return s
    .replace(/&amp;/g, "&")   // unescape outer XML encoding FIRST
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}
function decodeEntities(s: string): string {
  // Google News descriptions are double-encoded (e.g. "&amp;nbsp;" instead of
  // "&nbsp;"), so a single pass leaves residual entities. Run twice.
  return decodeEntitiesOnce(decodeEntitiesOnce(s));
}

// Curated, always-available links shown if every live fetch fails —
// real working destinations, not fake dated headlines.
const STATIC_FALLBACK: NewsItem[] = [
  { title: "Bursa Malaysia — Company Announcements",      link: "https://www.bursamalaysia.com/market_information/announcements/company_announcement", pubDate: "", source: "Bursa Malaysia", category: "Official", color: "#f29900", summary: "Official real-time company filings, results, and disclosures.", isBursaRelated: true },
  { title: "The Edge Markets — Malaysia Business News",    link: "https://www.theedgemarkets.com/",                                                    pubDate: "", source: "The Edge Markets", category: "News",     color: "#ff9f3f", summary: "Malaysia's top financial newspaper.",                          isBursaRelated: true },
  { title: "The Star — Business Section",                  link: "https://www.thestar.com.my/business",                                                pubDate: "", source: "The Star",        category: "News",     color: "#ff5f6b", summary: "Daily Malaysian business and market coverage.",               isBursaRelated: true },
  { title: "Bernama — Business News",                       link: "https://www.bernama.com/en/business/",                                               pubDate: "", source: "Bernama",         category: "News",     color: "#1a73e8", summary: "Malaysia's national news agency business desk.",              isBursaRelated: true },
  { title: "Bursa Malaysia — Market Statistics",            link: "https://www.bursamalaysia.com/market_information/market_statistics/securities",      pubDate: "", source: "Bursa Malaysia", category: "Official", color: "#f29900", summary: "Advancers, decliners, volume and value leaders.",              isBursaRelated: true },
  { title: "Yahoo Finance — Malaysia Markets",              link: "https://finance.yahoo.com/quote/%5EKLSE/",                                           pubDate: "", source: "Yahoo Finance",   category: "Data",     color: "#8430ce", summary: "Live FBM KLCI index data and news.",                          isBursaRelated: true },
];

export async function GET() {
  const results: NewsItem[] = [];
  let liveSourceCount = 0;

  // ── 1. Google News RSS — primary reliable source ──
  const gnFetches = await Promise.allSettled(
    GOOGLE_NEWS_QUERIES.map(async ({ q }) => {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}+when:3d&hl=en-MY&gl=MY&ceid=MY:en`;
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; BursaMindBot/1.0)" },
        next: { revalidate: 300 },
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const text = await res.text();
      return parseRSS(text, "Google News", "#34a853");
    })
  );
  gnFetches.forEach(r => {
    if (r.status === "fulfilled" && r.value.length > 0) {
      results.push(...r.value);
      liveSourceCount++;
    }
  });

  // ── 2. Direct publisher feeds — bonus, best-effort ──
  const directFetches = await Promise.allSettled(
    DIRECT_FEEDS.map(async feed => {
      const res = await fetch(feed.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BursaMindBot/1.0)",
          "Accept": "application/rss+xml, application/xml, text/xml, */*",
        },
        next: { revalidate: 300 },
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const text = await res.text();
      return parseRSS(text, feed.name, feed.color);
    })
  );
  directFetches.forEach(r => {
    if (r.status === "fulfilled" && r.value.length > 0) {
      results.push(...r.value);
      liveSourceCount++;
    }
  });

  // ── 3. Yahoo Finance news search — bonus ──
  try {
    const yfRes = await fetch(
      "https://query1.finance.yahoo.com/v1/finance/search?q=Bursa+Malaysia&lang=en-US&region=MY&quotesCount=0&newsCount=15&enableFuzzyQuery=false",
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 300 } }
    );
    if (yfRes.ok) {
      const yfData = await yfRes.json();
      const yfNews = yfData?.news || [];
      if (yfNews.length > 0) liveSourceCount++;
      for (const n of yfNews) {
        results.push({
          title: n.title,
          link: n.link || `https://finance.yahoo.com/news/${n.uuid}`,
          pubDate: new Date((n.providerPublishTime || Date.now() / 1000) * 1000).toUTCString(),
          source: n.publisher || "Yahoo Finance",
          category: "News",
          color: "#8430ce",
          summary: "",
          isBursaRelated: true,
        });
      }
    }
  } catch { /* skip */ }

  // De-duplicate by title
  const seen = new Set<string>();
  const deduped = results.filter(n => {
    const key = n.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const sorted = deduped
    .filter(n => n.title && n.title.length > 5)
    .sort((a, b) => {
      const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return db - da;
    })
    .slice(0, 60);

  // Guarantee the page is never blank
  const usingFallback = sorted.length === 0;
  const finalItems = usingFallback ? STATIC_FALLBACK : sorted;

  return NextResponse.json({
    items: finalItems,
    count: finalItems.length,
    timestamp: new Date().toISOString(),
    sourcesLive: liveSourceCount,
    usingFallback,
  });
}
