/*
  - Wrap page with .lab-page grid
  - Keep canvas in .lab-preview with <canvas className="lab-canvas" />
  - Dock controls at bottom: .lab-dock with .lab-panel (active controls) + .lab-tabs (tab buttons)
  - IMPORTANT: do not re-init GL on slider changes; uniforms from controlsRef drive shader.
*/
import React, { useEffect, useRef, useState } from "react";
import "./LabLayout.css";

type TabKey = "emblem" | "companion" | "trail" | "background" | "skins";

export default function LabTool() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controlsRef = useRef({
    hue: 0.33, gloss: 0.5, rough: 0.4, rim: 0.5,
    companion: 0.5, trail: 0.5, bg: 0.3
  });
  const [tab, setTab] = useState<TabKey>("emblem");

  // ---- GL init once -------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current!;
    // initGL is your existing helper – create program with emblem.vert/frag
    // It must return { gl, program, setUniform(name, value), dispose() }
    const glHandle = (window as any).__initLabGL?.(canvas, {
      vertexUrl: "/shaders/lab/emblem.vert",
      fragmentUrl: "/shaders/lab/emblem.frag"
    });

    let raf = 0;
    const loop = (t: number) => {
      const u = controlsRef.current;
      glHandle?.setUniform?.("uHue", u.hue);
      glHandle?.setUniform?.("uGloss", u.gloss);
      glHandle?.setUniform?.("uRough", u.rough);
      glHandle?.setUniform?.("uRim", u.rim);
      glHandle?.setUniform?.("uCompanion", u.companion);
      glHandle?.setUniform?.("uTrail", u.trail);
      glHandle?.setUniform?.("uBackground", u.bg);
      glHandle?.setUniform?.("uTime", t * 0.001);
      glHandle?.render?.();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        glHandle?.resize?.(w, h, dpr);
      }
    };
    onResize();
    const ro = new ResizeObserver(onResize); ro.observe(canvas);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); glHandle?.dispose?.(); };
  }, []);

  // helper to bind sliders
  const bind = <K extends keyof typeof controlsRef.current>(key: K) => ({
    value: controlsRef.current[key] as number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      (controlsRef.current as any)[key] = (e.target as HTMLInputElement).valueAsNumber;
    }
  });

  return (
    <div className="lab-page">
      <div className="lab-header">{/* (keep your Home/Lab buttons) */}</div>

      <div className="lab-preview">
        <canvas ref={canvasRef} className="lab-canvas" />
      </div>

      <div className="lab-dock">
        <div className="lab-panel" role="region" aria-label="Active Controls">
          {tab === "emblem" && (
            <>
              <h3>Emblem Controls</h3>
              <div className="lab-row">
                <label>Hue</label>
                <input className="lab-range" type="range" min={0} max={1} step={0.01} {...bind("hue")} />
              </div>
              <div className="lab-row">
                <label>Gloss</label>
                <input className="lab-range" type="range" min={0} max={1} step={0.01} {...bind("gloss")} />
              </div>
              <div className="lab-row">
                <label>Roughness</label>
                <input className="lab-range" type="range" min={0} max={1} step={0.01} {...bind("rough")} />
              </div>
              <div className="lab-row">
                <label>Rim Strength</label>
                <input className="lab-range" type="range" min={0} max={1} step={0.01} {...bind("rim")} />
              </div>
            </>
          )}

          {tab === "companion" && (
            <>
              <h3>Companion</h3>
              <input className="lab-range" type="range" min={0} max={1} step={0.01} {...bind("companion")} />
            </>
          )}

          {tab === "trail" && (
            <>
              <h3>Trail</h3>
              <input className="lab-range" type="range" min={0} max={1} step={0.01} {...bind("trail")} />
            </>
          )}

          {tab === "background" && (
            <>
              <h3>Background</h3>
              <input className="lab-range" type="range" min={0} max={1} step={0.01} {...bind("bg")} />
            </>
          )}

          {tab === "skins" && (
            <>
              <h3>Skins</h3>
              {/* keep your export UI */}
            </>
          )}
        </div>

        <div className="lab-tabs" role="tablist" aria-label="Lab tabs">
          {(["emblem","companion","trail","background","skins"] as TabKey[]).map(k => (
            <button key={k} className={`lab-tab ${tab===k?"is-active":""}`} onClick={()=>setTab(k)}>
              {k[0].toUpperCase()+k.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
