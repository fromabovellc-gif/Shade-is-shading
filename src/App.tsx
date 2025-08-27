import React, { useRef } from 'react';
import './index.css';
import Controls from './components/Controls';
import AmbientBackground from './components/AmbientBackground';

export default function App() {
  const controlsRef = useRef({ hue: 0.6, speed: 1.0, intensity: 0.8 });

  return (
    <div className="page">
      <AmbientBackground />
      <div className="layout">
        <div className="left">
          <div id="previewSticky" className="preview-sticky">
            <div className="floating-title-wrap">
              <h1 className="floating-title">ShaderVibe</h1>
            </div>
            <section className="stage">
              {/* KEEP your existing canvas & GL init EXACTLY as is */}
              <canvas id="gl-canvas" style={{ width: '100%', height: '100%' }} />
            </section>
          </div>
        </div>
        <div className="right">
          <Controls controlsRef={controlsRef} />
        </div>
      </div>
    </div>
  );
}
