export const FEATURE_COUNT = 4;

export function clamp(value: number, min = -1, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function pointerPose(x: number, y: number, width: number, height: number) {
  return {
    x: clamp(x / Math.max(1, width) * 2 - 1),
    y: clamp(y / Math.max(1, height) * 2 - 1),
  };
}

export function swipePose(start: number, distance: number, width: number) {
  return clamp(start + distance / Math.max(1, width) * 2);
}

export function wrapFeature(index: number) {
  return ((index % FEATURE_COUNT) + FEATURE_COUNT) % FEATURE_COUNT;
}

export function featurePose(index: number) {
  return [-0.32, 0.65, -0.65, 0.25][wrapFeature(index)];
}
