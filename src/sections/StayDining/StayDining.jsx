import { useRef } from 'react';
import { Coffee, MessageCircle, Utensils } from 'lucide-react';
import Reveal from '../../components/motion/Reveal';
import SplitText from '../../components/motion/SplitText';
import ScrubText from '../../components/motion/ScrubText';
import MaskImage from '../../components/motion/MaskImage';
import ParallaxMedia from '../../components/motion/ParallaxMedia';
import Button from '../../components/ui/Button';
import EnquireButton from '../../components/ui/EnquireButton';
import { enquiryText, whatsappUrl } from '../../lib/enquiry';
import { useSectionTransition } from '../../hooks/useSectionTransition';
import { assets } from '../../data/assets';
import { resort } from '../../data/resort';
import { stayDining } from '../../data/content';
import './StayDining.css';

const ICONS = { 'stay-with-breakfast': Coffee, 'stay-with-meals': Utensils };

// Dining showcase: a photography composition beside editorial copy and the two meal options.
// No menus, dishes, timings or prices are shown because none were supplied.
export default function StayDining() {
  const sectionRef = useRef(null);
  useSectionTransition(sectionRef, { inset: '2.5vw', radius: '2rem' });

  const options = resort.stayPackages || [];
  if (options.length === 0) return null;
  const wa = whatsappUrl(enquiryText('dining and meals'));
  const { plan, media } = stayDining;
  const photos = assets.dining || {};

  return (
    <section id="stay-dining" ref={sectionRef} className="section section--alt sd" aria-labelledby="sd-title">
      <div className="container">
        <div className="sd__layout">
          <div className="sd__visual">
            <MaskImage
              className="sd__main"
              src={photos.main ? photos.main.src : null}
              alt={photos.main ? photos.main.alt || '' : ''}
              ratio={media.main.ratio}
              label={media.main.label}
            />
            <div className="sd__inset">
              <ParallaxMedia
                src={photos.inset ? photos.inset.src : null}
                alt={photos.inset ? photos.inset.alt || '' : ''}
                ratio={media.inset.ratio}
                label={media.inset.label}
                range={6}
              />
            </div>
            <span className="sd__stamp" aria-hidden="true">
              Dine
            </span>
          </div>

          <div className="sd__copy">
            <header className="sd__head">
              <Reveal as="p" className="eyebrow eyebrow--line">
                {stayDining.eyebrow}
              </Reveal>
              <SplitText as="h2" id="sd-title" className="display sd__title" text={stayDining.title} />
              <Reveal as="p" className="lede" delay={0.15}>
                {stayDining.intro}
              </Reveal>
            </header>

            <ScrubText className="sd__statement" text={stayDining.statement} />

            <ul className="sd__list">
              {options.map((o, i) => {
                const Icon = ICONS[o.id];
                return (
                  <li key={o.id}>
                    <Reveal className="sd__row" delay={i * 0.1}>
                      <span className="sd__num" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="sd__main-text">
                        <h3 className="h1 sd__name">{o.name}</h3>
                        <p className="sd__pending">{stayDining.pending}</p>
                      </div>
                      {Icon && <Icon className="sd__icon" size={32} strokeWidth={1} aria-hidden="true" />}
                      <EnquireButton interest={o.name} variant="primary">
                        {stayDining.cta}
                        <span className="visually-hidden">: {o.name}</span>
                      </EnquireButton>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <Reveal className="sd__plan">
          <div>
            <h3 className="h2">{plan.title}</h3>
            <p>{plan.text}</p>
          </div>
          <div className="sd__plan-actions">
            <EnquireButton interest="" variant="solid" size="lg">
              {plan.cta}
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
                WhatsApp {resort.contact.phone}
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
