import { useEffect, useRef } from 'react';
import { getLenis } from '../lib/lenis';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Shared behaviour for modal surfaces: pause smooth scroll, lock the page, focus the close button,
// trap Tab inside the dialog, close on Escape and return focus to whatever opened it.
// onClose is read through a ref so a new function identity never re-runs the effect.
export function useDialog({ open, onClose, dialogRef, initialFocusRef }) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const lenis = getLenis();
    if (lenis) lenis.stop();
    document.documentElement.style.overflow = 'hidden';
    if (initialFocusRef && initialFocusRef.current) initialFocusRef.current.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = dialogRef.current.querySelectorAll(FOCUSABLE);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      if (lenis) lenis.start();
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open, dialogRef, initialFocusRef]);
}
