import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import Controls from './components/Controls';

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
  console.log('[App] rendering with controls');
  const [hue, setHue] = usePersistedNumber(STORAGE_KEYS.hue, 0.6);
  const [speed, setSpeed] = usePersistedNumber(STORAGE_KEYS.speed, 1.0);
  const [intensity, setIntensity] = usePersistedNumber(STORAGE_KEYS.intensity, 1.0);
  const onReset = () => {
    setHue(0.6);
    setSpeed(1.0);
    setIntensity(1.0);
    localStorage.removeItem(STORAGE_KEYS.hue);
    localStorage.removeItem(STORAGE_KEYS.speed);
    localStorage.removeItem(STORAGE_KEYS.intensity);
    window.dispatchEvent(new CustomEvent('shadervibe:reset'));
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

      <Controls
        hue={hue}
        speed={speed}
        intensity={intensity}
        setHue={setHue}
        setSpeed={setSpeed}
        setIntensity={setIntensity}
        onReset={onReset}
      />
    </div>
  );
}

