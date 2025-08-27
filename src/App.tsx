import React from 'react';
import './index.css';
import Controls from './components/Controls';

export default function App() {
  return (
    <div className="app-root">
      <div className="canvas-wrap">
        <canvas id="shader-canvas" className="shader-canvas" />
      </div>
      <Controls />
    </div>
  );
}
