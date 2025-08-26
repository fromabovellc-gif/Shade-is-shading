import React from "react";
import Controls from "./components/Controls";
import "./index.css";

export default function App() {
  return (
    <div className="app">
      <h1 className="title">Hello from Express API 👋</h1>
      <div className="canvas-wrap">
        <canvas id="shader-canvas"></canvas>
      </div>
      <Controls />
    </div>
  );
}
