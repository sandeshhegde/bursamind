# 🇲🇾 BursaMind AI — Bursa Malaysia Stock Research Platform

An AI-powered stock research and analysis platform for **Bursa Malaysia** markets, inspired by multibagg.ai. Built with Next.js 16 and powered by Claude AI.

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | FBM KLCI chart, market indices, top gainers/losers, corporate actions |
| 🤖 **Ask Aria (AI Chat)** | Claude-powered AI assistant specialised in Bursa Malaysia |
| 🔍 **Stock Screener** | Filter by P/E, P/B, dividend yield, ROE, sector, and more |
| 📈 **Market Overview** | FBM KLCI, FBM 70, FBM Small Cap, FBM ACE indices + breadth |
| 📉 **Market Movers** | Top gainers, losers, most active by volume/value |
| 💼 **Portfolio Tracker** | Track holdings, P&L, allocation pie chart |
| ⭐ **Watchlist** | Save and monitor favourite stocks |
| 🏭 **Sectors & Industries** | Sector heatmap + drilldown by stock |
| 📋 **IPO Tracker** | Upcoming and recent Bursa Malaysia listings |
| 📄 **Stock Detail Pages** | Price charts, financials, key ratios, about |

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1 — Push to GitHub
```bash
cd bursamind
git init
git add .
git commit -m "Initial BursaMind AI commit"
gh repo create bursamind --public --push
# or: git remote add origin https://github.com/YOUR_USERNAME/bursamind.git && git push -u origin main
```

### Step 2 — Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Click **Deploy** — first deploy works without API key (chat disabled)

### Step 3 — Add Anthropic API Key (for AI Chat)
1. In Vercel dashboard → **Settings** → **Environment Variables**
2. Add: `ANTHROPIC_API_KEY` = your key from [console.anthropic.com](https://console.anthropic.com)
3. **Redeploy** the project

That's it! 🎉

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Run development server
npm run dev
# Open http://localhost:3000
```

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + custom CSS variables
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Anthropic Claude (claude-haiku-4-5 — free tier friendly)
- **Deployment**: Vercel

## 🏛️ Market Coverage

- **Main Market** — Blue-chip stocks (MAYBANK, CIMB, PBBANK, TENAGA, etc.)
- **ACE Market** — Growth companies
- **LEAP Market** — SME-focused listings
- **Indices**: FBM KLCI, FBM 70, FBM Small Cap, FBM ACE

## 📊 Included Stocks (20 real Bursa Malaysia companies)

| Symbol | Company | Sector |
|---|---|---|
| MAYBANK | Malayan Banking Bhd | Finance |
| CIMB | CIMB Group Holdings | Finance |
| PBBANK | Public Bank Bhd | Finance |
| TENAGA | Tenaga Nasional Bhd | Utilities |
| PCHEM | Petronas Chemicals | Materials |
| MAXIS | Maxis Bhd | Communications |
| DIGI | CelcomDigi Bhd | Communications |
| GENTING | Genting Bhd | Consumer Discretionary |
| IHH | IHH Healthcare Bhd | Healthcare |
| INARI | Inari Amertron Bhd | Technology |
| ... | + 10 more | Various |

## 🔌 Adding Real Market Data

To replace mock data with live prices, integrate any of these APIs in `lib/data.ts`:

- **Bursa Market Data**: [bursamarketplace.com](https://bursamarketplace.com)
- **Yahoo Finance**: `yfinance` compatible (append `.KL` to symbols)
- **Alpha Vantage**: Free tier with Bursa Malaysia support
- **Klse.i3investor.com**: Scraping-based (check ToS)

Example for Yahoo Finance (add `.KL` suffix):
```
MAYBANK.KL, CIMB.KL, PBBANK.KL, TENAGA.KL
```

## 🤖 Aria AI — Customisation

The AI system prompt is in `app/api/chat/route.ts`. You can extend it with:
- Real-time stock data by fetching prices before calling Claude
- PDF annual report parsing
- Custom screening logic

## 📁 Project Structure

```
bursamind/
├── app/
│   ├── api/chat/route.ts      # Claude AI endpoint
│   ├── dashboard/page.tsx     # Main dashboard
│   ├── chat/page.tsx          # Aria AI chat
│   ├── screener/page.tsx      # Stock screener
│   ├── market/page.tsx        # Market overview
│   ├── movers/page.tsx        # Market movers
│   ├── portfolio/page.tsx     # Portfolio tracker
│   ├── watchlist/page.tsx     # Watchlists
│   ├── sectors/page.tsx       # Sector analysis
│   ├── ipo/page.tsx           # IPO tracker
│   └── stock/[symbol]/        # Stock detail pages
├── components/
│   ├── Sidebar.tsx            # Navigation sidebar
│   └── Topbar.tsx             # Search + market bar
├── lib/
│   └── data.ts                # Bursa Malaysia mock data
└── vercel.json                # Vercel config
```

## ⚠️ Disclaimer

This platform is for **educational and research purposes only**. Stock data may be delayed or simulated. Not financial advice. Always consult a licensed financial advisor before investing. Refer to official Bursa Malaysia sources for accurate data.

---

Built for Bursa Malaysia 🇲🇾 · Powered by Claude AI 🤖
