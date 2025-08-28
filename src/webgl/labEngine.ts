import type React from 'react';
import fragSource from '../shaders/lab.frag?raw';

export type Uniforms = {
  master: number;
  emblem: number;
  companion: number;
  trail: number;
  background: number;
  themeA: [number, number, number];
  themeB: [number, number, number];
};

export function createLabEngine(canvas: HTMLCanvasElement, uniformsRef: React.MutableRefObject<Uniforms>) {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    return { dispose() {} };
  }

  const vertSrc = `
    attribute vec2 position;
    void main(){
      gl_Position = vec4(position,0.0,1.0);
    }
  `;

  const compile = (type: number, src: string): WebGLShader => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return sh;
  };

  const vert = compile(gl.VERTEX_SHADER, vertSrc);
  const frag = compile(gl.FRAGMENT_SHADER, fragSource);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
       3, -1,
      -1,  3,
    ]),
    gl.STATIC_DRAW
  );
  const posLoc = gl.getAttribLocation(prog, 'position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const loc = {
    uTime: gl.getUniformLocation(prog, 'uTime'),
    uResolution: gl.getUniformLocation(prog, 'uResolution'),
    uMaster: gl.getUniformLocation(prog, 'uMaster'),
    uEmblem: gl.getUniformLocation(prog, 'uEmblem'),
    uCompanion: gl.getUniformLocation(prog, 'uCompanion'),
    uTrail: gl.getUniformLocation(prog, 'uTrail'),
    uBackground: gl.getUniformLocation(prog, 'uBackground'),
    uThemeA: gl.getUniformLocation(prog, 'uThemeA'),
    uThemeB: gl.getUniformLocation(prog, 'uThemeB'),
  } as const;

  const fit = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  fit();
  window.addEventListener('resize', fit);

  let raf = 0;
  const start = performance.now();
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const t = (performance.now() - start) / 1000;
    gl.uniform1f(loc.uTime, t);
    gl.uniform2f(loc.uResolution, canvas.width, canvas.height);
    const u = uniformsRef.current;
    gl.uniform1f(loc.uMaster, u.master);
    gl.uniform1f(loc.uEmblem, u.master * u.emblem);
    gl.uniform1f(loc.uCompanion, u.master * u.companion);
    gl.uniform1f(loc.uTrail, u.master * u.trail);
    gl.uniform1f(loc.uBackground, u.master * u.background);
    gl.uniform3fv(loc.uThemeA, u.themeA);
    gl.uniform3fv(loc.uThemeB, u.themeB);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  frame();

  return {
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fit);
      gl.deleteBuffer(buf);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteProgram(prog);
    }
  };
}
