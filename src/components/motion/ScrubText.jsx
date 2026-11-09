import { createElement, useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// A paragraph whose words brighten one after another as it scrolls through the viewport.
// Reduced-motion visitors, and screens below 768px, simply see the finished text.
export default function ScrubText({ as = 'p', text, className = '', ...rest }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  useLayoutEffect(() => {
    if (reduced || !ref.current) return undefined;
    const el = ref.current;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.fromTo(
        el.querySelectorAll('.scrub__word'),
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: 0.6 },
        }
      );
    });
    return () => mm.revert();
  }, [reduced, text]);

  return createElement(
    as,
    { ref, className: `scrub ${className}`.trim(), ...rest },
    words.map((w, i) => (
      <span key={`${w}-${i}`} className="scrub__word">
        {w}
        {i < words.length - 1 ? ' ' : ''}
      </span>
    ))
  );
}
