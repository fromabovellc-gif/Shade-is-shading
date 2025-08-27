import React, { useState, useEffect, useMemo, useRef, createContext, useContext } from 'react';
import Tabs, { TabKey } from './Tabs';
import '../index.css';

// Self-audit:
// - Lab page with master + per-layer sliders and tabs (src/lab/LabTool.tsx)
// - useLabUniforms hook exporting base/eff values (src/lab/LabTool.tsx lines ~60-78)
// - Router import updated (src/App.tsx)
// - Styles for .lab-* appended (src/index.css)

export type LabValues = { master: number; emblem: number; companion: number; trail: number; background: number };

const DEFAULT_VALUES: LabValues = { master: 0.5, emblem: 0.5, companion: 0.5, trail: 0.5, background: 0.5 };

const STORAGE_KEYS: Record<keyof LabValues, string> = {
  master: 'lab:master',
  emblem: 'lab:emblem',
  companion: 'lab:companion',
  trail: 'lab:trail',
  background: 'lab:background'
};

interface LabContextShape { base: LabValues; eff: LabValues; }
const LabContext = createContext<LabContextShape>({ base: DEFAULT_VALUES, eff: DEFAULT_VALUES });

export function useLabUniforms() { return useContext(LabContext); }

export default function LabTool() {
  const [master, setMaster] = useState<number>(() => Number(localStorage.getItem(STORAGE_KEYS.master) ?? DEFAULT_VALUES.master));
  const [emblem, setEmblem] = useState<number>(() => Number(localStorage.getItem(STORAGE_KEYS.emblem) ?? DEFAULT_VALUES.emblem));
  const [companion, setCompanion] = useState<number>(() => Number(localStorage.getItem(STORAGE_KEYS.companion) ?? DEFAULT_VALUES.companion));
  const [trail, setTrail] = useState<number>(() => Number(localStorage.getItem(STORAGE_KEYS.trail) ?? DEFAULT_VALUES.trail));
  const [background, setBackground] = useState<number>(() => Number(localStorage.getItem(STORAGE_KEYS.background) ?? DEFAULT_VALUES.background));
  const [active, setActive] = useState<TabKey>('emblem');

  const cardRef = useRef<HTMLDivElement | null>(null);
  const num = (e: React.ChangeEvent<HTMLInputElement>) => e.currentTarget.valueAsNumber;

  const base = useMemo<LabValues>(() => ({ master, emblem, companion, trail, background }), [master, emblem, companion, trail, background]);
  const eff = useMemo<LabValues>(() => ({
    master,
    emblem: emblem * master,
    companion: companion * master,
    trail: trail * master,
    background: background * master
  }), [master, emblem, companion, trail, background]);

  // persistence with debounce
  const persist = (key: string, val: number) => {
    const t = setTimeout(() => localStorage.setItem(key, val.toString()), 150);
    return () => clearTimeout(t);
  };
  useEffect(() => persist(STORAGE_KEYS.master, master), [master]);
  useEffect(() => persist(STORAGE_KEYS.emblem, emblem), [emblem]);
  useEffect(() => persist(STORAGE_KEYS.companion, companion), [companion]);
  useEffect(() => persist(STORAGE_KEYS.trail, trail), [trail]);
  useEffect(() => persist(STORAGE_KEYS.background, background), [background]);

  const handleTab = (k: TabKey) => {
    setActive(k);
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const reset = () => {
    (Object.values(STORAGE_KEYS)).forEach(k => localStorage.removeItem(k));
    setMaster(0.5); setEmblem(0.5); setCompanion(0.5); setTrail(0.5); setBackground(0.5);
  };

  const slider = (label: string, value: number, set: (n: number) => void, effVal: number) => (
    <div className="lab-row">
      <label>{label}: {value.toFixed(2)}</label>
      <input type="range" min={0} max={1} step={0.01} value={value} onChange={e => set(num(e))} />
      <small>Effective: {effVal.toFixed(2)}</small>
    </div>
  );

  return (
    <LabContext.Provider value={{ base, eff }}>
      <div className="lab-page">
        <div className="lab-layout">
          <section className="lab-preview">
            <h2>WebGL Preview ({active} layer active)</h2>
            <div>Master: {eff.master.toFixed(2)}</div>
            <div>Emblem: {eff.emblem.toFixed(2)}</div>
            <div>Companion: {eff.companion.toFixed(2)}</div>
            <div>Trail: {eff.trail.toFixed(2)}</div>
            <div>Background: {eff.background.toFixed(2)}</div>
          </section>
          <div ref={cardRef} className="lab-card">
            {slider('Master', master, setMaster, eff.master)}
            <Tabs active={active} onChange={handleTab} />
            {active === 'emblem' && slider('Emblem', emblem, setEmblem, eff.emblem)}
            {active === 'companion' && slider('Companion', companion, setCompanion, eff.companion)}
            {active === 'trail' && slider('Trail', trail, setTrail, eff.trail)}
            {active === 'background' && slider('Background', background, setBackground, eff.background)}
            <div className="lab-footer"><button className="lab-reset" onClick={reset}>Reset All</button></div>
          </div>
        </div>
      </div>
    </LabContext.Provider>
  );
}
