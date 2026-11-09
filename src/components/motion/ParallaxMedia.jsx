import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { distance } from '../../lib/motion';
import MediaFrame from '../ui/MediaFrame';

// Scroll-linked parallax. Keep range at or below 10 so the image never reveals an edge.
export default function ParallaxMedia({ src, alt = '', ratio = '4 / 5', label, range = distance.parallax, className = '' }) {
  const frame = useRef(null);
  const inner = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !frame.current || !inner.current) return undefined;
    // Full drift on larger screens; a gentler drift on phones to keep scrolling light.
    const mm = gsap.matchMedia();
    const drift = (amount) =>
      gsap.fromTo(
        inner.current,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    mm.add('(min-width: 768px)', () => drift(range));
    mm.add('(max-width: 767px)', () => drift(range * 0.5));
    return () => mm.revert();
  }, [reduced, range]);

  return (
    <div ref={frame} className={`parallax ${className}`.trim()} style={{ aspectRatio: ratio }}>
      <div ref={inner} className="parallax__inner">
        <MediaFrame src={src} alt={alt} ratio="auto" label={label} />
      </div>
    </div>
  );
}
