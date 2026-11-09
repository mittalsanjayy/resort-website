import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import MediaFrame from '../../components/ui/MediaFrame';
import { ease } from '../../lib/motion';
import { stay } from '../../data/content';

const PLACEHOLDER_SLOTS = 4;

// Large main frame plus a thumbnail strip. With real photographs (item.images) the thumbnails
// switch the main image; until then every slot is a labelled placeholder.
export default function StayGallery({ item }) {
  const [index, setIndex] = useState(0);

  const slots =
    item.images && item.images.length > 0
      ? item.images.map((img) => ({ src: img.src, alt: img.alt || item.name, label: stay.photoLabel }))
      : Array.from({ length: PLACEHOLDER_SLOTS }, (_, n) => ({
          src: null,
          alt: '',
          label: `${item.name}: photograph ${n + 1} to be added`,
        }));
  const current = slots[Math.min(index, slots.length - 1)];

  return (
    <div className="gallery-d">
      <div className="gallery-d__main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: ease.out }}
          >
            <MediaFrame
              src={current.src}
              alt={current.alt}
              ratio="16 / 10"
              label={current.label}
              sizes="(max-width: 1023px) 100vw, 1024px"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {slots.length > 1 && (
        <ul className="gallery-d__thumbs" aria-label={`${item.name} photographs`}>
          {slots.map((slot, n) => (
            <li key={`${item.id}-${n}`}>
              <button
                type="button"
                className="gallery-d__thumb"
                aria-label={`Show photograph ${n + 1} of ${slots.length}`}
                aria-pressed={n === index}
                onClick={() => setIndex(n)}
              >
                <MediaFrame src={slot.src} alt="" ratio="4 / 3" label={`${n + 1}`} sizes="104px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
