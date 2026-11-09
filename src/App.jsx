import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ScrollTrigger } from './lib/gsap';
import { useLenis } from './hooks/useLenis';
import { useReducedMotion } from './hooks/useReducedMotion';
import { handleAnchorClick } from './lib/lenis';
import { bookNow, navLinks } from './data/nav';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Loader from './components/layout/Loader';
import FloatingContact from './components/layout/FloatingContact';
import Hero from './sections/Hero/Hero';
import Story from './sections/Story/Story';
import Experiences from './sections/Experiences/Experiences';
import Activities from './sections/Activities/Activities';
import Highlights from './sections/Highlights/Highlights';
import Stay from './sections/Stay/Stay';
import Packages from './sections/Packages/Packages';
import StayDining from './sections/StayDining/StayDining';
import Gallery from './sections/Gallery/Gallery';
import Location from './sections/Location/Location';
import Enquiry from './sections/Enquiry/Enquiry';

// The design system reference page loads only when requested: /?design-system
const DesignSystem = lazy(() => import('./pages/DesignSystem'));
const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
const showDesignSystem = params.has('design-system');

const LOADER_KEY = 'oxy-loader-seen';

// The loader plays once per browser session, never for reduced-motion visitors,
// and can be forced for testing with /?loader
function shouldShowLoader() {
  if (typeof window === 'undefined' || showDesignSystem) return false;
  if (params.has('loader')) return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return window.sessionStorage.getItem(LOADER_KEY) !== '1';
  } catch {
    return true;
  }
}

export default function App() {
  const reduced = useReducedMotion();
  const [loading, setLoading] = useState(shouldShowLoader);
  useLenis(!reduced && !loading);

  const handleLoaded = useCallback(() => {
    try {
      window.sessionStorage.setItem(LOADER_KEY, '1');
    } catch {
      /* storage unavailable: the loader simply plays again next visit */
    }
    setLoading(false);
  }, []);

  // Every in-page link (#story, #stay ...) scrolls through one shared handler.
  useEffect(() => {
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Web fonts change text height after first paint; re-measure scroll triggers once they load.
  useEffect(() => {
    let active = true;
    document.fonts?.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });
    return () => {
      active = false;
    };
  }, []);

  if (showDesignSystem) {
    return (
      <Suspense fallback={null}>
        <DesignSystem />
      </Suspense>
    );
  }

  return (
    <>
      <AnimatePresence>{loading && <Loader key="loader" onDone={handleLoaded} />}</AnimatePresence>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header links={navLinks} cta={bookNow} ready={!loading} />
      <main id="main" tabIndex={-1}>
        <Hero ready={!loading} />
        <Story />
        <Experiences />
        <Activities />
        <Highlights />
        <Stay />
        <Packages />
        <StayDining />
        <Gallery />
        <Location />
        <Enquiry />
      </main>
      <Footer />
      {!loading && <FloatingContact />}
    </>
  );
}
