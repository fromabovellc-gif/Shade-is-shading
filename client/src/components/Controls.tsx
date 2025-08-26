import React, { useEffect, useMemo, useState } from "react";

const keyHue = "sv_hue";
const keySpeed = "sv_speed";
const keyIntensity = "sv_intensity";

export default function Controls() {
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
    // Simple animated color fill based on hue/speed/intensity
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

  const label = useMemo(() => (v: number) => v.toFixed(2), []);

  return (
    <div className="mt-6 space-y-4">
      <div>
        <div className="text-sm text-gray-300 mb-1">Hue: {label(hue)}</div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={hue}
          onChange={(e) => setHue(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <div className="text-sm text-gray-300 mb-1">Speed: {label(speed)}</div>
        <input
          type="range"
          min={0}
          max={2}
          step={0.01}
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <div className="text-sm text-gray-300 mb-1">Intensity: {label(intensity)}</div>
        <input
          type="range"
          min={0}
          max={2}
          step={0.01}
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
