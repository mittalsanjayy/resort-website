import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

/**
 * Variants: primary | light | solid | solid-light | ghost
 * Sizes: sm | md | lg
 * Pass href for a link, otherwise a button is rendered.
 */
export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  icon = true,
  iconNode = null,
  className = '',
  children,
  ...rest
}) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim();
  const content = (
    <>
      <span>{children}</span>
      {icon && (iconNode || <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />)}
    </>
  );
  const press = { whileTap: { scale: 0.975 }, transition: { duration: 0.2 } };

  return href ? (
    <motion.a className={classes} href={href} {...press} {...rest}>
      {content}
    </motion.a>
  ) : (
    <motion.button className={classes} type="button" {...press} {...rest}>
      {content}
    </motion.button>
  );
}
