export type LabPresetKey = "planet" | "neon" | "minimal";
export type LabState = {
  master: number;
  emblem: { hue: number; gloss: number; roughness: number; rim: number };
  companion: { amount: number };
  trail: { amount: number };
  background: { vignette: number; hueShift?: number };
};
export const LAB_PRESETS: Record<LabPresetKey, LabState> = {
  planet:  { master:1.0, emblem:{ hue:0.62, gloss:0.55, roughness:0.35, rim:0.5 }, companion:{amount:0.5}, trail:{amount:0.6}, background:{vignette:0.25, hueShift:0.0} },
  neon:    { master:0.9, emblem:{ hue:0.82, gloss:0.8,  roughness:0.15, rim:0.65}, companion:{amount:0.35},trail:{amount:0.9}, background:{vignette:0.18, hueShift:0.15}},
  minimal: { master:0.7, emblem:{ hue:0.05, gloss:0.25, roughness:0.6,  rim:0.35}, companion:{amount:0.2}, trail:{amount:0.1}, background:{vignette:0.12, hueShift:-0.08}}
};
