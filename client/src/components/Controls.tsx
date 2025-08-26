import React, {useEffect, useState} from 'react';

//
// /client/src/components/Controls.tsx
//

type Props = {
  valueHue: number; onHue:(n:number)=>void;
  valueSpeed: number; onSpeed:(n:number)=>void;
  valueIntensity: number; onIntensity:(n:number)=>void;
  onReset: ()=>void;
};

export default function Controls(p: Props) {
  return (
    <div
      data-testid="controls"
      style={{
        position:'fixed',
        left:0, right:0, bottom:0,
        zIndex: 2147483646,
        background:'rgba(0,0,0,0.65)',
        backdropFilter:'blur(6px)',
        WebkitBackdropFilter:'blur(6px)',
        borderTop:'1px solid rgba(255,255,255,.15)',
        color:'#fff',
        padding:'10px 12px',
        fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
      }}
    >
      <div style={{display:'grid', gap:10}}>
        <details open>
          <summary>Colors</summary>
          <label>Hue: {p.valueHue.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01"
                 value={p.valueHue}
                 onChange={e=>p.onHue(parseFloat(e.target.value))} />
        </details>

        <details open>
          <summary>Motion</summary>
          <label>Speed: {p.valueSpeed.toFixed(2)}</label>
          <input type="range" min="0" max="3" step="0.01"
                 value={p.valueSpeed}
                 onChange={e=>p.onSpeed(parseFloat(e.target.value))} />
        </details>

        <details open>
          <summary>FX</summary>
          <label>Intensity: {p.valueIntensity.toFixed(2)}</label>
          <input type="range" min="0" max="3" step="0.01"
                 value={p.valueIntensity}
                 onChange={e=>p.onIntensity(parseFloat(e.target.value))} />
        </details>

        <button
          data-testid="reset"
          onClick={p.onReset}
          style={{
            marginTop:6, alignSelf:'flex-start',
            background:'#fff', color:'#000',
            border:'0', borderRadius:6,
            padding:'8px 12px', fontWeight:600,
            cursor:'pointer'
          }}>
          Reset
        </button>
      </div>
    </div>
  );
}
