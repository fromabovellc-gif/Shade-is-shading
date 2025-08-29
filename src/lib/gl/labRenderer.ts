export type LabUniforms = {
  uHue: number;
  uGloss: number;
  uRoughness: number;
  uRim: number;
  uTrailIntensity: number;
  uTrailLength: number;
  uCompanionCount: number;
  uCompanionSize: number;
  uVignette: number;
  uBlur: number;
  uBob: number;
};

export default function initLabRenderer(
  canvas: HTMLCanvasElement,
  uniforms: LabUniforms
) {
  const gl = canvas.getContext("webgl2")!;
  if (!gl) {
    throw new Error("WebGL2 not supported");
  }

  const vertexSrc = `#version 300 es\nprecision mediump float;\nin vec2 position;\nvoid main(){gl_Position=vec4(position,0.0,1.0);} `;
  const fragmentSrc = `#version 300 es\nprecision highp float;\nout vec4 outColor;\nuniform float uHue,uGloss,uRoughness,uRim,uTrailIntensity,uTrailLength,uCompanionCount,uCompanionSize,uVignette,uBlur,uBob;\nvoid main(){float c=uHue+uGloss+uRoughness+uRim+uTrailIntensity+uTrailLength+uCompanionCount+uCompanionSize+uVignette+uBlur+uBob;outColor=vec4(fract(c),0.0,1.0-fract(c),1.0);} `;

  function compile(type: number, src: string) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
  }

  const vert = compile(gl.VERTEX_SHADER, vertexSrc);
  const frag = compile(gl.FRAGMENT_SHADER, fragmentSrc);
  const program = gl.createProgram()!;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.bindAttribLocation(program, 0, "position");
  gl.linkProgram(program);
  gl.useProgram(program);

  const locations = {
    uHue: gl.getUniformLocation(program, "uHue"),
    uGloss: gl.getUniformLocation(program, "uGloss"),
    uRoughness: gl.getUniformLocation(program, "uRoughness"),
    uRim: gl.getUniformLocation(program, "uRim"),
    uTrailIntensity: gl.getUniformLocation(program, "uTrailIntensity"),
    uTrailLength: gl.getUniformLocation(program, "uTrailLength"),
    uCompanionCount: gl.getUniformLocation(program, "uCompanionCount"),
    uCompanionSize: gl.getUniformLocation(program, "uCompanionSize"),
    uVignette: gl.getUniformLocation(program, "uVignette"),
    uBlur: gl.getUniformLocation(program, "uBlur"),
    uBob: gl.getUniformLocation(program, "uBob"),
  } as const;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  let raf = 0;
  const render = (t: number) => {
    const time = t * 0.001;
    uniforms.uBob = Math.sin(time * 0.6) * 0.02;

    gl.uniform1f(locations.uHue, uniforms.uHue);
    gl.uniform1f(locations.uGloss, uniforms.uGloss);
    gl.uniform1f(locations.uRoughness, uniforms.uRoughness);
    gl.uniform1f(locations.uRim, uniforms.uRim);
    gl.uniform1f(locations.uTrailIntensity, uniforms.uTrailIntensity);
    gl.uniform1f(locations.uTrailLength, uniforms.uTrailLength);
    gl.uniform1f(locations.uCompanionCount, uniforms.uCompanionCount);
    gl.uniform1f(locations.uCompanionSize, uniforms.uCompanionSize);
    gl.uniform1f(locations.uVignette, uniforms.uVignette);
    gl.uniform1f(locations.uBlur, uniforms.uBlur);
    gl.uniform1f(locations.uBob, uniforms.uBob);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(render);
  };
  raf = requestAnimationFrame(render);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    },
  };
}

