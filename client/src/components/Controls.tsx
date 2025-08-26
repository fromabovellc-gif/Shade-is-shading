import React from "react"
import type { AppState } from "../types"

type Props = {
  state: AppState
  onChange: (next: Partial<AppState>) => void
  onReset: () => void
}

export default function Controls({ state, onChange, onReset }: Props) {
  return (
    <div className="controls">
      <details open>
        <summary>Colors</summary>
        <label className="row">
          <span>Hue: {state.hue.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={state.hue}
            onChange={(e) => onChange({ hue: Number(e.target.value) })}
          />
        </label>
      </details>

      <details open>
        <summary>Motion</summary>
        <label className="row">
          <span>Speed: {state.speed.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={3}
            step={0.01}
            value={state.speed}
            onChange={(e) => onChange({ speed: Number(e.target.value) })}
          />
        </label>
      </details>

      <details open>
        <summary>FX</summary>
        <label className="row">
          <span>Intensity: {state.intensity.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={2}
            step={0.01}
            value={state.intensity}
            onChange={(e) => onChange({ intensity: Number(e.target.value) })}
          />
        </label>
      </details>

      <div className="actions">
        <button
          onClick={onReset}
          style={{ marginTop: "20px", padding: "8px 16px", fontSize: "16px" }}
        >
          Reset
        </button>
        <button onClick={() => navigator.clipboard.writeText(location.href)}>
          Copy Link
        </button>
      </div>
    </div>
  )
}

