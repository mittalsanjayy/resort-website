import { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { ease } from '../../lib/motion';
import { useDialog } from '../../hooks/useDialog';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './Drawer.css';

// `label` names the dialog for screen readers; `heading` is the small caption in the top bar.
// Right-hand drawer (full screen on phones). Content scrolls natively inside it.
export default function Drawer({ open, onClose, label, heading = 'Details', children }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const reduced = useReducedMotion();

  useDialog({ open, onClose, dialogRef: panelRef, initialFocusRef: closeRef });

  const slide = reduced ? { opacity: 0 } : { x: '100%' };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="drawer__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: ease.out }}
          onClick={onClose}
        >
          <motion.aside
            ref={panelRef}
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={label}
            data-lenis-prevent
            initial={slide}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={slide}
            transition={{ duration: reduced ? 0.2 : 0.75, ease: ease.inOut }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="drawer__bar">
              <p className="eyebrow drawer__label">
                {heading}
              </p>
              <button ref={closeRef} type="button" className="drawer__close" aria-label="Close details" onClick={onClose}>
                <X size={24} strokeWidth={1.25} aria-hidden="true" />
              </button>
            </header>
            <div className="drawer__scroll">{children}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
