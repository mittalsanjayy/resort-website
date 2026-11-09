import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

// A small round label that follows a fine pointer while it is over `targetRef`
// (for example "View" over gallery photographs). Not rendered for touch or reduced motion.
export default function CursorLabel({ targetRef, label = 'View' }) {
  const dot = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    const node = dot.current;
    if (!target || !node) return undefined;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!fine.matches) return undefined;

    gsap.set(node, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
    const moveX = gsap.quickTo(node, 'x', { duration: 0.45, ease: 'power3.out' });
    const moveY = gsap.quickTo(node, 'y', { duration: 0.45, ease: 'power3.out' });

    const onMove = (e) => {
      moveX(e.clientX);
      moveY(e.clientY);
    };
    const onOver = (e) => {
      if (e.target.closest('[data-cursor]')) gsap.to(node, { scale: 1, opacity: 1, duration: 0.4, ease: 'expo.out' });
    };
    const onOut = (e) => {
      if (e.target.closest('[data-cursor]') && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-cursor]'))) {
        gsap.to(node, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.out' });
      }
    };
    const onLeave = () => gsap.to(node, { scale: 0, opacity: 0, duration: 0.3 });

    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerover', onOver);
    target.addEventListener('pointerout', onOut);
    target.addEventListener('pointerleave', onLeave);
    return () => {
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerover', onOver);
      target.removeEventListener('pointerout', onOut);
      target.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(node);
    };
  }, [targetRef]);

  return (
    <span ref={dot} className="cursor-label" aria-hidden="true">
      {label}
    </span>
  );
}
