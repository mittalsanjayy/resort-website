// Single definition of the responsive breakpoints (min-width, px).
// CSS media queries cannot read custom properties, so the same numbers are
// repeated in CSS. Keep them identical.
export const breakpoints = {
  xs: 0, // small phones, 320-479
  sm: 480, // large phones, 480-767
  md: 768, // tablets, 768-1023
  lg: 1024, // laptops and landscape tablets, 1024-1439
  xl: 1440, // desktops, 1440-1919
  xxl: 1920, // large displays, 1920+
};

export const mq = {
  up: (key) => `(min-width: ${breakpoints[key]}px)`,
  down: (key) => `(max-width: ${breakpoints[key] - 0.02}px)`,
  reducedMotion: '(prefers-reduced-motion: reduce)',
  hover: '(hover: hover)',
};
