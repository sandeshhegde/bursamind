export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePct: number;
  volume: number;
  marketCap: number; // MYR millions
  pe: number;
  pb: number;
  eps: number;
  dividendYield: number;
  revenue: number;   // MYR millions
  netProfit: number; // MYR millions
  roe: number;
  roa: number;
  debtEquity: number;
  week52High: number;
  week52Low: number;
  beta: number;
  shares: number;
}

// Bursa stock code → Yahoo Finance .KL symbol
export const BURSA_CODES: Record<string, string> = {
  MAYBANK:"1155", CIMB:"1023", PBBANK:"1295", TENAGA:"5347",
  PCHEM:"5183",   MAXIS:"6012", DIGI:"6947",   GENTING:"3182",
  IOICORP:"1961", KLKK:"2445",  SIME:"4197",   AXIATA:"6888",
  RHBBANK:"1066", HLFG:"1082",  MISC:"3816",   IHH:"5225",
  HARTA:"5168",   TOPGLOV:"7113",INARI:"0166",  MY:"5014",
};

export const STOCKS: Stock[] = [
  { symbol:"MAYBANK", name:"Malayan Banking Bhd",          sector:"Finance",                industry:"Banking",                price:9.58,   change:0.12,  changePct:1.27,  volume:8234500,   marketCap:107200, pe:13.2, pb:1.38, eps:0.726, dividendYield:5.85, revenue:56800,  netProfit:8120, roe:10.8, roa:1.12, debtEquity:0.48, week52High:10.20, week52Low:8.40,  beta:0.82, shares:11193000000 },
  { symbol:"CIMB",    name:"CIMB Group Holdings Bhd",      sector:"Finance",                industry:"Banking",                price:7.44,   change:-0.06, changePct:-0.80, volume:12560000,  marketCap:79200,  pe:11.4, pb:1.12, eps:0.652, dividendYield:4.62, revenue:42300,  netProfit:6940, roe:9.6,  roa:0.98, debtEquity:0.52, week52High:8.10,  week52Low:6.20,  beta:1.05, shares:10645000000 },
  { symbol:"PBBANK",  name:"Public Bank Bhd",               sector:"Finance",                industry:"Banking",                price:4.28,   change:0.04,  changePct:0.94,  volume:15420000,  marketCap:83200,  pe:14.8, pb:1.95, eps:0.289, dividendYield:3.88, revenue:24600,  netProfit:5620, roe:13.4, roa:1.42, debtEquity:0.41, week52High:4.75,  week52Low:3.90,  beta:0.65, shares:19439000000 },
  { symbol:"TENAGA",  name:"Tenaga Nasional Bhd",           sector:"Utilities",              industry:"Electric Utilities",     price:12.82,  change:-0.18, changePct:-1.38, volume:5630000,   marketCap:72800,  pe:16.2, pb:1.44, eps:0.791, dividendYield:3.52, revenue:58400,  netProfit:4490, roe:8.9,  roa:2.14, debtEquity:0.85, week52High:14.50, week52Low:11.20, beta:0.55, shares:5679000000  },
  { symbol:"PCHEM",   name:"Petronas Chemicals Group Bhd",  sector:"Materials",              industry:"Chemicals",              price:5.62,   change:0.08,  changePct:1.44,  volume:9870000,   marketCap:44900,  pe:18.5, pb:1.28, eps:0.304, dividendYield:4.12, revenue:31200,  netProfit:2430, roe:7.1,  roa:3.82, debtEquity:0.12, week52High:6.80,  week52Low:4.90,  beta:0.94, shares:7993000000  },
  { symbol:"MAXIS",   name:"Maxis Bhd",                     sector:"Communications",         industry:"Telecom",                price:3.89,   change:0.02,  changePct:0.52,  volume:6750000,   marketCap:30300,  pe:26.4, pb:10.2, eps:0.147, dividendYield:4.88, revenue:9820,   netProfit:1148, roe:39.4, roa:5.12, debtEquity:1.82, week52High:4.40,  week52Low:3.55,  beta:0.44, shares:7789000000  },
  { symbol:"DIGI",    name:"CelcomDigi Bhd",                sector:"Communications",         industry:"Telecom",                price:3.56,   change:-0.04, changePct:-1.11, volume:8920000,   marketCap:27700,  pe:22.1, pb:8.8,  eps:0.161, dividendYield:5.21, revenue:8640,   netProfit:1252, roe:41.2, roa:6.84, debtEquity:1.64, week52High:4.10,  week52Low:3.20,  beta:0.38, shares:7781000000  },
  { symbol:"GENTING", name:"Genting Bhd",                   sector:"Consumer Discretionary", industry:"Hotels & Resorts",       price:4.22,   change:0.14,  changePct:3.43,  volume:11230000,  marketCap:16200,  pe:20.8, pb:0.68, eps:0.203, dividendYield:2.84, revenue:21400,  netProfit:778,  roe:3.3,  roa:1.44, debtEquity:0.64, week52High:4.90,  week52Low:3.50,  beta:1.22, shares:3840000000  },
  { symbol:"IOICORP", name:"IOI Corporation Bhd",           sector:"Consumer Staples",       industry:"Plantation",             price:3.94,   change:-0.02, changePct:-0.50, volume:7340000,   marketCap:24800,  pe:15.6, pb:2.14, eps:0.253, dividendYield:3.55, revenue:18700,  netProfit:1592, roe:14.2, roa:5.22, debtEquity:0.32, week52High:4.60,  week52Low:3.45,  beta:0.72, shares:6298000000  },
  { symbol:"KLKK",    name:"Kuala Lumpur Kepong Bhd",       sector:"Consumer Staples",       industry:"Plantation",             price:21.40,  change:0.20,  changePct:0.94,  volume:1230000,   marketCap:23100,  pe:18.2, pb:2.38, eps:1.176, dividendYield:2.94, revenue:25400,  netProfit:1272, roe:13.6, roa:4.82, debtEquity:0.28, week52High:24.00, week52Low:19.20, beta:0.68, shares:1079000000  },
  { symbol:"SIME",    name:"Sime Darby Bhd",                sector:"Industrials",            industry:"Industrial Conglomerate", price:2.68,   change:0.04,  changePct:1.52,  volume:18420000,  marketCap:18200,  pe:12.4, pb:1.32, eps:0.216, dividendYield:4.48, revenue:45200,  netProfit:1468, roe:10.8, roa:2.14, debtEquity:0.42, week52High:3.20,  week52Low:2.30,  beta:1.08, shares:6791000000  },
  { symbol:"AXIATA",  name:"Axiata Group Bhd",              sector:"Communications",         industry:"Telecom",                price:2.48,   change:-0.06, changePct:-2.36, volume:14560000,  marketCap:22500,  pe:24.8, pb:1.52, eps:0.100, dividendYield:2.02, revenue:14200,  netProfit:908,  roe:6.2,  roa:2.12, debtEquity:0.72, week52High:3.20,  week52Low:2.10,  beta:0.98, shares:9073000000  },
  { symbol:"RHBBANK", name:"RHB Bank Bhd",                  sector:"Finance",                industry:"Banking",                price:6.12,   change:0.08,  changePct:1.32,  volume:9840000,   marketCap:24600,  pe:10.2, pb:0.95, eps:0.600, dividendYield:5.88, revenue:16200,  netProfit:2408, roe:9.4,  roa:1.02, debtEquity:0.44, week52High:6.90,  week52Low:5.50,  beta:0.88, shares:4020000000  },
  { symbol:"HLFG",    name:"Hong Leong Financial Group",    sector:"Finance",                industry:"Banking",                price:18.60,  change:-0.20, changePct:-1.06, volume:1890000,   marketCap:19200,  pe:12.8, pb:1.18, eps:1.453, dividendYield:2.42, revenue:11800,  netProfit:1500, roe:9.6,  roa:0.82, debtEquity:0.38, week52High:21.00, week52Low:16.80, beta:0.62, shares:1032000000  },
  { symbol:"MISC",    name:"MISC Bhd",                      sector:"Industrials",            industry:"Marine Shipping",        price:7.08,   change:0.12,  changePct:1.72,  volume:4560000,   marketCap:31600,  pe:15.4, pb:1.08, eps:0.460, dividendYield:4.52, revenue:12400,  netProfit:2052, roe:7.2,  roa:3.44, debtEquity:0.32, week52High:8.20,  week52Low:6.40,  beta:0.52, shares:4464000000  },
  { symbol:"IHH",     name:"IHH Healthcare Bhd",            sector:"Healthcare",             industry:"Hospital & Clinics",     price:6.58,   change:0.06,  changePct:0.92,  volume:7230000,   marketCap:57800,  pe:38.4, pb:2.84, eps:0.171, dividendYield:0.76, revenue:18400,  netProfit:1504, roe:7.6,  roa:2.84, debtEquity:0.48, week52High:7.20,  week52Low:5.90,  beta:0.48, shares:8785000000  },
  { symbol:"HARTA",   name:"Hartalega Holdings Bhd",        sector:"Healthcare",             industry:"Medical Supplies",       price:2.82,   change:0.10,  changePct:3.68,  volume:28940000,  marketCap:9700,   pe:44.2, pb:4.12, eps:0.064, dividendYield:1.42, revenue:3840,   netProfit:220,  roe:9.8,  roa:6.24, debtEquity:0.08, week52High:3.20,  week52Low:1.90,  beta:1.58, shares:3440000000  },
  { symbol:"TOPGLOV", name:"Top Glove Corporation Bhd",     sector:"Healthcare",             industry:"Medical Supplies",       price:0.945,  change:-0.015,changePct:-1.56, volume:45780000,  marketCap:7600,   pe:38.6, pb:1.84, eps:0.024, dividendYield:0.53, revenue:4120,   netProfit:197,  roe:4.8,  roa:2.84, debtEquity:0.14, week52High:1.45,  week52Low:0.72,  beta:1.82, shares:8042000000  },
  { symbol:"INARI",   name:"Inari Amertron Bhd",            sector:"Technology",             industry:"Semiconductors",         price:3.42,   change:0.08,  changePct:2.40,  volume:19560000,  marketCap:11200,  pe:32.4, pb:5.44, eps:0.106, dividendYield:2.34, revenue:2840,   netProfit:348,  roe:17.4, roa:12.84,debtEquity:0.04, week52High:4.10,  week52Low:2.60,  beta:1.42, shares:3275000000  },
  { symbol:"MY",      name:"Malaysia Airports Holdings Bhd",sector:"Industrials",            industry:"Airport Services",       price:8.94,   change:-0.08, changePct:-0.88, volume:3450000,   marketCap:14800,  pe:28.6, pb:2.14, eps:0.313, dividendYield:1.68, revenue:4280,   netProfit:517,  roe:7.6,  roa:2.44, debtEquity:0.62, week52High:10.20, week52Low:7.80,  beta:0.82, shares:1656000000  },
];

