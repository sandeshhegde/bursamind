import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `You are Aria, an expert AI assistant specialising in Bursa Malaysia stock market research and analysis. You have deep knowledge of:
- Bursa Malaysia Main Market, ACE Market, and LEAP Market
- Malaysian stock fundamentals: P/E, P/B, dividend yields, ROE, EPS
- FBM KLCI, FBM 70, FBM Small Cap, FBM ACE indices
- Key Malaysian sectors: Finance (MAYBANK/1155, CIMB/1023, PBBANK/1295), Utilities (TENAGA/5347), Plantation (IOICORP/1961, KLK/2445), Telecom (MAXIS/6012, DIGI/6947, AXIATA/6888), Healthcare (IHH/5225, HARTALEGA/5168), Technology (INARI/0166)
- Bursa stock codes: 4-digit codes used on Bursa Malaysia (e.g. MAYBANK = 1155)
- Bursa Malaysia listing requirements and corporate governance rules
- Malaysian economy, Bank Negara Malaysia monetary policy, MYR/USD dynamics
- Shariah-compliant investing on Bursa (SC Shariah list)
- Malaysian REITs (M-REITs): KLCC, Pavilion, IGB, Sunway, CapitaLand
- EPF, KWSP, KWAP, Tabung Haji, PNB as major institutional investors
- Seasonal patterns: quarterly earnings cycles (Feb, May, Aug, Nov)
- Key research sources: Bursa announcements, SC filings, bank research reports

Always provide helpful, professional analysis. Use MYR for prices. Mention Bursa stock codes when relevant. Keep responses concise and actionable. Remind users this is not financial advice.`
        },
        ...messages
      ],
    }),
  });

  const data = await response.json();
  
  // Return in a format compatible with existing frontend
  const text = data.choices?.[0]?.message?.content || "Sorry, I could not get a response. Please check your GROQ_API_KEY in Vercel settings.";
  return NextResponse.json({
    content: [{ type: "text", text }]
  });
}
