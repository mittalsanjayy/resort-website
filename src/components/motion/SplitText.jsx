import { createElement, Fragment, useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { duration, gsapEase, scroll, stagger } from '../../lib/motion';

// Wrap words in *asterisks* to set them in italic: "Quiet luxury, *in motion*"
function parse(text) {
  const words = [];
  text.split('*').forEach((segment, i) => {
    // Only text that directly follows a closing asterisk ("*word*," ) sticks to the italic word.
    // The italic segment itself (odd index) is a new word and keeps its leading space.
    const glue = i > 0 && i % 2 === 0 && segment.length > 0 && !/^\s/.test(segment);
    segment
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w, j) => {
        words.push({ w, em: i % 2 === 1, glue: glue && j === 0 && words.length > 0 });
      });
  });
  return words;
}

export default function SplitText({ as = 'h2', text, className = '', delay = 0, onScroll = true, ...rest }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const words = parse(text);
  const plain = text.replace(/\*/g, '');

  useLayoutEffect(() => {
    if (reduced || !ref.current) return undefined;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const inners = el.querySelectorAll('.split__inner');
      gsap.set(inners, { yPercent: 115 });
      gsap.to(inners, {
        yPercent: 0,
        duration: duration.scene,
        ease: gsapEase.out,
        stagger: stagger.text,
        delay,
        scrollTrigger: onScroll ? { trigger: el, start: scroll.start, once: true } : undefined,
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced, text, delay, onScroll]);

  return createElement(
    as,
    { ref, className: `split ${className}`.trim(), 'aria-label': plain, ...rest },
    words.map((item, i) => (
      <Fragment key={`${item.w}-${i}`}>
        {i > 0 && !item.glue ? ' ' : null}
        <span className="split__word" aria-hidden="true">
          <span className="split__inner">{item.em ? <em>{item.w}</em> : item.w}</span>
        </span>
      </Fragment>
    ))
  );
}