export const SECTORS = [
  { name:"Finance",                stocks:6, change:0.48,  marketCap:313200 },
  { name:"Communications",         stocks:3, change:-0.98, marketCap:80500  },
  { name:"Utilities",              stocks:1, change:-1.38, marketCap:72800  },
  { name:"Healthcare",             stocks:3, change:1.01,  marketCap:75100  },
  { name:"Consumer Staples",       stocks:2, change:0.22,  marketCap:47900  },
  { name:"Industrials",            stocks:3, change:0.79,  marketCap:64600  },
  { name:"Materials",              stocks:1, change:1.44,  marketCap:44900  },
  { name:"Technology",             stocks:1, change:2.40,  marketCap:11200  },
  { name:"Consumer Discretionary", stocks:1, change:3.43,  marketCap:16200  },
];

export const KLCI_HISTORY = Array.from({ length: 60 }, (_, i) => {
  const base = 1580;
  const noise = Math.sin(i*0.3)*30 + Math.sin(i*0.1)*20 + (Math.random()-0.5)*15;
  return {
    date: new Date(Date.now()-(59-i)*24*60*60*1000).toLocaleDateString("en-MY",{month:"short",day:"numeric"}),
    value: Math.round((base+noise)*100)/100,
  };
});

export const MARKET_INDICES = [
  { name:"FBM KLCI",       value:1598.42, change:8.21,   changePct:0.52  },
  { name:"FBM 70",         value:16840.35,change:-42.18, changePct:-0.25 },
  { name:"FBM Small Cap",  value:18924.61,change:124.52, changePct:0.66  },
  { name:"FBM ACE",        value:7218.44, change:58.82,  changePct:0.82  },
];

