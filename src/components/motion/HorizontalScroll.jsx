import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

// Desktop with motion allowed: the section pins and the track scrolls sideways.
// Touch devices, tablets and reduced-motion users get a native swipeable row.
export default function HorizontalScroll({ children, label = 'Horizontal showcase', className = '' }) {
  const wrap = useRef(null);
  const track = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const distanceToScroll = () => Math.max(0, track.current.scrollWidth - window.innerWidth);
      gsap.to(track.current, {
        x: () => -distanceToScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => `+=${distanceToScroll()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={wrap} className={`hscroll ${className}`.trim()} role="region" aria-label={label}>
      <div ref={track} className="hscroll__track">
        {children}
      </div>
    </div>
  );
}
