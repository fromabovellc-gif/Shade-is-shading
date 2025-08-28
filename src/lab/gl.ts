import fragSource from '../shaders/lab.frag?raw';

export interface LabGL {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  uniforms: {
    uTime: WebGLUniformLocation | null;
    uResolution: WebGLUniformLocation | null;
    uMaster: WebGLUniformLocation | null;
    uEmblemHue: WebGLUniformLocation | null;
    uEmblemGloss: WebGLUniformLocation | null;
    uEmblemRough: WebGLUniformLocation | null;
    uRimStrength: WebGLUniformLocation | null;
    uCompanion: WebGLUniformLocation | null;
    uTrail: WebGLUniformLocation | null;
    uBackground: WebGLUniformLocation | null;
  };
  resize: () => void;
  render: (t: number) => void;
}

export function initLabGL(canvas: HTMLCanvasElement): LabGL {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('WebGL not supported');
  }

  const vertSrc = `
    attribute vec2 position;
    void main(){
      gl_Position = vec4(position,0.0,1.0);
    }
  `;

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return sh;
  };

  const vert = compile(gl.VERTEX_SHADER, vertSrc);
  const frag = compile(gl.FRAGMENT_SHADER, fragSource);

  const program = gl.createProgram()!;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  gl.useProgram(program);

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
  const posLoc = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    uTime: gl.getUniformLocation(program, 'uTime'),
    uResolution: gl.getUniformLocation(program, 'uResolution'),
    uMaster: gl.getUniformLocation(program, 'uMaster'),
    uEmblemHue: gl.getUniformLocation(program, 'uEmblemHue'),
    uEmblemGloss: gl.getUniformLocation(program, 'uEmblemGloss'),
    uEmblemRough: gl.getUniformLocation(program, 'uEmblemRough'),
    uRimStrength: gl.getUniformLocation(program, 'uRimStrength'),
    uCompanion: gl.getUniformLocation(program, 'uCompanion'),
    uTrail: gl.getUniformLocation(program, 'uTrail'),
    uBackground: gl.getUniformLocation(program, 'uBackground'),
  } as const;

  const resize = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();

  const render = (t: number) => {
    gl.uniform1f(uniforms.uTime, t);
    gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  return { gl, program, uniforms, resize, render };
}