export const CORPORATE_ACTIONS = [
  { company:"MAYBANK", action:"Dividend",    detail:"Final dividend of 29 sen per share",   exDate:"2025-05-10" },
  { company:"PBBANK",  action:"Dividend",    detail:"Interim dividend of 8 sen per share",  exDate:"2025-05-14" },
  { company:"TENAGA",  action:"AGM",         detail:"Annual General Meeting 2025",           exDate:"2025-05-22" },
  { company:"PCHEM",   action:"Bonus Issue", detail:"1 for 5 bonus shares",                 exDate:"2025-06-01" },
  { company:"IHH",     action:"Rights Issue",detail:"1 for 8 at RM5.50",                    exDate:"2025-06-15" },
  { company:"GENTING", action:"Dividend",    detail:"Special dividend of 10 sen",           exDate:"2025-06-20" },
];

export const IPO_LIST = [
  { name:"Kumpulan Aquabaric Bhd", symbol:"AQUA",  sector:"Utilities",    issue:0.48, listing:"2025-03-15", status:"Listed",   gain:18.75, marketCap:240  },
  { name:"Bpuri Holdings Bhd",     symbol:"BPURI", sector:"Construction", issue:0.35, listing:"2025-04-02", status:"Listed",   gain:-5.71, marketCap:175  },
  { name:"Pekat Group Bhd",        symbol:"PEKAT", sector:"Industrials",  issue:0.52, listing:"2025-04-18", status:"Upcoming", gain:0,     marketCap:312  },
  { name:"MN Holdings Bhd",        symbol:"MNH",   sector:"Engineering",  issue:0.28, listing:"2025-05-05", status:"Upcoming", gain:0,     marketCap:168  },
  { name:"Eco Solutions Bhd",      symbol:"ECO",   sector:"Environment",  issue:0.65, listing:"2025-05-20", status:"Upcoming", gain:0,     marketCap:455  },
];

export function generatePriceHistory(basePrice: number, days = 90) {
  let price = basePrice * 0.85;
  return Array.from({ length: days }, (_, i) => {
    price = price*(1+(Math.random()-0.48)*0.025);
    return {
      date: new Date(Date.now()-(days-i)*24*60*60*1000).toLocaleDateString("en-MY",{month:"short",day:"numeric"}),
      price: Math.round(price*1000)/1000,
      volume: Math.floor(Math.random()*10000000+2000000),
    };
  });
}

export function generateFinancials(stock: Stock) {
  const quarters = ["Q1 FY24","Q2 FY24","Q3 FY24","Q4 FY24","Q1 FY25","Q2 FY25"];
  return quarters.map((q,i) => ({
    quarter: q,
    revenue:   Math.round(stock.revenue/4*(1+i*0.02+(Math.random()-0.5)*0.1)),
    netProfit: Math.round(stock.netProfit/4*(1+i*0.03+(Math.random()-0.5)*0.15)),
    eps:       Math.round(stock.eps/4*(1+i*0.03)*100)/100,
  }));
}
