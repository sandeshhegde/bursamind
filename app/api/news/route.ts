import { NextResponse } from "next/server";

// Real free RSS/JSON feeds for Bursa Malaysia news
// All public, no API key required
const FEEDS = [
  {
    name: "The Edge Markets",
    url: "https://www.theedgemarkets.com/rss/market",
    category: "News",
    color: "#ff9f3f",
  },
  {
    name: "The Star Business",
    url: "https://www.thestar.com.my/rss/business/business-news",
    category: "News",
    color: "#ff5f6b",
  },
  {
    name: "Bernama Business",
    url: "https://www.bernama.com/en/rss.php?id=7",
    category: "News",
    color: "#4d9fff",
  },
  {
    name: "Bursa IR Announcements",
    url: "https://bursa.listedcompany.com/newsroom.html",
    category: "Official",
    color: "#f5b942",
  },
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

function parseRSS(xml: string, source: string, category: string, color: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title   = stripCDATA(extract(block, "title")).trim();
    const link    = stripCDATA(extract(block, "link")).trim() || stripCDATA(extract(block, "guid")).trim();
    const pubDate = extract(block, "pubDate").trim() || extract(block, "dc:date").trim();
    const desc    = stripCDATA(extract(block, "description")).replace(/<[^>]+>/g, "").trim().slice(0, 180);

    if (!title || title.length < 5) continue;

    // Check if Bursa/Malaysia/stock related
    const full = (title + " " + desc).toLowerCase();
    const isBursaRelated = /bursa|klci|klse|ringgit|myr|saham|malaysia stock|fbm|maybank|cimb|tenaga|petronas|axiata|maxis|genting|ipo|dividend|earnings|quarter|profit|revenue|analyst|invest|fund|epf|pnb|bnm|opr|rate|inflation/i.test(full);

    items.push({ title, link, pubDate, source, category, color, summary: desc, isBursaRelated });
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

export async function GET() {
  const results: NewsItem[] = [];

  // Fetch all RSS feeds in parallel
  const fetches = await Promise.allSettled(
    FEEDS.map(async feed => {
      const res = await fetch(feed.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BursaMindBot/1.0)",
          "Accept": "application/rss+xml, application/xml, text/xml, */*",
        },
        next: { revalidate: 300 }, // cache 5 min
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const text = await res.text();
      return parseRSS(text, feed.name, feed.category, feed.color);
    })
  );

  fetches.forEach(r => {
    if (r.status === "fulfilled") results.push(...r.value);
  });

  // Also fetch from Yahoo Finance news for KLSE
  try {
    const yfRes = await fetch(
      "https://query1.finance.yahoo.com/v1/finance/search?q=Bursa+Malaysia&lang=en-US&region=MY&quotesCount=0&newsCount=20&enableFuzzyQuery=false",
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 300 },
      }
    );
    if (yfRes.ok) {
      const yfData = await yfRes.json();
      const yfNews = yfData?.news || [];
      for (const n of yfNews) {
        results.push({
          title: n.title,
          link: n.link || `https://finance.yahoo.com/news/${n.uuid}`,
          pubDate: new Date((n.providerPublishTime || Date.now()/1000) * 1000).toUTCString(),
          source: n.publisher || "Yahoo Finance",
          category: "News",
          color: "#9b73f8",
          summary: "",
          isBursaRelated: true,
        });
      }
    }
  } catch { /* skip */ }

  // Sort by date, newest first
  const sorted = results
    .filter(n => n.title && n.title.length > 5)
    .sort((a, b) => {
      const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return db - da;
    })
    .slice(0, 60);

  return NextResponse.json({
    items: sorted,
    count: sorted.length,
    timestamp: new Date().toISOString(),
    sourcesLive: fetches.filter(r => r.status === "fulfilled").length,
    totalSources: FEEDS.length,
  });
}
