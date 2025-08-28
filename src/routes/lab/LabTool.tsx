import { useEffect, useMemo, useRef, useState } from "react";
import { LAB_PRESETS, type LabPresetKey, type LabState } from "../../lib/presets";

export default function Lab() {
  const glRef = useRef<{ setState: (s: LabState) => void } | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);

  const initial = useMemo<LabState>(() => LAB_PRESETS.planet, []);
  const [presetKey, setPresetKey] = useState<LabPresetKey>("planet");
  const [state, setState] = useState<LabState>(initial);

  // Mount GL exactly once; expose setState to update uniforms only
  useEffect(() => {
    if (!mountRef.current || glRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    mountRef.current.appendChild(canvas);

    const glHandle = (window as any).__initLabGL?.(canvas, {
      vertexUrl: "/shaders/lab/emblem.vert",
      fragmentUrl: "/shaders/lab/emblem.frag",
    });

    glRef.current = {
      setState: (s: LabState) => {
        glHandle?.setUniform?.("uHue", s.emblem.hue);
        glHandle?.setUniform?.("uGloss", s.emblem.gloss);
        glHandle?.setUniform?.("uRoughness", s.emblem.roughness);
        glHandle?.setUniform?.("uRim", s.emblem.rim);
        glHandle?.setUniform?.("uCompanion", s.companion.amount);
        glHandle?.setUniform?.("uTrail", s.trail.amount);
        glHandle?.setUniform?.("uBgVignette", s.background.vignette);
        glHandle?.setUniform?.("uHueShift", s.background.hueShift ?? 0);
        glHandle?.setUniform?.("uMaster", s.master);
      },
    };
    glRef.current.setState(initial);

    let raf = 0;
    const loop = (t: number) => {
      glHandle?.setUniform?.("uTime", t * 0.001);
      glHandle?.render?.();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = mountRef.current!.getBoundingClientRect();
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        glHandle?.resize?.(w, h, dpr);
      }
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(mountRef.current!);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      glHandle?.dispose?.();
      glRef.current = null;
      mountRef.current?.removeChild(canvas);
    };
  }, [initial]);

  // push changes to uniforms (no recompile)
  useEffect(() => {
    glRef.current?.setState(state);
  }, [state]);

  const applyPreset = (k: LabPresetKey) => {
    setPresetKey(k);
    setState(LAB_PRESETS[k]);
  };

  const saveSkin = (name: string) => {
    const key = "lab:skins";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.unshift({ name, presetKey, state, savedAt: Date.now() });
    localStorage.setItem(key, JSON.stringify(list));
  };

  return (
    <div className="lab-page">
      <section className="preview-card">
        <div className="preview-inner">
          <div className="canvas-mount" ref={mountRef} />
        </div>
      </section>

      <section className="glass-panel">
        <header className="panel-head">
          <div className="chips">
            <button
              className={`chip ${presetKey === "planet" ? "is-active" : ""}`}
              onClick={() => applyPreset("planet")}
            >
              Planet
            </button>
            <button
              className={`chip ${presetKey === "neon" ? "is-active" : ""}`}
              onClick={() => applyPreset("neon")}
            >
              Neon
            </button>
            <button
              className={`chip ${presetKey === "minimal" ? "is-active" : ""}`}
              onClick={() => applyPreset("minimal")}
            >
              Minimal
            </button>
          </div>
        </header>

        <div className="control">
          <label>Master: {state.master.toFixed(2)}</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={state.master}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                master: (e.currentTarget as HTMLInputElement).valueAsNumber,
              }))
            }
          />
        </div>

        <div className="grid two">
          <div className="control">
            <label>Hue: {(state.emblem.hue * 360) | 0}°</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={state.emblem.hue}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  emblem: {
                    ...s.emblem,
                    hue: (e.currentTarget as HTMLInputElement).valueAsNumber,
                  },
                }))
              }
            />
          </div>
          <div className="control">
            <label>Gloss: {state.emblem.gloss.toFixed(2)}</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={state.emblem.gloss}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  emblem: {
                    ...s.emblem,
                    gloss: (e.currentTarget as HTMLInputElement).valueAsNumber,
                  },
                }))
              }
            />
          </div>
          <div className="control">
            <label>Roughness: {state.emblem.roughness.toFixed(2)}</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={state.emblem.roughness}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  emblem: {
                    ...s.emblem,
                    roughness: (e.currentTarget as HTMLInputElement).valueAsNumber,
                  },
                }))
              }
            />
          </div>
          <div className="control">
            <label>Rim: {state.emblem.rim.toFixed(2)}</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={state.emblem.rim}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  emblem: {
                    ...s.emblem,
                    rim: (e.currentTarget as HTMLInputElement).valueAsNumber,
                  },
                }))
              }
            />
          </div>
        </div>

        <footer className="panel-foot">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const i = e.currentTarget.elements.namedItem("skinName") as HTMLInputElement;
              if (i.value.trim()) {
                saveSkin(i.value.trim());
                i.value = "";
              }
            }}
          >
            <input name="skinName" placeholder="Skin name…" />
            <button type="submit">Save Skin</button>
            <button
              type="button"
              onClick={() => {
                const json = JSON.stringify({ presetKey, state }, null, 2);
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `skin-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export JSON
            </button>
          </form>
        </footer>
      </section>
    </div>
  );
}
