#version 300 es
precision highp float;
out vec4 outColor;

uniform float uHue, uGloss, uRough, uRim;
uniform float uCompanion, uTrail, uBackground;

void main(){
  // Placeholder simple shading; keep your existing PBR/lambert if present.
  float base = 0.55 + 0.45 * uGloss;
  float rim  = pow(uRim, 1.2);
  outColor = vec4(base, base*(1.0-uRough), base*0.8, 1.0);
}
