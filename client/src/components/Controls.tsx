import React from 'react';

interface ControlsProps {
  hue: number;
  speed: number;
  intensity: number;
  setHue?: (n: number) => void;
  setSpeed?: (n: number) => void;
  setIntensity?: (n: number) => void;
  onReset?: () => void;
}

export default function Controls(props: ControlsProps) {
  console.log('[Controls] mounted');

  const { hue, speed, intensity, setHue, setSpeed, setIntensity } = props;

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
              onChange={(e) => setHue?.(parseFloat(e.target.value))}
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
              onChange={(e) => setSpeed?.(parseFloat(e.target.value))}
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
              onChange={(e) => setIntensity?.(parseFloat(e.target.value))}
            />
          </div>
        </details>
      </div>

      <div className="controls-actions">
        <button
          type="button"
          className="reset-btn"
          onClick={() => {
            if (typeof props?.onReset === 'function') {
              props.onReset();
              return;
            }
            try {
              localStorage.removeItem('sv_hue');
              localStorage.removeItem('sv_speed');
              localStorage.removeItem('sv_intensity');
              window.dispatchEvent(new CustomEvent('shadervibe:reset'));
            } catch {}
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
