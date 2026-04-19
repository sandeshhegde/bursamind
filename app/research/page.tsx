"use client";
import { useState } from "react";
import { ExternalLink, Search, BookOpen, Building2, TrendingUp, Globe, FileText, Newspaper } from "lucide-react";

interface Source { name:string; org:string; description:string; snippet:string; url:string; logoUrl?:string; bgColor:string; accentColor:string; type:"Official"|"Broker"|"Academic"|"Data"|"News"; tags:string[]; badge?:string; }

const SOURCES: Source[] = [
  // OFFICIAL / REGULATORY
  { name:"EDGAR Full-Text Search", org:"SEC.gov", description:"Search all SEC filings — 10-K, 10-Q, 8-K, S-1 IPO prospectuses, proxy statements and more for every US public company.", snippet:"The most authoritative free source for US public company financial data. Every earnings report, annual filing, and insider transaction is here.", url:"https://efts.sec.gov/LATEST/search-index?q=%22annual+report%22&dateRange=custom&startdt=2024-01-01&enddt=2025-01-01&forms=10-K", bgColor:"#0a1628", accentColor:"#4d9fff", type:"Official", badge:"Primary Source", tags:["10-K","10-Q","8-K","S-1","Free"] },
  { name:"EDGAR Company Search", org:"SEC.gov", description:"Direct access to every SEC filing by company. Search by ticker or company name to find all filings instantly.", snippet:"Bookmark this — it's the fastest way to find a company's latest 10-K annual report or 10-Q quarterly filing directly from the SEC.", url:"https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=10-K&dateb=&owner=include&count=40", bgColor:"#0a1628", accentColor:"#4d9fff", type:"Official", tags:["SEC Filings","Annual Reports","Free"] },
  { name:"Federal Reserve Economic Data", org:"FRED — St. Louis Fed", description:"200,000+ US and international economic time series. Fed funds rate, CPI, GDP, unemployment, yield curve, M2 money supply.", snippet:"FRED is the ultimate free macro data source. Build custom charts comparing Fed rate decisions against S&P 500 performance over decades.", url:"https://fred.stlouisfed.org/", bgColor:"#0d1a10", accentColor:"#4caf7d", type:"Official", badge:"Essential Macro", tags:["Fed Funds Rate","CPI","GDP","Yield Curve","Free"] },
  { name:"FOMC Statements & Minutes", org:"Federal Reserve", description:"All Federal Open Market Committee interest rate decisions, meeting minutes, and economic projections (dot plot).", snippet:"The most market-moving document in US finance. FOMC minutes reveal the internal Fed debate on inflation and rate paths.", url:"https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm", bgColor:"#0d1a10", accentColor:"#4caf7d", type:"Official", tags:["Monetary Policy","Interest Rates","FOMC","Free"] },
  { name:"Bureau of Labor Statistics", org:"BLS.gov", description:"Official US CPI, PPI, jobs reports (NFP), unemployment rate, wage growth data — the market-moving releases.", snippet:"The NFP (Non-Farm Payrolls) and CPI releases here are the two most market-moving monthly data points for US equities and bonds.", url:"https://www.bls.gov/", bgColor:"#0a1420", accentColor:"#e8b84b", type:"Official", tags:["CPI","NFP","PPI","Wages","Free"] },
  { name:"Bureau of Economic Analysis", org:"BEA.gov", description:"Official US GDP, PCE inflation, corporate profits, trade balance, and national income accounts.", snippet:"PCE (Personal Consumption Expenditures) is the Fed's preferred inflation measure — published here monthly before market open.", url:"https://www.bea.gov/", bgColor:"#0a1420", accentColor:"#e8b84b", type:"Official", tags:["GDP","PCE","Corporate Profits","Free"] },
  { name:"FINRA BrokerCheck", org:"FINRA", description:"Verify broker and investment advisor credentials, disciplinary history, and regulatory actions.", snippet:"Always verify your broker or financial advisor on FINRA BrokerCheck before investing. Free and takes 30 seconds.", url:"https://brokercheck.finra.org/", bgColor:"#100d1a", accentColor:"#9b73f8", type:"Official", tags:["Broker Verification","Regulatory","Investor Protection"] },

  // BROKER / ANALYST RESEARCH
  { name:"Seeking Alpha", org:"Seeking Alpha", description:"Analyst articles, earnings call transcripts, quant ratings, and dividend analysis for US stocks. Large free tier available.", snippet:"Seeking Alpha's quant rating system has historically outperformed the S&P 500. Free access to thousands of analysis articles.", url:"https://seekingalpha.com/", bgColor:"#0d1a10", accentColor:"#ff9f3f", type:"Broker", badge:"Best Free Research", tags:["Stock Analysis","Earnings Transcripts","Quant Ratings","Free Tier"] },
  { name:"Motley Fool Free Articles", org:"The Motley Fool", description:"Stock analysis, industry deep-dives, and long-term investment thesis articles. Strong free content library.", snippet:"Motley Fool's free articles cover investment theses on major US stocks. Good for understanding business models and competitive moats.", url:"https://www.fool.com/investing/", bgColor:"#1a0d0d", accentColor:"#ff5f6b", type:"Broker", tags:["Stock Analysis","Long-term","Free Articles"] },
  { name:"Morningstar Research", org:"Morningstar", description:"Fair value estimates, moat ratings, uncertainty ratings, and analyst reports for thousands of US stocks.", snippet:"Morningstar's economic moat framework is one of the best qualitative stock analysis tools. Free access to basic ratings and data.", url:"https://www.morningstar.com/stocks", bgColor:"#0a1420", accentColor:"#e8b84b", type:"Broker", badge:"Best Valuations", tags:["Fair Value","Moat Rating","Analyst Reports","Free Tier"] },
  { name:"Zacks Investment Research", org:"Zacks", description:"Earnings estimate revisions, Zacks Rank (1–5), sector analysis, and earnings surprise data for US equities.", snippet:"The Zacks Rank #1 (Strong Buy) stocks have historically beaten the market significantly. Free access to rankings and screener.", url:"https://www.zacks.com/", bgColor:"#0d1520", accentColor:"#4d9fff", type:"Broker", tags:["Earnings Estimates","Zacks Rank","Earnings Surprise","Free"] },
  { name:"Value Line Research", org:"Value Line", description:"Independent research covering 1,700 US stocks with 3–5 year price projections, timeliness ranks, and safety ratings.", snippet:"Value Line's Timeliness Rank has one of the longest verified track records in US equity research — available free via many public libraries.", url:"https://www.valueline.com/", bgColor:"#100d1a", accentColor:"#9b73f8", type:"Broker", tags:["Independent Research","Price Projections","Safety Ratings"] },

  // DATA PLATFORMS
  { name:"Yahoo Finance", org:"Yahoo Finance", description:"Free real-time quotes, historical prices, financials, earnings calendars, and news for all US stocks.", snippet:"This app uses Yahoo Finance's API for live US stock prices. Also great for downloading historical CSV data for any ticker.", url:"https://finance.yahoo.com/", bgColor:"#1a0d28", accentColor:"#9b73f8", type:"Data", badge:"Powers This App", tags:["Live Prices","Historical Data","Financials","Free"] },
  { name:"TradingView — US Markets", org:"TradingView", description:"Free interactive charts with 100+ technical indicators. All NYSE and NASDAQ stocks available. Use NASDAQ: or NYSE: prefix.", snippet:"TradingView is used directly in this app's stock detail pages. Free account gives 3 indicators, 2 charts — enough for most analysis.", url:"https://www.tradingview.com/markets/stocks-usa/", bgColor:"#0d1a28", accentColor:"#2196f3", type:"Data", badge:"Used In This App", tags:["Charts","Technical Analysis","RSI","MACD","Free"] },
  { name:"Finviz Stock Screener", org:"Finviz", description:"Powerful free stock screener with 70+ filters. Visualise the entire US market as a sector heatmap.", snippet:"Finviz's free screener and heatmap are unmatched for quickly visualising which sectors and stocks are leading/lagging the market.", url:"https://finviz.com/map.ashx?t=sec", bgColor:"#0d1a14", accentColor:"#4caf7d", type:"Data", badge:"Best Free Screener", tags:["Screener","Heatmap","70+ Filters","Free"] },
  { name:"Macrotrends", org:"Macrotrends", description:"Long-term historical charts for US stocks and macroeconomic indicators going back 100+ years.", snippet:"Macrotrends is exceptional for long-term perspective — see P/E ratios, revenue growth, and margins going back decades for any major US stock.", url:"https://www.macrotrends.net/", bgColor:"#0a1420", accentColor:"#4d9fff", type:"Data", tags:["Historical Data","Long-term Charts","Fundamentals","Free"] },
  { name:"Simply Wall St", org:"Simply Wall St", description:"Visualised analysis of US stocks — dividend safety, debt levels, PE vs peers, insider ownership, valuation snowflake.", snippet:"Best for quickly visualising whether a stock passes a simple health check. The snowflake chart covers value, future growth, past performance, health, and dividends.", url:"https://simplywall.st/markets/us", bgColor:"#0d1a14", accentColor:"#4caf7d", type:"Data", tags:["Visual Analysis","Snowflake","Fundamentals","Free Tier"] },
  { name:"Wisesheets / Stockanalysis", org:"Stock Analysis", description:"Free comprehensive financial data — income statements, balance sheets, cash flows, ratios for all US stocks.", snippet:"Stock Analysis (stockanalysis.io) is the best free site for quickly pulling up full financial statements for any US stock ticker.", url:"https://stockanalysis.com/", bgColor:"#1a0d0d", accentColor:"#ff9f3f", type:"Data", tags:["Financial Statements","Ratios","Free","No Login"] },

  // ACADEMIC & RESEARCH PAPERS
  { name:"NBER Working Papers", org:"National Bureau of Economic Research", description:"Cutting-edge academic research on US financial markets, asset pricing, corporate finance, and macroeconomics.", snippet:"NBER papers are the gold standard in US finance academia. Many recent papers are free. Topics include factor investing, market microstructure, and monetary policy transmission.", url:"https://www.nber.org/papers?page=1&perPage=50&sortBy=public_date", bgColor:"#100d1a", accentColor:"#9b73f8", type:"Academic", badge:"Gold Standard", tags:["Asset Pricing","Corporate Finance","Macro","Free Access"] },
  { name:"SSRN Finance Research", org:"SSRN / Elsevier", description:"Thousands of free preprint academic papers on US equity markets, factor investing, options, ETFs, and more.", snippet:"Search SSRN for any topic — momentum, value factor, earnings quality, short interest — and find peer-reviewed research. Most papers are free to download.", url:"https://papers.ssrn.com/sol3/displayabstractsearch.cfm", bgColor:"#0d1520", accentColor:"#4d9fff", type:"Academic", tags:["Academic Papers","Factor Investing","Options","Free Download"] },
  { name:"Federal Reserve Research Papers", org:"Federal Reserve System", description:"Research from all 12 Federal Reserve Banks — monetary policy, banking, financial stability, and economic research.", snippet:"The Fed's research division publishes rigorous free papers on interest rate policy, bank regulation, systemic risk, and credit markets.", url:"https://www.federalreserve.gov/econres.htm", bgColor:"#0d1a10", accentColor:"#4caf7d", type:"Academic", tags:["Monetary Policy","Banking","Financial Stability","Free"] },
  { name:"AQR Capital Research Library", org:"AQR Capital Management", description:"Free research papers from AQR on factor investing, value, momentum, carry, quality, and alternative risk premia.", snippet:"AQR's free white papers are industry-defining documents on systematic and quantitative investing strategies — required reading for factor investors.", url:"https://www.aqr.com/Insights/Research", bgColor:"#100d1a", accentColor:"#9b73f8", type:"Academic", badge:"Factor Investing", tags:["Factor Investing","Momentum","Value","Quality","Free"] },
  { name:"CFA Institute Research", org:"CFA Institute", description:"Free research on investment management, ESG, market integrity, and financial reporting standards.", snippet:"CFA Institute's free research portal covers investment ethics, ESG integration, and best practices in portfolio management.", url:"https://www.cfainstitute.org/en/research", bgColor:"#0a1420", accentColor:"#e8b84b", type:"Academic", tags:["Investment Management","ESG","Portfolio Management","Free"] },

  // NEWS
  { name:"The Wall Street Journal", org:"WSJ", description:"US's top financial newspaper. Market news, company coverage, earnings analysis, Fed coverage, and investigative reporting.", snippet:"WSJ's earnings and Fed coverage is the most comprehensive in US financial media. Free access to some articles; full access via many libraries.", url:"https://www.wsj.com/markets", bgColor:"#1a0d0d", accentColor:"#ff9f3f", type:"News", badge:"Best in Class", tags:["Financial News","Earnings","Fed Coverage","Markets"] },
  { name:"Bloomberg Markets", org:"Bloomberg", description:"Real-time market news, economic data, and in-depth financial analysis. Large free section available.", snippet:"Bloomberg's free section covers major market-moving news. Their economic calendar and data tools are exceptional for macro investors.", url:"https://www.bloomberg.com/markets", bgColor:"#0a1628", accentColor:"#4d9fff", type:"News", tags:["Financial News","Real-time","Economic Data","Free Section"] },
  { name:"Reuters Finance", org:"Reuters", description:"Breaking financial news, earnings reports, M&A deals, and regulatory news for US markets.", snippet:"Reuters provides fast, unbiased financial news globally. Their earnings and M&A coverage is excellent and largely free.", url:"https://www.reuters.com/finance/", bgColor:"#1a0d0d", accentColor:"#ff5f6b", type:"News", tags:["Breaking News","M&A","Earnings","Free"] },
  { name:"MarketWatch", org:"MarketWatch / WSJ", description:"Free financial news, market data, portfolio tools, and live earnings updates for US markets.", snippet:"MarketWatch's real-time earnings updates and economic calendar are among the best free tools for tracking US market events.", url:"https://www.marketwatch.com/", bgColor:"#0d1a10", accentColor:"#4caf7d", type:"News", tags:["Free News","Earnings","Economic Calendar","Market Data"] },
  { name:"Barron's", org:"Barron's / Dow Jones", description:"Weekly investment magazine with stock picks, market outlook, ETF analysis, and fund rankings.", snippet:"Barron's stock picks have a strong long-term track record. Some articles are free; full access via Dow Jones subscription or library.", url:"https://www.barrons.com/", bgColor:"#100d1a", accentColor:"#9b73f8", type:"News", tags:["Stock Picks","ETF Analysis","Market Outlook"] },
  { name:"Investopedia", org:"Investopedia", description:"Free financial education — terms, concepts, strategies, tutorials, and investing guides for all levels.", snippet:"Investopedia is the best free resource for learning any finance concept — from P/E ratios to options Greeks to DCF valuation models.", url:"https://www.investopedia.com/", bgColor:"#0d1a14", accentColor:"#4caf7d", type:"News", badge:"Best for Learning", tags:["Education","Concepts","Tutorials","100% Free"] },
];

