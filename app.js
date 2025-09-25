import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('stark-canvas');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x02070f, 0.048);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 320);
camera.position.set(-7, 11, 26);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 12;
controls.maxDistance = 48;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.65;

const clock = new THREE.Clock();

const promptModules = [
  {
    name: 'Intent Matrix',
    summary: 'Сканирует входной запрос, выстраивает первичную задачу, контекст и ожидаемый результат.',
    color: 0x00e5ff,
    orbitRadius: 8.2,
    angle: 0,
    duration: 5.4,
    metrics: { signalA: [0.15, 0.92], signalB: [0.42, 0.95], signalC: [0.25, 0.76] },
    payloads: [
      {
        label: 'Захват входного сигнала',
        detail: 'Фиксация текста пользователя и первичная нормализация.',
        trigger: 0.12,
        color: 0x1fe7ff,
        speed: 0.55,
      },
      {
        label: 'Скан намерений',
        detail: 'Выявление ключевых глаголов и скрытых целей.',
        trigger: 0.33,
        color: 0x3dfff2,
        speed: 0.64,
      },
      {
        label: 'Каркас промпта',
        detail: 'Создание структуры будущего запроса и определение тональности.',
        trigger: 0.62,
        color: 0x74f3ff,
        speed: 0.72,
      },
    ],
  },
  {
    name: 'Persona Forge',
    summary: 'Формирует виртуальные роли и голоса, через которые будет говорить система.',
    color: 0x46ffda,
    orbitRadius: 10.6,
    angle: Math.PI * 0.32,
    duration: 4.8,
    metrics: { signalA: [0.3, 0.84], signalB: [0.35, 0.82], signalC: [0.38, 1] },
    payloads: [
      {
        label: 'Реконфигурация персонажей',
        detail: 'Выбор ведущей роли и настроек голоса.',
        trigger: 0.18,
        color: 0x43ffd3,
        speed: 0.58,
      },
      {
        label: 'Слияние с тоном пользователя',
        detail: 'Подстройка лексики под стиль диалога.',
        trigger: 0.44,
        color: 0x6cffea,
        speed: 0.68,
      },
      {
        label: 'Матрица эмпатии',
        detail: 'Настройка ответов на эмоциональные ожидания.',
        trigger: 0.7,
        color: 0x92fff6,
        speed: 0.74,
      },
    ],
  },
  {
    name: 'Knowledge Nexus',
    summary: 'Подключает внешние базы знаний, релевантные векторные воспоминания и свежие факты.',
    color: 0x8ab7ff,
    orbitRadius: 9.4,
    angle: Math.PI * 0.68,
    duration: 5.6,
    metrics: { signalA: [0.28, 0.78], signalB: [0.62, 1], signalC: [0.48, 0.98] },
    payloads: [
      {
        label: 'Выбор базовой памяти',
        detail: 'Извлечение ближайших эмбеддингов и контекста.',
        trigger: 0.16,
        color: 0x66a9ff,
        speed: 0.56,
      },
      {
        label: 'Слияние источников',
        detail: 'Комбинирование базы знаний и свежих данных.',
        trigger: 0.42,
        color: 0x8cd4ff,
        speed: 0.66,
      },
      {
        label: 'Фильтр релевантности',
        detail: 'Отбрасывание шума и приоритизация фактов.',
        trigger: 0.68,
        color: 0xb6e4ff,
        speed: 0.76,
      },
    ],
  },
  {
    name: 'Constraint Sentinel',
    summary: 'Контролирует политику, ограничения и безопасность на каждом шаге.',
    color: 0xff8ae3,
    orbitRadius: 7.6,
    angle: Math.PI * 1.08,
    duration: 4.4,
    metrics: { signalA: [0.56, 1], signalB: [0.24, 0.7], signalC: [0.15, 0.54] },
    payloads: [
      {
        label: 'Проверка политики',
        detail: 'Сканирование риска и запрещённых сценариев.',
        trigger: 0.2,
        color: 0xff9cf0,
        speed: 0.6,
      },
      {
        label: 'Согласование ограничений',
        detail: 'Применение лимитов, температур и длины.',
        trigger: 0.46,
        color: 0xffbef5,
        speed: 0.7,
      },
      {
        label: 'Блокировка конфликтов',
        detail: 'Гашение опасных веток ответа.',
        trigger: 0.72,
        color: 0xfcd1ff,
        speed: 0.78,
      },
    ],
  },
  {
    name: 'Prompt Composer',
    summary: 'Оркестрирует финальный промпт, соединяя все модули и выдавая готовый макет.',
    color: 0xffdc6a,
    orbitRadius: 8.9,
    angle: Math.PI * 1.52,
    duration: 6.1,
    metrics: { signalA: [0.36, 0.92], signalB: [0.42, 0.92], signalC: [0.62, 1] },
    payloads: [
      {
        label: 'Сбор черновика',
        detail: 'Композиция блоков и логики ответа.',
        trigger: 0.16,
        color: 0xffd85c,
        speed: 0.58,
      },
      {
        label: 'Встраивание фактов',
        detail: 'Инъекция подтверждённых знаний и ссылок.',
        trigger: 0.39,
        color: 0xffe17e,
        speed: 0.66,
      },
      {
        label: 'Полировка стиля',
        detail: 'Выравнивание тона, формата и структур.',
        trigger: 0.62,
        color: 0xfff0a2,
        speed: 0.74,
      },
      {
        label: 'Сигнатура готовности',
        detail: 'Финальный контроль и запуск импульса в ядро.',
        trigger: 0.84,
        color: 0xfff9c8,
        speed: 0.82,
      },
    ],
  },
];

