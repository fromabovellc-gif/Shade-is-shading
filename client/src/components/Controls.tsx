import React, { useEffect, useMemo, useState } from "react";

const keyHue = "sv_hue";
const keySpeed = "sv_speed";
const keyIntensity = "sv_intensity";

export default function Controls() {
  console.log("[Controls] mounted");
  const [hue, setHue] = useState<number>(() => parseFloat(localStorage.getItem(keyHue) || "0.5"));
  const [speed, setSpeed] = useState<number>(() => parseFloat(localStorage.getItem(keySpeed) || "1.0"));
  const [intensity, setIntensity] = useState<number>(() => parseFloat(localStorage.getItem(keyIntensity) || "1.0"));

  useEffect(() => localStorage.setItem(keyHue, String(hue)), [hue]);
  useEffect(() => localStorage.setItem(keySpeed, String(speed)), [speed]);
  useEffect(() => localStorage.setItem(keyIntensity, String(intensity)), [intensity]);

  useEffect(() => {
    const c = document.getElementById("shader-canvas") as HTMLCanvasElement | null;
    if (!c) return;
    const gl = c.getContext("webgl");
    if (!gl) return;
    let raf = 0;
    function draw(t: number) {
      const phase = (t * 0.001 * speed) % 1;
      const h = (hue + phase) % 1;
      const r = Math.abs(Math.sin(h * Math.PI * 2)) * intensity;
      const g = Math.abs(Math.sin((h + 0.33) * Math.PI * 2)) * intensity;
      const b = Math.abs(Math.sin((h + 0.66) * Math.PI * 2)) * intensity;
      gl.clearColor(r, g, b, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [hue, speed, intensity]);

  const fmt = useMemo(() => (v: number) => v.toFixed(2), []);

  return (
    <div
      id="controls-panel"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483646,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(6px)",
        borderTop: "1px solid rgba(255,255,255,0.15)",
        padding: "12px 16px"
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 14, color: "#aab", marginBottom: 6 }}>Hue: {fmt(hue)}</div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={hue}
          onChange={(e) => setHue(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />

        <div style={{ height: 10 }} />

        <div style={{ fontSize: 14, color: "#aab", marginBottom: 6 }}>Speed: {fmt(speed)}</div>
        <input
          type="range"
          min={0}
          max={2}
          step={0.01}
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />

        <div style={{ height: 10 }} />

        <div style={{ fontSize: 14, color: "#aab", marginBottom: 6 }}>Intensity: {fmt(intensity)}</div>
        <input
          type="range"
          min={0}
          max={2}
          step={0.01}
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}

