import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export const metadata: Metadata = {
  title: "BursaMind AI — Bursa Malaysia Research Platform",
  description: "AI-powered stock research and analysis for Bursa Malaysia — Main Market, ACE Market, LEAP Market",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <div style={{ display:"flex", minHeight:"100vh" }}>
          <Sidebar/>
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <Topbar/>
            <main style={{ flex:1, overflowY:"auto", padding:"24px", background:"var(--bg)" }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
