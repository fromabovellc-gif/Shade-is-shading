import React from "react";
import Controls from "./components/Controls";
import ResetButton from "./components/ResetButton";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-4">
        <canvas id="shader-canvas" className="w-full aspect-[16/9] rounded-lg"></canvas>
        <Controls />
      </div>
      <ResetButton />
    </div>
  );
}
