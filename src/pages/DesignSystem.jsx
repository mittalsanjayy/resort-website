import { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import MediaFrame from '../components/ui/MediaFrame';
import SplitText from '../components/motion/SplitText';
import MaskImage from '../components/motion/MaskImage';
import ParallaxMedia from '../components/motion/ParallaxMedia';
import HorizontalScroll from '../components/motion/HorizontalScroll';
import { breakpoints } from '../lib/breakpoints';
import { duration, ease } from '../lib/motion';
import './DesignSystem.css';

const brandColors = [
  ['Deep Forest Green', '--forest', '#14201A', 'Primary dark. Text on light, hero and footer ground.'],
  ['Moss Green', '--moss', '#2F4A3A', 'Secondary dark. Alternate dark panels, hover fills.'],
  ['Sage', '--sage', '#8A9A82', 'Muted UI, quiet icons, decorative strokes on dark.'],
  ['Mist', '--mist', '#CFD6CC', 'Hairlines and borders on light.'],
  ['Warm Ivory', '--bone', '#F4EFE6', 'Page ground and text on dark.'],
  ['Linen', '--linen', '#E9E1D2', 'Alternate sections, image placeholders.'],
  ['Muted Brass', '--brass', '#B08D57', 'Fine lines, ornaments, accent on dark.'],
  ['Natural Clay', '--clay', '#B6764E', 'Warm accent. Large type and details only.'],
];

const textSafe = [
  ['Brass text', '--brass-text', '#7A5B2E', 'Small accent text on ivory.'],
  ['Clay text', '--clay-text', '#8A4F2E', 'Small warm accent text on ivory.'],
  ['Ink muted', '--ink-muted', '#4D5A52', 'Secondary text on ivory.'],
  ['Bone muted', '--bone-muted', '#B9C2B8', 'Secondary text on forest.'],
];

const proportions = [
  ['Ivory and Linen', 60, 'var(--bone)', 'var(--forest)'],
  ['Forest and Moss', 25, 'var(--forest)', 'var(--bone)'],
  ['Sage and Mist', 10, 'var(--sage)', 'var(--forest)'],
  ['Brass and Clay', 5, 'var(--brass)', 'var(--forest)'],
];

const typeSamples = [
  ['display-xl', 'Display XL', 'Held in green'],
  ['display', 'Display', 'Quiet luxury'],
  ['h1', 'Heading 1', 'Ways to arrive'],
  ['h2', 'Heading 2', 'Where you stay'],
  ['h3', 'Heading 3', 'A closer look'],
  ['h4', 'Heading 4', 'Find your way'],
  ['lede', 'Lede', 'A luxury nature resort on Mysore Road, near Ramohalli, Bengaluru.'],
  ['eyebrow', 'Eyebrow', 'Experiences'],
];

const spaceTokens = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6', '--space-7', '--space-8', '--space-9', '--space-10'];

const ratios = [
  ['Portrait', '4 / 5', 'Rooms, people, vertical details'],
  ['Tall', '3 / 4', 'Editorial columns, gallery'],
  ['Landscape', '16 / 9', 'Panoramas, video'],
  ['Wide', '21 / 9', 'Cinematic bands'],
  ['Square', '1 / 1', 'Details, textures'],
];

const deviceRules = [
  ['Android phones', '360 to 412 wide', 'xs / sm', 'Single column. 44px minimum tap targets. Menu overlay replaces nav. No pinned sections; horizontal showcases become swipe rows. Video replaced by poster on data saver.'],
  ['iPhones', '375 to 440 wide', 'xs / sm', 'Same as Android, plus safe-area insets for notch and home bar, 16px minimum inputs to stop zoom, 100svh instead of 100vh.'],
  ['Tablets', '768 to 1024 wide', 'md', 'Two-column editorial layouts. Menu overlay up to 899px. Touch rules apply: no hover-only effects. Pinned horizontal scroll stays off below 900px.'],
  ['Laptops', '1024 to 1439 wide', 'lg', 'Full navigation, 12-column asymmetric layouts, pinned storytelling and horizontal scroll enabled.'],
  ['Desktop', '1440 to 1919 wide', 'xl', 'Container at 90rem. Larger gutters, more whitespace. All motion enabled.'],
  ['Large displays', '1920 wide and up', 'xxl', 'Root font size scales to 112.5% (1920) and 125% (2560) so type, spacing and the container grow together. Imagery must be supplied at 2560px wide or more.'],
];

const easings = [
  ['ease.out', 'Default. Arrivals, reveals, hovers.', 'cubic-bezier(0.16, 1, 0.3, 1)', ease.out],
  ['ease.inOut', 'Overlays, clip-path wipes, page transitions.', 'cubic-bezier(0.65, 0, 0.35, 1)', ease.inOut],
  ['ease.soft', 'Subtle ambient movement.', 'cubic-bezier(0.25, 0.1, 0.25, 1)', ease.soft],
];

function Block({ id, eyebrow, title, alt = false, children }) {
  return (
    <section id={id} className={`section ds-block ${alt ? 'section--alt' : ''}`}>
      <div className="container">
        <header className="ds-block__head">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="h2">{title}</h2>
        </header>
        {children}
      </div>
    </section>
  );
}

export default function DesignSystem() {
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <header className="ds-hero theme-dark">
        <div className="container">
          <a className="ds-back caps" href="/">
            <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" /> Back to site
          </a>
          <p className="eyebrow eyebrow--line">Oxy Village Resort by De Verveil</p>
          <h1 className="display">
            Design <em>system</em>
          </h1>
          <p className="lede">Colour, type, space, grid, controls, imagery and motion. The reference for every section of the site.</p>
        </div>
      </header>

      <main>
        <Block id="colour" eyebrow="01 · Colour" title={<>A palette <em>held in green</em></>}>
          <div className="ds-swatches">
            {brandColors.map(([name, token, hex, use]) => (
              <div className="ds-swatch" key={token}>
                <div className="ds-swatch__chip" style={{ background: `var(${token})` }} />
                <p className="ds-swatch__name">{name}</p>
                <p className="ds-swatch__meta">{hex} · {token}</p>
                <p className="ds-swatch__use">{use}</p>
              </div>
            ))}
          </div>

          <h3 className="h4 ds-sub">Text-safe variants</h3>
          <div className="ds-swatches">
            {textSafe.map(([name, token, hex, use]) => (
              <div className="ds-swatch" key={token}>
                <div className="ds-swatch__chip" style={{ background: `var(${token})` }} />
                <p className="ds-swatch__name">{name}</p>
                <p className="ds-swatch__meta">{hex} · {token}</p>
                <p className="ds-swatch__use">{use}</p>
              </div>
            ))}
          </div>

          <h3 className="h4 ds-sub">Proportion</h3>
          <div className="ds-proportion" role="img" aria-label="Colour proportion: 60 percent ivory and linen, 25 percent forest and moss, 10 percent sage and mist, 5 percent brass and clay">
            {proportions.map(([name, weight, bg, fg]) => (
              <div key={name} style={{ flexGrow: weight, background: bg, color: fg }}>
                <span>{name} {weight}%</span>
              </div>
            ))}
          </div>
        </Block>

        <Block id="type" eyebrow="02 · Typography" title={<>Cormorant Garamond <em>and</em> Hanken Grotesk</>} alt>
          <div className="ds-type">
            {typeSamples.map(([cls, label, sample]) => (
              <div className="ds-type__row" key={cls}>
                <p className="ds-type__label caps">{label} · .{cls}</p>
                <p className={cls}>{sample}</p>
              </div>
            ))}
            <div className="ds-type__row">
              <p className="ds-type__label caps">Italic emphasis</p>
              <p className="h1">Quiet luxury, <em>in motion</em></p>
            </div>
            <div className="ds-type__row">
              <p className="ds-type__label caps">Body</p>
              <p className="prose">Body copy is set in Hanken Grotesk at a relaxed 1.65 line height, with a measure capped at 62 characters for comfortable reading on every screen.</p>
            </div>
          </div>
        </Block>

        <Block id="space" eyebrow="03 · Spacing and grid" title={<>Room to <em>breathe</em></>}>
          <div className="ds-space">
            {spaceTokens.map((t) => (
              <div className="ds-space__row" key={t}>
                <code>{t}</code>
                <span style={{ width: `var(${t})` }} />
              </div>
            ))}
          </div>

          <h3 className="h4 ds-sub">12-column grid</h3>
          <div className="grid-12 ds-grid" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <div className="ds-grid__col" key={i}>{i + 1}</div>
            ))}
          </div>

          <h3 className="h4 ds-sub">Asymmetric composition</h3>
          <div className="grid-12 ds-asym">
            <div className="col" style={{ '--start': 1, '--span': 7 }}>
              <MediaFrame ratio="4 / 5" label="Large image · columns 1 to 7" />
            </div>
            <div className="col ds-asym__small" style={{ '--start': 9, '--span': 4 }}>
              <MediaFrame ratio="3 / 4" label="Small image · columns 9 to 12" />
              <p className="caption">Offset downward to break the grid line.</p>
            </div>
          </div>
        </Block>

        <Block id="controls" eyebrow="04 · Buttons and navigation" title={<>Quiet, <em>precise</em> controls</>} alt>
          <div className="ds-buttons">
            <div className="ds-buttons__panel">
              <p className="caps">On ivory</p>
              {['sm', 'md', 'lg'].map((size) => (
                <div className="ds-buttons__row" key={size}>
                  <Button variant="primary" size={size}>Primary</Button>
                  <Button variant="solid" size={size}>Solid</Button>
                  <Button variant="ghost" size={size}>Ghost</Button>
                </div>
              ))}
              <div className="ds-buttons__row">
                <Button variant="primary" aria-disabled="true">Disabled</Button>
                <Button variant="solid" icon={false} onClick={() => setModalOpen(true)}>Open modal</Button>
              </div>
            </div>
            <div className="ds-buttons__panel theme-dark">
              <p className="caps">On forest</p>
              {['sm', 'md', 'lg'].map((size) => (
                <div className="ds-buttons__row" key={size}>
                  <Button variant="light" size={size}>Light</Button>
                  <Button variant="solid-light" size={size}>Solid light</Button>
                  <Button variant="ghost" size={size}>Ghost</Button>
                </div>
              ))}
            </div>
          </div>
          <p className="caption">Navigation: transparent over imagery, ivory glass after 60px, hides on scroll down and returns on scroll up, brass progress hairline, active-section underline, full-screen overlay menu below 900px.</p>
        </Block>

        <Block id="imagery" eyebrow="05 · Image treatment" title={<>Photography <em>leads</em></>}>
          <div className="ds-ratios">
            {ratios.map(([name, ratio, use]) => (
              <figure key={name}>
                <MediaFrame ratio={ratio} label={`${name} · ${ratio.replace(/ /g, '')}`} />
                <figcaption className="caption">{use}</figcaption>
              </figure>
            ))}
          </div>

          <div className="ds-scrim ratio-landscape">
            <div className="scrim-bottom" />
            <p className="h3">Text over imagery always sits on a forest scrim.</p>
          </div>

          <ul className="ds-rules">
            <li>Minimal grading. Let the real light and greenery carry the page.</li>
            <li>One scrim recipe: forest gradient from the bottom, 72% to transparent.</li>
            <li>Full-bleed for hero and showcase moments, inset for supporting images.</li>
            <li>Alt text describes the scene. Decorative images use empty alt text.</li>
            <li>Supply WebP or AVIF at 2560px wide, MP4 H.264 for video with a poster image.</li>
          </ul>
        </Block>

        <Block id="motion" eyebrow="06 · Motion" title={<>Breathe, <em>don't bounce</em></>} alt>
          <div className="ds-motion theme-dark">
            <SplitText as="h3" className="display" text="Quiet luxury, *in motion*" />
          </div>

          <div className="ds-motion-grid">
            <div>
              <MaskImage ratio="4 / 5" label="Mask reveal" />
              <p className="caption">Mask reveal: frame opens while the image settles from 1.18 to 1.</p>
            </div>
            <div>
              <ParallaxMedia ratio="4 / 5" label="Scroll parallax" />
              <p className="caption">Parallax: scrubbed, 8% travel each way, off under reduced motion.</p>
            </div>
          </div>

          <h3 className="h4 ds-sub">Easing and timing</h3>
          <div className="ds-ease">
            {easings.map(([name, use, css, bezier]) => (
              <motion.div
                className="ds-ease__row"
                key={name}
                whileHover={{ x: 12 }}
                transition={{ duration: duration.ui, ease: bezier }}
              >
                <p className="ds-ease__name">{name}</p>
                <p>{use}</p>
                <code>{css}</code>
              </motion.div>
            ))}
          </div>
          <p className="caption">
            Durations: micro {duration.micro}s · ui {duration.ui}s · reveal {duration.reveal}s · scene {duration.scene}s · slow {duration.slow}s.
          </p>
        </Block>

        <section aria-label="Horizontal scroll demonstration" className="ds-hscroll-wrap theme-dark">
          <HorizontalScroll label="Horizontal showcase demonstration">
            {['One', 'Two', 'Three', 'Four'].map((n) => (
              <article className="hscroll__panel ds-panel" key={n}>
                <MediaFrame ratio="3 / 4" label={`Panel ${n}`} />
                <h3 className="h3">Panel {n}</h3>
              </article>
            ))}
          </HorizontalScroll>
        </section>

        <Block id="responsive" eyebrow="07 · Responsive" title={<>Every screen, <em>considered</em></>}>
          <div className="ds-scroll">
            <table className="ds-table">
              <thead>
                <tr><th>Device</th><th>Width</th><th>Breakpoint</th><th>Rules</th></tr>
              </thead>
              <tbody>
                {deviceRules.map(([device, width, bp, rule]) => (
                  <tr key={device}>
                    <th scope="row">{device}</th>
                    <td>{width}</td>
                    <td>{bp}</td>
                    <td>{rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption">
            Breakpoints (min-width): {Object.entries(breakpoints).map(([k, v]) => `${k} ${v}px`).join(' · ')}
          </p>
        </Block>
      </main>

      <Modal open={modalOpen} onClose={closeModal} title="Modal pattern">
        <p>Modals fade and rise in 0.6 seconds, trap focus, close on Escape, pause smooth scrolling and return focus to the control that opened them.</p>
        <Button variant="solid" icon={false} onClick={closeModal}>Close</Button>
      </Modal>
    </>
  );
}