const moduleGroups = [];
const links = [];
const dataShards = [];

let coreGroup;
let corePulse = 0;
let assemblyRunning = true;
let activeModuleIndex = 0;
let moduleElapsed = 0;
let cycleIndex = 0;

const tempVecA = new THREE.Vector3();
const tempVecB = new THREE.Vector3();
const upVector = new THREE.Vector3(0, 1, 0);
const tempQuat = new THREE.Quaternion();

scene.add(new THREE.AmbientLight(0x68cfff, 0.55));

const rimLight = new THREE.DirectionalLight(0x46ffda, 0.6);
rimLight.position.set(18, 24, 16);
scene.add(rimLight);

const backLight = new THREE.DirectionalLight(0x1c75ff, 0.35);
backLight.position.set(-26, 18, -16);
scene.add(backLight);

const hologrid = new THREE.Group();
scene.add(hologrid);

createGrid();
createParticles();
createCore();
createModules();
createLinks();

const timelineElement = document.getElementById('timeline');
const assemblyFeedElement = document.getElementById('assembly-feed');

const timelineItems = promptModules.map((module) => {
  const li = document.createElement('li');
  li.innerHTML = `<strong>${module.name}</strong><br /><span>${module.summary}</span>`;
  timelineElement.appendChild(li);
  return li;
});

const statusValue = document.getElementById('current-node');
const signalA = document.getElementById('signal-a');
const signalB = document.getElementById('signal-b');
const signalC = document.getElementById('signal-c');

initializePayloadState();
updateActiveModule(0);

const toggleAssemblyBtn = document.getElementById('toggle-assembly');
const resetSequenceBtn = document.getElementById('reset-sequence');

toggleAssemblyBtn.addEventListener('click', () => {
  assemblyRunning = !assemblyRunning;
  toggleAssemblyBtn.textContent = assemblyRunning ? 'Пауза' : 'Запуск';
});

resetSequenceBtn.addEventListener('click', () => {
  assemblyRunning = true;
  toggleAssemblyBtn.textContent = 'Пауза';
  cycleIndex = 0;
  moduleElapsed = 0;
  activeModuleIndex = 0;
  timelineItems.forEach((item) => item.classList.remove('completed'));
  clearDataShards();
  assemblyFeedElement.innerHTML = '';
  initializePayloadState();
  updateActiveModule(activeModuleIndex);
});

