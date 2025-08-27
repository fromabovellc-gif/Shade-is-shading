import React, { useEffect, useState } from 'react';

const STORAGE_KEYS = {
  hue: 'shader:hue',
  speed: 'shader:speed',
  intensity: 'shader:intensity',
} as const;

export default function Controls() {
  const [hue, setHue] = useState(0.6);
  const [speed, setSpeed] = useState(1.0);
  const [intensity, setIntensity] = useState(0.8);

  useEffect(() => {
    try {
      const h = localStorage.getItem(STORAGE_KEYS.hue);
      if (h !== null) {
        const n = parseFloat(h);
        if (!Number.isNaN(n)) setHue(n);
      }
      const s = localStorage.getItem(STORAGE_KEYS.speed);
      if (s !== null) {
        const n = parseFloat(s);
        if (!Number.isNaN(n)) setSpeed(n);
      }
      const i = localStorage.getItem(STORAGE_KEYS.intensity);
      if (i !== null) {
        const n = parseFloat(i);
        if (!Number.isNaN(n)) setIntensity(n);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.hue, String(hue)); } catch {}
  }, [hue]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.speed, String(speed)); } catch {}
  }, [speed]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.intensity, String(intensity)); } catch {}
  }, [intensity]);

  const reset = () => {
    setHue(0.6);
    setSpeed(1.0);
    setIntensity(0.8);
    try {
      localStorage.removeItem(STORAGE_KEYS.hue);
      localStorage.removeItem(STORAGE_KEYS.speed);
      localStorage.removeItem(STORAGE_KEYS.intensity);
    } catch {}
  };

  return (
    <div id="controls-fixed">
      <div className="controls-row">
        <details open>
          <summary>Colors</summary>
          <div className="control">
            <label htmlFor="hue">Hue: {hue.toFixed(2)}</label>
            <input
              id="hue"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={hue}
              onChange={(e) => setHue(parseFloat(e.target.value))}
            />
          </div>
        </details>
      </div>

      <div className="controls-row">
        <details open>
          <summary>Motion</summary>
          <div className="control">
            <label htmlFor="speed">Speed: {speed.toFixed(2)}</label>
            <input
              id="speed"
              type="range"
              min={0}
              max={5}
              step={0.01}
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
            />
          </div>
        </details>
      </div>

      <div className="controls-row">
        <details open>
          <summary>FX</summary>
          <div className="control">
            <label htmlFor="intensity">Intensity: {intensity.toFixed(2)}</label>
            <input
              id="intensity"
              type="range"
              min={0}
              max={2}
              step={0.01}
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
            />
          </div>
        </details>
      </div>

      <button
        type="button"
        onClick={reset}
        style={{marginTop:12,padding:"8px 12px",border:"1px solid #999",background:"#eee",cursor:"pointer"}}
      >
        Reset
      </button>
    </div>
  );
}
