import React, { useState, useRef, useEffect } from 'react';
import AmbientBackground from '../components/AmbientBackground';
import { createLabEngine, Uniforms } from '../webgl/labEngine';
import '../index.css';

type TabKey = 'emblem' | 'companion' | 'trail' | 'background';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'emblem', label: 'Emblem' },
  { key: 'companion', label: 'Companion' },
  { key: 'trail', label: 'Trail' },
  { key: 'background', label: 'Background' }
];

const themeMap = {
  planet: { themeA: [0.20, 0.60, 1.00] as [number, number, number], themeB: [0.02, 0.10, 0.25] as [number, number, number] },
  neon: { themeA: [0.95, 0.10, 0.95] as [number, number, number], themeB: [0.05, 0.90, 0.95] as [number, number, number] },
  mono: { themeA: [0.85, 0.85, 0.90] as [number, number, number], themeB: [0.15, 0.15, 0.18] as [number, number, number] }
};

type ThemeKey = keyof typeof themeMap;

const clamp = (v: number, min = 0, max = 1) => Math.min(Math.max(v, min), max);
const calcDerived = (val: number, master: number, min: number, max: number) => {
  const m = min + (max - min) * master;
  return clamp(val * m);
};

export default function LabTool() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [master, setMaster] = useState<number>(() => Number(localStorage.getItem('lab:master') ?? 0.5));
  const [emblem, setEmblem] = useState<number>(() => Number(localStorage.getItem('lab:emblem') ?? 0.5));
  const [companion, setCompanion] = useState<number>(() => Number(localStorage.getItem('lab:companion') ?? 0.5));
  const [trail, setTrail] = useState<number>(() => Number(localStorage.getItem('lab:trail') ?? 0.5));
  const [background, setBackground] = useState<number>(() => Number(localStorage.getItem('lab:background') ?? 0.5));
  const [theme, setTheme] = useState<ThemeKey>(() => (localStorage.getItem('lab:theme') as ThemeKey) ?? 'planet');
  const [active, setActive] = useState<TabKey>('emblem');

  const uniformsRef = useRef<Uniforms>({
    master,
    emblem: calcDerived(emblem, master, 0.6, 1.4),
    companion: calcDerived(companion, master, 0.4, 1.6),
    trail: calcDerived(trail, master, 0.2, 1.8),
    background: calcDerived(background, master, 0.7, 1.3),
    ...themeMap[theme]
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const eng = createLabEngine(canvas, uniformsRef);
    return () => eng.dispose();
  }, []);

  useEffect(() => {
    const { themeA, themeB } = themeMap[theme];
    uniformsRef.current = {
      master,
      emblem: calcDerived(emblem, master, 0.6, 1.4),
      companion: calcDerived(companion, master, 0.4, 1.6),
      trail: calcDerived(trail, master, 0.2, 1.8),
      background: calcDerived(background, master, 0.7, 1.3),
      themeA,
      themeB
    };
  }, [master, emblem, companion, trail, background, theme]);

  const persist = (key: string, val: string) => {
    const t = setTimeout(() => localStorage.setItem(key, val), 150);
    return () => clearTimeout(t);
  };
  useEffect(() => persist('lab:master', master.toString()), [master]);
  useEffect(() => persist('lab:emblem', emblem.toString()), [emblem]);
  useEffect(() => persist('lab:companion', companion.toString()), [companion]);
  useEffect(() => persist('lab:trail', trail.toString()), [trail]);
  useEffect(() => persist('lab:background', background.toString()), [background]);
  useEffect(() => persist('lab:theme', theme), [theme]);

  const num = (e: React.ChangeEvent<HTMLInputElement>) => e.currentTarget.valueAsNumber;

  const reset = () => {
    ['lab:master', 'lab:emblem', 'lab:companion', 'lab:trail', 'lab:background', 'lab:theme'].forEach(k => localStorage.removeItem(k));
    setMaster(0.5); setEmblem(0.5); setCompanion(0.5); setTrail(0.5); setBackground(0.5); setTheme('planet');
  };

  return (
    <div className="page lab-page">
      <AmbientBackground />
      <div className="layout">
        <div className="left">
          <div id="previewSticky" className="preview-sticky">
            <div className="floating-title-wrap"><h1 className="floating-title">Lab Tool</h1></div>
            <section className="stage"><canvas ref={canvasRef} style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} /></section>
          </div>
        </div>
        <div className="right">
          <div className="group">
            <div className="row">
              <div className="label">Master: {master.toFixed(2)}</div>
              <input type="range" min={0} max={1} step={0.01} value={master} onChange={e => setMaster(num(e))} />
            </div>
          </div>
          <div className="tabs" role="tablist" aria-label="Lab sections">
            {TABS.map(t => (
              <button key={t.key} role="tab" aria-selected={active === t.key} aria-controls={`pane-${t.key}`} className="tab-btn" onClick={() => setActive(t.key)} type="button">{t.label}</button>
            ))}
          </div>
          <div className="tab-content">
            <div id="pane-emblem" className={`tab-pane ${active === 'emblem' ? 'active' : ''}`} role="tabpanel">
              <div className="group">
                <div className="row">
                  <div className="label">Emblem: {emblem.toFixed(2)}</div>
                  <input type="range" min={0} max={1} step={0.01} value={emblem} onChange={e => setEmblem(num(e))} />
                </div>
              </div>
            </div>
            <div id="pane-companion" className={`tab-pane ${active === 'companion' ? 'active' : ''}`} role="tabpanel">
              <div className="group">
                <div className="row">
                  <div className="label">Companion: {companion.toFixed(2)}</div>
                  <input type="range" min={0} max={1} step={0.01} value={companion} onChange={e => setCompanion(num(e))} />
                </div>
              </div>
            </div>
            <div id="pane-trail" className={`tab-pane ${active === 'trail' ? 'active' : ''}`} role="tabpanel">
              <div className="group">
                <div className="row">
                  <div className="label">Trail: {trail.toFixed(2)}</div>
                  <input type="range" min={0} max={1} step={0.01} value={trail} onChange={e => setTrail(num(e))} />
                </div>
              </div>
            </div>
            <div id="pane-background" className={`tab-pane ${active === 'background' ? 'active' : ''}`} role="tabpanel">
              <div className="group">
                <div className="row">
                  <div className="label">Background: {background.toFixed(2)}</div>
                  <input type="range" min={0} max={1} step={0.01} value={background} onChange={e => setBackground(num(e))} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="label">Themes</div>
            <div className="tabs">
              {(['planet', 'neon', 'mono'] as ThemeKey[]).map(k => (
                <button key={k} className="tab-btn" aria-pressed={theme === k} onClick={() => setTheme(k)} type="button">{k.charAt(0).toUpperCase() + k.slice(1)}</button>
              ))}
            </div>
          </div>
          <div className="row"><button className="tab-btn" onClick={reset}>Reset All</button></div>
        </div>
      </div>
    </div>
  );
}
