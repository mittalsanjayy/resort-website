// Holds the active Lenis instance so other components can pause or drive scrolling.
let instance = null;

export function setLenis(lenis) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Moves keyboard and screen-reader focus to the section that was jumped to, without scrolling again.
// Sections are not controls, so they are given tabindex="-1" (and no focus ring, see base.css).
function focusTarget(el) {
  if (!el) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

// Keeps the address bar in step with an in-page jump without triggering the browser's own jump.
// "#top" clears the hash so the home link leaves a clean URL.
export function setHash(hash) {
  if (!window.history || !window.history.replaceState) return;
  const url = hash === '#top' ? window.location.pathname + window.location.search : hash;
  window.history.replaceState(null, '', url);
}

// Smooth-scrolls to an element by hash ('#stay'). Reduced-motion visitors jump instantly.
// With { focus: true } focus follows once the scroll has finished.
export function scrollToTarget(hash, { focus = false } = {}) {
  if (!hash || hash === '#') return;
  let el = null;
  try {
    el = document.querySelector(hash);
  } catch {
    el = null;
  }
  if (!el) return;
  const done = () => {
    if (focus) focusTarget(el);
  };
  if (prefersReducedMotion()) {
    el.scrollIntoView({ behavior: 'auto' });
    done();
  } else if (instance) {
    instance.scrollTo(el, { onComplete: done });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(done, 700);
  }
}

// One delegated click handler for every in-page link (#story, #stay, #enquiry ...).
// It replaces the library's own anchor hijacking, so the same code path runs with and without
// smooth scrolling and honours prefers-reduced-motion. Links that already handle their own click
// (the header, Enquire buttons) call preventDefault first and are skipped here.
export function handleAnchorClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest('a[href^="#"]');
  if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
  const hash = a.getAttribute('href');
  if (!hash || hash === '#') return;
  let el = null;
  try {
    el = document.querySelector(hash);
  } catch {
    el = null;
  }
  if (!el) return;
  e.preventDefault();
  scrollToTarget(hash, { focus: true });
  setHash(hash);
}
