import * as THREE from 'three';

export type RoomMaterials = ReturnType<typeof createMaterials>;

export function createMaterials() {
  return {
    plaster: new THREE.MeshStandardMaterial({ color: '#173e57', roughness: 0.94 }),
    plasterWarm: new THREE.MeshStandardMaterial({ color: '#102f48', roughness: 0.88 }),
    ceiling: new THREE.MeshStandardMaterial({ color: '#2b4c63', roughness: 0.96 }),
    floor: new THREE.MeshPhysicalMaterial({ color: '#8b735d', roughness: 0.58, clearcoat: 0.12 }),
    walnut: new THREE.MeshStandardMaterial({ color: '#3b281f', roughness: 0.52 }),
    black: new THREE.MeshStandardMaterial({ color: '#111719', roughness: 0.35, metalness: 0.42 }),
    metal: new THREE.MeshStandardMaterial({ color: '#786e62', roughness: 0.28, metalness: 0.72 }),
    linen: new THREE.MeshStandardMaterial({ color: '#cfc5b6', roughness: 1 }),
    boucle: new THREE.MeshStandardMaterial({ color: '#ddd7cd', roughness: 1 }),
    blueFabric: new THREE.MeshStandardMaterial({ color: '#273c4a', roughness: 0.92 }),
    green: new THREE.MeshStandardMaterial({ color: '#2c503e', roughness: 0.88, side: THREE.DoubleSide }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#b9d8dc', roughness: 0.08, transmission: 0.6, transparent: true, opacity: 0.5 }),
    unit: new THREE.MeshPhysicalMaterial({ color: '#f6f7f5', roughness: 0.2, clearcoat: 0.4, clearcoatRoughness: 0.25 }),
    vent: new THREE.MeshStandardMaterial({ color: '#1a2226', roughness: 0.38 }),
    ice: new THREE.MeshBasicMaterial({ color: '#b4efff', transparent: true, opacity: 0.18, depthWrite: false, blending: THREE.AdditiveBlending }),
    rug: new THREE.MeshStandardMaterial({ color: '#b8aa96', roughness: 1 }),
  };
}
