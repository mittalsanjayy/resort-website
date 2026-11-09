import { resort } from '../../data/resort';
import { assets } from '../../data/assets';
import './Footer.css';

export default function Footer() {
  const { contact, social, location } = resort;
  const socials = [social.instagram, social.facebook, social.youtube].filter(Boolean);
  const hasContact = contact.phone || contact.email || contact.whatsapp;

  return (
    <footer className="footer theme-dark">
      <div className="container">
        <div className="footer__top">
          <div>
            {assets.brand.logo ? (
              <img
                className="footer__logo"
                src={assets.brand.logo}
                alt={`${resort.name} ${resort.endorsement}`}
                width="384"
                height="384"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <>
                <p className="footer__brand">OXY VILLAGE</p>
                <p className="eyebrow">Resort · {resort.endorsement}</p>
              </>
            )}
          </div>

          <div className="footer__col">
            <p className="eyebrow">Find us</p>
            <p>
              {location.address ? `${location.address}, ` : ''}
              {location.area}, {location.city}, {location.state}
            </p>
            {location.mapUrl && (
              <p>
                <a href={location.mapUrl} target="_blank" rel="noopener noreferrer">
                  Open in Google Maps<span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </p>
            )}
          </div>

          {hasContact && (
            <div className="footer__col">
              <p className="eyebrow">Contact</p>
              <ul className="footer__list">
                {contact.phone && (
                  <li>
                    <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </li>
                )}
                {contact.whatsapp && (
                  <li>
                    <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                      WhatsApp<span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {socials.length > 0 && (
            <div className="footer__col">
              <p className="eyebrow">Follow</p>
              <ul className="footer__list">
                {socials.map((s) => (
                  <li key={s.label}>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer" title={s.isSearch ? 'Opens a Facebook search for the page' : undefined}>
                        {s.label}
                        {s.handle ? ` · ${s.handle}` : ''}
                        <span className="visually-hidden"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span>
                        {s.label}
                        {s.handle ? ` · ${s.handle}` : ''}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <hr className="hairline" />
        <p className="footer__legal">
          © {new Date().getFullYear()} {resort.name} {resort.endorsement}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
