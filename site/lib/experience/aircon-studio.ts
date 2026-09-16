type StudioOptions = { getPose: () => { x: number; y: number } };

/** Photo-based 3D presentation: keep the source silhouette visible at every angle. */
export function createAirconStudio(stage: HTMLDivElement, product: HTMLDivElement, options: StudioOptions) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let disposed = false;
  let frame = 0;
  let previous = 0;
  let elapsed = 0;
  let x = 0;
  let y = 0;
  let scrollTilt = 0;
  let scrollDirty = true;

  const draw = (now: number) => {
    frame = 0;
    if (!visible || document.hidden || disposed) return;
    const delta = Math.min((now - previous) / 1000 || 0.016, 0.05);
    previous = now;
    elapsed += delta;
    if (scrollDirty) {
      const rect = stage.getBoundingClientRect();
      scrollTilt = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
      scrollDirty = false;
    }
    const target = options.getPose();
    const ease = motion.matches ? 1 : 1 - Math.exp(-delta * 9);
    x += (target.x - x) * ease;
    y += (target.y - y) * ease;
    const float = motion.matches ? 0 : Math.sin(elapsed * 0.7) * 5;
    const sway = motion.matches ? 0 : Math.sin(elapsed * 0.4) * 1.2;
    const tilt = motion.matches ? 0 : scrollTilt * 4;
    product.style.transform = `translate3d(${x * 14}px, ${y * 6 + float}px, 0) rotateX(${-y * 5 + tilt}deg) rotateY(${x * 15 + sway}deg) rotateZ(${-x * 1.2}deg)`;
    if (!motion.matches || Math.abs(target.x - x) + Math.abs(target.y - y) > 0.001) {
      frame = requestAnimationFrame(draw);
    }
  };

  const wake = () => {
    if (visible && !document.hidden && !disposed && !frame) {
      previous = performance.now();
      frame = requestAnimationFrame(draw);
    }
  };
  const visibility = () => {
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    else wake();
  };
  const scroll = () => { scrollDirty = true; if (!motion.matches) wake(); };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    product.style.willChange = visible ? 'transform' : 'auto';
    if (visible) { scrollDirty = true; wake(); }
    else { cancelAnimationFrame(frame); frame = 0; }
  });
  observer.observe(stage);
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('scroll', scroll, { passive: true });
  window.addEventListener('resize', scroll, { passive: true });
  motion.addEventListener('change', wake);

  return {
    wake,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
      motion.removeEventListener('change', wake);
      product.style.willChange = 'auto';
      product.style.transform = '';
    },
  };
}
