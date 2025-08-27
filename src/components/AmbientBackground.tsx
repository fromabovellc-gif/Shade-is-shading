import React, { useEffect, useRef } from "react";

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Three tiny, cheap fragments to choose from.
// Keep them simple for mobile GPUs.
const FRAGS = [
  // Soft plasma
  `
  precision mediump float;
  uniform float uTime, uRatio;
  vec2 hash22(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
    return -1.0 + 2.0*fract(sin(p)*43758.5453123); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix(dot(hash22(i+vec2(0,0)), f-vec2(0,0)),
                    dot(hash22(i+vec2(1,0)), f-vec2(1,0)), u.x),
                mix(dot(hash22(i+vec2(0,1)), f-vec2(0,1)),
                    dot(hash22(i+vec2(1,1)), f-vec2(1,1)), u.x), u.y );
  }
  void main() {
    vec2 uv = (gl_FragCoord.xy / vec2(min(uRatio,1.0),1.0)) / 720.0;
    uv.x *= uRatio;
    float t = uTime*0.08;
    float n = noise(uv*6.0 + vec2(t, -t*0.7));
    float v = 0.5 + 0.5*sin(6.2831*(n*0.6 + t));
    vec3 col = mix(vec3(0.05,0.0,0.2), vec3(0.0,0.4,0.9), v);
    gl_FragColor = vec4(col, 0.22); // low alpha for subtle overlay
  }
  `,
  // Radial waves
  `
  precision mediump float;
  uniform float uTime, uRatio;
  void main(){
    vec2 uv = gl_FragCoord.xy / 720.0;
    uv.x *= uRatio;
    vec2 c = uv - vec2(0.75*uRatio,0.5);
    float d = length(c);
    float v = 0.5+0.5*sin(12.0*d - uTime*0.9);
    vec3 col = mix(vec3(0.02,0.0,0.12), vec3(0.1,0.5,1.0), v);
    gl_FragColor = vec4(col, 0.18);
  }
  `,
  // Aurora sweep
  `
  precision mediump float;
  uniform float uTime, uRatio;
  float band(float x, float s, float w){ return smoothstep(s-w,s,x)*smoothstep(s+w,s,x); }
  void main(){
    vec2 uv = gl_FragCoord.xy/720.0; uv.x*=uRatio;
    float t = uTime*0.35;
    float a = band(uv.y, 0.55+0.15*sin(t*0.9)+0.25*sin(uv.x*5.0+t), 0.15);
    vec3 col = mix(vec3(0.02,0.02,0.08), vec3(0.2,0.9,0.6), a);
    gl_FragColor = vec4(col, 0.20);
  }
  `
];

export default function AmbientBackground(){
  const ref = useRef<HTMLCanvasElement|null>(null);
  const stopRef = useRef<() => void>(()=>{});
  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;

    // Pick a fragment at random
    const FRAG = FRAGS[(Math.random()*FRAGS.length)|0];

    // Compile helpers
    const sh = (type:number, src:string) => {
      const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);

    // Quad
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1, -1,1,  -1,1, 1,-1, 1,1
    ]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRatio = gl.getUniformLocation(prog, "uRatio");

    let raf = 0, start = performance.now();
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = window.innerWidth, h = window.innerHeight;
      canvas.width = w*dpr; canvas.height = h*dpr;
      canvas.style.width = w+"px"; canvas.style.height = h+"px";
      gl.viewport(0,0,canvas.width,canvas.height);
      gl.uniform1f(uRatio, canvas.width/canvas.height);
    };
    fit();
    window.addEventListener("resize", fit);

    // Throttle a bit (approx ~45fps max)
    let last = 0;
    const loop = (t:number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 1000/45) return;
      last = t;
      const secs = (performance.now()-start)/1000;
      gl.uniform1f(uTime, secs);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // Pause when tab hidden
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else { last = 0; raf = requestAnimationFrame(loop); }
    };
    document.addEventListener("visibilitychange", onVis);

    raf = requestAnimationFrame(loop);
    stopRef.current = () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", fit);
      gl.deleteBuffer(buf); gl.deleteProgram(prog);
    };
    return () => stopRef.current();
  }, []);

  return <canvas ref={ref} className="ambient-bg" aria-hidden="true" />;
}
