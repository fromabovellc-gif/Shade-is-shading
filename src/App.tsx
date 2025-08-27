import React, { useRef } from 'react';
import './index.css';
import Controls from './components/Controls';

export default function App() {
  const controlsRef = useRef({ hue: 0.6, speed: 1.0, intensity: 0.8 });

  return (
    <div className="app-root">
      <div id="previewSticky" className="preview-sticky">
        <div className="canvas-wrap">
          <canvas id="shader-canvas" className="shader-canvas" />
        </div>
      </div>
      <Controls controlsRef={controlsRef} />
    </div>
  );
}
