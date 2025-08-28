precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uMaster;
uniform float uEmblemHue;
uniform float uEmblemGloss;
uniform float uEmblemRough;
uniform float uRimStrength;
uniform float uCompanion;
uniform float uTrail;
uniform float uBackground;

#define MAX_STEPS 64
#define MAX_DIST 20.0
#define SURF_DIST 0.001

float sdSphere(vec3 p,float r){return length(p)-r;}

float map(vec3 p){return sdSphere(p,1.0);}

vec3 hsv2rgb(vec3 c){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

vec3 calcNormal(vec3 p){
  float d = map(p);
  vec2 e = vec2(0.001,0.0);
  vec3 n = d - vec3(
    map(p-e.xyy),
    map(p-e.yxy),
    map(p-e.yyx)
  );
  return normalize(n);
}

vec3 raymarch(vec3 ro, vec3 rd){
  float dO = 0.0;
  for(int i=0;i<MAX_STEPS;i++){
    vec3 p = ro + rd * dO;
    float dS = map(p);
    if(dS < SURF_DIST || dO > MAX_DIST) break;
    dO += dS;
  }
  vec3 p = ro + rd * dO;
  vec3 n = calcNormal(p);
  vec3 lightDir = normalize(vec3(-0.4,0.6,0.5));
  float diff = max(dot(n,lightDir),0.0);
  float spec = pow(max(dot(reflect(-lightDir,n), -rd),0.0), mix(2.0,64.0,uEmblemGloss));
  vec3 base = hsv2rgb(vec3(uEmblemHue,1.0,1.0));
  float rim = pow(1.0 - max(dot(n,-rd),0.0), uRimStrength*2.0);
  vec3 col = base * diff + spec * uEmblemGloss + rim * uRimStrength;
  return col;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*uResolution) / uResolution.y;
  vec3 ro = vec3(0.0,0.0,3.0);
  vec3 rd = normalize(vec3(uv,-1.5));
  vec3 col = raymarch(ro,rd);

  // background gradient
  vec3 bg = vec3(0.02,0.03,0.06) + uv.y * 0.05;
  col = col * uMaster + bg * uBackground;

  // companion
  vec2 orb = vec2(cos(uTime), sin(uTime)) * 0.8;
  float comp = exp(-4.0 * length(uv - orb));
  col += vec3(0.8,0.6,0.2) * comp * uCompanion;

  // trail
  vec2 tr = uv - orb;
  float trail = exp(-2.0*abs(tr.y)) * max(0.0,0.5 - tr.x);
  col += vec3(0.2,0.4,0.9) * trail * uTrail;

  gl_FragColor = vec4(col,1.0);
}
