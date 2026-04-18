"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Plus, Sparkles, TrendingUp } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "What are the top dividend stocks on Bursa Malaysia?",
  "Analyse MAYBANK fundamentals and outlook",
  "Compare KLCI performance vs regional markets",
  "Which Bursa sectors are best for 2025?",
  "Explain how to read a Bursa quarterly report",
  "What are Shariah-compliant blue chips on Bursa?",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState(["Current Session"]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please check your API key in Vercel environment variables." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 82px)", gap: 0, margin: -24 }}>
      {/* Chat sidebar */}
      <div style={{
        width: 240, background: "var(--bg2)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", padding: 14
      }}>
        <button
          onClick={() => { setMessages([]); setSessions(prev => [`Session ${prev.length + 1}`, ...prev]); }}
          className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 16 }}>
          <Plus size={14} /> New Chat
        </button>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
          History
        </div>
        {sessions.map((s, i) => (
          <div key={i} style={{
            padding: "8px 10px", borderRadius: 8, fontSize: 12, color: i === 0 ? "var(--accent)" : "var(--text2)",
            background: i === 0 ? "rgba(0,200,151,0.1)" : "transparent",
            cursor: "pointer", marginBottom: 2, fontWeight: i === 0 ? 600 : 400
          }}>{s}</div>
        ))}
      </div>

      {/* Main chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)" }}>
        {/* Header */}
        <div style={{
          padding: "16px 24px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 12, background: "var(--bg2)"
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, var(--accent), var(--blue))",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Sparkles size={18} color="#000" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>Aria — AI Research Assistant</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>Powered by Claude · Specialised in Bursa Malaysia</div>
          </div>
          <div style={{
            marginLeft: "auto", display: "flex", alignItems: "center", gap: 6,
            fontSize: 11, color: "var(--accent)", fontWeight: 600
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />
            Online
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {messages.length === 0 ? (
            <div style={{ maxWidth: 620, margin: "0 auto", paddingTop: 40 }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: "linear-gradient(135deg, var(--accent), var(--blue))",
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px"
                }}>
                  <TrendingUp size={28} color="#000" />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
                  Ask Aria anything about Bursa Malaysia
                </h2>
                <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.6 }}>
                  I can help with stock analysis, sector research, fundamentals, dividend strategies, and more — all focused on the Malaysian market.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)}
                    style={{
                      background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10,
                      padding: "12px 14px", textAlign: "left", cursor: "pointer", fontSize: 12,
                      color: "var(--text2)", transition: "all 0.15s", fontFamily: "inherit"
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text2)"; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: m.role === "user" ? "var(--card2)" : "linear-gradient(135deg, var(--accent), var(--blue))",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {m.role === "user" ? <User size={14} color="var(--text2)" /> : <Sparkles size={14} color="#000" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", marginBottom: 6 }}>
                      {m.role === "user" ? "You" : "Aria"}
                    </div>
                    <div className={m.role === "user" ? "chat-user" : "chat-ai"}
                      style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text)", whiteSpace: "pre-wrap" }}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: "linear-gradient(135deg, var(--accent), var(--blue))",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Sparkles size={14} color="#000" />
                  </div>
                  <div className="chat-ai" style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          width: 7, height: 7, borderRadius: "50%", background: "var(--accent)",
                          animation: `bounce 1.2s ${i * 0.2}s infinite`
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", background: "var(--bg2)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 10 }}>
            <input
              className="input"
              placeholder="Ask about any Bursa Malaysia stock, sector, or market trend…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              style={{ fontSize: 14 }}
            />
            <button onClick={() => send()} disabled={!input.trim() || loading} className="btn-primary"
              style={{ flexShrink: 0, width: 44, height: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: (!input.trim() || loading) ? 0.5 : 1 }}>
              <Send size={16} />
            </button>
          </div>
          <div style={{ maxWidth: 720, margin: "8px auto 0", fontSize: 10, color: "var(--text3)", textAlign: "center" }}>
            Aria is for educational purposes only. Not financial advice. Prices may be delayed.
          </div>
        </div>
      </div>

      <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }`}</style>
    </div>
  );
}
