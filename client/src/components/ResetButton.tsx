import React from "react";

const ResetButton: React.FC = () => {
  const onClick = () => {
    ["sv_hue", "sv_speed", "sv_intensity"].forEach((k) =>
      localStorage.removeItem(k)
    );
    window.location.reload();
  };

  const style: React.CSSProperties = {
    position: "fixed",
    right: 16,
    bottom: 16,
    zIndex: 2147483647,
    padding: "10px 14px",
    background: "#111",
    color: "#fff",
    border: "1px solid rgba(255,255,255,.35)",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    lineHeight: 1,
    cursor: "pointer",
  };

  return (
    <button style={style} onClick={onClick} aria-label="Reset controls">
      Reset
    </button>
  );
};

export default ResetButton;

