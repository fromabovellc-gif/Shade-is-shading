import React from 'react';
import Controls from './components/Controls';
import './index.css';

export default function App() {
  const [hue, setHue] = React.useState(0.6);
  const [speed, setSpeed] = React.useState(1.0);
  const [intensity, setIntensity] = React.useState(1.0);

  React.useEffect(() => {
    const h = parseFloat(localStorage.getItem('shader:hue') ?? '');
    if (!Number.isNaN(h)) setHue(h);
    const s = parseFloat(localStorage.getItem('shader:speed') ?? '');
    if (!Number.isNaN(s)) setSpeed(s);
    const i = parseFloat(localStorage.getItem('shader:intensity') ?? '');
    if (!Number.isNaN(i)) setIntensity(i);
  }, []);

  React.useEffect(() => {
    localStorage.setItem('shader:hue', String(hue));
  }, [hue]);
  React.useEffect(() => {
    localStorage.setItem('shader:speed', String(speed));
  }, [speed]);
  React.useEffect(() => {
    localStorage.setItem('shader:intensity', String(intensity));
  }, [intensity]);

  React.useEffect(() => {
    const canvas = document.getElementById('shader-canvas') as HTMLCanvasElement | null;
    if (canvas) {
      canvas.style.backgroundColor = `hsl(${hue * 360},100%,${intensity * 50}%)`;
    }
  }, [hue, intensity]);

  const onReset = () => {
    localStorage.removeItem('shader:hue');
    localStorage.removeItem('shader:speed');
    localStorage.removeItem('shader:intensity');
    setHue(0.6);
    setSpeed(1.0);
    setIntensity(1.0);
  };

  return (
    <div className="app">
      <div className="canvas-wrap">
        <canvas id="shader-canvas" className="shader-canvas"></canvas>
      </div>
      <Controls
        hue={hue} onHue={setHue}
        speed={speed} onSpeed={setSpeed}
        intensity={intensity} onIntensity={setIntensity}
        onReset={onReset}
      />
    </div>
  );
}
