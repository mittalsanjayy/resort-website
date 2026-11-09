import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { resort } from '../../data/resort';
import { assets } from '../../data/assets';
import { getLenis, scrollToTarget, setHash } from '../../lib/lenis';
import { ease } from '../../lib/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import Button from '../ui/Button';
import './Header.css';

export default function Header({ links, cta, ready = true }) {
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const closeRef = useRef(null);
  const overlayRef = useRef(null);
  const burgerRef = useRef(null);
  const progressRef = useRef(null);

  // Scroll state: solid background, hide on scroll down, reveal on scroll up, progress hairline.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        setHidden(!reduced && y > 500 && delta > 0);
        lastY = y;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  // Active section indicator.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const targets = [...new Set(['#top', ...links.map((l) => l.href)])]
      .map((h) => document.querySelector(h))
      .filter(Boolean);
    if (!targets.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id === 'top' ? '' : `#${entry.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [links]);

  // Closing the menu always hands keyboard focus back to the button that opened it.
  const closeMenu = () => {
    setOpen(false);
    if (burgerRef.current) burgerRef.current.focus();
  };

  // Menu overlay: pause smooth scroll, lock page, close on Escape.
  useEffect(() => {
    if (!open) return undefined;
    const lenis = getLenis();
    if (lenis) lenis.stop();
    document.documentElement.style.overflow = 'hidden';
    if (closeRef.current) closeRef.current.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      // Keep keyboard focus inside the open menu.
      if (e.key !== 'Tab' || !overlayRef.current) return;
      const items = overlayRef.current.querySelectorAll('a[href], button:not([disabled])');
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
    };
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    setHash(href);
    window.setTimeout(() => scrollToTarget(href, { focus: true }), 150);
  };

  const logo = assets.brand && (assets.brand.logoSmall || assets.brand.logo);

  return (
    <>
      <header
        className={`header ${scrolled ? 'header--scrolled' : ''} ${hidden && !open ? 'header--hidden' : ''} ${ready ? '' : 'header--pre'}`}
        onFocus={() => setHidden(false)}
        /* While the loader is up the bar is off-screen, so it must not be reachable with Tab either. */
        {...(!ready ? { inert: '' } : {})}
      >
        <div className="container header__inner">
          <a
            href="#top"
            className="brand"
            onClick={(e) => go(e, '#top')}
            aria-label={`${resort.name} ${resort.endorsement}, back to top`}
          >
            {logo ? (
              <img src={logo} alt="" className="brand__logo" width="192" height="192" decoding="async" {...{ fetchpriority: 'high' }} />
            ) : (
              <>
                <span className="brand__name">OXY VILLAGE</span>
                <span className="brand__sub">Resort · {resort.endorsement}</span>
              </>
            )}
          </a>

          <nav className="header__nav" aria-label="Primary">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={(active || '#top') === l.href ? 'true' : undefined}
                onClick={(e) => go(e, l.href)}
              >
                <span className="navlink" data-label={l.label}>
                  <span className="navlink__text">{l.label}</span>
                </span>
              </a>
            ))}
          </nav>

          <div className="header__actions">
            <span className="header__cta">
              <Button href={cta.href} size="sm" variant={scrolled ? 'solid' : 'light'} onClick={(e) => go(e, cta.href)}>
                {cta.label}
              </Button>
            </span>
            <button
              ref={burgerRef}
              type="button"
              className="header__burger"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="menu-overlay"
              onClick={() => setOpen(true)}
            >
              <Menu size={26} strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="header__progress" ref={progressRef} aria-hidden="true" />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-overlay"
            ref={overlayRef}
            className="overlay theme-dark"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-lenis-prevent
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: ease.inOut }}
          >
            <div className="container overlay__inner">
              <button
                ref={closeRef}
                type="button"
                className="overlay__close"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <X size={28} strokeWidth={1.25} aria-hidden="true" />
              </button>
              <nav aria-label="Menu">
                <ul className="overlay__list">
                  {links.map((l, i) => (
                    <li key={l.href} className="overlay__item">
                      <motion.div
                        initial={reduced ? false : { y: '110%' }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.3 + i * 0.07, duration: 0.9, ease: ease.out }}
                      >
                        <a href={l.href} onClick={(e) => go(e, l.href)}>
                          <span className="overlay__num" aria-hidden="true">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="overlay__label">{l.label}</span>
                        </a>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </nav>
              <motion.div
                className="overlay__cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + links.length * 0.07, duration: 0.8, ease: ease.out }}
              >
                <Button href={cta.href} variant="light" onClick={(e) => go(e, cta.href)}>
                  {cta.label}
                </Button>
              </motion.div>
              <p className="overlay__foot eyebrow">
                {resort.location.area}, {resort.location.city}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
