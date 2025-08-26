import React, { useEffect, useState } from "react";

const read = (k: string, d: number) => {
  const v = localStorage.getItem(k);
  return v === null ? d : Number(v);
};
const write = (k: string, v: number) => localStorage.setItem(k, String(v));

export default function Controls() {
  const [hue, setHue] = useState(read("hue", 0.6));
  const [speed, setSpeed] = useState(read("speed", 1.0));
  const [intensity, setIntensity] = useState(read("intensity", 1.0));

  useEffect(() => write("hue", hue), [hue]);
  useEffect(() => write("speed", speed), [speed]);
  useEffect(() => write("intensity", intensity), [intensity]);

  const resetAll = () => {
    setHue(0.6);
    setSpeed(1.0);
    setIntensity(1.0);
    localStorage.removeItem("hue");
    localStorage.removeItem("speed");
    localStorage.removeItem("intensity");
  };

  return (
    <div
      className="controls-panel"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#fff",
        padding: "16px",
        zIndex: 1000,
      }}
    >
      <details>
        <summary>Colors</summary>
        <div className="row">
          <label>Hue: {hue.toFixed(2)}</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
          />
        </div>
      </details>

      <details>
        <summary>Motion</summary>
        <div className="row">
          <label>Speed: {speed.toFixed(2)}</label>
          <input
            type="range"
            min={0}
            max={3}
            step={0.01}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
      </details>

      <details>
        <summary>FX</summary>
        <div className="row">
          <label>Intensity: {intensity.toFixed(2)}</label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.01}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
          />
        </div>
      </details>

      <div style={{ color: "red" }}>RESET TEST BUTTON</div>
      <button className="reset-btn" onClick={resetAll}>Reset</button>
    </div>
  );
}
