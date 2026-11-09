import Reveal from '../../components/motion/Reveal';
import SplitText from '../../components/motion/SplitText';
import MediaFrame from '../../components/ui/MediaFrame';
import EnquireButton from '../../components/ui/EnquireButton';
import { resort } from '../../data/resort';
import { dayOuting } from '../../data/content';
import './Packages.css';

// Day outing and corporate packages. Renders nothing until resort.packages has entries.
// Only supplied facts are shown: price, minimum guests and the meal inclusion. No timings or menus.
export default function Packages() {
  const items = resort.packages;
  if (items.length === 0) return null;

  return (
    <section id="packages" className="section theme-dark pkg" aria-labelledby="pkg-title">
      <div className="container">
        <header className="pkg__head">
          <Reveal as="p" className="eyebrow eyebrow--line">
            {dayOuting.eyebrow}
          </Reveal>
          <SplitText as="h2" id="pkg-title" className="display pkg__title" text={dayOuting.title} />
          <Reveal as="p" className="lede" delay={0.15}>
            {dayOuting.intro}
          </Reveal>
        </header>

        <div className="pkg__grid">
          {items.map((p, i) => (
            <Reveal as="article" className="pkg__card" key={p.id} delay={(i % 2) * 0.12}>
              <MediaFrame
                src={p.image}
                alt={p.image ? p.name : ''}
                ratio={i % 2 === 0 ? '16 / 10' : '16 / 11'}
                label={`${p.name}: photograph to be added`}
              />
              <div className="pkg__body">
                {p.label && <p className="eyebrow pkg__label">{p.label}</p>}
                <h3 className="h1 pkg__name">{p.name}</h3>

                <p className="pkg__price">
                  <span className="pkg__amount">{p.priceAmount || p.price}</span>
                  {p.priceBasis && <span className="pkg__basis">{p.priceBasis}</span>}
                </p>

                <ul className="pkg__list">
                  {(p.conditions || []).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                  {(p.inclusions || []).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                {p.note && <p className="pkg__note">{p.note}</p>}

                <EnquireButton interest={p.name} variant="light">
                  {dayOuting.cta}
                  <span className="visually-hidden">: {p.name}</span>
                </EnquireButton>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
