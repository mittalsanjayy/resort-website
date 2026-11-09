import { useId, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { ease } from '../../lib/motion';
import { useDialog } from '../../hooks/useDialog';

export default function Modal({ open, onClose, title, children }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useDialog({ open, onClose, dialogRef, initialFocusRef: closeRef });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: ease.out }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-lenis-prevent
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.6, ease: ease.out }}
            onClick={(e) => e.stopPropagation()}
          >
            <button ref={closeRef} type="button" className="modal__close" aria-label="Close dialog" onClick={onClose}>
              <X size={22} strokeWidth={1.25} aria-hidden="true" />
            </button>
            <h2 id={titleId} className="h3 modal__title">
              {title}
            </h2>
            <div className="modal__body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
