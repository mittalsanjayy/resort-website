import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { contactLinks } from '../../lib/contact';
import './FloatingContact.css';

// A small always-reachable WhatsApp button. It appears after the hero and steps aside while the
// visitor is looking at the enquiry form (which has its own WhatsApp button).
export default function FloatingContact() {
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [overForm, setOverForm] = useState(false);
  const link = contactLinks().whatsapp;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById('enquiry');
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => setOverForm(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!link) return null;
  const visible = scrolled && !overForm;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          key="fab"
          className="fab"
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with the resort on WhatsApp (opens in a new tab)"
          initial={reduced ? false : { opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={22} strokeWidth={1.5} aria-hidden="true" />
          <span className="fab__label">WhatsApp</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
