"use client";
import { useEffect, useRef, useId } from "react";

interface TVWidgetProps {
  scriptSrc: string;
  config: Record<string, unknown>;
  height?: number | string;
  containerStyle?: React.CSSProperties;
}

/**
 * Generic TradingView widget loader.
 * Handles the official embed pattern: a div container + a <script> tag
 * with the JSON config inlined as the script's text content.
 * Cleans up properly on unmount / symbol change to avoid duplicate widgets.
 */
export default function TVWidget({ scriptSrc, config, height = 500, containerStyle }: TVWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    container.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptSrc;
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptSrc, JSON.stringify(config)]);

  return (
    <div
      key={uid}
      className="tradingview-widget-container"
      ref={ref}
      style={{ width: "100%", height, ...containerStyle }}
    />
  );
}
