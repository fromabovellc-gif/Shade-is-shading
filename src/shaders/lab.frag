precision mediump float;

uniform float uTime;
uniform vec2  uResolution;
uniform float uMaster;
uniform float uEmblem;
uniform float uCompanion;
uniform float uTrail;
uniform float uBackground;
uniform vec3  uThemeA;
uniform vec3  uThemeB;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;
    float t = uTime;

    // background gradient with vignette
    vec3 base = mix(uThemeB, uThemeA, uv.y);
    float vign = smoothstep(1.3, 0.7, length(p));
    vec3 col = base * vign * uBackground;

    // emblem glow at center
    float em = exp(-3.0 * length(p));
    col += uThemeA * em * uEmblem;

    // companion orbiting dot
    vec2 orbit = vec2(cos(t), sin(t)) * 0.5;
    float comp = exp(-60.0 * dot(p - orbit, p - orbit));
    col += uThemeA.yzx * comp * uCompanion;

    // trailing ripple / streak
    vec2 tr = p - orbit;
    float trail = exp(-4.0 * abs(tr.y)) * exp(-2.0 * max(0.0, tr.x));
    trail *= 0.5 + 0.5 * sin(10.0 * (tr.x - t));
    col += uThemeA * 0.6 * trail * uTrail;

    // master multiplier
    col *= 0.8 + 0.4 * uMaster;

    gl_FragColor = vec4(col, 1.0);
}