window.addEventListener('resize', onResize);

function tick() {
  const delta = clock.getDelta();
  animate(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();

function animate(delta) {
  controls.update();
  hologrid.rotation.y += delta * 0.08;

  moduleGroups.forEach((group, index) => {
    const pulse = 0.68 + Math.sin(clock.elapsedTime * (0.9 + index * 0.15)) * 0.18;
    group.userData.core.scale.setScalar(pulse);
    group.userData.aura.scale.setScalar(1.25 + Math.sin(clock.elapsedTime * 1.4 + index) * 0.1);
    group.userData.aura.material.opacity = 0.18 + Math.sin(clock.elapsedTime * 1.6 + index) * 0.08;
    group.userData.orbit.rotation.y += delta * 0.9;
    group.userData.glow.rotation.z += delta * 0.6;
    group.userData.beam.material.opacity = THREE.MathUtils.lerp(
      group.userData.beam.material.opacity,
      group.userData.targetBeam,
      0.08
    );
    group.position.y = Math.sin(clock.elapsedTime * 1.8 + index) * 0.45;
    group.rotation.y += delta * 0.2;
  });

  links.forEach((link, idx) => {
    link.material.opacity = 0.18 + Math.sin(clock.elapsedTime * 1.6 + idx) * 0.12;
  });

  updateDataShards(delta);
  updateCorePulse(delta);

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
    const isActive = idx === index;
    const isCompleted = timelineItems[idx].classList.contains('completed');
    const emissive = isActive ? 1.3 : isCompleted ? 0.85 : 0.4;
    group.userData.core.material.emissiveIntensity = emissive;
    group.userData.targetBeam = isActive ? 0.45 : isCompleted ? 0.25 : 0.12;
    group.userData.glow.material.opacity = isActive ? 0.75 : isCompleted ? 0.45 : 0.2;
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
  const energy = THREE.MathUtils.lerp(0.2, 1.05, easeInOut(progress));
  group.userData.aura.material.opacity = 0.18 + energy * 0.32;
  group.userData.glow.material.opacity = 0.35 + energy * 0.45;
  group.userData.core.scale.setScalar(0.7 + energy * 0.45);

  module.payloads.forEach((payload) => {
    if ((payload.lastCycle ?? -1) < cycleIndex && progress >= payload.trigger) {
      spawnDataShard(activeModuleIndex, payload);
      payload.lastCycle = cycleIndex;
    }
  });
}

function advanceModule() {
  timelineItems[activeModuleIndex].classList.add('completed');
  moduleElapsed = 0;
  activeModuleIndex = (activeModuleIndex + 1) % promptModules.length;
  if (activeModuleIndex === 0) {
    cycleIndex += 1;
    timelineItems.forEach((item) => item.classList.remove('completed'));
  }
  updateActiveModule(activeModuleIndex);
}

function spawnDataShard(moduleIndex, payload) {
  const moduleGroup = moduleGroups[moduleIndex];
  const accentColor = new THREE.Color(payload.color ?? promptModules[moduleIndex].color);

  const start = moduleGroup.position.clone();
  const controlA = start.clone().multiplyScalar(0.55).add(new THREE.Vector3(
    THREE.MathUtils.randFloatSpread(3),
    THREE.MathUtils.randFloat(3.6, 5.2),
    THREE.MathUtils.randFloatSpread(3)
  ));
  const controlB = new THREE.Vector3(
    THREE.MathUtils.randFloatSpread(1.8),
    THREE.MathUtils.randFloat(0.8, 2.2),
    THREE.MathUtils.randFloatSpread(1.8)
  );
  const end = new THREE.Vector3(
    THREE.MathUtils.randFloatSpread(0.8),
    THREE.MathUtils.randFloat(-0.25, 0.85),
    THREE.MathUtils.randFloatSpread(0.8)
  );

  const curve = new THREE.CatmullRomCurve3([start, controlA, controlB, end]);

  const shardGeometry = new THREE.OctahedronGeometry(0.32, 0);
  const shardMaterial = new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor.clone().multiplyScalar(0.55),
    roughness: 0.15,
    metalness: 0.4,
    transparent: true,
    opacity: 0.92,
  });
  const shard = new THREE.Mesh(shardGeometry, shardMaterial);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 18, 18),
    new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.28 })
  );
  shard.add(halo);

  const trail = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 80, 0.04, 8, false),
    new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.18 })
  );

  scene.add(trail);
  scene.add(shard);

  const feedEntry = createFeedEntry(promptModules[moduleIndex], payload, accentColor);

  dataShards.push({
    mesh: shard,
    trail,
    curve,
    speed: payload.speed ?? 0.6,
    startTime: clock.elapsedTime,
    payload,
    feedEntry,
    state: 'flight',
  });

  trimFeed();
}

