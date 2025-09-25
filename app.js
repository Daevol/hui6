import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('stark-canvas');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x02070f, 0.05);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 300);
camera.position.set(-6, 9, 24);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 12;
controls.maxDistance = 45;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.6;

const clock = new THREE.Clock();

const promptModules = [
  {
    name: 'Intent Matrix',
    summary: 'Сканирует входной запрос и выделяет первичные задачи, контекст и скрытые намерения.',
    color: 0x00e5ff,
    orbitRadius: 8,
    angle: 0,
    duration: 5.2,
    metrics: { signalA: [0.15, 0.9], signalB: [0.4, 0.95], signalC: [0.2, 0.7] },
  },
  {
    name: 'Persona Forge',
    summary: 'Конструирует виртуальные роли и их голос, усиливая стиль будущего ответа.',
    color: 0x46ffda,
    orbitRadius: 10.5,
    angle: Math.PI * 0.35,
    duration: 4.6,
    metrics: { signalA: [0.3, 0.8], signalB: [0.3, 0.8], signalC: [0.35, 1] },
  },
  {
    name: 'Knowledge Nexus',
    summary: 'Подбирает релевантные слои памяти и подключает внешние базы знаний.',
    color: 0x8ab7ff,
    orbitRadius: 9.5,
    angle: Math.PI * 0.7,
    duration: 5.8,
    metrics: { signalA: [0.25, 0.75], signalB: [0.6, 1], signalC: [0.45, 0.95] },
  },
  {
    name: 'Constraint Sentinel',
    summary: 'Гарантирует соответствие политике, ограничениям и метрикам безопасности.',
    color: 0xff8ae3,
    orbitRadius: 7.5,
    angle: Math.PI * 1.12,
    duration: 4.2,
    metrics: { signalA: [0.55, 1], signalB: [0.2, 0.65], signalC: [0.15, 0.5] },
  },
  {
    name: 'Prompt Composer',
    summary: 'Оркестрирует финальный промпт, связывая все модули и форматируя результат.',
    color: 0xffdc6a,
    orbitRadius: 8.8,
    angle: Math.PI * 1.52,
    duration: 6,
    metrics: { signalA: [0.35, 0.9], signalB: [0.4, 0.9], signalC: [0.6, 1] },
  },
];

const moduleGroups = [];
const links = [];

scene.add(new THREE.AmbientLight(0x68cfff, 0.55));

const rimLight = new THREE.DirectionalLight(0x46ffda, 0.6);
rimLight.position.set(18, 22, 16);
scene.add(rimLight);

const hologrid = new THREE.Group();
scene.add(hologrid);

createGrid();
createParticles();
createCore();
createModules();
createLinks();

const timelineElement = document.getElementById('timeline');
const timelineItems = promptModules.map((module) => {
  const li = document.createElement('li');
  li.innerHTML = `<strong>${module.name}</strong><br /><span>${module.summary}</span>`;
  timelineElement.appendChild(li);
  return li;
});

let assemblyRunning = true;
let activeModuleIndex = 0;
let moduleElapsed = 0;

const statusValue = document.getElementById('current-node');
const signalA = document.getElementById('signal-a');
const signalB = document.getElementById('signal-b');
const signalC = document.getElementById('signal-c');

updateActiveModule(0);

const toggleAssemblyBtn = document.getElementById('toggle-assembly');
const resetSequenceBtn = document.getElementById('reset-sequence');

toggleAssemblyBtn.addEventListener('click', () => {
  assemblyRunning = !assemblyRunning;
  toggleAssemblyBtn.textContent = assemblyRunning ? 'Пауза' : 'Запуск';
});

resetSequenceBtn.addEventListener('click', () => {
  activeModuleIndex = 0;
  moduleElapsed = 0;
  updateActiveModule(activeModuleIndex);
});

window.addEventListener('resize', onResize);

