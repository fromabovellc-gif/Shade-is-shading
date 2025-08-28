import React, { useEffect, useRef, useState } from 'react';
import { initLabGL } from './gl';
import '../index.css';

const lsNum = (k: string, d: number) => Number(localStorage.getItem(k) ?? d);

interface Skin {
  name: string;
  master: number;
  emblemHue: number;
  emblemGloss: number;
  emblemRough: number;
  rim: number;
  companion: number;
  trail: number;
  background: number;
  createdAt: number;
}

const useDebouncedLS = (key: string, value: number) => {
  useEffect(() => {
    const id = setTimeout(() => localStorage.setItem(key, String(value)), 150);
    return () => clearTimeout(id);
  }, [key, value]);
};

export default function LabTool() {
  const [master, setMaster] = useState(lsNum('lab:master', 0.8));
  const [emblemHue, setEmblemHue] = useState(lsNum('lab:emblemHue', 0.6));
  const [emblemGloss, setEmblemGloss] = useState(lsNum('lab:emblemGloss', 0.5));
  const [emblemRough, setEmblemRough] = useState(lsNum('lab:emblemRough', 0.4));
  const [rim, setRim] = useState(lsNum('lab:rim', 0.6));
  const [companion, setCompanion] = useState(lsNum('lab:companion', 0.6));
  const [trail, setTrail] = useState(lsNum('lab:trail', 0.7));
  const [background, setBackground] = useState(lsNum('lab:background', 0.5));
  const [skins, setSkins] = useState<Skin[]>(() => {
    try { return JSON.parse(localStorage.getItem('lab:skins') || '[]'); } catch { return []; }
  });

  useDebouncedLS('lab:master', master);
  useDebouncedLS('lab:emblemHue', emblemHue);
  useDebouncedLS('lab:emblemGloss', emblemGloss);
  useDebouncedLS('lab:emblemRough', emblemRough);
  useDebouncedLS('lab:rim', rim);
  useDebouncedLS('lab:companion', companion);
  useDebouncedLS('lab:trail', trail);
  useDebouncedLS('lab:background', background);
  useEffect(() => { const id = setTimeout(() => localStorage.setItem('lab:skins', JSON.stringify(skins)), 150); return () => clearTimeout(id); }, [skins]);

  const valuesRef = useRef({ master, emblemHue, emblemGloss, emblemRough, rim, companion, trail, background });
  useEffect(() => { valuesRef.current = { master, emblemHue, emblemGloss, emblemRough, rim, companion, trail, background }; }, [master, emblemHue, emblemGloss, emblemRough, rim, companion, trail, background]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    document.body.classList.add('lab-lock');
    return () => document.body.classList.remove('lab-lock');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = initLabGL(canvas);
    const handle = () => gl.resize();
    window.addEventListener('resize', handle);
    let raf = 0;
    const start = performance.now();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const t = (performance.now() - start) / 1000;
      const v = valuesRef.current;
      const u = gl.uniforms;
      const g = gl.gl;
      g.uniform1f(u.uMaster, v.master);
      g.uniform1f(u.uEmblemHue, v.emblemHue);
      g.uniform1f(u.uEmblemGloss, v.emblemGloss * v.master);
      g.uniform1f(u.uEmblemRough, v.emblemRough);
      g.uniform1f(u.uRimStrength, v.rim);
      g.uniform1f(u.uCompanion, v.companion * v.master);
      g.uniform1f(u.uTrail, v.trail * v.master);
      g.uniform1f(u.uBackground, v.background * v.master);
      gl.render(t);
    };
    frame();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', handle); };
  }, []);

  const num = (e: React.ChangeEvent<HTMLInputElement>) => e.currentTarget.valueAsNumber;

  const saveSkin = () => {
    const name = window.prompt('Skin name?') || `Skin ${skins.length + 1}`;
    const preset: Skin = { name, master, emblemHue, emblemGloss, emblemRough, rim, companion, trail, background, createdAt: Date.now() };
    setSkins(s => [...s, preset]);
  };
  const loadSkin = (s: Skin) => {
    setMaster(s.master); setEmblemHue(s.emblemHue); setEmblemGloss(s.emblemGloss); setEmblemRough(s.emblemRough); setRim(s.rim); setCompanion(s.companion); setTrail(s.trail); setBackground(s.background);
  };
  const deleteSkin = (i: number) => setSkins(s => s.filter((_,idx)=>idx!==i));
  const exportSkin = (s?: Skin) => {
    const data = s || { master, emblemHue, emblemGloss, emblemRough, rim, companion, trail, background };
    navigator.clipboard.writeText(JSON.stringify(data));
  };

  const slider = (label: string, value: number, setter: (n:number)=>void, min=0, max=1, step=0.01) => (
    <div className="row">
      <label>{label}: {value.toFixed(2)}</label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>setter(num(e))} />
    </div>
  );

  const [activeDock, setActiveDock] = useState<string>('');
  const [mobile, setMobile] = useState(() => window.innerWidth < 980);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 980);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const dockTabs = [
    { key: 'emblem', label: 'Emblem' },
    { key: 'companion', label: 'Companion' },
    { key: 'trail', label: 'Trail' },
    { key: 'background', label: 'Background' },
    { key: 'skins', label: 'Skins' }
  ];

  const DockCard = () => {
    if (!activeDock) return null;
    return (
      <div className="dock-card">
        {activeDock === 'emblem' && <>
          {slider('Hue', emblemHue, setEmblemHue)}
          {slider('Gloss', emblemGloss, setEmblemGloss)}
          {slider('Rough', emblemRough, setEmblemRough)}
          {slider('Rim', rim, setRim, 0, 2)}
        </>}
        {activeDock === 'companion' && slider('Companion', companion, setCompanion)}
        {activeDock === 'trail' && slider('Trail', trail, setTrail)}
        {activeDock === 'background' && slider('Background', background, setBackground)}
        {activeDock === 'skins' && (
          <div className="row">
            <button onClick={saveSkin}>Save Skin</button>
            <button onClick={() => exportSkin()}>Export JSON</button>
            <ul>
              {skins.map((s,i)=>(
                <li key={s.createdAt}>
                  {s.name}
                  <button onClick={() => loadSkin(s)}>Load</button>
                  <button onClick={() => deleteSkin(i)}>Delete</button>
                  <button onClick={() => exportSkin(s)}>Copy</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const ControlsPanel = () => (
    <div className="controls-panel" style={{ overflowY:'auto', maxHeight:'calc(100vh - 24px)' }}>
      <section>
        <h3>Emblem</h3>
        {slider('Hue', emblemHue, setEmblemHue)}
        {slider('Gloss', emblemGloss, setEmblemGloss)}
        {slider('Rough', emblemRough, setEmblemRough)}
        {slider('Rim', rim, setRim, 0, 2)}
      </section>
      <section>
        <h3>Companion</h3>
        {slider('Companion', companion, setCompanion)}
      </section>
      <section>
        <h3>Trail</h3>
        {slider('Trail', trail, setTrail)}
      </section>
      <section>
        <h3>Background</h3>
        {slider('Background', background, setBackground)}
      </section>
      <section>
        <h3>Skins</h3>
        <button onClick={saveSkin}>Save Skin</button>
        <button onClick={() => exportSkin()}>Export JSON</button>
        <ul>
          {skins.map((s,i)=>(
            <li key={s.createdAt}>
              {s.name} <button onClick={()=>loadSkin(s)}>Load</button> <button onClick={()=>deleteSkin(i)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <div className="lab-page">
      {mobile ? (
        <>
          <div className="lab-canvas"><canvas ref={canvasRef} /></div>
          {activeDock && <DockCard />}
          <div className="dock">
            <div className="dock-tabs">
              {dockTabs.map(t => (
                <button key={t.key} className={`dock-btn ${activeDock===t.key?'is-active':''}`} onClick={()=>setActiveDock(t.key)}>{t.label}</button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="lab-split">
          <div className="lab-left">
            <div className="lab-canvas"><canvas ref={canvasRef} /></div>
          </div>
          <div className="lab-right">
            <ControlsPanel />
          </div>
        </div>
      )}
    </div>
  );
}