const CATS = [
  { key:"All",      label:"All",           icon:Globe,       color:"var(--text2)"  },
  { key:"Official", label:"Official / Gov",icon:Building2,   color:"var(--blue)"   },
  { key:"Broker",   label:"Broker Research",icon:TrendingUp, color:"var(--gold)"   },
  { key:"Data",     label:"Data & Charts",  icon:FileText,   color:"var(--accent)" },
  { key:"Academic", label:"Research Papers",icon:BookOpen,   color:"var(--purple)" },
  { key:"News",     label:"News & Media",   icon:Newspaper,  color:"var(--red)"    },
];
const TC: Record<string,string> = { Official:"var(--blue)", Broker:"var(--gold)", Data:"var(--accent)", Academic:"var(--purple)", News:"var(--red)" };

export default function Research() {
  const [cat, setCat]       = useState("All");
  const [search, setSearch] = useState("");
  const filtered = SOURCES.filter(s=>(cat==="All"||s.type===cat)&&(search===""||s.name.toLowerCase().includes(search.toLowerCase())||s.org.toLowerCase().includes(search.toLowerCase())||s.snippet.toLowerCase().includes(search.toLowerCase())||s.tags.some(t=>t.toLowerCase().includes(search.toLowerCase()))));
  return (
    <div className="fade-in" style={{maxWidth:1200}}>
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:22,fontWeight:800,color:"var(--text)",marginBottom:6}}>Free US Market Research Library</h1>
        <p style={{fontSize:13,color:"var(--text3)",lineHeight:1.6,maxWidth:680}}>Curated free research for US equity investors — SEC filings, broker reports, FRED macro data, academic papers, and financial news. Everything here is free to access.</p>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {CATS.map(c=>{const count=c.key==="All"?SOURCES.length:SOURCES.filter(s=>s.type===c.key).length;const active=cat===c.key;return(
          <button key={c.key} onClick={()=>setCat(c.key)} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:24,fontSize:13,fontWeight:600,border:active?"none":"1px solid var(--border)",background:active?c.color:"var(--card)",color:active?(c.key==="All"?"var(--bg)":"#000"):"var(--text2)",cursor:"pointer",transition:"all 0.15s"}}>
            <c.icon size={13}/>{c.label}<span style={{fontSize:11,fontWeight:700,padding:"1px 7px",borderRadius:12,background:active?"rgba(0,0,0,0.2)":"var(--card2)",color:active?"#fff":"var(--text3)"}}>{count}</span>
          </button>);
        })}
      </div>
      <div style={{position:"relative",marginBottom:24}}>
        <Search size={15} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}/>
        <input className="input" placeholder="Search by name, org, topic, or tag…" value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:40,fontSize:14}}/>
      </div>
      <div style={{fontSize:12,color:"var(--text3)",marginBottom:16}}>{filtered.length} source{filtered.length!==1?"s":""}{cat!=="All"&&` in ${cat}`}{search&&` matching "${search}"`}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(350px,1fr))",gap:16}}>
        {filtered.map(source=><SourceCard key={source.name+source.org} source={source}/>)}
      </div>
      <div style={{marginTop:32,padding:"16px 20px",background:"rgba(77,159,255,0.07)",border:"1px solid rgba(77,159,255,0.15)",borderRadius:12}}>
        <div style={{fontSize:12,color:"var(--text3)",lineHeight:1.8}}><strong style={{color:"var(--blue)"}}>📚 Note</strong> — All sources are publicly available. Some broker research and news sites may require a free account. SEC EDGAR, FRED, BLS, and BEA are 100% free government resources with no registration. Not financial advice.</div>
      </div>
    </div>
  );
}

