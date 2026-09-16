import * as THREE from 'three';

const ease = (value: number) => value * value * (3 - 2 * value);

export function updateCinematicCamera(camera: THREE.PerspectiveCamera, progress: number, pointer: THREE.Vector2, reducedMotion: boolean) {
  const p = ease(Math.min(1, Math.max(0, progress)));
  const macro = new THREE.Vector3(2.62, 4.48, -1.35);
  const wide = new THREE.Vector3(0.35, 3.05, 13.5);
  const targetPosition = macro.clone().lerp(wide, p);
  targetPosition.x += Math.sin(p * Math.PI) * -0.8;
  targetPosition.y += Math.sin(p * Math.PI * 1.2) * 0.25;
  if (!reducedMotion) {
    targetPosition.x += pointer.x * (0.05 + p * 0.18);
    targetPosition.y += pointer.y * (0.035 + p * 0.1);
  }
  camera.position.lerp(targetPosition, reducedMotion ? 0.2 : 0.075);
  const target = new THREE.Vector3(2.45, 4.44, -3.45).lerp(new THREE.Vector3(0, 2.25, 0.3), ease(Math.min(1, p * 1.15)));
  camera.lookAt(target);
  const fov = THREE.MathUtils.lerp(22, 40, p);
  if (Math.abs(camera.fov - fov) > 0.01) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}
