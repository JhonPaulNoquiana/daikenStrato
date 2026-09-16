import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { createMaterials, type RoomMaterials } from './materials';

type SceneBuild = {
  root: THREE.Group;
  ac: THREE.Group;
  louvers: THREE.Object3D[];
  curtains: THREE.Mesh[];
  air: THREE.Points;
  dust: THREE.Points;
  sun: THREE.DirectionalLight;
  dispose: () => void;
};

function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, position: [number, number, number], root: THREE.Object3D, cast = true) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...position);
  object.castShadow = cast;
  object.receiveShadow = true;
  root.add(object);
  return object;
}

function box(size: [number, number, number], position: [number, number, number], material: THREE.Material, root: THREE.Object3D, radius = 0.04) {
  return mesh(new RoundedBoxGeometry(size[0], size[1], size[2], 3, radius), material, position, root);
}

function makePlant(x: number, z: number, scale: number, m: RoomMaterials, root: THREE.Object3D) {
  const plant = new THREE.Group();
  box([0.62, 0.62, 0.62], [0, 0.31, 0], m.plasterWarm, plant, 0.12);
  for (let i = 0; i < 13; i += 1) {
    const angle = (i / 13) * Math.PI * 2;
    const stem = mesh(new THREE.CylinderGeometry(0.018, 0.025, 1.3 + (i % 3) * 0.22, 5), m.green, [0, 1, 0], plant);
    stem.rotation.z = Math.cos(angle) * 0.35;
    stem.rotation.x = Math.sin(angle) * 0.35;
    const leaf = mesh(new THREE.SphereGeometry(0.23, 8, 5), m.green, [Math.cos(angle) * 0.5, 1.4 + (i % 4) * 0.14, Math.sin(angle) * 0.5], plant);
    leaf.scale.set(1, 0.22, 0.52);
    leaf.rotation.y = -angle;
    leaf.userData.plantLeaf = true;
  }
  plant.position.set(x, 0, z);
  plant.scale.setScalar(scale);
  root.add(plant);
}

