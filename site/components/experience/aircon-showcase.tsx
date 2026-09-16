'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal, RotateCcw, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showcaseFeatures } from '@/data/showcase';
import { featurePose, pointerPose, swipePose, wrapFeature } from '@/lib/experience/rotation';
import { createAirconStudio } from '@/lib/experience/aircon-studio';

export function AirconShowcase() {
  const stageRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<ReturnType<typeof createAirconStudio> | null>(null);
  const pose = useRef({ x: 0, y: 0 });
  const gesture = useRef<{ id: number; x: number; y: number; pose: number; width: number; horizontal: boolean } | null>(null);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const feature = showcaseFeatures[active];

  useEffect(() => {
    if (!stageRef.current || !productRef.current) return;
    const studio = createAirconStudio(stageRef.current, productRef.current, { getPose: () => pose.current });
    studioRef.current = studio;
    return () => { studio.dispose(); studioRef.current = null; };
  }, []);

  const selectFeature = (index: number) => {
    const next = wrapFeature(index);
    pose.current = { x: featurePose(next), y: 0 };
    studioRef.current?.wake();
    setActive(next);
  };
  const reset = () => {
    pose.current = { x: 0, y: 0 };
    studioRef.current?.wake();
    setActive(0);
  };
  const startSwipe = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, pose: pose.current.x, width: event.currentTarget.clientWidth, horizontal: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const movePointer = (event: PointerEvent<HTMLDivElement>) => {
    // Mouse and pen hover respond immediately; no click or pressed button is needed.
    if (event.pointerType === 'mouse' || (event.pointerType === 'pen' && event.buttons === 0)) {
      const rect = event.currentTarget.getBoundingClientRect();
      pose.current = pointerPose(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height);
      studioRef.current?.wake();
      return;
    }
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.horizontal && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy)) {
      start.horizontal = true;
      setDragging(true);
    }
    if (!start.horizontal) return;
    pose.current = { x: swipePose(start.pose, dx, start.width), y: 0 };
    studioRef.current?.wake();
  };
  const endSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    gesture.current = null;
    setDragging(false);
    // Complete horizontal swipes advance the quality highlight as well as moving the image.
    if (event.type === 'pointerup' && start.horizontal && Math.abs(event.clientX - start.x) > 45) {
      setActive((current) => wrapFeature(current + (event.clientX < start.x ? 1 : -1)));
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section className="aircon-showcase" id="explore-3d" aria-labelledby="showcase-title">
      <div className="showcase-heading">
        <p className="kicker"><span className="status-dot" /> Daikin / Comfort, considered</p>
        <h2 id="showcase-title">Exceptional comfort.<br /><em>Beautifully considered.</em></h2>
        <p className="showcase-intro">Precision cooling. Thoughtful design. A better feeling, every day.</p>
      </div>

      <div className="showcase-studio">
        <div className="showcase-studio__top"><span><Snowflake size={15} strokeWidth={1.25} /> DAIKIN / WALL-MOUNTED COOLING</span><span>MADE FOR YOUR SPACE</span></div>
        <div className="showcase-wordmark" aria-hidden="true">DAIKIN</div>
        <div
          ref={stageRef}
          className="showcase-viewport"
          data-dragging={dragging}
          role="group"
          tabIndex={0}
          aria-label="Daikin air conditioner with interactive 3D tilt"
          aria-describedby="showcase-instructions"
          onPointerDown={startSwipe}
          onPointerMove={movePointer}
          onPointerUp={endSwipe}
          onPointerCancel={endSwipe}
          onLostPointerCapture={endSwipe}
          onPointerLeave={() => { if (!gesture.current) { pose.current = { x: 0, y: 0 }; studioRef.current?.wake(); } }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              selectFeature(active + (event.key === 'ArrowRight' ? 1 : -1));
            } else if (event.key === 'Home') { event.preventDefault(); reset(); }
          }}
        >
          <div className="showcase-product" ref={productRef}>
            <Image src="/images/products/daikin-aircon-cutout.png" alt="Silver-white Daikin wall-mounted air conditioner, isolated with its front panel and air outlet visible" width={1728} height={910} sizes="(max-width: 760px) 90vw, 78vw" draggable={false} onError={() => setImageFailed(true)} />
          </div>
          {imageFailed && <p className="showcase-image-error" role="status">The product image could not load. Explore its features below.</p>}
        </div>
        <div className="showcase-controls">
          <p id="showcase-instructions"><MoveHorizontal size={18} strokeWidth={1.2} /><span>Move your mouse or swipe to explore<small>No click needed. Arrow keys also work.</small></span></p>
          <div className="showcase-controls__buttons">
            <Button variant="ghost" className="showcase-control" aria-label="Previous feature" onClick={() => selectFeature(active - 1)}><ArrowLeft /></Button>
            <Button variant="ghost" className="showcase-control" aria-label="Center the air conditioner" onClick={reset}><RotateCcw /></Button>
            <Button variant="ghost" className="showcase-control" aria-label="Next feature" onClick={() => selectFeature(active + 1)}><ArrowRight /></Button>
          </div>
        </div>
      </div>

      <div className="showcase-features" aria-label="Explore Daikin qualities">
        {showcaseFeatures.map((item, index) => <Button key={item.label} variant="ghost" className="showcase-feature" aria-pressed={active === index} aria-controls="showcase-detail" onClick={() => selectFeature(index)}><span>0{index + 1}</span>{item.label}<i aria-hidden="true" /></Button>)}
      </div>
      <div className="showcase-detail" id="showcase-detail" aria-live="polite" aria-atomic="true">
        <p className="showcase-detail__label">{feature.detail}</p>
        <div key={active} className="showcase-detail__copy"><h3>{feature.title}</h3><p>{feature.description}</p></div>
        <a href="#technology" className="showcase-link">Discover the technology <ArrowUpRight size={17} /></a>
      </div>
      <div className="showcase-close"><p>Bring better comfort home.</p><a className="showcase-quote" href="mailto:admin@stratobuilders.ph?subject=Daikin%20cooling%20quotation">Request your quotation <ArrowUpRight size={17} /></a></div>
      <p className="showcase-note">Product illustration. Features vary by model.</p>
    </section>
  );
}
