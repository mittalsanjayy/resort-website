import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { gsap } from '../../lib/gsap';
import { assets } from '../../data/assets';
import { ease } from '../../lib/motion';
import './Loader.css';

const MAX_WAIT_MS = 3500;

// Opening loader. The bar eases to ~85% on a fixed timeline, then completes once fonts and the
// window load event are in (or after MAX_WAIT_MS). It never waits longer than it must.
// Counter and bar are written straight to the DOM, so progress causes no React re-renders.
export default function Loader({ onDone }) {
  const bar = useRef(null);
  const count = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const state = { v: 0 };
    const paint = () => {
      const v = Math.round(state.v);
      if (bar.current) bar.current.style.transform = `scaleX(${state.v / 100})`;
      if (count.current) count.current.textContent = String(v).padStart(3, '0');
    };

    let cancelled = false;
    let timelineDone = false;
    let assetsReady = false;
    let finishing = false;

    const finish = () => {
      if (cancelled || finishing || !timelineDone || !assetsReady) return;
      finishing = true;
      gsap.to(state, {
        v: 100,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: paint,
        onComplete: () => {
          if (cancelled) return;
          root.style.overflow = '';
          window.setTimeout(() => !cancelled && onDone(), 250);
        },
      });
    };

    const first = gsap.to(state, {
      v: 85,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: paint,
      onComplete: () => {
        timelineDone = true;
        finish();
      },
    });

    const pageLoaded = new Promise((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve, { once: true });
    });
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const timeout = new Promise((resolve) => window.setTimeout(resolve, MAX_WAIT_MS));

    Promise.race([Promise.all([pageLoaded, fontsReady]), timeout]).then(() => {
      assetsReady = true;
      finish();
    });

    return () => {
      cancelled = true;
      first.kill();
      gsap.killTweensOf(state);
      root.style.overflow = '';
    };
  }, [onDone]);

  return (
    <motion.div
      className="loader theme-dark"
      role="status"
      aria-live="polite"
      aria-label="Loading Oxy Village Resort"
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.9, ease: ease.inOut }}
    >
      <motion.div
        className="loader__inner"
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.5, ease: ease.out }}
      >
        <motion.img
          className="loader__logo"
          src={assets.brand.logo}
          alt=""
          width="384"
          height="384"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: ease.out }}
        />
        <div className="loader__meter" aria-hidden="true">
          <span className="loader__track">
            <span className="loader__bar" ref={bar} />
          </span>
          <span className="loader__count" ref={count}>
            000
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
