import React from 'react';

type Props = {
  hue: number;
  speed: number;
  intensity: number;
  onHue: (n: number) => void;
  onSpeed: (n: number) => void;
  onIntensity: (n: number) => void;
  onReset: () => void;
};

export default function Controls({ hue, speed, intensity, onHue, onSpeed, onIntensity, onReset }: Props) {
  return (
    <div className="controls-bar">
      <div className="controls-row">
        <label>
          Hue
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={hue}
            onChange={(e) => onHue(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Speed
          <input
            type="range"
            min="0"
            max="3"
            step="0.01"
            value={speed}
            onChange={(e) => onSpeed(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Intensity
          <input
            type="range"
            min="0"
            max="3"
            step="0.01"
            value={intensity}
            onChange={(e) => onIntensity(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <button className="reset" onClick={onReset}>Reset</button>
    </div>
  );
}
