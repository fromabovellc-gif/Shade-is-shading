import { sizeCanvasToDisplay } from './canvas';

export const state = {
  emblem: { radius: 0.26 },
  companion: { orbitRadius: 0.45, size: 0.04 },
};

export function renderWorld(timeMs: number, canvas: HTMLCanvasElement, activeTab?: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = sizeCanvasToDisplay(canvas);
  const cx = canvas.width * 0.5;
  const cy = canvas.height * 0.5;
  const minDim = Math.min(canvas.width, canvas.height);
  const R = Math.max(0.18, Math.min(state.emblem.radius ?? 0.26, 0.33)) * minDim;

  ctx.clearRect(0, 0, width, height);

  // draw emblem centered
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();

  // companion orbit
  const or = state.companion.orbitRadius * minDim;
  const angle = timeMs * 0.001;
  const x = cx + Math.cos(angle) * or;
  const y = cy + Math.sin(angle) * or;

  ctx.fillStyle = '#88aaff';
  ctx.beginPath();
  ctx.arc(x, y, state.companion.size * minDim, 0, Math.PI * 2);
  ctx.fill();

  // trail from emblem center
  const trailAlpha = activeTab === 'Trail' ? 1 : 0.2;
  ctx.strokeStyle = `rgba(255,255,255,${trailAlpha})`;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x, y);
  ctx.stroke();
}
