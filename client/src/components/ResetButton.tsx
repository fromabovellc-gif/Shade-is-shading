import React from "react";
import { resetControls } from "../lib/resetControls";

export default function ResetButton() {
  return (
    <button
      onClick={resetControls}
      aria-label="Reset controls"
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 100000,
        padding: "10px 14px",
        background: "#111",
        color: "#fff",
        border: "1px solid rgba(255,255,255,.35)",
        borderRadius: 10,
        fontWeight: 600,
      }}
    >
      Reset
    </button>
  );
}
