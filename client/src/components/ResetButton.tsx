import React from "react";
const keys = ["sv_hue", "sv_speed", "sv_intensity"];
export default function ResetButton() {
  const onClick = () => {
    keys.forEach((k) => localStorage.removeItem(k));
    location.reload();
  };
  return (
    <button
      onClick={onClick}
      aria-label="Reset controls"
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 2147483647,
        padding: "10px 14px",
        background: "#111",
        color: "#fff",
        border: "1px solid rgba(255,255,255,.35)",
        borderRadius: 10,
        fontWeight: 600
      }}
    >
      Reset
    </button>
  );
}
