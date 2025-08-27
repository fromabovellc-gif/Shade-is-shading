import React, { useRef } from 'react';
import './index.css';
import Controls from './components/Controls';

export default function App() {
  const controlsRef = useRef({ hue: 0.6, speed: 1.0, intensity: 0.8 });

  return (
    <div className="app">
      <header className="header">
        <div className="panel">
          <h1 style={{ margin: 0 }}>ShaderVibe ✨</h1>
          {/* Remove any “Live WebGL Parameter Control” subtitle here */}
        </div>
      </header>

      <section className="stage">
        {/* KEEP your existing canvas & GL init EXACTLY as is */}
        <canvas id="gl-canvas" style={{ width: '100%', height: '100%' }} />
      </section>

      <section className="controls">
        <Controls controlsRef={controlsRef} />
      </section>
    </div>
  );
}
