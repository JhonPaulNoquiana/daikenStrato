'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import { buildRoom, animateRoom } from '@/lib/experience/scene';
import { updateCinematicCamera } from '@/lib/experience/camera';

export function CinematicRoom() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reducedQuality = innerWidth < 800 || devicePixelRatio > 2.2;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !reducedQuality, alpha: false, powerPreference: reducedQuality ? 'low-power' : 'high-performance' });
    } catch {
      setFallback(true);
      return;
    }
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#08273b');
    scene.fog = new THREE.FogExp2('#08273b', 0.017);
    const camera = new THREE.PerspectiveCamera(22, mount.clientWidth / mount.clientHeight, 0.1, 100);
    renderer.setPixelRatio(Math.min(devicePixelRatio, reducedQuality ? 1 : 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    const room = buildRoom(scene, reducedQuality);
    const pointer = new THREE.Vector2();
    let progress = 0;
    let targetProgress = 0;
    const onScroll = () => {
      const shell = mount.closest('.experience-shell') as HTMLElement | null;
      const available = shell ? shell.offsetHeight - innerHeight : document.documentElement.scrollHeight - innerHeight;
      const start = shell?.offsetTop ?? 0;
      targetProgress = available > 0 ? Math.min(1, Math.max(0, (scrollY - start) / available)) : 0;
      document.documentElement.style.setProperty('--journey', targetProgress.toFixed(4));
      window.dispatchEvent(new CustomEvent('cinematic-progress', { detail: targetProgress }));
    };
    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX / innerWidth * 2 - 1;
      pointer.y = -(event.clientY / innerHeight * 2 - 1);
    };
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('pointermove', onPointer, { passive: true });
    addEventListener('resize', onResize);
    onScroll();
    let frame = 0;
    let running = true;
    let lastFrame = 0;
    const frameInterval = reducedQuality ? 1000 / 30 : 1000 / 60;
    const clock = new THREE.Clock();
    const render = (now = performance.now()) => {
      if (!running) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(render);
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;
      progress += (targetProgress - progress) * (reducedMotion ? 0.2 : 0.065);
      updateCinematicCamera(camera, progress, pointer, reducedMotion);
      animateRoom(room, clock.getElapsedTime());
      renderer.toneMappingExposure = 0.92 + progress * 0.26;
      renderer.render(scene, camera);
    };
    const observer = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting && !document.hidden;
      if (running && frame === 0) frame = requestAnimationFrame(render);
      if (!running && frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { rootMargin: '120px 0px' });
    const onVisibility = () => {
      running = !document.hidden && mount.getBoundingClientRect().bottom > -120 && mount.getBoundingClientRect().top < innerHeight + 120;
      if (running && frame === 0) frame = requestAnimationFrame(render);
    };
    observer.observe(mount);
    document.addEventListener('visibilitychange', onVisibility);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      removeEventListener('scroll', onScroll);
      removeEventListener('pointermove', onPointer);
      removeEventListener('resize', onResize);
      room.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={mountRef} className={`scene-canvas${fallback ? ' is-fallback' : ''}`} aria-hidden="true">
      {fallback && <Image className="fallback-product" src="/images/products/daikin-aircon-cutout.png" alt="" width={1728} height={910} sizes="70vw" />}
    </div>
  );
}
