/*
  - Wrap page with .lab-page grid
  - Keep canvas in #labLiveView with <canvas className="lab-canvas" />
  - Controls panel uses .dock with .dock-header/.dock-body and .dock-tabs
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
  const tabTitle = `${tab[0].toUpperCase() + tab.slice(1)} Controls`;

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

      <div id="labLiveView" className="lab-preview">
        <canvas ref={canvasRef} className="lab-canvas" />
      </div>

      <div className="dock" role="region" aria-label="Lab Controls">
        <div className="dock-header">
          <div className="dock-title">{tabTitle}</div>
        </div>
        <div className="dock-body">
          {tab === "emblem" && (
            <>
              <div className="dock-row">
                <label className="dock-label">Hue</label>
                <input type="range" min={0} max={1} step={0.01} {...bind("hue")} />
              </div>
              <div className="dock-row">
                <label className="dock-label">Gloss</label>
                <input type="range" min={0} max={1} step={0.01} {...bind("gloss")} />
              </div>
              <div className="dock-row">
                <label className="dock-label">Roughness</label>
                <input type="range" min={0} max={1} step={0.01} {...bind("rough")} />
              </div>
              <div className="dock-row">
                <label className="dock-label">Rim Strength</label>
                <input type="range" min={0} max={1} step={0.01} {...bind("rim")} />
              </div>
            </>
          )}

          {tab === "companion" && (
            <div className="dock-row">
              <label className="dock-label">Companion</label>
              <input type="range" min={0} max={1} step={0.01} {...bind("companion")} />
            </div>
          )}

          {tab === "trail" && (
            <div className="dock-row">
              <label className="dock-label">Trail</label>
              <input type="range" min={0} max={1} step={0.01} {...bind("trail")} />
            </div>
          )}

          {tab === "background" && (
            <div className="dock-row">
              <label className="dock-label">Background</label>
              <input type="range" min={0} max={1} step={0.01} {...bind("bg")} />
            </div>
          )}

          {tab === "skins" && (
            <div className="dock-row">
              <label className="dock-label">Skins</label>
              {/* keep your export UI */}
            </div>
          )}

          <div className="dock-tabs" role="tablist" aria-label="Lab sections">
            {(["emblem","companion","trail","background","skins"] as TabKey[]).map(k => (
              <button
                key={k}
                className="dock-tab"
                role="tab"
                aria-selected={tab===k}
                onClick={()=>setTab(k)}
              >
                {k[0].toUpperCase()+k.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
