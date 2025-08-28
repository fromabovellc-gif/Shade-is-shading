import React, { useState, useEffect, useRef } from 'react';
import Tabs, { TabKey } from './Tabs';
import { createLabEngine, Uniforms } from '../webgl/labEngine';
import '../index.css';

const ls = (k: string, fallback: number) => Number(localStorage.getItem(k) ?? fallback);

type Theme = 'planet' | 'neon' | 'minimal';
const THEME_COLORS: Record<Theme, { A: [number, number, number]; B: [number, number, number] }> = {
  planet: { A: [0.2, 0.6, 1.0], B: [0.0, 0.0, 0.0] },
  neon: { A: [1.0, 0.3, 0.7], B: [0.0, 0.0, 0.0] },
  minimal: { A: [1.0, 1.0, 1.0], B: [0.0, 0.0, 0.0] },
};

export default function LabTool() {
  const [master, setMaster] = useState(ls('lab:master', 0.6));
  const [emblem, setEmblem] = useState(ls('lab:emblem', 0.7));
  const [companion, setCompanion] = useState(ls('lab:companion', 0.5));
  const [trail, setTrail] = useState(ls('lab:trail', 0.6));
  const [background, setBackground] = useState(ls('lab:background', 0.4));
  const [theme, setTheme] = useState<Theme>((localStorage.getItem('lab:theme') as Theme) || 'planet');
  const [optionsOpen, setOptionsOpen] = useState(localStorage.getItem('lab:optionsOpen') === 'true');
  const uniformsRef = useRef<Uniforms>({
    master,
    emblem,
    companion,
    trail,
    background,
    themeA: THEME_COLORS[theme].A,
    themeB: THEME_COLORS[theme].B,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => { const t=setTimeout(()=>localStorage.setItem('lab:master', String(master)),150); return()=>clearTimeout(t); }, [master]);
  useEffect(() => { const t=setTimeout(()=>localStorage.setItem('lab:emblem', String(emblem)),150); return()=>clearTimeout(t); }, [emblem]);
  useEffect(() => { const t=setTimeout(()=>localStorage.setItem('lab:companion', String(companion)),150); return()=>clearTimeout(t); }, [companion]);
  useEffect(() => { const t=setTimeout(()=>localStorage.setItem('lab:trail', String(trail)),150); return()=>clearTimeout(t); }, [trail]);
  useEffect(() => { const t=setTimeout(()=>localStorage.setItem('lab:background', String(background)),150); return()=>clearTimeout(t); }, [background]);
  useEffect(() => { const t=setTimeout(()=>localStorage.setItem('lab:theme', theme),150); return()=>clearTimeout(t); }, [theme]);
  useEffect(() => { localStorage.setItem('lab:optionsOpen', String(optionsOpen)); }, [optionsOpen]);

  useEffect(() => {
    uniformsRef.current.master = master;
    uniformsRef.current.emblem = emblem;
    uniformsRef.current.companion = companion;
    uniformsRef.current.trail = trail;
    uniformsRef.current.background = background;
    const { A, B } = THEME_COLORS[theme];
    uniformsRef.current.themeA = A;
    uniformsRef.current.themeB = B;
  }, [master, emblem, companion, trail, background, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = createLabEngine(canvas, uniformsRef);
    return () => engine.dispose();
  }, []);

  const [active, setActive] = useState<TabKey>('emblem');
  const num = (e: React.ChangeEvent<HTMLInputElement>) => e.currentTarget.valueAsNumber;

  const reset = () => {
    ['lab:master','lab:emblem','lab:companion','lab:trail','lab:background','lab:theme'].forEach(k=>localStorage.removeItem(k));
    setMaster(0.6); setEmblem(0.7); setCompanion(0.5); setTrail(0.6); setBackground(0.4); setTheme('planet');
  };

  const eff = {
    master,
    emblem: master * emblem,
    companion: master * companion,
    trail: master * trail,
    background: master * background,
  };

  const slider = (label: string, value: number, setter: (n:number)=>void, effVal: number, help?: string) => (
    <div className="lab-row">
      <label>{label}: {value.toFixed(2)}</label>
      <input type="range" min={0} max={1} step={0.01} value={value} onChange={e=>setter(num(e))} />
      <small>Effective: {effVal.toFixed(2)}</small>
      {help && <small>{help}</small>}
    </div>
  );

  return (
    <div className="lab-page">
      <div className="lab-layout">
        <section className="lab-preview">
          <h2 className="lab-title">Shader Lab</h2>
          <canvas id="labCanvas" ref={canvasRef} className="shader-canvas" />
        </section>
        <div className="lab-card">
          <Tabs active={active} onChange={setActive} />
          {active === 'emblem' && slider('Emblem', emblem, setEmblem, eff.emblem)}
          {active === 'companion' && slider('Companion', companion, setCompanion, eff.companion)}
          {active === 'trail' && slider('Trail', trail, setTrail, eff.trail)}
          {active === 'background' && slider('Background', background, setBackground, eff.background)}
          <div className="lab-footer"><button className="lab-reset" onClick={reset}>Reset All</button></div>
          <div className="lab-options">
            <button className="lab-options-toggle" onClick={() => setOptionsOpen(o=>!o)}>⚙️ Lab Options</button>
            {optionsOpen && (
              <div className="lab-options-body">
                <div className="lab-row">
                  <label>Lab Themes</label>
                  <div className="lab-themes lab-tabs">
                    {(['planet','neon','minimal'] as Theme[]).map(t => (
                      <button
                        key={t}
                        className={`lab-tab ${theme===t ? 'is-active' : ''}`}
                        onClick={() => setTheme(t)}
                        type="button"
                      >
                        {t[0].toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                {slider('Master (global influence)', master, setMaster, eff.master, 'Scales all other sliders.')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
