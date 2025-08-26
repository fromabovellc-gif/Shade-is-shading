import React from 'react';
import Controls from './components/Controls';
import './index.css';

export default function App() {
  console.log('[App ACTIVE]', new Date().toISOString());

  const [hue, setHue] = React.useState(0.5);
  const [speed, setSpeed] = React.useState(1.0);
  const [intensity, setIntensity] = React.useState(1.0);

  React.useEffect(() => {
    const H = parseFloat(localStorage.getItem('hue') ?? '');
    if (!Number.isNaN(H)) setHue(H);
    const S = parseFloat(localStorage.getItem('speed') ?? '');
    if (!Number.isNaN(S)) setSpeed(S);
    const I = parseFloat(localStorage.getItem('intensity') ?? '');
    if (!Number.isNaN(I)) setIntensity(I);
  }, []);
  React.useEffect(() => { localStorage.setItem('hue', String(hue)); }, [hue]);
  React.useEffect(() => { localStorage.setItem('speed', String(speed)); }, [speed]);
  React.useEffect(() => { localStorage.setItem('intensity', String(intensity)); }, [intensity]);

  const onReset = () => {
    localStorage.removeItem('hue');
    localStorage.removeItem('speed');
    localStorage.removeItem('intensity');
    window.location.reload();
  };

  return (
    <div className="app">
      <div className="canvas-wrap">
        <canvas
          id="shader-canvas"
          className="shader-canvas"
          style={{ position: 'relative', zIndex: 1 }}
        ></canvas>
      </div>

      <Controls
        valueHue={hue} onHue={setHue}
        valueSpeed={speed} onSpeed={setSpeed}
        valueIntensity={intensity} onIntensity={setIntensity}
        onReset={onReset}
      />

      <div
        style={{
          position: 'fixed',
          right: 8,
          bottom: 8,
          zIndex: 2147483647,
          background: '#0ff',
          color: '#000',
          padding: '6px 8px',
          fontSize: 12,
          borderRadius: 6,
          boxShadow: '0 0 6px rgba(0,0,0,.4)'
        }}
      >
        ACTIVE CLIENT
      </div>
    </div>
  );
}
