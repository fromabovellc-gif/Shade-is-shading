export function sizeCanvasToDisplay(canvas: HTMLCanvasElement) {
  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));
  const w = Math.floor(canvas.clientWidth  || window.innerWidth);
  const h = Math.floor(canvas.clientHeight || window.innerHeight);
  const pw = Math.floor(w * dpr);
  const ph = Math.floor(h * dpr);
  if (canvas.width !== pw || canvas.height !== ph) {
    canvas.width  = pw;
    canvas.height = ph;
  }
  return { dpr, width: pw, height: ph, cssWidth: w, cssHeight: h };
}
