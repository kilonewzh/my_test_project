const canvas = document.getElementById('tree-canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

let w = innerWidth, h = innerHeight;
canvas.width = w; canvas.height = h;

let mouse = { x: w/2, y: h/2, nx: 0, ny: 0 };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.nx = (e.clientX / w) * 2 - 1;
  mouse.ny = -(e.clientY / h) * 2 + 1;
});

window.addEventListener('resize', () => {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  gl.viewport(0,0,w,h);
});

gl.viewport(0,0,w,h);

const vertexSource = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const fragmentSource = `
precision highp float;
varying vec2 vUv;
uniform vec2 mouse;
uniform float time;

float tree(vec2 uv) {
  uv.y += 0.4;
  float d = length(uv - vec2(0.0, -0.3));
  float trunk = smoothstep(0.22, 0.0, d);
  trunk *= smoothstep(-0.6, -0.1, uv.y);

  float crack = sin(uv.y * 18.0 + uv.x * 2.0) * 0.02;
  trunk += crack * 0.4;

  float ring = sin(uv.y * 12.0) * 0.02;
  trunk += ring;

  return trunk;
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= 1.0;
  uv.y += sin(time * 0.3) * 0.04;

  float t = tree(uv);

  vec2 lightPos = mouse;
  lightPos.x *= 1.8;
  lightPos.y *= 1.8;
  lightPos.y += 0.4;

  float dist = length(uv - lightPos);
  float light = 1.0 / (dist * 4.0 + 0.2);
  light *= smoothstep(0.0, 1.0, t);

  vec3 col = vec3(0.0);
  col += vec3(0.12, 0.08, 0.04) * t;
  col += vec3(0.8, 0.7, 0.4) * light * 0.6;
  col += vec3(0.1, 0.3, 0.6) * light * 0.2;

  float glow = light * 0.3;
  col += vec3(0.3, 0.7, 1.0) * glow;

  float vignette = 1.0 - length(uv - vec2(0.0, 0.2)) * 0.3;
  col *= vignette;

  gl_FragColor = vec4(col, t + light * 0.2);
}
`;

function createShader(type, source) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  return sh;
}

const vs = createShader(gl.VERTEX_SHADER, vertexSource);
const fs = createShader(gl.FRAGMENT_SHADER, fragmentSource);
const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
gl.useProgram(program);

const vertices = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const aPos = gl.getAttribLocation(program, 'aPos');
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

const uMouse = gl.getUniformLocation(program, 'mouse');
const uTime = gl.getUniformLocation(program, 'time');

let start = Date.now();
function render() {
  const t = (Date.now() - start) / 1000;
  gl.uniform2f(uMouse, mouse.nx, mouse.ny);
  gl.uniform1f(uTime, t);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(render);
}
render();