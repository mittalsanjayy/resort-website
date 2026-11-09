import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import Reveal from '../../components/motion/Reveal';
import SplitText from '../../components/motion/SplitText';
import MaskImage from '../../components/motion/MaskImage';
import ParallaxMedia from '../../components/motion/ParallaxMedia';
import { resort } from '../../data/resort';
import { story } from '../../data/content';
import './Story.css';

export default function Story() {
  const root = useRef(null);
  const reduced = useReducedMotion();
  const [mediaA, mediaB] = story.media;

  useLayoutEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.story__item').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 65%',
          end: 'bottom 35%',
          toggleClass: { targets: el, className: 'is-active' },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="story" ref={root} className="section story" aria-labelledby="story-title">
      <div className="container">
        <header className="story__head">
          <Reveal as="p" className="eyebrow eyebrow--line">
            {story.eyebrow}
          </Reveal>
          <SplitText as="h2" id="story-title" className="display story__title" text={story.title} />
        </header>

        <div className="story__layout">
          <div className="story__img story__img--a">
            <MaskImage src={mediaA.image} alt={mediaA.alt} ratio={mediaA.ratio} label={mediaA.label} direction="left" />
          </div>

          <div className="story__text prose">
            {story.paragraphs.map((p, i) => (
              <Reveal as="p" key={p} delay={i * 0.08} className={i === 0 ? 'story__lead' : undefined}>
                {p}
              </Reveal>
            ))}
          </div>

          <div className="story__img story__img--b">
            <ParallaxMedia src={mediaB.image} alt={mediaB.alt} ratio={mediaB.ratio} label={mediaB.label} />
          </div>

          <dl className="story__facts">
            {story.facts.map((f, i) => (
              <Reveal key={f.label} className="story__fact" delay={i * 0.1}>
                <dt className="eyebrow">{f.prefix}</dt>
                <dd>
                  <span className="story__value">{f.value}</span>
                  <span className="story__unit">{f.unit}</span>
                  <span className="story__label">{f.label}</span>
                  {f.note && <span className="story__note">{f.note}</span>}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <ul className="story__list" aria-label="What the resort is for">
          {resort.positioning.map((item) => (
            <li key={item} className={`story__item ${reduced ? 'is-active' : ''}`}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