function SourceCard({ source }: { source: Source }) {
  const ac = TC[source.type];
  return (
    <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,overflow:"hidden",display:"flex",flexDirection:"column",transition:"all 0.18s"}}
      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=ac;(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLElement).style.boxShadow="0 8px 32px rgba(0,0,0,0.3)";}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--border)";(e.currentTarget as HTMLElement).style.transform="none";(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
      <div style={{padding:"16px 18px",background:source.bgColor,borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:44,height:44,borderRadius:10,overflow:"hidden",flexShrink:0,background:"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,0.08)"}}>
          <img src={source.logoUrl} alt={source.org} width={44} height={44} style={{objectFit:"contain",padding:6}}
            onError={e=>{const el=e.currentTarget as HTMLImageElement;el.style.display="none";const p=el.parentElement;if(p)p.innerHTML=`<span style="font-size:13px;font-weight:800;color:${source.accentColor}">${source.org.slice(0,3).toUpperCase()}</span>`;}}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:2,lineHeight:1.3}}>{source.name}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:500}}>{source.org}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
          <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:`${ac}20`,color:ac,border:`1px solid ${ac}40`,flexShrink:0}}>{source.type}</span>
          {source.badge&&<span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,background:`${source.accentColor}25`,color:source.accentColor,border:`1px solid ${source.accentColor}40`}}>{source.badge}</span>}
        </div>
      </div>
      <div style={{padding:"16px 18px",flex:1,display:"flex",flexDirection:"column",gap:12}}>
        <p style={{fontSize:12,color:"var(--text2)",lineHeight:1.6,margin:0}}>{source.description}</p>
        <div style={{background:"var(--bg2)",borderRadius:8,padding:"10px 12px",borderLeft:`3px solid ${ac}`}}>
          <div style={{fontSize:10,color:ac,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Why it's useful</div>
          <div style={{fontSize:12,color:"var(--text3)",lineHeight:1.6}}>{source.snippet}</div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{source.tags.map(tag=><span key={tag} style={{fontSize:10,padding:"3px 9px",borderRadius:20,background:"var(--card2)",color:"var(--text3)",border:"1px solid var(--border)"}}>{tag}</span>)}</div>
        <a href={source.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:13,fontWeight:700,color:ac,textDecoration:"none",padding:"10px 16px",borderRadius:8,marginTop:"auto",background:`${ac}12`,border:`1px solid ${ac}30`,transition:"all 0.15s"}}
          onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=`${ac}22`}
          onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=`${ac}12`}>
          <ExternalLink size={13}/>Open {source.org}
        </a>
      </div>
    </div>
  );
}
