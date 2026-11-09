import { useLayoutEffect } from 'react';
import { gsap } from '../lib/gsap';

// Elegant section entrance: on desktop the section opens from a slightly inset, softly rounded
// card to full width as it scrolls into place. Skipped on touch screens (phones and tablets) and for
// reduced-motion visitors. The clip-path is removed once it finishes so it costs nothing afterwards.
export function useSectionTransition(ref, { inset = '3.5vw', radius = '2.5rem' } = {}) {
  useLayoutEffect(() => {
    if (!ref.current) return undefined;
    const el = ref.current;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (hover: hover) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        el,
        { clipPath: `inset(0px ${inset} 0px ${inset} round ${radius} ${radius} 0px 0px)` },
        {
          clipPath: 'inset(0px 0vw 0px 0vw round 0rem 0rem 0px 0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            end: 'top 30%',
            scrub: true,
            onLeave: () => gsap.set(el, { clearProps: 'clipPath' }),
          },
        }
      );
    });
    return () => mm.revert();
  }, [ref, inset, radius]);
}
