import { useEffect, useRef, useState } from "react";
import initLabRenderer, {
  type LabUniforms,
} from "../../lib/gl/labRenderer";
import "../../styles/lab.css";

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
  uniformsRef: React.MutableRefObject<LabUniforms>,
  map: (v: number) => number = (v) => v
) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    const num = stored !== null ? parseFloat(stored) : initial;
    uniformsRef.current[uniformKey] = map(num);
    return num;
  });

  const timeout = useRef<number>();

  const set = (v: number) => {
    setValue(v);
    uniformsRef.current[uniformKey] = map(v);
    window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => {
      localStorage.setItem(key, v.toString());
    }, 150);
  };

  return [value, set] as const;
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

  const [activeTab, setActiveTab] = useState<TabKey>("Emblem");

  const [hueDeg, setHueDeg] = useUniform(
    "lab:hue",
    "uHue",
    180,
    uniformsRef,
    (v) => v / 360
  );
  const [gloss, setGloss] = useUniform(
    "lab:gloss",
    "uGloss",
    0.5,
    uniformsRef
  );
  const [roughness, setRoughness] = useUniform(
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
  const [atmosphere, setAtmosphere] = useUniform(
    "lab:vignette",
    "uVignette",
    0.85,
    uniformsRef
  );
  const [grain, setGrain] = useUniform(
    "lab:blur",
    "uBlur",
    0.1,
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
      hueDeg,
      gloss,
      roughness,
      rim,
      trail,
      length,
      count,
      size,
      atmosphere,
      grain,
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

      <div className="dock">
        <div className="dock-card">
          <div className="tabs" role="tablist" aria-label="Lab controls">
            {(['Emblem','Companion','Trail','Background','Skins'] as const).map(t => (
              <button
                key={t}
                className={`tab ${activeTab===t ? 'is-active' : ''}`}
                role="tab"
                aria-selected={activeTab===t}
                onClick={()=>setActiveTab(t)}
                type="button"
              >{t}</button>
            ))}
          </div>

          {/* Show exactly one page; keep state/handlers you already have */}
          {activeTab==='Emblem' && (
            <div className="sliders" role="tabpanel" aria-label="Emblem">
              <div className="field">
                <div className="row"><span>Hue</span><span className="value">{Math.round(hueDeg)}°</span></div>
                <input type="range" min={0} max={360} step={1}
                       value={hueDeg}
                       onChange={e=>setHueDeg((e.currentTarget as HTMLInputElement).valueAsNumber)} />
              </div>
              <div className="field">
                <div className="row"><span>Gloss</span><span className="value">{gloss.toFixed(2)}</span></div>
                <input type="range" min={0} max={1} step={0.01}
                       value={gloss}
                       onChange={e=>setGloss((e.currentTarget as HTMLInputElement).valueAsNumber)} />
              </div>
              <div className="field">
                <div className="row"><span>Roughness</span><span className="value">{roughness.toFixed(2)}</span></div>
                <input type="range" min={0} max={1} step={0.01}
                       value={roughness}
                       onChange={e=>setRoughness((e.currentTarget as HTMLInputElement).valueAsNumber)} />
              </div>
              <div className="field">
                <div className="row"><span>Rim</span><span className="value">{rim.toFixed(2)}</span></div>
                <input type="range" min={0} max={1} step={0.01}
                       value={rim}
                       onChange={e=>setRim((e.currentTarget as HTMLInputElement).valueAsNumber)} />
              </div>
            </div>
          )}
          {activeTab==='Companion' && (
            <div className="sliders" role="tabpanel" aria-label="Companion">
              <div className="field">
                <div className="row"><span>Count</span><span className="value">{count}</span></div>
                <input type="range" min={0} max={10} step={1}
                       value={count}
                       onChange={e=>setCount((e.currentTarget as HTMLInputElement).valueAsNumber)} />
              </div>
              <div className="field">
                <div className="row"><span>Size</span><span className="value">{size.toFixed(2)}</span></div>
                <input type="range" min={0.05} max={0.6} step={0.01}
                       value={size}
                       onChange={e=>setSize((e.currentTarget as HTMLInputElement).valueAsNumber)} />
              </div>
            </div>
          )}
          {activeTab==='Trail' && (
            <div className="sliders" role="tabpanel" aria-label="Trail">
              <div className="field">
                <div className="row"><span>Intensity</span><span className="value">{trail.toFixed(2)}</span></div>
                <input type="range" min={0} max={1} step={0.01}
                       value={trail}
                       onChange={e=>setTrail((e.currentTarget as HTMLInputElement).valueAsNumber)} />
              </div>
              <div className="field">
                <div className="row"><span>Length</span><span className="value">{length.toFixed(2)}</span></div>
                <input type="range" min={0} max={1} step={0.01}
                       value={length}
                       onChange={e=>setLength((e.currentTarget as HTMLInputElement).valueAsNumber)} />
              </div>
            </div>
          )}
          {activeTab==='Background' && (
            <div className="sliders" role="tabpanel" aria-label="Background">
              <div className="field">
                <div className="row"><span>Atmosphere</span><span className="value">{atmosphere.toFixed(2)}</span></div>
                <input type="range" min={0.75} max={0.95} step={0.01}
                       value={atmosphere}
                       onChange={e=>setAtmosphere((e.currentTarget as HTMLInputElement).valueAsNumber)} />
              </div>
              <div className="field">
                <div className="row"><span>Grain</span><span className="value">{grain.toFixed(2)}</span></div>
                <input type="range" min={0} max={0.35} step={0.01}
                       value={grain}
                       onChange={e=>setGrain((e.currentTarget as HTMLInputElement).valueAsNumber)} />
              </div>
            </div>
          )}
          {activeTab==='Skins' && (
            <div className="sliders" role="tabpanel" aria-label="Skins">
              <div className="field">
                <input
                  className="skin-input"
                  placeholder="Skin name"
                  value={skinName}
                  onChange={(e) => setSkinName(e.target.value)}
                />
              </div>
              <div className="field">
                <button
                  className="btn primary"
                  type="button"
                  onClick={exportJSON}
                >
                  Export JSON
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    );
}

