"use client";
import { useState, useEffect, useCallback } from "react";
import { STOCKS, Stock } from "./data";

interface LivePrice {
  price: number;
  change: number;
  changePct: number;
  volume: number;
  marketCap: number;
  pe: number;
  week52High: number;
  week52Low: number;
  open: number;
  dayHigh: number;
  dayLow: number;
}

interface UseLivePricesReturn {
  stocks: Stock[];
  liveData: Record<string, LivePrice>;
  loading: boolean;
  lastUpdated: string | null;
  refresh: () => void;
  isLive: boolean;
}

export function useLivePrices(symbols?: string[]): UseLivePricesReturn {
  const [liveData, setLiveData] = useState<Record<string, LivePrice>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const targetSymbols = symbols || STOCKS.map(s => s.symbol);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/prices?symbols=${targetSymbols.join(",")}`);
      const json = await res.json();
      if (json.data && Object.keys(json.data).length > 0) {
        setLiveData(json.data);
        setLastUpdated(json.timestamp);
        setIsLive(true);
      }
    } catch (e) {
      console.warn("Live prices unavailable, using mock data");
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, [targetSymbols.join(",")]);

  useEffect(() => {
    fetchPrices();
    // Refresh every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Merge live data on top of static mock data
  const stocks = STOCKS.map(stock => {
    const live = liveData[stock.symbol];
    if (!live || live.price === 0) return stock;
    return {
      ...stock,
      price: live.price,
      change: live.change,
      changePct: live.changePct,
      volume: live.volume > 0 ? live.volume : stock.volume,
      marketCap: live.marketCap > 0 ? live.marketCap : stock.marketCap,
      pe: live.pe > 0 ? live.pe : stock.pe,
      week52High: live.week52High > 0 ? live.week52High : stock.week52High,
      week52Low: live.week52Low > 0 ? live.week52Low : stock.week52Low,
    };
  });

  return { stocks, liveData, loading, lastUpdated, refresh: fetchPrices, isLive };
}
