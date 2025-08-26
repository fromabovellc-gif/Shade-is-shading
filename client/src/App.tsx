import React from "react";
import Controls from "./components/Controls";
import ResetButton from "./components/ResetButton";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* reserve space so the fixed controls do not overlap the canvas */}
      <div style={{ paddingBottom: 180 }} className="max-w-5xl mx-auto p-4">
        <canvas id="shader-canvas" className="w-full aspect-[16/9] rounded-lg"></canvas>
      </div>
      <Controls />
      <ResetButton />
    </div>
  );
}
