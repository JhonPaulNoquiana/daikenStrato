'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowDownRight, MoveDown } from 'lucide-react';

const moments = [
  { from: 0, to: .2, eyebrow: 'Daikin climate systems · 01', title: <>More cooling.<br /><em>Bigger spaces.</em></>, note: 'Scroll to enter the room' },
  { from: .18, to: .42, eyebrow: 'Sculpted airflow · 02', title: <>Engineered<br />to disappear.</>, note: 'Quiet by design' },
  { from: .4, to: .68, eyebrow: 'Total comfort · 03', title: <>Every corner.<br /><em>One climate.</em></>, note: 'Intelligent inverter control' },
  { from: .66, to: .88, eyebrow: 'Spatial thinking · 04', title: <>Made for<br />larger lives.</>, note: 'Power without presence' },
];

export function Narrative() {
  const [progress, setProgress] = useState(0);
  const [roomSize, setRoomSize] = useState('');
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const onProgress = (event: Event) => setProgress((event as CustomEvent<number>).detail);
    addEventListener('cinematic-progress', onProgress);
    return () => removeEventListener('cinematic-progress', onProgress);
  }, []);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (roomSize.trim()) setSent(true);
  };
  return (
    <>
      <header className="site-mark" aria-label="Daikin by Strato Builders OPC"><span className="site-mark__glyph" aria-hidden="true" /><span>DAIKIN</span><small>× STRATO BUILDERS OPC</small></header>
      <nav className="hero-links" aria-label="Quick navigation"><a href="#systems">Explore systems</a><a href="#contact">Get in touch</a></nav>
      <div className="chapter-index" aria-hidden="true"><b>{String(Math.min(5, Math.floor(progress * 5) + 1)).padStart(2, '0')}</b><span>/</span><span>05</span></div>
      <div className="progress-rail" aria-hidden="true"><i style={{ transform: `scaleY(${Math.max(.02, progress)})` }} /></div>
      {moments.map((moment, index) => {
        const center = (moment.from + moment.to) / 2;
        const range = (moment.to - moment.from) / 2;
        const opacity = index === 0 && progress < center ? 1 : Math.max(0, 1 - Math.abs(progress - center) / range);
        return (
          <section className={`story-moment story-moment--${index}`} style={{ opacity, pointerEvents: opacity > .6 ? 'auto' : 'none' }} key={moment.eyebrow} aria-hidden={opacity < .1}>
            <p>{moment.eyebrow}</p><h1>{moment.title}</h1><span>{moment.note}</span>{index === 0 && <MoveDown size={16} strokeWidth={1.2} />}
          </section>
        );
      })}
      <section className="finale" style={{ opacity: Math.max(0, (progress - .84) / .12), pointerEvents: progress > .9 ? 'auto' : 'none' }} aria-hidden={progress < .86}>
        <p>Find the right cooling for your space</p>
        {sent ? (
          <div className="confirmation"><span>SPACE RECEIVED</span><strong>We’ll map the perfect climate for {roomSize}.</strong></div>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor="room-size">Tell us your room size</label>
            <div><input id="room-size" value={roomSize} onChange={(event) => setRoomSize(event.target.value)} placeholder="e.g. 42 m²" required /><button aria-label="Submit room size"><ArrowDownRight size={22} /></button></div>
          </form>
        )}
      </section>
      <footer><span>Scroll is camera</span><span>DAIKIN × STRATO BUILDERS OPC</span></footer>
    </>
  );
}
