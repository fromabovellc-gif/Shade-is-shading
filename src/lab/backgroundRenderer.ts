import { activePreset } from './backgroundPresets';
import { sizeCanvasToDisplay } from './canvas';

let gl: WebGLRenderingContext | null = null;
let program: WebGLProgram | null = null;
let quadBuffer: WebGLBuffer | null = null;
let canvasRef: HTMLCanvasElement | null = null;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(String(gl.getShaderInfoLog(sh)));
  }
  return sh;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const prog = gl.createProgram()!;
  const v = createShader(gl, gl.VERTEX_SHADER, vs);
  const f = createShader(gl, gl.FRAGMENT_SHADER, fs);
  gl.attachShader(prog, v);
  gl.attachShader(prog, f);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(String(gl.getProgramInfoLog(prog)));
  }
  return prog;
}

const vertexShader = `
  attribute vec2 a_position;
  varying vec2 vUv;
  void main() {
    vUv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform float uTime;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uVignette;
  uniform float uNoise;
  uniform float uSpeed;
  uniform float uIntensity;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise2(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i+vec2(0,0)), hash(i+vec2(1,0)), u.x),
               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
  }

  void main(){
    vec2 uv = vUv;
    float t = uTime * uSpeed;
    float w1 = sin(uv.x*3.0 + t*0.5) * 0.3;
    float w2 = sin(uv.y*4.0 + t*0.7) * 0.2;
    float w3 = sin((uv.x+uv.y)*2.0 + t*0.3) * 0.4;
    float patt = w1 + w2 + w3 + noise2(uv*3.0 + t*0.1)*uNoise;

    vec3 col = mix(uColorB, uColorA, (patt+1.0)*0.5) * uIntensity;

    float dist = distance(uv, vec2(0.5));
    float vig  = 1.0 - smoothstep(0.3, 1.0, dist) * uVignette;
    col *= vig;
    col += exp(-dist*1.8) * 0.3 * uColorA;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function initBackgroundRenderer(canvas: HTMLCanvasElement) {
  canvasRef = canvas;
  gl = canvas.getContext('webgl', { antialias: true, premultipliedAlpha: false });
  if (!gl) return;

  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
  gl.clearColor(0,0,0,1);

  quadBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  const posLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  onResize();
  window.addEventListener('resize', onResize, { passive: true });
}

function onResize(){
  if (!gl || !canvasRef) return;
  const { width, height } = sizeCanvasToDisplay(canvasRef);
  gl.viewport(0,0,width,height);
}

export function renderBackground(timeMs: number) {
  if (!gl || !program) return;

  gl.useProgram(program);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const uTime      = gl.getUniformLocation(program, 'uTime');
  const uColorA    = gl.getUniformLocation(program, 'uColorA');
  const uColorB    = gl.getUniformLocation(program, 'uColorB');
  const uVignette  = gl.getUniformLocation(program, 'uVignette');
  const uNoise     = gl.getUniformLocation(program, 'uNoise');
  const uSpeed     = gl.getUniformLocation(program, 'uSpeed');
  const uIntensity = gl.getUniformLocation(program, 'uIntensity');

  const t = timeMs * 0.001;
  const p = activePreset;

  gl.uniform1f(uTime, t);
  gl.uniform3f(uColorA, p.a[0], p.a[1], p.a[2]);
  gl.uniform3f(uColorB, p.b[0], p.b[1], p.b[2]);
  gl.uniform1f(uVignette, p.vignette);
  gl.uniform1f(uNoise,    p.noise);
  gl.uniform1f(uSpeed,    p.speed);
  gl.uniform1f(uIntensity, p.intensity ?? 0.9);

  const posLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export function disposeBackgroundRenderer() {
  window.removeEventListener('resize', onResize);
  gl = null; program = null; quadBuffer = null; canvasRef = null;
}
