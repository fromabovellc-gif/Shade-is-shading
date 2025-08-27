import React, { useEffect, useState } from 'react';

const STORAGE_KEYS = {
  hue: 'shader:hue',
  speed: 'shader:speed',
  intensity: 'shader:intensity',
} as const;

const TABS = [
  { key: 'templates', label: 'Templates' },
  { key: 'colors', label: 'Colors' },
  { key: 'motion', label: 'Motion' },
  { key: 'effects', label: 'Effects' },
] as const;

type ControlsState = {
  hue: number;
  speed: number;
  intensity: number;
};

interface ControlsProps {
  controlsRef: React.MutableRefObject<ControlsState>;
}

export default function Controls({ controlsRef }: ControlsProps) {
  const [active, setActive] = useState<string>('templates');
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
    controlsRef.current = { hue, speed, intensity };
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.hue, String(hue));
        localStorage.setItem(STORAGE_KEYS.speed, String(speed));
        localStorage.setItem(STORAGE_KEYS.intensity, String(intensity));
      } catch {}
    }, 150);
    return () => clearTimeout(t);
  }, [hue, speed, intensity, controlsRef]);

  const resetAll = () => {
    setHue(0.6);
    setSpeed(1.0);
    setIntensity(0.8);
    controlsRef.current = { hue: 0.6, speed: 1.0, intensity: 0.8 };
    try {
      localStorage.removeItem(STORAGE_KEYS.hue);
      localStorage.removeItem(STORAGE_KEYS.speed);
      localStorage.removeItem(STORAGE_KEYS.intensity);
    } catch {}
  };

  return (
    <div className="controls-card">
      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab ${active === t.key ? 'is-active' : ''}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === 'templates' && <div className="panel" />}

      {active === 'colors' && (
        <div className="panel">
          <div className="row">
            <label htmlFor="hue">Hue: {hue.toFixed(2)}</label>
            <input
              id="hue"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={hue}
              onChange={(e) =>
                setHue((e.target as HTMLInputElement).valueAsNumber)
              }
            />
          </div>
        </div>
      )}

      {active === 'motion' && (
        <div className="panel">
          <div className="row">
            <label htmlFor="speed">Speed: {speed.toFixed(2)}</label>
            <input
              id="speed"
              type="range"
              min={0}
              max={5}
              step={0.01}
              value={speed}
              onChange={(e) =>
                setSpeed((e.target as HTMLInputElement).valueAsNumber)
              }
            />
          </div>
        </div>
      )}

      {active === 'effects' && (
        <div className="panel">
          <div className="row">
            <label htmlFor="intensity">Intensity: {intensity.toFixed(2)}</label>
            <input
              id="intensity"
              type="range"
              min={0}
              max={2}
              step={0.01}
              value={intensity}
              onChange={(e) =>
                setIntensity((e.target as HTMLInputElement).valueAsNumber)
              }
            />
          </div>
        </div>
      )}

      <button type="button" className="reset" onClick={resetAll}>
        Reset
      </button>
    </div>
  );
}

