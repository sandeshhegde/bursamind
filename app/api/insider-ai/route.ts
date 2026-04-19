import { NextRequest, NextResponse } from "next/server";

// AI signal analyst — takes a batch of insider transactions and returns deep analysis
export async function POST(req: NextRequest) {
  const { transactions, stock } = await req.json();

  const txSummary = transactions.slice(0, 5).map((t: {
    name: string; role: string; type: string; shares: number;
    value: number; price: number; date: string; totalPct: number;
  }) =>
    `${t.date}: ${t.name} (${t.role}) ${t.type} ${t.shares.toLocaleString()} shares @ RM${t.price.toFixed(3)}, value RM${(t.value/1000).toFixed(0)}K, total holding ${t.totalPct.toFixed(2)}%`
  ).join("\n");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content: `You are an expert Bursa Malaysia insider transaction analyst. Analyse director and substantial shareholder dealings to surface investment signals. You understand Malaysian corporate governance, Bursa listing rules (Chapter 14), closed period restrictions, and the significance of different types of insider transactions. Be direct, specific, and actionable. Use MYR. Keep response under 200 words.`,
        },
        {
          role: "user",
          content: `Analyse these insider transactions for ${stock} on Bursa Malaysia:\n\n${txSummary}\n\nProvide: (1) Signal strength and rationale (2) Key risk factors (3) One actionable takeaway. Be specific about Malaysian market context.`,
        },
      ],
    }),
  });

  const data = await res.json();
  const analysis = data.choices?.[0]?.message?.content || "Analysis unavailable.";
  return NextResponse.json({ analysis });
}
