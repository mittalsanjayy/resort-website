// Shared motion tokens. Keep in sync with src/styles/tokens.css.
// Motion for React uses the cubic-bezier arrays; GSAP uses the named eases.
export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  soft: [0.25, 0.1, 0.25, 1],
};

export const gsapEase = {
  out: 'expo.out',
  inOut: 'expo.inOut',
  soft: 'power2.out',
};

export const duration = {
  micro: 0.2,
  ui: 0.5,
  reveal: 0.9,
  scene: 1.4,
  slow: 1.8,
};

export const stagger = {
  text: 0.06,
  cards: 0.12,
  list: 0.08,
};

export const distance = {
  reveal: 24,
  parallax: 8, // percent of the image height, each direction
  hover: 6,
};

export const scroll = {
  start: 'top 85%',
  startLate: 'top 70%',
};
