import React, { useState, useEffect, useRef } from 'react';
import Tabs, { TabKey } from './Tabs';
import { createLabEngine, Uniforms } from '../webgl/labEngine';
import '../index.css';

const ls = (k: string, fallback: number) => Number(localStorage.getItem(k) ?? fallback);

export default function LabTool() {
  const [master, setMaster] = useState(ls('lab:master', 0.6));
  const [emblem, setEmblem] = useState(ls('lab:emblem', 0.7));
  const [companion, setCompanion] = useState(ls('lab:companion', 0.5));
  const [trail, setTrail] = useState(ls('lab:trail', 0.6));
  const [background, setBackground] = useState(ls('lab:background', 0.4));
  const uniformsRef = useRef<Uniforms>({
    master,
    emblem,
    companion,
    trail,
    background,
    themeA: [0.2, 0.6, 1.0],
    themeB: [0.0, 0.0, 0.0],
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => { const t=setTimeout(()=>localStorage.setItem('lab:master', String(master)),150); return()=>clearTimeout(t); }, [master]);
  useEffect(() => { const t=setTimeout(()=>localStorage.setItem('lab:emblem', String(emblem)),150); return()=>clearTimeout(t); }, [emblem]);
  useEffect(() => { const t=setTimeout(()=>localStorage.setItem('lab:companion', String(companion)),150); return()=>clearTimeout(t); }, [companion]);
  useEffect(() => { const t=setTimeout(()=>localStorage.setItem('lab:trail', String(trail)),150); return()=>clearTimeout(t); }, [trail]);
  useEffect(() => { const t=setTimeout(()=>localStorage.setItem('lab:background', String(background)),150); return()=>clearTimeout(t); }, [background]);

  useEffect(() => {
    uniformsRef.current.master = master;
    uniformsRef.current.emblem = emblem;
    uniformsRef.current.companion = companion;
    uniformsRef.current.trail = trail;
    uniformsRef.current.background = background;
  }, [master, emblem, companion, trail, background]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = createLabEngine(canvas, uniformsRef);
    return () => engine.dispose();
  }, []);

  const [active, setActive] = useState<TabKey>('emblem');
  const num = (e: React.ChangeEvent<HTMLInputElement>) => e.currentTarget.valueAsNumber;

  const reset = () => {
    ['lab:master','lab:emblem','lab:companion','lab:trail','lab:background'].forEach(k=>localStorage.removeItem(k));
    setMaster(0.6); setEmblem(0.7); setCompanion(0.5); setTrail(0.6); setBackground(0.4);
  };

  const eff = {
    master,
    emblem: master * emblem,
    companion: master * companion,
    trail: master * trail,
    background: master * background,
  };

  const slider = (label: string, value: number, setter: (n:number)=>void, effVal: number) => (
    <div className="lab-row">
      <label>{label}: {value.toFixed(2)}</label>
      <input type="range" min={0} max={1} step={0.01} value={value} onChange={e=>setter(num(e))} />
      <small>Effective: {effVal.toFixed(2)}</small>
    </div>
  );

  return (
    <div className="lab-page">
      <div className="lab-layout">
        <section className="lab-preview">
          <canvas ref={canvasRef} className="shader-canvas" style={{ width: '100%', height: '260px' }} />
          <div className="lab-values">
            <strong>Effective Values</strong>
            <div>Master: {eff.master.toFixed(2)}</div>
            <div>Emblem: {eff.emblem.toFixed(2)}</div>
            <div>Companion: {eff.companion.toFixed(2)}</div>
            <div>Trail: {eff.trail.toFixed(2)}</div>
            <div>Background: {eff.background.toFixed(2)}</div>
          </div>
        </section>
        <div className="lab-card">
          {slider('Master', master, setMaster, eff.master)}
          <Tabs active={active} onChange={setActive} />
          {active === 'emblem' && slider('Emblem', emblem, setEmblem, eff.emblem)}
          {active === 'companion' && slider('Companion', companion, setCompanion, eff.companion)}
          {active === 'trail' && slider('Trail', trail, setTrail, eff.trail)}
          {active === 'background' && slider('Background', background, setBackground, eff.background)}
          <div className="lab-footer"><button className="lab-reset" onClick={reset}>Reset All</button></div>
        </div>
      </div>
    </div>
  );
}