export function buildRoom(scene: THREE.Scene, reducedQuality: boolean): SceneBuild {
  const m = createMaterials();
  const root = new THREE.Group();
  scene.add(root);

  const floor = mesh(new THREE.PlaneGeometry(18, 20), m.floor, [0, 0, 3], root);
  floor.rotation.x = -Math.PI / 2;
  const backWall = mesh(new THREE.PlaneGeometry(16, 7), m.plaster, [0, 3.1, -4], root, false);
  const ceiling = mesh(new THREE.PlaneGeometry(18, 20), m.ceiling, [0, 6, 3], root, false);
  ceiling.rotation.x = Math.PI / 2;
  const leftWall = mesh(new THREE.PlaneGeometry(20, 7), m.plasterWarm, [-8, 3.1, 3], root, false);
  leftWall.rotation.y = Math.PI / 2;

  // Window bay and architectural mullions.
  mesh(new THREE.PlaneGeometry(6.2, 4.8), m.glass, [-3.8, 3.05, -3.94], root, false);
  for (let i = -3; i <= 3; i += 2) box([0.08, 5, 0.12], [-3.8 + i * 0.78, 3.05, -3.84], m.black, root, 0.01);
  box([6.4, 0.09, 0.12], [-3.8, 5.52, -3.84], m.black, root, 0.01);
  box([6.4, 0.09, 0.12], [-3.8, 0.58, -3.84], m.black, root, 0.01);
  box([3.8, 0.13, 0.45], [3.8, 5.62, -3.65], m.plasterWarm, root);

  const curtains: THREE.Mesh[] = [];
  for (const x of [-6.65, -0.92]) {
    const curtain = mesh(new THREE.PlaneGeometry(0.85, 5, 8, 18), new THREE.MeshStandardMaterial({ color: '#d7d0c6', roughness: 1, side: THREE.DoubleSide }), [x, 3.02, -3.62], root, false);
    curtain.userData.base = curtain.geometry.attributes.position.array.slice();
    curtains.push(curtain);
  }

  // AC with recessed vent, blades, sensor and embossed seam.
  const ac = new THREE.Group();
  const body = box([4.25, 1.15, 0.72], [0, 0, 0], m.unit, ac, 0.18);
  body.castShadow = true;
  box([3.68, 0.22, 0.12], [0, -0.42, 0.4], m.vent, ac, 0.025);
  box([3.8, 0.025, 0.02], [0, 0.3, 0.372], m.plasterWarm, ac, 0.005);
  const louvers: THREE.Object3D[] = [];
  for (let i = 0; i < 12; i += 1) {
    const fin = box([0.025, 0.19, 0.18], [-1.65 + i * 0.3, -0.42, 0.5], m.metal, ac, 0.006);
    louvers.push(fin);
  }
  const indicator = mesh(new THREE.CircleGeometry(0.026, 16), new THREE.MeshBasicMaterial({ color: '#a6f2ff' }), [1.7, 0.3, 0.37], ac, false);
  indicator.rotation.y = Math.PI;
  ac.position.set(2.45, 4.5, -3.45);
  ac.rotation.y = -0.015;
  root.add(ac);

  // Living zone.
  const rug = box([5.5, 0.08, 4.1], [1.55, 0.07, 2.3], m.rug, root, 0.22);
  rug.receiveShadow = true;
  const sofa = new THREE.Group();
  box([4.9, 0.75, 0.72], [0, 0.68, 0.43], m.linen, sofa, 0.18);
  box([4.9, 0.55, 0.9], [0, 0.48, -0.16], m.linen, sofa, 0.16);
  box([0.45, 0.72, 1.15], [-2.27, 0.57, -0.05], m.linen, sofa, 0.16);
  box([0.45, 0.72, 1.15], [2.27, 0.57, -0.05], m.linen, sofa, 0.16);
  for (const x of [-1.45, -0.5, 0.5, 1.45]) box([0.86, 0.62, 0.28], [x, 1.18, 0.12], x === 0.5 ? m.blueFabric : m.boucle, sofa, 0.12);
  sofa.position.set(1.75, 0, 4.25);
  root.add(sofa);

  const coffee = new THREE.Group();
  mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.17, 48), m.walnut, [0, 0.62, 0], coffee);
  for (let i = 0; i < 3; i += 1) {
    const angle = (i / 3) * Math.PI * 2;
    const leg = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.62, 8), m.black, [Math.cos(angle) * 0.85, 0.3, Math.sin(angle) * 0.85], coffee);
    leg.rotation.z = Math.cos(angle) * 0.12;
  }
  coffee.position.set(1.3, 0, 1.4);
  root.add(coffee);
  makePlant(5.9, 1.1, 1.05, m, root);
  makePlant(0.15, 1.15, 0.42, m, root);

  // Dining zone and quiet kitchen beyond.
  const dining = new THREE.Group();
  box([3.7, 0.18, 1.42], [0, 1.2, 0], m.walnut, dining, 0.08);
  for (const x of [-1.45, 1.45]) for (const z of [-0.5, 0.5]) box([0.11, 1.15, 0.11], [x, 0.59, z], m.black, dining, 0.025);
  for (const x of [-1.3, 0, 1.3]) for (const z of [-1.02, 1.02]) {
    const chair = new THREE.Group();
    box([0.72, 0.17, 0.68], [0, 0.75, 0], m.boucle, chair, 0.08);
    box([0.72, 0.82, 0.18], [0, 1.2, z < 0 ? 0.27 : -0.27], m.boucle, chair, 0.09);
    for (const lx of [-0.25, 0.25]) for (const lz of [-0.2, 0.2]) box([0.05, 0.72, 0.05], [lx, 0.36, lz], m.black, chair, 0.01);
    chair.position.set(x, 0, z);
    dining.add(chair);
  }
  dining.position.set(-3.6, 0, 2.25);
  root.add(dining);
  for (const x of [-4.6, -3.6, -2.6]) {
    const cord = mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.65, 6), m.black, [x, 5.15, 2.25], root);
    const shade = mesh(new THREE.ConeGeometry(0.38, 0.34, 32, 1, true), m.black, [x, 4.26, 2.25], root);
    shade.rotation.x = Math.PI;
    const glow = new THREE.PointLight('#ffc875', 8, 3.5, 2);
    glow.position.set(x, 4.05, 2.25);
    root.add(glow);
  }
  for (let i = 0; i < 5; i += 1) box([1.25, 2.35, 0.65], [-5.1 + i * 1.26, 1.4, -3.45], i % 2 ? m.walnut : m.black, root, 0.025);
  box([6.4, 0.12, 0.85], [-2.6, 2.62, -3.25], m.plasterWarm, root, 0.035);

  // Airflow and ambient dust.
  const airCount = reducedQuality ? 180 : 480;
  const airPositions = new Float32Array(airCount * 3);
  for (let i = 0; i < airCount; i += 1) {
    const t = Math.random();
    airPositions[i * 3] = 2.45 + (Math.random() - 0.5) * (0.4 + t * 4.8);
    airPositions[i * 3 + 1] = 4.05 - t * 2.1 + Math.sin(t * 5) * 0.15;
    airPositions[i * 3 + 2] = -2.9 + t * 5.8 + (Math.random() - 0.5) * 0.25;
  }
  const airGeometry = new THREE.BufferGeometry();
  airGeometry.setAttribute('position', new THREE.BufferAttribute(airPositions, 3));
  const air = new THREE.Points(airGeometry, new THREE.PointsMaterial({ color: '#b7f0ff', size: reducedQuality ? 0.025 : 0.035, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false }));
  root.add(air);
  const dustCount = reducedQuality ? 120 : 360;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i += 1) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 14;
    dustPositions[i * 3 + 1] = Math.random() * 5.5;
    dustPositions[i * 3 + 2] = -3 + Math.random() * 13;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: '#fff2d5', size: 0.018, transparent: true, opacity: 0.42, depthWrite: false }));
  root.add(dust);

  scene.add(new THREE.HemisphereLight('#dff5ff', '#4b392b', 2.25));
  const sun = new THREE.DirectionalLight('#ffe2ae', 5.8);
  sun.position.set(-6, 8, 6);
  sun.castShadow = !reducedQuality;
  sun.shadow.mapSize.set(reducedQuality ? 512 : 1536, reducedQuality ? 512 : 1536);
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -4;
  scene.add(sun);
  const cool = new THREE.PointLight('#9fe8ff', 14, 7, 2);
  cool.position.set(2.45, 4, -2.5);
  scene.add(cool);

  return {
    root, ac, louvers, curtains, air, dust, sun,
    dispose: () => {
      root.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const mats = Array.isArray(object.material) ? object.material : [object.material];
          mats.forEach((material) => material.dispose());
        }
      });
    },
  };
}

