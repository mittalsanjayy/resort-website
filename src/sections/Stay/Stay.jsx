import { useCallback, useState } from 'react';
import Reveal from '../../components/motion/Reveal';
import SplitText from '../../components/motion/SplitText';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import { resort } from '../../data/resort';
import { stay } from '../../data/content';
import StayCard from './StayCard';
import StayDetail from './StayDetail';
import './Stay.css';

function layoutFor(item, index) {
  if (index === 0) return 'feature';
  if (item.enquiryOnly) return 'wide';
  return 'standard';
}

export default function Stay() {
  const items = resort.accommodations;
  const [activeId, setActiveId] = useState(null);
  const close = useCallback(() => setActiveId(null), []);

  const activeIndex = items.findIndex((i) => i.id === activeId);
  const active = activeIndex >= 0 ? items[activeIndex] : null;
  const previous = items[(activeIndex - 1 + items.length) % items.length];
  const next = items[(activeIndex + 1) % items.length];

  return (
    <section id="stay" className="section stay" aria-labelledby="stay-title">
      <div className="container">
        <header className="stay__head">
          <Reveal as="p" className="eyebrow eyebrow--line">
            {stay.eyebrow}
          </Reveal>
          <SplitText as="h2" id="stay-title" className="display stay__title" text={stay.title} />
          <Reveal as="p" className="lede" delay={0.15}>
            {stay.intro}
          </Reveal>
          <Reveal as="p" className="stay__note" delay={0.2}>
            {stay.priceFootnote} {stay.priceNote}
          </Reveal>
        </header>

        {items.length === 0 ? (
          <Reveal className="stay__empty">
            <p className="lede">
              Accommodation details are being finalised. Please send an enquiry to ask about current stay options.
            </p>
            <Button href="#enquiry" variant="primary">
              Enquire about stays
            </Button>
          </Reveal>
        ) : (
          <div className="stay__list">
            {items.map((item, i) => (
              <StayCard key={item.id} item={item} number={i + 1} layout={layoutFor(item, i)} onOpen={setActiveId} />
            ))}
          </div>
        )}
      </div>

      <Drawer open={Boolean(active)} onClose={close} label={active ? active.name : 'Accommodation'} heading="Accommodation">
        {active && (
          <StayDetail item={active} previous={previous} next={next} onSelect={setActiveId} onClose={close} />
        )}
      </Drawer>
    </section>
  );
}
