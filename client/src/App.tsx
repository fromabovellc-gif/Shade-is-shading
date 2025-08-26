import React, { useEffect } from "react";
import Controls from "./components/Controls";
import DebugOverlay from "./components/DebugOverlay";
import "./index.css";

export default function App() {
  useEffect(() => {
    console.log(`[App] mounted @ ${new Date().toISOString()}`);
    const canvas = document.getElementById("shader-canvas");
    if (canvas) {
      console.log("[Canvas] ready");
    }
  }, []);

  return (
    <div className="app">
      <h1 style={{ color: "magenta" }}>APP SHELL LOADED</h1>
      <div className="canvas-wrap">
        <canvas id="shader-canvas" className="shader-canvas"></canvas>
      </div>
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 56,
          padding: "12px 16px",
          zIndex: 100000,
          pointerEvents: "auto",
          background: "rgba(0,0,0,.75)",
          color: "#fff",
        }}
      >
        <Controls />
      </div>
      <DebugOverlay />
    </div>
  );
}