renderer.setAnimationLoop(() => {
  const delta = clock.getDelta();
  animate(delta);
  renderer.render(scene, camera);
});

function animate(delta) {
  controls.update();
  hologrid.rotation.y += delta * 0.08;

  moduleGroups.forEach((group, index) => {
    const pulse = 0.6 + Math.sin(clock.elapsedTime * (0.8 + index * 0.2)) * 0.18;
    group.userData.core.scale.setScalar(pulse);
    group.rotation.y += delta * 0.2;
  });

  links.forEach((line, idx) => {
    const intensity = 0.3 + Math.sin(clock.elapsedTime * 1.5 + idx) * 0.2;
    line.material.opacity = THREE.MathUtils.clamp(intensity, 0.1, 0.7);
  });

  if (!assemblyRunning) {
    return;
  }

  moduleElapsed += delta;

  const currentModule = promptModules[activeModuleIndex];
  const progress = Math.min(moduleElapsed / currentModule.duration, 1);

  updateSignals(currentModule, progress);
  updateModuleVisual(currentModule, progress);

  if (progress >= 1) {
    advanceModule();
  }
}

function updateActiveModule(index) {
  timelineItems.forEach((item, idx) => {
    item.classList.toggle('active', idx === index);
  });

  const module = promptModules[index];
  statusValue.textContent = module.name;
  moduleGroups.forEach((group, idx) => {
    const opacity = idx <= index ? 1 : 0.3;
    group.userData.glow.material.opacity = opacity * 0.45;
    group.userData.core.material.emissiveIntensity = idx === index ? 1.2 : 0.6;
  });
}

function updateSignals(module, progress) {
  const [aMin, aMax] = module.metrics.signalA;
  const [bMin, bMax] = module.metrics.signalB;
  const [cMin, cMax] = module.metrics.signalC;

  signalA.style.transform = `scaleX(${THREE.MathUtils.lerp(aMin, aMax, easeInOut(progress))})`;
  signalB.style.transform = `scaleX(${THREE.MathUtils.lerp(bMin, bMax, easeInOut(progress))})`;
  signalC.style.transform = `scaleX(${THREE.MathUtils.lerp(cMin, cMax, easeInOut(progress))})`;
}

function updateModuleVisual(module, progress) {
  const group = moduleGroups[activeModuleIndex];
  const energy = THREE.MathUtils.lerp(0.25, 1.1, easeInOut(progress));
  group.userData.aura.material.opacity = energy * 0.4;
  group.userData.beam.material.opacity = energy * 0.3;
  group.position.y = Math.sin(clock.elapsedTime * 1.8 + activeModuleIndex) * 0.4;
}

function advanceModule() {
  moduleElapsed = 0;
  activeModuleIndex = (activeModuleIndex + 1) % promptModules.length;
  updateActiveModule(activeModuleIndex);
}

function createCore() {
  const core = new THREE.Group();

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 48, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0x0affff,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.8,
      thickness: 1.2,
      emissive: new THREE.Color(0x0affff),
      emissiveIntensity: 0.8,
      opacity: 0.85,
      transparent: true,
    })
  );
  core.add(sphere);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(4.5, 0.05, 32, 320),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.55 })
  );
  ring.rotation.x = Math.PI / 2;
  core.add(ring);

  const light = new THREE.PointLight(0x00f6ff, 3, 60);
  light.position.set(0, 0, 0);
  core.add(light);

  scene.add(core);
}

