import Reveal from '../../components/motion/Reveal';
import SplitText from '../../components/motion/SplitText';
import ActivityIcon from '../../components/ui/ActivityIcon';
import { activities } from '../../data/content';
import './Activities.css';

export default function Activities() {
  return (
    <section id="activities" className="section section--alt act" aria-labelledby="act-title">
      <div className="container act__layout">
        <header className="act__head">
          <Reveal as="p" className="eyebrow eyebrow--line">
            {activities.eyebrow}
          </Reveal>
          <SplitText as="h2" id="act-title" className="display act__title" text={activities.title} />
          <Reveal as="p" className="lede" delay={0.15}>
            {activities.intro}
          </Reveal>
        </header>

        <ul className="act__grid">
          {activities.items.map((a, i) => (
            <li key={a.id} className="act__cell">
              <Reveal className="act__inner" delay={(i % 3) * 0.08} y={16}>
                <span className="act__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <ActivityIcon id={a.id} size={52} className="act__icon" />
                <span className="act__name">{a.name}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