export function animateRoom(build: SceneBuild, time: number) {
  build.louvers.forEach((louver, index) => { louver.rotation.x = -0.22 + Math.sin(time * 0.55 + index * 0.08) * 0.025; });
  build.air.rotation.y = Math.sin(time * 0.18) * 0.035;
  const airPosition = build.air.geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < airPosition.count; i += 1) {
    const z = airPosition.getZ(i) + 0.006 + (i % 5) * 0.0007;
    airPosition.setZ(i, z > 3.1 ? -2.9 : z);
  }
  airPosition.needsUpdate = true;
  build.dust.rotation.y = time * 0.012;
  build.dust.position.y = Math.sin(time * 0.2) * 0.08;
  build.curtains.forEach((curtain, curtainIndex) => {
    const position = curtain.geometry.attributes.position as THREE.BufferAttribute;
    const base = curtain.userData.base as Float32Array;
    for (let i = 0; i < position.count; i += 1) position.setZ(i, base[i * 3 + 2] + Math.sin(time * 0.7 + i * 0.4 + curtainIndex) * 0.018);
    position.needsUpdate = true;
  });
  build.root.traverse((object) => {
    if (object.userData.plantLeaf) object.rotation.z = Math.sin(time * 0.45 + object.position.y * 3) * 0.035;
  });
  build.sun.intensity = 5.5 + Math.sin(time * 0.12) * 0.35;
}
