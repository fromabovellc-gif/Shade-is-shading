import React, { useEffect, useMemo, useState } from 'react';
import './index.css';

const STORAGE_KEYS = {
  hue: 'sv_hue',
  speed: 'sv_speed',
  intensity: 'sv_intensity',
} as const;

function usePersistedNumber(key: string, initial: number) {
  const [value, setValue] = useState<number>(() => {
    const raw = localStorage.getItem(key);
    const n = raw !== null ? Number(raw) : initial;
    return Number.isFinite(n) ? n : initial;
  });
  useEffect(() => { localStorage.setItem(key, String(value)); }, [key, value]);
  return [value, setValue] as const;
}

export default function App() {
  const [hue, setHue] = usePersistedNumber(STORAGE_KEYS.hue, 0.6);
  const [speed, setSpeed] = usePersistedNumber(STORAGE_KEYS.speed, 1.0);
  const [intensity, setIntensity] = usePersistedNumber(STORAGE_KEYS.intensity, 1.0);

  const handleReset = () => {
    setHue(0.6);
    setSpeed(1.0);
    setIntensity(1.0);
    localStorage.removeItem(STORAGE_KEYS.hue);
    localStorage.removeItem(STORAGE_KEYS.speed);
    localStorage.removeItem(STORAGE_KEYS.intensity);
  };

  // Expose values to your shader/canvas if needed
  const shaderUniforms = useMemo(() => ({ hue, speed, intensity }), [hue, speed, intensity]);

  return (
    <div className="app-root">
      <div className="canvas-wrap">
        {/* Existing canvas / shader component goes here. Example: */}
        {/* <ShaderCanvas hue={hue} speed={speed} intensity={intensity} /> */}
        <canvas id="shader-canvas" className="shader-canvas" />
      </div>

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

        <div className="controls-actions">
          <button type="button" className="reset-btn" onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  );
}

