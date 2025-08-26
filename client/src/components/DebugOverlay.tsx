import React, { useEffect, useState } from "react";
import { resetControls } from "../lib/resetControls";

const buildTimestamp = new Date().toISOString();

export default function DebugOverlay() {
  const [mounted, setMounted] = useState("unknown");

  useEffect(() => {
    const update = () => {
      const v = (window as any).__controlsMounted;
      setMounted(typeof v === "boolean" ? String(v) : "unknown");
    };
    update();
    const id = setInterval(update, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "12px 16px",
        fontSize: 14,
        lineHeight: 1.2,
        background: "rgba(255, 0, 0, 0.85)",
        color: "#fff",
        textShadow: "0 1px 0 rgba(0,0,0,.4)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        DEBUG OVERLAY — Controls mount: {mounted} — Build: {buildTimestamp}
      </div>
      <button
        onClick={resetControls}
        style={{
          appearance: "none",
          border: "1px solid rgba(255,255,255,0.25)",
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: 8,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Reset
      </button>
    </div>
  );
}
