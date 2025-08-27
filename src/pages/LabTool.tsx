import React from 'react';
import AmbientBackground from '../components/AmbientBackground';
import '../index.css';

type TabKey = 'emblem'|'companion'|'trail'|'background';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'emblem',    label: 'Emblem' },
  { key: 'companion', label: 'Companion' },
  { key: 'trail',     label: 'Trail' },
  { key: 'background',label: 'Background' },
];

const DEFAULT = 0.5;

export default function LabTool(){
  const controlsRef = React.useRef({ emblem:DEFAULT, companion:DEFAULT, trail:DEFAULT, background:DEFAULT });
  const [active,setActive] = React.useState<TabKey>('emblem');

  const [emblem,setEmblem] = React.useState<number>(()=>Number(localStorage.getItem('lab:emblem') ?? DEFAULT));
  const [companion,setCompanion] = React.useState<number>(()=>Number(localStorage.getItem('lab:companion') ?? DEFAULT));
  const [trail,setTrail] = React.useState<number>(()=>Number(localStorage.getItem('lab:trail') ?? DEFAULT));
  const [background,setBackground] = React.useState<number>(()=>Number(localStorage.getItem('lab:background') ?? DEFAULT));
  const [master,setMaster] = React.useState<number>(()=>Number(localStorage.getItem('lab:master') ?? DEFAULT));

  // sync master when tab changes or value changes
  React.useEffect(()=>{
    const val = active==='emblem'?emblem:active==='companion'?companion:active==='trail'?trail:background;
    setMaster(val);
  },[active, emblem, companion, trail, background]);

  // persistence
  React.useEffect(()=>{const t=setTimeout(()=>localStorage.setItem('lab:emblem',String(emblem)),150);return()=>clearTimeout(t);},[emblem]);
  React.useEffect(()=>{const t=setTimeout(()=>localStorage.setItem('lab:companion',String(companion)),150);return()=>clearTimeout(t);},[companion]);
  React.useEffect(()=>{const t=setTimeout(()=>localStorage.setItem('lab:trail',String(trail)),150);return()=>clearTimeout(t);},[trail]);
  React.useEffect(()=>{const t=setTimeout(()=>localStorage.setItem('lab:background',String(background)),150);return()=>clearTimeout(t);},[background]);
  React.useEffect(()=>{const t=setTimeout(()=>localStorage.setItem('lab:master',String(master)),150);return()=>clearTimeout(t);},[master]);

  // sync to ref
  React.useEffect(()=>{controlsRef.current={emblem,companion,trail,background};},[emblem,companion,trail,background]);

  const num = (e: React.ChangeEvent<HTMLInputElement>) => (e.currentTarget as HTMLInputElement).valueAsNumber;

  const updateValue = (key:TabKey,val:number)=>{
    if(key==='emblem') setEmblem(val);
    else if(key==='companion') setCompanion(val);
    else if(key==='trail') setTrail(val);
    else setBackground(val);
    if(active===key) setMaster(val);
  };

  const onMaster = (val:number)=>{
    setMaster(val);
    updateValue(active,val);
  };

  const resetAll = ()=>{
    ['lab:emblem','lab:companion','lab:trail','lab:background','lab:master'].forEach(k=>localStorage.removeItem(k));
    setEmblem(DEFAULT); setCompanion(DEFAULT); setTrail(DEFAULT); setBackground(DEFAULT); setMaster(DEFAULT);
  };

  return (
    <div className="page lab-page">
      <AmbientBackground />
      <div className="layout">
        <div className="left">
          <div id="previewSticky" className="preview-sticky">
            <div className="floating-title-wrap"><h1 className="floating-title">Lab Tool</h1></div>
            <section className="stage"><canvas id="gl-canvas" style={{width:'100%',height:'100%'}} /></section>
          </div>
        </div>
        <div className="right">
          <div className="group">
            <div className="row">
              <div className="label">Master: {master.toFixed(2)}</div>
              <input type="range" min={0} max={1} step={0.01} value={master} onChange={e=>onMaster(num(e))} />
            </div>
          </div>
          <div className="tabs" role="tablist" aria-label="Lab sections">
            {TABS.map(t=>(
              <button key={t.key} role="tab" aria-selected={active===t.key} aria-controls={`pane-${t.key}`} className="tab-btn" onClick={()=>setActive(t.key)} type="button">{t.label}</button>
            ))}
          </div>
          <div className="tab-content">
            <div id="pane-emblem" className={`tab-pane ${active==='emblem'?'active':''}`} role="tabpanel">
              <div className="group">
                <div className="row">
                  <div className="label">Emblem: {emblem.toFixed(2)}</div>
                  <input type="range" min={0} max={1} step={0.01} value={emblem} onChange={e=>updateValue('emblem',num(e))} />
                </div>
              </div>
            </div>
            <div id="pane-companion" className={`tab-pane ${active==='companion'?'active':''}`} role="tabpanel">
              <div className="group">
                <div className="row">
                  <div className="label">Companion: {companion.toFixed(2)}</div>
                  <input type="range" min={0} max={1} step={0.01} value={companion} onChange={e=>updateValue('companion',num(e))} />
                </div>
              </div>
            </div>
            <div id="pane-trail" className={`tab-pane ${active==='trail'?'active':''}`} role="tabpanel">
              <div className="group">
                <div className="row">
                  <div className="label">Trail: {trail.toFixed(2)}</div>
                  <input type="range" min={0} max={1} step={0.01} value={trail} onChange={e=>updateValue('trail',num(e))} />
                </div>
              </div>
            </div>
            <div id="pane-background" className={`tab-pane ${active==='background'?'active':''}`} role="tabpanel">
              <div className="group">
                <div className="row">
                  <div className="label">Background: {background.toFixed(2)}</div>
                  <input type="range" min={0} max={1} step={0.01} value={background} onChange={e=>updateValue('background',num(e))} />
                </div>
              </div>
            </div>
          </div>
          <div className="row"><button className="tab-btn" onClick={resetAll}>Reset All</button></div>
        </div>
      </div>
    </div>
  );
}

