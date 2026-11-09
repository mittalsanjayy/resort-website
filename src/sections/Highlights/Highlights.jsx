import { Briefcase, Leaf, Sparkles, Trees, Users, Waves } from 'lucide-react';
import Reveal from '../../components/motion/Reveal';
import SplitText from '../../components/motion/SplitText';
import ParallaxMedia from '../../components/motion/ParallaxMedia';
import { highlights, story } from '../../data/content';
import './Highlights.css';

const ICONS = { trees: Trees, leaf: Leaf, waves: Waves, sparkles: Sparkles, users: Users, briefcase: Briefcase };

export default function Highlights() {
  const { media } = highlights;
  const acres = story.facts[0];

  return (
    <section id="highlights" className="section theme-dark hl" aria-labelledby="hl-title">
      <div className="container">
        <header className="hl__head">
          <Reveal as="p" className="eyebrow eyebrow--line">
            {highlights.eyebrow}
          </Reveal>
          <SplitText as="h2" id="hl-title" className="display hl__title" text={highlights.title} />
        </header>

        <ParallaxMedia
          className="hl__band"
          src={media.image}
          alt={media.alt}
          ratio="21 / 9"
          label={media.label}
          range={6}
        />

        <ul className="hl__grid">
          {highlights.items.map((item, i) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.id} className={`hl__item ${item.feature ? 'hl__item--feature' : ''}`}>
                <Reveal className="hl__inner" delay={(i % 3) * 0.08} y={16}>
                  <span className="hl__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {Icon && <Icon className="hl__icon" size={28} strokeWidth={1.1} aria-hidden="true" />}
                  {item.feature && (
                    <span className="hl__stat" aria-hidden="true">
                      {acres.value}
                    </span>
                  )}
                  <h3 className="h2 hl__name">{item.title}</h3>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
