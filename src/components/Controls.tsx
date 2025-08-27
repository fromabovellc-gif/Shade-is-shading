import React from 'react';

type TabKey = 'templates'|'colors'|'motion'|'effects';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'templates', label: 'Templates' },
  { key: 'colors',    label: 'Colors' },
  { key: 'motion',    label: 'Motion' },
  { key: 'effects',   label: 'Effects' },
];

export default function Controls(props: {
  controlsRef?: React.MutableRefObject<{hue:number;speed:number;intensity:number}>;
}) {
  // Reuse existing init & debounce scheme:
  const [hue, setHue] = React.useState<number>(() => Number(localStorage.getItem('shader:hue') ?? 0.60));
  const [speed, setSpeed] = React.useState<number>(() => Number(localStorage.getItem('shader:speed') ?? 1.00));
  const [intensity, setIntensity] = React.useState<number>(() => Number(localStorage.getItem('shader:intensity') ?? 0.80));

  // Debounced persistence (preserve your existing helper if you already have one)
  React.useEffect(() => { const t=setTimeout(()=>localStorage.setItem('shader:hue', String(hue)),150); return ()=>clearTimeout(t); }, [hue]);
  React.useEffect(() => { const t=setTimeout(()=>localStorage.setItem('shader:speed', String(speed)),150); return ()=>clearTimeout(t); }, [speed]);
  React.useEffect(() => { const t=setTimeout(()=>localStorage.setItem('shader:intensity', String(intensity)),150); return ()=>clearTimeout(t); }, [intensity]);

  // Sync to ref for RAF loop (no GL re-init)
  React.useEffect(() => {
    if (props.controlsRef) props.controlsRef.current = {hue,speed,intensity};
  }, [hue,speed,intensity,props.controlsRef]);

  const resetAll = () => {
    localStorage.removeItem('shader:hue');
    localStorage.removeItem('shader:speed');
    localStorage.removeItem('shader:intensity');
    setHue(0.60); setSpeed(1.00); setIntensity(0.80);
  };

  const [active, setActive] = React.useState<TabKey>('templates');
  const num = (e: React.ChangeEvent<HTMLInputElement>) => (e.currentTarget as HTMLInputElement).valueAsNumber;

  return (
    <>
      {/* Header (subtitle removed per request) */}
      <div className="tabs" role="tablist" aria-label="Shader sections">
        {TABS.map(t=>(
          <button
            key={t.key}
            role="tab"
            aria-selected={active===t.key}
            aria-controls={`pane-${t.key}`}
            className="tab-btn"
            onClick={()=>setActive(t.key)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {/* Templates */}
        <div id="pane-templates" className={`tab-pane ${active==='templates'?'active':''}`} role="tabpanel">
          <div className="group">
            <div className="row">
              <div className="label">Templates</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <button className="tab-btn" onClick={()=>{ setHue(0.58); setSpeed(1.2); setIntensity(1.2); }}>Waves</button>
                <button className="tab-btn" onClick={()=>{ setHue(0.66); setSpeed(1.6); setIntensity(1.4); }}>Ripples</button>
                <button className="tab-btn" onClick={()=>{ setHue(0.77); setSpeed(3.0); setIntensity(2.0); }}>Plasma</button>
                <button className="tab-btn" onClick={()=>{ setHue(0.85); setSpeed(0.8); setIntensity(1.6); }}>Tunnel</button>
              </div>
            </div>
            <div className="row"><button className="tab-btn" onClick={resetAll}>Reset All</button></div>
          </div>
        </div>

        {/* Colors */}
        <div id="pane-colors" className={`tab-pane ${active==='colors'?'active':''}`} role="tabpanel">
          <div className="group">
            <div className="row">
              <div className="label">Hue: {hue.toFixed(2)}</div>
              <input type="range" min={0} max={1} step={0.01} value={hue}
                     onChange={e=>setHue(num(e))}/>
            </div>
          </div>
        </div>

        {/* Motion */}
        <div id="pane-motion" className={`tab-pane ${active==='motion'?'active':''}`} role="tabpanel">
          <div className="group">
            <div className="row">
              <div className="label">Speed: {speed.toFixed(2)}×</div>
              <input type="range" min={0.1} max={3} step={0.01} value={speed}
                     onChange={e=>setSpeed(num(e))}/>
            </div>
          </div>
        </div>

        {/* Effects */}
        <div id="pane-effects" className={`tab-pane ${active==='effects'?'active':''}`} role="tabpanel">
          <div className="group">
            <div className="row">
              <div className="label">Intensity: {intensity.toFixed(2)}</div>
              <input type="range" min={0} max={2} step={0.01} value={intensity}
                     onChange={e=>setIntensity(num(e))}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
