import { ArrowUpRight } from 'lucide-react';
import Reveal from '../../components/motion/Reveal';
import SplitText from '../../components/motion/SplitText';
import MediaFrame from '../../components/ui/MediaFrame';
import { experiences } from '../../data/content';
import './Experiences.css';

// Editorial grid. Card widths come from the nth-child pattern in Experiences.css.
export default function Experiences() {
  return (
    <section id="experiences" className="section theme-dark exp" aria-labelledby="exp-title">
      <div className="container">
        <header className="exp__head">
          <Reveal as="p" className="eyebrow eyebrow--line">
            {experiences.eyebrow}
          </Reveal>
          <SplitText as="h2" id="exp-title" className="display exp__title" text={experiences.title} />
          <Reveal as="p" className="lede" delay={0.15}>
            {experiences.intro}
          </Reveal>
        </header>

        <ul className="exp__grid">
          {experiences.items.map((item, i) => (
            <li key={item.id} className="exp__item">
              <Reveal as="article" className="exp__card" delay={(i % 3) * 0.08}>
                <MediaFrame
                  src={item.image}
                  alt={item.image ? item.name : ''}
                  ratio="auto"
                  label={`${item.name}: photograph to be added`}
                  className="exp__media"
                />
                <div className="exp__shade" aria-hidden="true" />
                <span className="exp__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="exp__tag">{item.tag}</span>
                <div className="exp__body">
                  <h3 className="h2">{item.name}</h3>
                  <a className="exp__link" href="#enquiry" aria-label={`Enquire about ${item.name}`}>
                    Enquire <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
