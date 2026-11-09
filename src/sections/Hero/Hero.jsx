import { useLayoutEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { resort } from '../../data/resort';
import { assets } from '../../data/assets';
import { hero } from '../../data/content';
import Button from '../../components/ui/Button';
import './Hero.css';

// Abstract layered-hills backdrop, shown until a real hero photograph or video is added to assets.js.
// It is a deliberate piece of design, not a picture of the resort, so it carries no visible label.
// Set assets.hero.poster (and optionally assets.hero.video) and it is replaced automatically.
function HeroBackdrop() {
  return (
    <div className="hero__backdrop">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" focusable="false">
        <path
          className="hero__hill"
          data-depth="3"
          fill="#2f4a3a"
          opacity="0.55"
          d="M0 560C200 480 360 520 560 470s420-90 640-30 300 40 400 10V900H0z"
        />
        <path
          className="hero__hill"
          data-depth="6"
          fill="#243a2d"
          opacity="0.8"
          d="M0 650C180 590 380 640 600 590s440-80 660-20 260 30 340 0V900H0z"
        />
        <path
          className="hero__hill"
          data-depth="10"
          fill="#18271f"
          d="M0 740C220 690 420 730 660 690s460-60 680-10 190 20 260 0V900H0z"
        />
      </svg>
    </div>
  );
}

export default function Hero({ ready = true }) {
  const root = useRef(null);
  const media = useRef(null);
  const zoom = useRef(null);
  const reduced = useReducedMotion();
  const { video, poster } = assets.hero || {};

  useLayoutEffect(() => {
    if (reduced) return undefined;
    let mm;
    const ctx = gsap.context(() => {
      if (ready) {
        const tl = gsap.timeline({ delay: 0.25 });
        tl.from('.hero__line > span', { yPercent: 110, duration: 1.4, stagger: 0.14 }, 0)
          .from('.hero__fade', { opacity: 0, y: 20, duration: 1.1, stagger: 0.1 }, 0.5)
          .from(zoom.current, { scale: 1.14, duration: 2.8, ease: 'expo.out' }, 0);
      } else {
        // Hold the content out of view while the loader is up.
        gsap.set(['.hero__line > span', '.hero__fade'], { opacity: 0 });
      }

      // Scroll-linked parallax is for larger screens with a mouse. Phones and touch tablets keep the
      // hero still while scrolling, which is smoother and cheaper on battery.
      mm = gsap.matchMedia();
      mm.add('(min-width: 768px) and (hover: hover)', () => {
        gsap.to(media.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.utils.toArray('.hero__hill').forEach((el) => {
          gsap.to(el, {
            yPercent: -Number(el.dataset.depth || 4),
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
          });
        });
      });
    }, root);
    return () => {
      if (mm) mm.revert();
      ctx.revert();
    };
  }, [reduced, ready]);

  // Hero video only plays when it is welcome: not for reduced motion, and not when the visitor has
  // asked their browser to save data. In those cases the poster image is shown instead.
  const saveData = typeof navigator !== 'undefined' && Boolean(navigator.connection && navigator.connection.saveData);
  const playVideo = Boolean(video) && !reduced && !saveData;

  return (
    <section id="top" ref={root} className="hero theme-dark" aria-label="Welcome">
      <div className="hero__media" ref={media} aria-hidden="true">
        <div className="hero__zoom" ref={zoom}>
          {playVideo ? (
            <video autoPlay muted loop playsInline preload="metadata" poster={poster} aria-hidden="true" tabIndex={-1}>
              <source src={video} type="video/mp4" />
            </video>
          ) : poster ? (
            <img src={poster} alt="" decoding="async" loading="eager" {...{ fetchpriority: 'high' }} />
          ) : (
            <HeroBackdrop />
          )}
        </div>
      </div>
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />

      <div className="container hero__inner">
        <p className="eyebrow hero__fade hero__brand">
          {resort.name} {resort.endorsement}
        </p>
        <h1 className="display hero__title">
          {hero.lines.map((line, i) => (
            <span className="hero__line" key={line}>
              <span>{i === hero.lines.length - 1 ? <em>{line}</em> : line}</span>
            </span>
          ))}
        </h1>
        <p className="lede hero__fade hero__support">{hero.support}</p>
        <div className="hero__actions hero__fade">
          <Button href={hero.primary.href} variant="light">
            {hero.primary.label}
          </Button>
          <Button href={hero.secondary.href} variant="ghost">
            {hero.secondary.label}
          </Button>
        </div>
      </div>

      <div className="container hero__foot hero__fade">
        <p className="hero__place">
          <MapPin size={16} strokeWidth={1.5} aria-hidden="true" />
          <span>{hero.location}</span>
        </p>
        <a href="#story" className="hero__cue" aria-label="Scroll to our story">
          <span className="hero__cue-label">Scroll</span>
          <span className="hero__cue-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
