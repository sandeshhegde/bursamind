export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePct: number;
  volume: number;
  marketCap: number; // USD millions
  pe: number;
  pb: number;
  eps: number;
  dividendYield: number;
  revenue: number;   // USD millions
  netProfit: number; // USD millions
  roe: number;
  roa: number;
  debtEquity: number;
  week52High: number;
  week52Low: number;
  beta: number;
  shares: number;    // shares outstanding
}

export const STOCKS: Stock[] = [
  { symbol:"AAPL",  name:"Apple Inc.",                    sector:"Technology",            industry:"Consumer Electronics",   price:213.49, change:1.82,  changePct:0.86,  volume:54230000,  marketCap:3280000, pe:33.2, pb:47.1,  eps:6.43,  dividendYield:0.52, revenue:391000,  netProfit:96995, roe:147.2, roa:22.6, debtEquity:1.79, week52High:237.23, week52Low:164.08, beta:1.24, shares:15334000000 },
  { symbol:"MSFT",  name:"Microsoft Corporation",         sector:"Technology",            industry:"Software",               price:415.32, change:3.21,  changePct:0.78,  volume:18920000,  marketCap:3090000, pe:35.4, pb:12.8,  eps:11.74, dividendYield:0.72, revenue:245000,  netProfit:88136, roe:36.8, roa:18.4, debtEquity:0.42, week52High:468.35, week52Low:385.58, beta:0.89, shares:7440000000  },
  { symbol:"NVDA",  name:"NVIDIA Corporation",            sector:"Technology",            industry:"Semiconductors",          price:875.40, change:22.10, changePct:2.59,  volume:41870000,  marketCap:2160000, pe:72.8, pb:42.3,  eps:12.03, dividendYield:0.03, revenue:79770,   netProfit:29760, roe:91.4, roa:49.2, debtEquity:0.41, week52High:974.00, week52Low:462.36, beta:1.68, shares:2468000000  },
  { symbol:"AMZN",  name:"Amazon.com Inc.",               sector:"Consumer Discretionary",industry:"E-Commerce",             price:196.38, change:-1.24, changePct:-0.63, volume:38560000,  marketCap:2090000, pe:41.2, pb:8.4,   eps:4.77,  dividendYield:0.00, revenue:637000,  netProfit:30425, roe:21.8, roa:7.1,  debtEquity:0.52, week52High:242.52, week52Low:151.61, beta:1.15, shares:10640000000 },
  { symbol:"GOOGL", name:"Alphabet Inc. (Google)",        sector:"Communication Services", industry:"Internet Content",       price:172.63, change:0.94,  changePct:0.55,  volume:22340000,  marketCap:2120000, pe:23.8, pb:6.7,   eps:7.26,  dividendYield:0.48, revenue:350000,  netProfit:73795, roe:29.6, roa:16.4, debtEquity:0.10, week52High:207.05, week52Low:140.53, beta:1.03, shares:12280000000 },
  { symbol:"META",  name:"Meta Platforms Inc.",           sector:"Communication Services", industry:"Social Media",           price:562.18, change:8.42,  changePct:1.52,  volume:14280000,  marketCap:1420000, pe:26.4, pb:8.6,   eps:21.29, dividendYield:0.36, revenue:164500,  netProfit:39098, roe:33.6, roa:19.8, debtEquity:0.18, week52High:638.40, week52Low:414.50, beta:1.21, shares:2525000000  },
  { symbol:"TSLA",  name:"Tesla Inc.",                    sector:"Consumer Discretionary",industry:"Electric Vehicles",       price:248.23, change:-4.82, changePct:-1.90, volume:102400000, marketCap:793000,  pe:68.4, pb:11.2,  eps:3.63,  dividendYield:0.00, revenue:96770,   netProfit:7091,  roe:17.2, roa:8.6,  debtEquity:0.19, week52High:488.54, week52Low:138.80, beta:2.35, shares:3193000000  },
  { symbol:"BRK.B", name:"Berkshire Hathaway Inc.",       sector:"Finance",               industry:"Insurance Conglomerate",  price:450.82, change:2.10,  changePct:0.47,  volume:3840000,   marketCap:985000,  pe:21.8, pb:1.56,  eps:20.68, dividendYield:0.00, revenue:364500,  netProfit:96223, roe:7.2,  roa:4.1,  debtEquity:0.28, week52High:496.27, week52Low:362.10, beta:0.88, shares:2184000000  },
  { symbol:"JPM",   name:"JPMorgan Chase & Co.",          sector:"Finance",               industry:"Banking",                price:238.56, change:1.34,  changePct:0.56,  volume:8920000,   marketCap:684000,  pe:12.6, pb:2.12,  eps:18.93, dividendYield:2.18, revenue:179000,  netProfit:49552, roe:16.2, roa:1.24, debtEquity:1.24, week52High:280.25, week52Low:182.45, beta:1.12, shares:2866000000  },
  { symbol:"V",     name:"Visa Inc.",                     sector:"Finance",               industry:"Payment Processing",      price:327.48, change:2.84,  changePct:0.88,  volume:5680000,   marketCap:670000,  pe:31.4, pb:14.8,  eps:10.43, dividendYield:0.76, revenue:35930,   netProfit:19743, roe:46.6, roa:18.2, debtEquity:0.62, week52High:372.05, week52Low:252.90, beta:0.94, shares:2046000000  },
  { symbol:"XOM",   name:"Exxon Mobil Corporation",       sector:"Energy",                industry:"Integrated Oil & Gas",    price:108.74, change:-0.52, changePct:-0.48, volume:14230000,  marketCap:463000,  pe:13.8, pb:1.84,  eps:7.88,  dividendYield:3.52, revenue:398000,  netProfit:36010, roe:13.6, roa:7.8,  debtEquity:0.22, week52High:126.34, week52Low:95.77,  beta:0.58, shares:4258000000  },
  { symbol:"UNH",   name:"UnitedHealth Group Inc.",       sector:"Healthcare",             industry:"Managed Care",            price:312.45, change:-6.32, changePct:-1.98, volume:4820000,   marketCap:287000,  pe:14.2, pb:3.92,  eps:22.01, dividendYield:2.12, revenue:371000,  netProfit:22381, roe:28.4, roa:6.8,  debtEquity:0.72, week52High:630.73, week52Low:280.10, beta:0.52, shares:919000000   },
  { symbol:"JNJ",   name:"Johnson & Johnson",             sector:"Healthcare",             industry:"Pharmaceuticals",         price:157.32, change:0.68,  changePct:0.43,  volume:6340000,   marketCap:378000,  pe:15.8, pb:5.14,  eps:9.95,  dividendYield:3.24, revenue:88820,   netProfit:14065, roe:32.8, roa:9.4,  debtEquity:0.48, week52High:168.85, week52Low:143.13, beta:0.56, shares:2403000000  },
  { symbol:"WMT",   name:"Walmart Inc.",                  sector:"Consumer Staples",       industry:"Retail",                  price:92.48,  change:0.54,  changePct:0.59,  volume:12840000,  marketCap:742000,  pe:38.4, pb:7.82,  eps:2.41,  dividendYield:1.04, revenue:680000,  netProfit:15511, roe:21.6, roa:6.2,  debtEquity:0.64, week52High:105.30, week52Low:60.11,  beta:0.52, shares:8022000000  },
  { symbol:"MA",    name:"Mastercard Incorporated",       sector:"Finance",               industry:"Payment Processing",      price:508.32, change:4.28,  changePct:0.85,  volume:2940000,   marketCap:472000,  pe:35.6, pb:58.2,  eps:14.28, dividendYield:0.62, revenue:27360,   netProfit:11196, roe:165.4,roa:26.8, debtEquity:1.72, week52High:583.09, week52Low:413.13, beta:1.06, shares:929000000   },
  { symbol:"HD",    name:"The Home Depot Inc.",           sector:"Consumer Discretionary",industry:"Home Improvement Retail", price:368.24, change:2.18,  changePct:0.60,  volume:3420000,   marketCap:365000,  pe:24.8, pb:null as unknown as number, eps:14.84, dividendYield:2.48, revenue:153700, netProfit:14814, roe:null as unknown as number, roa:18.4, debtEquity:null as unknown as number, week52High:439.37, week52Low:325.15, beta:1.02, shares:992000000   },
  { symbol:"PG",    name:"Procter & Gamble Co.",          sector:"Consumer Staples",       industry:"Household Products",      price:168.54, change:0.92,  changePct:0.55,  volume:5840000,   marketCap:395000,  pe:27.4, pb:8.24,  eps:6.15,  dividendYield:2.38, revenue:84040,   netProfit:14879, roe:30.6, roa:11.8, debtEquity:0.72, week52High:180.74, week52Low:153.25, beta:0.52, shares:2344000000  },
  { symbol:"AVGO",  name:"Broadcom Inc.",                 sector:"Technology",            industry:"Semiconductors",          price:1842.30,change:28.40, changePct:1.56,  volume:1840000,   marketCap:860000,  pe:68.2, pb:14.8,  eps:27.01, dividendYield:1.24, revenue:51570,   netProfit:14082, roe:25.8, roa:8.4,  debtEquity:1.62, week52High:2439.00,week52Low:1196.02,beta:1.10, shares:467000000   },
  { symbol:"COST",  name:"Costco Wholesale Corporation",  sector:"Consumer Staples",       industry:"Warehouse Clubs",         price:924.62, change:6.82,  changePct:0.74,  volume:2180000,   marketCap:409000,  pe:52.4, pb:16.8,  eps:17.64, dividendYield:0.54, revenue:254000,  netProfit:7367,  roe:32.4, roa:9.8,  debtEquity:0.44, week52High:1078.23,week52Low:718.93, beta:0.79, shares:442000000   },
  { symbol:"NFLX",  name:"Netflix Inc.",                  sector:"Communication Services", industry:"Streaming Entertainment", price:1048.20,change:15.40, changePct:1.49,  volume:2940000,   marketCap:446000,  pe:52.2, pb:18.4,  eps:20.09, dividendYield:0.00, revenue:39000,   netProfit:8702,  roe:38.2, roa:13.4, debtEquity:0.68, week52High:1064.50,week52Low:542.01, beta:1.28, shares:425000000   },
];

