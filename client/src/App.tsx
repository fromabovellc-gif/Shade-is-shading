import React, { useEffect } from "react";
import Controls from "./components/Controls";
import DebugOverlay from "./components/DebugOverlay";
import ResetButton from "./components/ResetButton";
import "./index.css";

export default function App() {
  useEffect(() => {
    console.log("[App] ACTIVE", new Date().toISOString());
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
          bottom: "56px",
          padding: "12px 16px",
          zIndex: 100000,
          pointerEvents: "auto",
          background: "rgba(0,0,0,.75)",
          color: "#fff",
        }}
      >
        <Controls />
      </div>
      <ResetButton />
      <div
        style={{
          position: "fixed",
          right: 8,
          bottom: 8,
          zIndex: 999999,
          background: "#0bf",
          color: "#000",
          padding: "6px 8px",
          fontSize: 12,
        }}
      >
        ACTIVE CLIENT
      </div>
      <DebugOverlay />
    </div>
  );
}
