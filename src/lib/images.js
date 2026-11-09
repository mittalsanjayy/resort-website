// Responsive image helper. Looks a photograph up in `imageVariants` (src/data/assets.js) and returns
// the extra attributes an <img> needs: srcSet, sizes, and the intrinsic width / height.
// For a photograph with no entry it returns an empty object, so the <img> works exactly as before.
import { imageVariants } from '../data/assets';

export function imageProps(src, sizes = '(max-width: 767px) 100vw, 50vw') {
  const v = src ? imageVariants[src] : null;
  if (!v) return {};
  return {
    srcSet: `${v.small} ${v.smallWidth}w, ${src} ${v.width}w`,
    sizes,
    width: v.width,
    height: v.height,
  };
}
