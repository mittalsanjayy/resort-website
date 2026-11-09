import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, MessageCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import EnquireButton from '../../components/ui/EnquireButton';
import { enquiryText, whatsappUrl } from '../../lib/enquiry';
import { ease } from '../../lib/motion';
import { stay } from '../../data/content';
import StayGallery from './StayGallery';

const rise = (i) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.25 + i * 0.07, duration: 0.8, ease: ease.out },
});

// Content of the accommodation drawer. `item` is one entry of resort.accommodations.
export default function StayDetail({ item, previous, next, onSelect, onClose }) {
  const wa = whatsappUrl(enquiryText(item.name));

  return (
    <article className="detail" key={item.id}>
      <StayGallery item={item} />

      <div className="detail__body">
        <motion.header className="detail__head" {...rise(0)}>
          <p className="eyebrow">{item.kind}</p>
          <h2 className="display detail__name">{item.name}</h2>
          <p className="lede detail__summary">{item.summary}</p>
        </motion.header>

        <div className="detail__cols">
          <motion.section {...rise(1)} aria-labelledby={`${item.id}-amenities`}>
            <h3 id={`${item.id}-amenities`} className="caps detail__sub">
              Amenities
            </h3>
            {item.details.length > 0 ? (
              <ul className="detail__list">
                {item.details.map((d) => (
                  <li key={d}>
                    <Check size={16} strokeWidth={1.5} aria-hidden="true" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="detail__text">{stay.enquiryOnlyText}</p>
            )}
          </motion.section>

          <motion.aside className="detail__price" {...rise(2)} aria-label="Price">
            <p className="caps detail__sub">{stay.priceLabel}</p>
            {item.price ? (
              <p className="detail__amount">{item.price}</p>
            ) : (
              <p className="detail__amount detail__amount--ask">{stay.enquiryOnlyPrice}</p>
            )}
            <p className="detail__text">
              {item.price ? `${stay.priceFootnote} ` : ''}
              {stay.priceNote}
            </p>
          </motion.aside>
        </div>

        <motion.div className="detail__actions" {...rise(3)}>
          <EnquireButton interest={item.name} variant="solid" size="lg" onNavigate={onClose}>
            Enquire About This Stay
          </EnquireButton>
          {wa && (
            <Button
              href={wa}
              variant="primary"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              iconNode={<MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />}
            >
              WhatsApp the resort
            </Button>
          )}
        </motion.div>

        <nav className="detail__pager" aria-label="Other accommodation">
          <button type="button" onClick={() => onSelect(previous.id)}>
            <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>
              <small>Previous</small>
              {previous.name}
            </span>
          </button>
          <button type="button" onClick={() => onSelect(next.id)}>
            <span>
              <small>Next</small>
              {next.name}
            </span>
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </nav>
      </div>
    </article>
  );
}
