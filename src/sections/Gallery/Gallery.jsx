import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import Reveal from '../../components/motion/Reveal';
import SplitText from '../../components/motion/SplitText';
import ScrubText from '../../components/motion/ScrubText';
import ParallaxMedia from '../../components/motion/ParallaxMedia';
import CursorLabel from '../../components/motion/CursorLabel';
import Lightbox from '../../components/ui/Lightbox';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { ease } from '../../lib/motion';
import { useSectionTransition } from '../../hooks/useSectionTransition';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { assets } from '../../data/assets';
import { imageProps } from '../../lib/images';
import { gallery } from '../../data/content';
import './Gallery.css';

const labelOf = (id) => (gallery.categories.find((c) => c.id === id) || { label: id }).label;

// Builds the working list. Real photographs come from assets.gallery. While that is empty the
// section uses clearly labelled placeholder frames; nothing here is presented as a real photograph.
function buildItems() {
  const photos = assets.gallery || [];
  if (photos.length > 0) {
    return photos.map((g, i) => ({
      id: `p-${i}-${g.src}`,
      src: g.src,
      alt: g.alt || '',
      caption: g.caption || '',
      ratio: g.ratio || '4 / 5',
      category: g.category || 'resort',
      categoryLabel: labelOf(g.category || 'resort'),
      label: `${labelOf(g.category || 'resort')} photograph`,
      real: true,
    }));
  }
  return gallery.placeholders.map((p, i) => ({
    id: `ph-${i}`,
    src: null,
    alt: '',
    caption: '',
    ratio: p.ratio,
    category: p.category,
    categoryLabel: labelOf(p.category),
    label: `${labelOf(p.category)}: photograph to be added`,
    real: false,
  }));
}

// One filtered view of the grid. Tiles open with a staggered mask reveal as they scroll into view.
function GalleryGrid({ items, onOpen }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !ref.current) return undefined;
    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray('.gal__tile');
      gsap.set(tiles, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set('.gal__tile .gal__frame', { scale: 1.2 });
      ScrollTrigger.batch(tiles, {
        start: 'top 92%',
        once: true,
        batchMax: 4,
        interval: 0.1,
        onEnter: (batch) => {
          gsap.to(batch, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            ease: 'expo.inOut',
            stagger: 0.12,
            overwrite: true,
          });
          gsap.to(
            batch.map((t) => t.querySelector('.gal__frame')),
            { scale: 1, duration: 1.8, ease: 'expo.out', stagger: 0.12, overwrite: true }
          );
        },
      });
    }, ref);
    // Filtering changes the page height, so measurements are refreshed once the grid is in place.
    const raf = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [reduced, items]);

  return (
    <ul ref={ref} className="gal__grid" style={{ '--gal-cols': items.length <= 2 ? items.length : items.length <= 4 ? 2 : 3 }}>
      {items.map((g, i) => (
        <li key={g.id} className="gal__item">
          <button
            type="button"
            className="gal__tile"
            data-cursor
            onClick={() => onOpen(i)}
            aria-label={`Open ${g.categoryLabel} photograph ${i + 1} of ${items.length}${g.real ? (g.alt ? `: ${g.alt}` : '') : ' (placeholder)'}`}
            aria-haspopup="dialog"
          >
            <span className="gal__frame">
              {g.src ? (
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  decoding="async"
                  style={{ aspectRatio: g.ratio }}
                  {...imageProps(g.src, '(max-width: 899px) 50vw, 33vw')}
                />
              ) : (
                <span className="gal__ph" style={{ aspectRatio: g.ratio }}>
                  <span>{g.label}</span>
                </span>
              )}
            </span>
            <span className="gal__shade" aria-hidden="true" />
            <span className="gal__meta" aria-hidden="true">
              <span className="gal__cat">{g.categoryLabel}</span>
              <span className="gal__plus">
                <Plus size={16} strokeWidth={1.25} />
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function Gallery() {
  const sectionRef = useRef(null);
  const gridWrapRef = useRef(null);
  const all = useMemo(buildItems, []);
  const hasPhotos = all.some((g) => g.real);
  useSectionTransition(sectionRef);

  // Only offer categories that have something in them.
  const tabs = useMemo(
    () =>
      gallery.categories
        .map((c) => ({ ...c, count: c.id === 'all' ? all.length : all.filter((g) => g.category === c.id).length }))
        .filter((c) => c.count > 0),
    [all]
  );

  const [category, setCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState(null);
  const visible = useMemo(() => (category === 'all' ? all : all.filter((g) => g.category === category)), [all, category]);

  // Feature frame: the first real photograph if one exists, otherwise a labelled placeholder.
  const lead = all.find((g) => g.real);

  return (
    <section id="gallery" ref={sectionRef} className="section theme-dark gal" aria-labelledby="gal-title">
      <div className="container gal__head-wrap">
        <header className="gal__head">
          <Reveal as="p" className="eyebrow eyebrow--line">
            {gallery.eyebrow}
          </Reveal>
          <SplitText as="h2" id="gal-title" className="display gal__title" text={gallery.title} />
          <Reveal as="p" className="lede" delay={0.15}>
            {gallery.intro}
          </Reveal>
        </header>
      </div>

      <div className="gal__feature">
        <ParallaxMedia
          className="gal__feature-media"
          src={lead ? lead.src : null}
          alt={lead ? lead.alt : ''}
          ratio={gallery.feature.ratio}
          label={gallery.feature.label}
          range={7}
        />
        <div className="gal__feature-shade" aria-hidden="true" />
        <p className="gal__feature-tag eyebrow">{lead ? lead.categoryLabel : labelOf(gallery.feature.category)}</p>
      </div>

      {!hasPhotos && (
        <div className="container">
          <Reveal as="p" className="gal__note">
            {gallery.placeholderNote}
          </Reveal>
        </div>
      )}

      <div className="container container--wide gal__body">
        <div className="gal__filters" role="group" aria-label="Filter photographs by category">
          {tabs.map((c) => {
            const active = c.id === category;
            return (
              <button
                key={c.id}
                type="button"
                className="gal__filter"
                aria-pressed={active}
                onClick={() => {
                  setCategory(c.id);
                  setOpenIndex(null);
                }}
              >
                {active && <motion.span layoutId="gal-pill" className="gal__pill" transition={{ duration: 0.6, ease: ease.out }} />}
                <span className="gal__filter-label">{c.label}</span>
                <sup className="gal__count">{c.count}</sup>
              </button>
            );
          })}
        </div>

        <div ref={gridWrapRef} className="gal__stage">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: ease.out }}
            >
              <GalleryGrid items={visible} onOpen={setOpenIndex} />
            </motion.div>
          </AnimatePresence>
          <CursorLabel targetRef={gridWrapRef} label="View" />
        </div>

        <ScrubText
          className="gal__statement"
          text="Some places are remembered in small moments."
        />
      </div>

      <Lightbox
        items={visible}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
        copy={gallery.lightbox}
      />
    </section>
  );
}