function updateDataShards(delta) {
  for (let i = dataShards.length - 1; i >= 0; i -= 1) {
    const shard = dataShards[i];
    const elapsed = clock.elapsedTime - shard.startTime;
    const t = Math.min(elapsed * shard.speed, 1);

    shard.curve.getPointAt(t, tempVecA);
    shard.mesh.position.copy(tempVecA);

    shard.curve.getTangentAt(Math.max(t - 0.01, 0), tempVecB);
    if (tempVecB.lengthSq() > 0.00001) {
      tempVecB.normalize();
      tempQuat.setFromUnitVectors(upVector, tempVecB);
      shard.mesh.quaternion.copy(tempQuat);
    }

    const wave = Math.sin(t * Math.PI);
    shard.mesh.scale.setScalar(THREE.MathUtils.lerp(0.6, 1.7, wave));
    shard.mesh.material.opacity = 0.65 + wave * 0.35;
    shard.trail.material.opacity = 0.12 + Math.sin(clock.elapsedTime * 3 + i) * 0.08;

    if (t >= 1 && shard.state === 'flight') {
      shard.state = 'integrating';
      shard.integrateStart = clock.elapsedTime;
      markFeedEntryComplete(shard.feedEntry);
      corePulse = Math.min(corePulse + 0.45, 1.8);
    }

    if (shard.state === 'integrating') {
      const fade = Math.min((clock.elapsedTime - shard.integrateStart) / 0.75, 1);
      shard.mesh.material.opacity = THREE.MathUtils.lerp(1, 0, fade);
      shard.mesh.scale.setScalar(THREE.MathUtils.lerp(1.7, 2.4, fade));
      shard.trail.material.opacity = THREE.MathUtils.lerp(shard.trail.material.opacity, 0, fade);
      if (fade >= 1) {
        scene.remove(shard.mesh);
        scene.remove(shard.trail);
        dataShards.splice(i, 1);
      }
    }
  }
}

function markFeedEntryComplete(entry) {
  if (!entry) return;
  entry.classList.add('completed');
  const status = entry.querySelector('.assembly-feed__status');
  if (status) {
    status.textContent = 'Интегрировано';
  }
}

function createFeedEntry(module, payload, accentColor) {
  const item = document.createElement('li');
  item.className = 'assembly-feed__item';
  item.style.setProperty('--accent-color', accentColor.getStyle());

  const pulse = document.createElement('div');
  pulse.className = 'assembly-feed__pulse';

  const text = document.createElement('div');
  text.className = 'assembly-feed__text';

  const label = document.createElement('span');
  label.className = 'assembly-feed__label';
  label.textContent = payload.label;

  const meta = document.createElement('span');
  meta.className = 'assembly-feed__meta';
  meta.textContent = `${module.name} · ${payload.detail}`;

  const status = document.createElement('span');
  status.className = 'assembly-feed__status';
  status.textContent = 'В полёте';

  text.appendChild(label);
  text.appendChild(meta);
  text.appendChild(status);
  item.appendChild(pulse);
  item.appendChild(text);
  assemblyFeedElement.prepend(item);

  requestAnimationFrame(() => item.classList.add('visible'));
  return item;
}

