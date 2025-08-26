import React, { useEffect, useState } from "react";

const read = (k: string, d: number) => {
  const v = localStorage.getItem(k);
  return v === null ? d : Number(v);
};
const write = (k: string, v: number) => localStorage.setItem(k, String(v));

function Controls() {
  const [hue, setHue] = useState(read("hue", 0.6));
  const [speed, setSpeed] = useState(read("speed", 1.0));
  const [intensity, setIntensity] = useState(read("intensity", 1.0));

  useEffect(() => {
    (window as any).__controlsMounted = true;
    console.log("[Controls] mounted");
  }, []);

  useEffect(() => write("hue", hue), [hue]);
  useEffect(() => write("speed", speed), [speed]);
  useEffect(() => write("intensity", intensity), [intensity]);

  return (
    <div className="controls-panel">
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
    </div>
  );
}

export default Controls;
