import assert from 'node:assert/strict';
import test from 'node:test';
import { featurePose, pointerPose, swipePose, wrapFeature } from '../lib/experience/rotation.ts';
import { createAirconStudio } from '../lib/experience/aircon-studio.ts';

test('hover position controls both axes without requiring a pressed button', () => {
  assert.deepEqual(pointerPose(0, 0, 800, 400), { x: -1, y: -1 });
  assert.deepEqual(pointerPose(400, 200, 800, 400), { x: 0, y: 0 });
  assert.deepEqual(pointerPose(800, 400, 800, 400), { x: 1, y: 1 });
});

test('offscreen and zero-size pointer inputs stay within safe tilt limits', () => {
  assert.deepEqual(pointerPose(-50, 999, 800, 400), { x: -1, y: 1 });
  assert.deepEqual(pointerPose(12, 12, 0, 0), { x: 1, y: 1 });
});

test('touch swipes preserve the starting pose and clamp large gestures', () => {
  assert.ok(Math.abs(swipePose(0.2, 80, 400) - 0.6) < 1e-10);
  assert.equal(swipePose(0, -800, 400), -1);
  assert.equal(swipePose(0, 800, 400), 1);
  assert.equal(swipePose(0.2, 0, 400), 0.2);
});

test('feature navigation wraps while preserving bounded product angles', () => {
  for (let index = -12; index <= 12; index += 1) {
    assert.ok(wrapFeature(index) >= 0 && wrapFeature(index) < 4);
    assert.ok(Math.abs(featurePose(index)) <= 1);
  }
  assert.equal(wrapFeature(-1), 3);
  assert.equal(wrapFeature(4), 0);
});

test('studio follows a changed pose without a click and pauses when hidden', () => {
  const keys = ['window', 'document', 'matchMedia', 'IntersectionObserver', 'requestAnimationFrame', 'cancelAnimationFrame', 'innerHeight'];
  const originals = new Map(keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const frames = new Map();
  let frameId = 0;
  let intersect;
  const doc = Object.assign(new EventTarget(), { hidden: false });
  const motion = Object.assign(new EventTarget(), { matches: false });
  const product = { style: {} };
  let pose = { x: 0, y: 0 };
  let studio;
  let now = performance.now() + 20;
  const tick = () => {
    const [id, callback] = frames.entries().next().value;
    frames.delete(id);
    callback(now);
    now += 20;
  };
  try {
    Object.assign(globalThis, {
      window: new EventTarget(), document: doc, innerHeight: 900,
      matchMedia: () => motion,
      IntersectionObserver: class { constructor(callback) { intersect = callback; } observe() {} disconnect() {} },
      requestAnimationFrame: (callback) => { frames.set(++frameId, callback); return frameId; },
      cancelAnimationFrame: (id) => frames.delete(id),
    });
    studio = createAirconStudio({ getBoundingClientRect: () => ({ top: 100, height: 500 }) }, product, { getPose: () => pose });
    assert.equal(frames.size, 0);
    intersect([{ isIntersecting: true }]);
    tick();
    const initialTransform = product.style.transform;
    pose = { x: 1, y: 0.5 };
    tick();
    assert.notEqual(product.style.transform, initialTransform);
    doc.hidden = true;
    doc.dispatchEvent(new Event('visibilitychange'));
    assert.equal(frames.size, 0);
    doc.hidden = false;
    doc.dispatchEvent(new Event('visibilitychange'));
    assert.equal(frames.size, 1);
    motion.matches = true;
    tick();
    assert.match(product.style.transform, /rotateY\(15deg\)/);
    assert.equal(frames.size, 0, 'reduced motion stops idle animation');
    intersect([{ isIntersecting: false }]);
    studio.wake();
    assert.equal(frames.size, 0, 'offscreen motion remains paused');
  } finally {
    studio?.dispose();
    for (const key of keys) {
      const descriptor = originals.get(key);
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});