function trimFeed() {
  const maxEntries = 11;
  const nodes = Array.from(assemblyFeedElement.children);
  if (nodes.length <= maxEntries) return;
  for (let i = maxEntries; i < nodes.length; i += 1) {
    const node = assemblyFeedElement.children[maxEntries];
    if (!node) break;
    node.classList.add('fading-out');
    setTimeout(() => node.remove(), 420);
  }
}

function updateCorePulse(delta) {
  if (!coreGroup) return;
  corePulse = Math.max(0, corePulse - delta * 0.75);

  const baseScale = 1 + Math.sin(clock.elapsedTime * 2) * 0.05;
  const pulseScale = baseScale + corePulse * 0.35;
  coreGroup.userData.sphere.scale.setScalar(pulseScale);

  coreGroup.userData.rings.forEach((ring, idx) => {
    ring.rotation.z += delta * (idx % 2 === 0 ? 0.4 : -0.35);
    ring.material.opacity = 0.4 + corePulse * (0.2 + idx * 0.12);
  });

  coreGroup.userData.flowLines.forEach((torus, idx) => {
    torus.rotation.y += delta * (0.35 + idx * 0.2);
    torus.material.opacity = 0.08 + corePulse * (0.15 + idx * 0.05);
  });
}

function clearDataShards() {
  dataShards.forEach((shard) => {
    scene.remove(shard.mesh);
    scene.remove(shard.trail);
  });
  dataShards.length = 0;
}

function initializePayloadState() {
  promptModules.forEach((module) => {
    module.payloads.forEach((payload) => {
      payload.lastCycle = -1;
    });
  });
}

function createCore() {
  coreGroup = new THREE.Group();

  const sphereMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0affff,
    metalness: 0.25,
    roughness: 0.1,
    transmission: 0.82,
    thickness: 1.3,
    emissive: new THREE.Color(0x0affff),
    emissiveIntensity: 0.85,
    opacity: 0.86,
    transparent: true,
  });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(2.6, 64, 64), sphereMaterial);
  coreGroup.add(sphere);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(new THREE.RingGeometry(4.4, 5.1, 160), ringMaterial);
  ring.rotation.x = Math.PI / 2;
  coreGroup.add(ring);

  const ring2 = new THREE.Mesh(new THREE.RingGeometry(3.4, 3.9, 96), ringMaterial.clone());
  ring2.rotation.x = Math.PI / 2;
  ring2.rotation.y = Math.PI / 3;
  coreGroup.add(ring2);

  const flowLines = [];
  for (let i = 0; i < 3; i += 1) {
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(3.6 + i * 0.55, 0.04, 24, 220),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.12 + i * 0.06 })
    );
    torus.rotation.x = Math.PI / 2;
    coreGroup.add(torus);
    flowLines.push(torus);
  }

  const point = new THREE.PointLight(0x00f6ff, 3.2, 60);
  coreGroup.add(point);

  coreGroup.userData = { sphere, rings: [ring, ring2], flowLines };
  scene.add(coreGroup);
}

