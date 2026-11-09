import Reveal from '../../components/motion/Reveal';
import MaskImage from '../../components/motion/MaskImage';
import ParallaxMedia from '../../components/motion/ParallaxMedia';
import Button from '../../components/ui/Button';
import EnquireButton from '../../components/ui/EnquireButton';
import { stay } from '../../data/content';

const PREVIEW = 4;
const RATIO = { feature: '4 / 3', wide: '16 / 9', standard: '4 / 5' };

// layout: 'feature' (full-width, image and text side by side), 'standard' (staggered pair) or 'wide'.
export default function StayCard({ item, number, layout, onOpen }) {
  const Media = layout === 'feature' ? ParallaxMedia : MaskImage;
  const photo = (item.images && item.images[0]) || null;
  const src = photo ? photo.src : item.image;
  const preview = item.details.slice(0, PREVIEW);
  const more = item.details.length - preview.length;
  const nameId = `stay-${item.id}`;

  return (
    <Reveal as="article" className={`stay-card stay-card--${layout}`} aria-labelledby={nameId}>
      {/* The image is a mouse convenience. Keyboard and screen-reader users use the View Details button. */}
      <div className="stay-card__media" onClick={() => onOpen(item.id)}>
        <Media
          src={src}
          alt={photo ? photo.alt || item.name : ''}
          ratio={RATIO[layout]}
          label={`${item.name}: ${stay.photoLabel.toLowerCase()}`}
        />
        <span className="stay-card__view" aria-hidden="true">
          View
        </span>
        {item.enquiryOnly && <span className="stay-card__badge">{stay.enquiryOnlyLabel}</span>}
      </div>

      <div className="stay-card__body">
        <p className="eyebrow stay-card__kind">
          <span aria-hidden="true">{String(number).padStart(2, '0')}</span> {item.kind}
        </p>
        <h3 id={nameId} className="h1 stay-card__name">
          {item.name}
        </h3>
        <p className="stay-card__summary">{item.summary}</p>

        {preview.length > 0 && (
          <ul className="stay-card__amenities" aria-label="Amenities">
            {preview.map((d) => (
              <li key={d}>{d}</li>
            ))}
            {more > 0 && <li className="stay-card__more">+ {more} more in details</li>}
          </ul>
        )}

        <p className="stay-card__price">
          {item.price ? (
            <>
              <span className="stay-card__price-label">{stay.priceLabel}</span>
              <span className="stay-card__price-value">{item.price}</span>
            </>
          ) : (
            <span className="stay-card__price-value stay-card__price-value--ask">{stay.enquiryOnlyPrice}</span>
          )}
        </p>

        <div className="stay-card__actions">
          <Button variant="primary" onClick={() => onOpen(item.id)} aria-haspopup="dialog">
            View Details
            <span className="visually-hidden">: {item.name}</span>
          </Button>
          <EnquireButton interest={item.name} variant="solid">
            Enquire Now
            <span className="visually-hidden">: {item.name}</span>
          </EnquireButton>
        </div>
      </div>
    </Reveal>
  );
}