function createModules() {
  const center = new THREE.Vector3();

  promptModules.forEach((module, index) => {
    const group = new THREE.Group();
    const angle = module.angle;
    const radius = module.orbitRadius;
    group.position.set(Math.cos(angle) * radius, Math.sin(angle * 0.5) * 1.5, Math.sin(angle) * radius);

    const capsule = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.6, 1.8, 16, 24),
      new THREE.MeshStandardMaterial({
        color: module.color,
        emissive: new THREE.Color(module.color),
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.1,
        transparent: true,
        opacity: 0.82,
      })
    );

    const aura = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 24, 24),
      new THREE.MeshBasicMaterial({ color: module.color, transparent: true, opacity: 0.2 })
    );

    const beamHeight = group.position.length();
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, beamHeight, 24, 1, true),
      new THREE.MeshBasicMaterial({ color: module.color, transparent: true, opacity: 0.18 })
    );
    const direction = group.position.clone().normalize().negate();
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    beam.position.copy(direction.clone().multiplyScalar(beamHeight / 2));

    const glow = new THREE.Mesh(
      new THREE.RingGeometry(0.9, 1.4, 64),
      new THREE.MeshBasicMaterial({ color: module.color, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    glow.rotation.x = Math.PI / 2;

    group.add(beam);
    group.add(aura);
    group.add(glow);
    group.add(capsule);

    const sprite = createLabel(module.name);
    sprite.position.set(0, 1.5, 0);
    group.add(sprite);

    group.userData = { core: capsule, aura, beam, glow };

    moduleGroups.push(group);
    scene.add(group);
  });
}

function createLinks() {
  promptModules.forEach((module, index) => {
    const currentGroup = moduleGroups[index];
    const nextGroup = moduleGroups[(index + 1) % moduleGroups.length];

    const midPoint = currentGroup.position.clone().lerp(nextGroup.position, 0.5);
    midPoint.y += 3.5;

    const curve = new THREE.CatmullRomCurve3([
      currentGroup.position.clone(),
      midPoint,
      nextGroup.position.clone(),
    ]);
    const geometry = new THREE.TubeGeometry(curve, 72, 0.08, 12, false);
    const startColor = new THREE.Color(module.color);
    const endColor = nextGroup.userData.core.material.color.clone();
    const material = new THREE.MeshBasicMaterial({
      color: startColor.clone().lerp(endColor, 0.5),
      transparent: true,
      opacity: 0.35,
    });

    const tube = new THREE.Mesh(geometry, material);
    scene.add(tube);
    links.push(tube);
  });
}

function createParticles() {
  const particleCount = 1500;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const radius = THREE.MathUtils.randFloat(12, 45);
    const angle = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const height = THREE.MathUtils.randFloatSpread(20);
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    const color = new THREE.Color().setHSL(THREE.MathUtils.randFloat(0.5, 0.6), 0.7, THREE.MathUtils.randFloat(0.5, 0.7));
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });

  const points = new THREE.Points(geometry, material);
  points.rotation.x = Math.PI / 8;
  scene.add(points);
}

function createGrid() {
  const gridMaterial = new THREE.LineBasicMaterial({ color: 0x0a4d6f, transparent: true, opacity: 0.3 });

  for (let i = -5; i <= 5; i++) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-25, 0, i * 5),
      new THREE.Vector3(25, 0, i * 5),
    ]);
    hologrid.add(new THREE.Line(geometry, gridMaterial));
  }

  for (let j = -5; j <= 5; j++) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(j * 5, 0, -25),
      new THREE.Vector3(j * 5, 0, 25),
    ]);
    hologrid.add(new THREE.Line(geometry, gridMaterial));
  }

  hologrid.position.y = -4;
}

function createLabel(text) {
  const canvas = document.createElement('canvas');
  const size = 256;
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(118, 255, 251, 0.5)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 3.2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#e8f6ff';
  ctx.font = '28px Orbitron';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  wrapText(ctx, text.toUpperCase(), size / 2, size / 2, 180, 30);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(4, 4, 4);
  return sprite;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let offsetY = 0;

  words.forEach((word, index) => {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && index > 0) {
      ctx.fillText(line, x, y + offsetY);
      line = word + ' ';
      offsetY += lineHeight;
    } else {
      line = testLine;
    }
  });

  ctx.fillText(line.trim(), x, y + offsetY);
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