function createModules() {
  promptModules.forEach((module) => {
    const group = new THREE.Group();
    const angle = module.angle;
    const radius = module.orbitRadius;
    group.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle * 0.6) * 1.6,
      Math.sin(angle) * radius
    );

    const capsuleMaterial = new THREE.MeshStandardMaterial({
      color: module.color,
      emissive: new THREE.Color(module.color),
      emissiveIntensity: 0.65,
      metalness: 0.35,
      roughness: 0.12,
      transparent: true,
      opacity: 0.82,
    });

    const capsule = new THREE.Mesh(new THREE.CapsuleGeometry(0.65, 1.9, 18, 28), capsuleMaterial);

    const aura = new THREE.Mesh(
      new THREE.SphereGeometry(1.45, 26, 26),
      new THREE.MeshBasicMaterial({ color: module.color, transparent: true, opacity: 0.22 })
    );

    const beamMaterial = new THREE.MeshBasicMaterial({ color: module.color, transparent: true, opacity: 0.18 });
    const beamHeight = group.position.length();
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, beamHeight, 24, 1, true), beamMaterial);
    const direction = group.position.clone().normalize().negate();
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    beam.position.copy(direction.clone().multiplyScalar(beamHeight / 2));

    const glow = new THREE.Mesh(
      new THREE.RingGeometry(0.9, 1.45, 64),
      new THREE.MeshBasicMaterial({ color: module.color, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    glow.rotation.x = Math.PI / 2;

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.02, 16, 120),
      new THREE.MeshBasicMaterial({ color: module.color, transparent: true, opacity: 0.24 })
    );

    group.add(beam);
    group.add(aura);
    group.add(glow);
    group.add(capsule);
    group.add(orbit);

    const sprite = createLabel(module.name);
    sprite.position.set(0, 1.6, 0);
    group.add(sprite);

    group.userData = { core: capsule, aura, beam, glow, orbit, targetBeam: 0.2 };

    moduleGroups.push(group);
    scene.add(group);
  });
}

function createLinks() {
  promptModules.forEach((module, index) => {
    const currentGroup = moduleGroups[index];
    const nextGroup = moduleGroups[(index + 1) % moduleGroups.length];

    const midPoint = currentGroup.position.clone().lerp(nextGroup.position, 0.5);
    midPoint.y += 3.8;

    const curve = new THREE.CatmullRomCurve3([
      currentGroup.position.clone(),
      midPoint,
      nextGroup.position.clone(),
    ]);

    const geometry = new THREE.TubeGeometry(curve, 90, 0.09, 16, false);
    const startColor = new THREE.Color(module.color);
    const endColor = new THREE.Color(promptModules[(index + 1) % promptModules.length].color);
    const material = new THREE.MeshBasicMaterial({
      color: startColor.clone().lerp(endColor, 0.5),
      transparent: true,
      opacity: 0.22,
    });

    const tube = new THREE.Mesh(geometry, material);
    scene.add(tube);
    links.push(tube);
  });
}

function createParticles() {
  const particleCount = 1800;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i += 1) {
    const radius = THREE.MathUtils.randFloat(12, 46);
    const angle = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const height = THREE.MathUtils.randFloatSpread(22);
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    const color = new THREE.Color().setHSL(
      THREE.MathUtils.randFloat(0.52, 0.62),
      0.7,
      THREE.MathUtils.randFloat(0.5, 0.72)
    );
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.22,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.82,
  });

  const points = new THREE.Points(geometry, material);
  points.rotation.x = Math.PI / 8;
  scene.add(points);
}

function createGrid() {
  const gridMaterial = new THREE.LineBasicMaterial({ color: 0x0a4d6f, transparent: true, opacity: 0.28 });

  for (let i = -5; i <= 5; i += 1) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-26, 0, i * 5),
      new THREE.Vector3(26, 0, i * 5),
    ]);
    hologrid.add(new THREE.Line(geometry, gridMaterial));
  }

  for (let j = -5; j <= 5; j += 1) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(j * 5, 0, -26),
      new THREE.Vector3(j * 5, 0, 26),
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
  ctx.fillStyle = 'rgba(0, 229, 255, 0.18)';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(118, 255, 251, 0.5)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 3.1, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#e8f6ff';
  ctx.font = '28px Orbitron';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  wrapText(ctx, text.toUpperCase(), size / 2, size / 2, 180, 30);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.95 });
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
