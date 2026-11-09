import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { duration, scroll } from '../../lib/motion';
import MediaFrame from '../ui/MediaFrame';

const FROM = {
  up: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
};

// Cinematic mask reveal: the frame opens as the image settles from a slight zoom.
export default function MaskImage({ src, alt = '', ratio = '4 / 5', label, direction = 'up', className = '' }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return undefined;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start: scroll.start, once: true };
      gsap.fromTo(
        el,
        { clipPath: FROM[direction] || FROM.up },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: duration.scene, ease: 'expo.inOut', scrollTrigger: trigger }
      );
      gsap.fromTo(
        el.querySelectorAll('img, .media__empty'),
        { scale: 1.18 },
        { scale: 1, duration: duration.slow, ease: 'expo.out', scrollTrigger: trigger }
      );
    }, ref);
    return () => ctx.revert();
  }, [reduced, direction]);

  return (
    <div ref={ref} className={`mask ${className}`.trim()} style={{ aspectRatio: ratio }}>
      <MediaFrame src={src} alt={alt} ratio="auto" label={label} />
    </div>
  );
}
