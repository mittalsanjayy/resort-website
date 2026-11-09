import Reveal from '../../components/motion/Reveal';
import MediaFrame from '../../components/ui/MediaFrame';
import { resort } from '../../data/resort';
import './Facilities.css';

export default function Facilities() {
  const items = resort.facilities;
  if (items.length === 0) return null;

  return (
    <section id="facilities" className="section section--alt fac">
      <div className="container">
        <header className="fac__head">
          <Reveal as="p" className="eyebrow">
            Facilities
          </Reveal>
          <Reveal as="h2" className="h1" delay={0.1}>
            At <em>your disposal</em>
          </Reveal>
        </header>
        <div className="fac__grid">
          {items.map((f, i) => (
            <Reveal as="article" className="fac__card" key={f.id || f.name} delay={(i % 3) * 0.08}>
              <MediaFrame src={f.image} alt={f.name} ratio="4 / 3" label={`${f.name}: photograph to be added`} />
              <h3 className="h3">{f.name}</h3>
              {f.summary && <p>{f.summary}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
