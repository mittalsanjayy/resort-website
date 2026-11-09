import { Facebook, Instagram, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import Reveal from '../../components/motion/Reveal';
import Button from '../../components/ui/Button';
import { resort } from '../../data/resort';
import { contactLinks } from '../../lib/contact';
import './Location.css';

const external = { target: '_blank', rel: 'noopener noreferrer' };

function Channel({ icon: Icon, link, newTab, hint }) {
  if (!link) return null;
  return (
    <a className="loc__channel" href={link.href} {...(newTab ? external : {})} title={link.note || undefined}>
      <span className="loc__channel-icon">
        <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span className="loc__channel-text">
        <span className="loc__channel-label">{link.label}</span>
        <span className="loc__channel-value">{link.value}</span>
      </span>
      {newTab && <span className="visually-hidden"> (opens in a new tab)</span>}
      {hint && <span className="visually-hidden"> {hint}</span>}
    </a>
  );
}

export default function Location() {
  const { location } = resort;
  const links = contactLinks();

  return (
    <section id="contact" className="section section--alt loc" aria-labelledby="contact-title">
      <div className="container loc__grid">
        <div className="loc__text">
          <Reveal as="p" className="eyebrow eyebrow--line">
            Contact &amp; Location
          </Reveal>
          <Reveal as="h2" id="contact-title" className="h1" delay={0.1}>
            Find your way to <em>Kumbalgod</em>
          </Reveal>
          <Reveal as="p" className="lede" delay={0.2}>
            {location.area}, {location.city}, {location.state}.
          </Reveal>
          {location.address && (
            <Reveal as="p" className="loc__address" delay={0.25}>
              <MapPin size={18} strokeWidth={1.5} aria-hidden="true" /> {location.address}
            </Reveal>
          )}

          <Reveal as="div" className="loc__channels" delay={0.28}>
            <Channel icon={Phone} link={links.call} />
            <Channel icon={MessageCircle} link={links.whatsapp} newTab />
            <Channel icon={Mail} link={links.email} />
          </Reveal>

          <Reveal as="div" className="loc__social" delay={0.32}>
            <p className="eyebrow">Follow the resort</p>
            <ul>
              {links.instagram && (
                <li>
                  <a href={links.instagram.href} {...external}>
                    <Instagram size={18} strokeWidth={1.5} aria-hidden="true" />
                    <span>Instagram · {links.instagram.value}</span>
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
              {links.facebook && (
                <li>
                  <a href={links.facebook.href} {...external} title={links.facebook.note || undefined}>
                    <Facebook size={18} strokeWidth={1.5} aria-hidden="true" />
                    <span>Facebook · {links.facebook.value}</span>
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>
          </Reveal>

          <Reveal delay={0.36}>
            <Button href="#enquiry" variant="solid" size="lg">
              Send a booking enquiry
            </Button>
          </Reveal>
        </div>

        <Reveal className="loc__map" y={0}>
          <svg className="loc__art" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <ellipse
                key={i}
                cx="200"
                cy="200"
                rx={40 + i * 24}
                ry={26 + i * 20}
                transform={`rotate(${i * 9 - 20} 200 200)`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity={1 - i * 0.11}
              />
            ))}
          </svg>
          <div className="loc__map-body">
            <span className="loc__pin" aria-hidden="true">
              <MapPin size={26} strokeWidth={1.5} />
            </span>
            <p className="loc__map-title">{resort.name}</p>
            <p className="loc__map-line">
              {location.area}
              <br />
              {location.city}, {location.state}
            </p>
            {links.map && (
              <Button
                href={links.map.href}
                variant="solid"
                {...external}
                iconNode={<Navigation size={16} strokeWidth={1.5} aria-hidden="true" />}
                aria-label="Open in Google Maps for directions (opens in a new tab)"
              >
                Open in Google Maps
              </Button>
            )}
            <p className="loc__map-note">Approximately {resort.facts.driveFromBengaluru} from Bengaluru, as estimated by the resort.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
