import React, { useRef } from 'react';
import './index.css';
import Controls from './components/Controls';
import AmbientBackground from './components/AmbientBackground';

export default function App() {
  const controlsRef = useRef({ hue: 0.6, speed: 1.0, intensity: 0.8 });

  return (
    <>
      <AmbientBackground />
      <header className="site-header">
        <h1 className="logo">ShaderVibe ✨</h1>
      </header>
      <div className="app">
        <section className="stage">
          {/* KEEP your existing canvas & GL init EXACTLY as is */}
          <canvas id="gl-canvas" style={{ width: '100%', height: '100%' }} />
        </section>

        <section className="controls">
          <Controls controlsRef={controlsRef} />
        </section>
      </div>
    </>
  );
}