export const SECTORS = [
  { name:"Technology",             stocks:5, change:1.24,  marketCap:9590000 },
  { name:"Finance",                stocks:4, change:0.62,  marketCap:2811000 },
  { name:"Healthcare",             stocks:2, change:-0.78, marketCap:665000  },
  { name:"Consumer Discretionary", stocks:3, change:0.14,  marketCap:3248000 },
  { name:"Consumer Staples",       stocks:3, change:0.63,  marketCap:1546000 },
  { name:"Communication Services", stocks:3, change:1.19,  marketCap:3988000 },
  { name:"Energy",                 stocks:1, change:-0.48, marketCap:463000  },
];

export const SP500_HISTORY = Array.from({ length: 60 }, (_, i) => {
  const base = 5800;
  const noise = Math.sin(i*0.3)*120 + Math.sin(i*0.12)*60 + (Math.random()-0.5)*40;
  return {
    date: new Date(Date.now()-(59-i)*24*60*60*1000).toLocaleDateString("en-US",{month:"short",day:"numeric"}),
    value: Math.round((base+noise)*100)/100,
  };
});

export const MARKET_INDICES = [
  { name:"S&P 500",    value:5848.35, change:28.42, changePct:0.49  },
  { name:"NASDAQ",     value:18753.96,change:162.04,changePct:0.87  },
  { name:"Dow Jones",  value:42387.73,change:108.18,changePct:0.26  },
  { name:"Russell 2000",value:2074.28,change:-8.42, changePct:-0.40 },
];

