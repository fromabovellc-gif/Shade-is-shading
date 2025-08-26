import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

console.log('[ENTRY]', document.querySelector('meta[name="debug-id"]')?.getAttribute('content'));

createRoot(document.getElementById("root")!).render(<App />);
