import { useEffect, useRef, useState } from "react";
import initLabRenderer, {
  type LabUniforms,
} from "../../lib/gl/labRenderer";

type TabKey =
  | "Emblem"
  | "Companion"
  | "Trail"
  | "Background"
  | "Skins";

function useUniform(
  key: string,
  uniformKey: keyof LabUniforms,
  initial: number,
  uniformsRef: React.MutableRefObject<LabUniforms>
) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    const num = stored !== null ? parseFloat(stored) : initial;
    uniformsRef.current[uniformKey] = num;
    return num;
  });

  const timeout = useRef<number>();

  const set = (v: number) => {
    setValue(v);
    uniformsRef.current[uniformKey] = v;
    window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => {
      localStorage.setItem(key, v.toString());
    }, 150);
  };

  return [value, set] as const;
}

function LabeledRange({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="labeled">
      <label>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
      />
    </div>
  );
}

export default function LabTool() {
  const uniformsRef = useRef<LabUniforms>({
    uHue: 0,
    uGloss: 0,
    uRoughness: 0,
    uRim: 0,
    uTrailIntensity: 0,
    uTrailLength: 0,
    uCompanionCount: 0,
    uCompanionSize: 0,
    uVignette: 0,
    uBlur: 0,
    uBob: 0,
  });

  const [active, setActive] = useState<TabKey>("Emblem");

  const [hue, setHue] = useUniform(
    "lab:hue",
    "uHue",
    0.5,
    uniformsRef
  );
  const [gloss, setGloss] = useUniform(
    "lab:gloss",
    "uGloss",
    0.5,
    uniformsRef
  );
  const [rough, setRough] = useUniform(
    "lab:rough",
    "uRoughness",
    0.5,
    uniformsRef
  );
  const [rim, setRim] = useUniform(
    "lab:rim",
    "uRim",
    0.5,
    uniformsRef
  );
  const [trail, setTrail] = useUniform(
    "lab:trail",
    "uTrailIntensity",
    0,
    uniformsRef
  );
  const [length, setLength] = useUniform(
    "lab:length",
    "uTrailLength",
    0.5,
    uniformsRef
  );
  const [count, setCount] = useUniform(
    "lab:compCount",
    "uCompanionCount",
    0,
    uniformsRef
  );
  const [size, setSize] = useUniform(
    "lab:compSize",
    "uCompanionSize",
    0.2,
    uniformsRef
  );
  const [vig, setVig] = useUniform(
    "lab:vignette",
    "uVignette",
    0.3,
    uniformsRef
  );
  const [blur, setBlur] = useUniform(
    "lab:blur",
    "uBlur",
    0,
    uniformsRef
  );

  const [skinName, setSkinName] = useState("");

  useEffect(() => {
    const canvas = document.getElementById("labCanvas") as HTMLCanvasElement;
    if (!canvas) return;
    const handle = initLabRenderer(canvas, uniformsRef.current);
    return () => handle.dispose();
  }, []);

  const exportJSON = () => {
    const data = {
      hue,
      gloss,
      rough,
      rim,
      trail,
      length,
      count,
      size,
      vig,
      blur,
    };
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${skinName || "skin"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="lab-root">
      <canvas id="labCanvas" className="lab-canvas" />
      <nav className="lab-topnav">
        <a href="/" className="chip">
          Home
        </a>
        <a href="/lab" className="chip is-active">
          Lab Tool
        </a>
      </nav>

      <section className="lab-dock" role="region" aria-label="Lab controls">
        <div className="dock-tabs" role="tablist" aria-label="Layers">
          {["Emblem", "Companion", "Trail", "Background", "Skins"].map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={active === k}
              className={`dock-tab ${active === k ? "is-active" : ""}`}
              onClick={() => setActive(k as TabKey)}
              type="button"
            >
              {k}
            </button>
          ))}
        </div>

        <div className="dock-panel">
          {active === "Emblem" && (
            <div className="panel-grid">
              <LabeledRange
                label={`Hue: ${Math.round(hue * 360)}°`}
                min={0}
                max={1}
                step={0.001}
                value={hue}
                onChange={setHue}
              />
              <LabeledRange
                label={`Gloss: ${gloss.toFixed(2)}`}
                min={0}
                max={1}
                step={0.001}
                value={gloss}
                onChange={setGloss}
              />
              <LabeledRange
                label={`Roughness: ${rough.toFixed(2)}`}
                min={0}
                max={1}
                step={0.001}
                value={rough}
                onChange={setRough}
              />
              <LabeledRange
                label={`Rim: ${rim.toFixed(2)}`}
                min={0}
                max={1}
                step={0.001}
                value={rim}
                onChange={setRim}
              />
            </div>
          )}
          {active === "Companion" && (
            <div className="panel-grid">
              <LabeledRange
                label={`Count: ${count}`}
                min={0}
                max={10}
                step={1}
                value={count}
                onChange={setCount}
              />
              <LabeledRange
                label={`Size: ${size.toFixed(2)}`}
                min={0.05}
                max={0.6}
                step={0.01}
                value={size}
                onChange={setSize}
              />
            </div>
          )}
          {active === "Trail" && (
            <div className="panel-grid">
              <LabeledRange
                label={`Intensity: ${trail.toFixed(2)}`}
                min={0}
                max={1}
                step={0.001}
                value={trail}
                onChange={setTrail}
              />
              <LabeledRange
                label={`Length: ${length.toFixed(2)}`}
                min={0}
                max={1}
                step={0.001}
                value={length}
                onChange={setLength}
              />
            </div>
          )}
          {active === "Background" && (
            <div className="panel-grid">
              <LabeledRange
                label={`Vignette: ${vig.toFixed(2)}`}
                min={0}
                max={1}
                step={0.001}
                value={vig}
                onChange={setVig}
              />
              <LabeledRange
                label={`Blur: ${blur.toFixed(2)}`}
                min={0}
                max={1}
                step={0.001}
                value={blur}
                onChange={setBlur}
              />
            </div>
          )}
          {active === "Skins" && (
            <div className="panel-grid">
              <input
                className="skin-input"
                placeholder="Skin name…"
                value={skinName}
                onChange={(e) => setSkinName(e.target.value)}
              />
              <button
                className="btn primary"
                type="button"
                onClick={exportJSON}
              >
                Export JSON
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

