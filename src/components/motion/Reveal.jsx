import { motion } from 'motion/react';
import { ease, duration } from '../../lib/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function Reveal({ as = 'div', delay = 0, y = 24, children, ...rest }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  return (
    <Tag
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: duration.reveal, ease: ease.out, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
