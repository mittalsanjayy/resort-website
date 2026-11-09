import { imageProps } from '../../lib/images';

// `priority` is for the first image on screen: it loads at once instead of lazily.
// `sizes` tells the browser how wide the picture is shown, so phones pick the small copy.
export default function MediaFrame({
  src,
  alt = '',
  ratio = '4 / 5',
  label = 'Photograph to be added',
  className = '',
  sizes,
  priority = false,
}) {
  return (
    <div className={`media ${className}`} style={{ aspectRatio: ratio }}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchpriority: 'high' } : {})}
          {...imageProps(src, sizes)}
        />
      ) : (
        <div className="media__empty" role="img" aria-label={label}>
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}
