#version 300 es
precision highp float;

layout(location=0) in vec3 position;
layout(location=1) in vec3 normal;

uniform mat4 uProjection, uView, uModel;
uniform float uTime;

/* gentle float: +/- 0.03 units vertical bob, tiny yaw */
mat4 rotY(float a){ return mat4(
  cos(a), 0.0, sin(a), 0.0,
  0.0,    1.0, 0.0,    0.0,
 -sin(a), 0.0, cos(a), 0.0,
  0.0,    0.0, 0.0,    1.0); }

void main() {
  float bob = 0.03 * sin(uTime * 0.8);
  mat4 model = uModel * rotY(0.2 * sin(uTime * 0.4)); // subtle
  vec4 worldPos = model * vec4(position.x, position.y + bob, position.z, 1.0);
  gl_Position = uProjection * uView * worldPos;
}
