import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ease } from '../../lib/motion';
import { useDialog } from '../../hooks/useDialog';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { imageProps } from '../../lib/images';
import './Lightbox.css';

const SWIPE = 70;

// Full-screen photograph viewer. Items: { id, src, alt, label, categoryLabel, ratio }.
// Items without a src show their labelled placeholder, so the viewer works before photos exist.
export default function Lightbox({ items, index, onClose, onIndexChange, copy }) {
  const open = index !== null && index >= 0 && items.length > 0;
  const reduced = useReducedMotion();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [dir, setDir] = useState(1);

  useDialog({ open, onClose, dialogRef, initialFocusRef: closeRef });

  const go = useCallback(
    (step) => {
      if (!open) return;
      setDir(step);
      onIndexChange((index + step + items.length) % items.length);
    },
    [open, index, items.length, onIndexChange]
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go]);

  // Warm the cache for the neighbouring photographs.
  useEffect(() => {
    if (!open) return;
    [1, -1].forEach((s) => {
      const n = items[(index + s + items.length) % items.length];
      if (n && n.src) {
        const img = new Image();
        img.src = n.src;
      }
    });
  }, [open, index, items]);

  const item = open ? items[index] : null;
  const shift = reduced ? 0 : 60;

  const node = (
    <AnimatePresence>
      {open && item && (
        <motion.div
          key="lightbox"
          ref={dialogRef}
          className="lb theme-dark"
          role="dialog"
          aria-modal="true"
          aria-label="Photograph gallery"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: ease.out }}
        >
          <button type="button" className="lb__backdrop" tabIndex={-1} aria-hidden="true" onClick={onClose} />

          <div className="lb__top">
            <p className="lb__count" aria-live="polite">
              <span>{String(index + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')}
            </p>
            <button ref={closeRef} type="button" className="lb__btn" aria-label={copy.close} onClick={onClose}>
              <X size={22} strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>

          <div className="lb__stage">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.figure
                key={item.id}
                className="lb__figure"
                custom={dir}
                variants={{
                  enter: (d) => ({ opacity: 0, x: d * shift }),
                  center: { opacity: 1, x: 0 },
                  exit: (d) => ({ opacity: 0, x: d * -shift }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: ease.out }}
                drag={reduced ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE) go(1);
                  else if (info.offset.x > SWIPE) go(-1);
                }}
              >
                {item.src ? (
                  <img src={item.src} alt={item.alt} draggable="false" className="lb__img" decoding="async" {...imageProps(item.src, '100vw')} />
                ) : (
                  <div
                    className="lb__empty"
                    role="img"
                    aria-label={item.label}
                    style={{ aspectRatio: item.ratio }}
                  >
                    <span>{item.label}</span>
                  </div>
                )}
                <figcaption className="lb__caption">
                  <span className="lb__cat">{item.categoryLabel}</span>
                  {item.src && item.caption ? <span>{item.caption}</span> : null}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {items.length > 1 && (
            <>
              <button type="button" className="lb__btn lb__nav lb__nav--prev" aria-label={copy.prev} onClick={() => go(-1)}>
                <ChevronLeft size={26} strokeWidth={1.25} aria-hidden="true" />
              </button>
              <button type="button" className="lb__btn lb__nav lb__nav--next" aria-label={copy.next} onClick={() => go(1)}>
                <ChevronRight size={26} strokeWidth={1.25} aria-hidden="true" />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(node, document.body);
}