export const CORPORATE_ACTIONS = [
  { company:"AAPL",  action:"Dividend",    detail:"Quarterly dividend $0.25/share",           exDate:"2025-05-09" },
  { company:"MSFT",  action:"Dividend",    detail:"Quarterly dividend $0.83/share",           exDate:"2025-05-14" },
  { company:"JPM",   action:"Dividend",    detail:"Quarterly dividend $1.40/share",           exDate:"2025-05-06" },
  { company:"NVDA",  action:"Stock Split", detail:"10-for-1 stock split announced",           exDate:"2025-06-01" },
  { company:"META",  action:"Dividend",    detail:"First ever quarterly dividend $0.50/share",exDate:"2025-05-22" },
  { company:"XOM",   action:"Buyback",     detail:"$20B share repurchase program renewed",   exDate:"2025-06-15" },
];

export const IPO_LIST = [
  { name:"CoreWeave Inc.",       symbol:"CRWV",  sector:"AI Infrastructure",   issue:40.00, listing:"2025-03-28", status:"Listed",   gain:28.50, marketCap:23000 },
  { name:"Klarna Group plc",     symbol:"KLAR",  sector:"Fintech",             issue:68.00, listing:"2025-04-14", status:"Listed",   gain:11.76, marketCap:15500 },
  { name:"StubHub Holdings",     symbol:"STUB",  sector:"Marketplace",         issue:28.00, listing:"2025-05-08", status:"Upcoming", gain:0,     marketCap:16500 },
  { name:"Medline Industries",   symbol:"MDLN",  sector:"Healthcare",          issue:24.00, listing:"2025-05-20", status:"Upcoming", gain:0,     marketCap:10200 },
  { name:"Cerebras Systems",     symbol:"CBRS",  sector:"AI Semiconductors",   issue:37.00, listing:"2025-06-10", status:"Upcoming", gain:0,     marketCap:8400  },
];

export function generatePriceHistory(basePrice: number, days = 90) {
  let price = basePrice * 0.85;
  return Array.from({ length: days }, (_, i) => {
    price = price*(1+(Math.random()-0.47)*0.022);
    return {
      date: new Date(Date.now()-(days-i)*24*60*60*1000).toLocaleDateString("en-US",{month:"short",day:"numeric"}),
      price: Math.round(price*100)/100,
      volume: Math.floor(Math.random()*50000000+5000000),
    };
  });
}

export function generateFinancials(stock: Stock) {
  const quarters = ["Q1 FY24","Q2 FY24","Q3 FY24","Q4 FY24","Q1 FY25","Q2 FY25"];
  return quarters.map((q,i) => ({
    quarter: q,
    revenue:   Math.round(stock.revenue/4*(1+i*0.025+(Math.random()-0.5)*0.1)),
    netProfit: Math.round(stock.netProfit/4*(1+i*0.03+(Math.random()-0.5)*0.14)),
    eps:       Math.round(stock.eps/4*(1+i*0.03)*100)/100,
  }));
}
