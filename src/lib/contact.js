// One place that turns resort.js contact data into links, so the contact section, footer and
// floating button can never disagree. Everything is derived; nothing is hard-coded here.
import { resort } from '../data/resort';
import { telLink } from './enquiryForm';
import { whatsappUrl, enquiryText } from './enquiry';

export function contactLinks() {
  const { contact, social, location } = resort;
  return {
    call: contact.phone ? { href: telLink(contact.phone), label: 'Call', value: contact.phone } : null,
    whatsapp: whatsappUrl(enquiryText('planning a visit'))
      ? { href: whatsappUrl(enquiryText('planning a visit')), label: 'WhatsApp', value: contact.phone }
      : null,
    email: contact.email ? { href: `mailto:${contact.email}`, label: 'Email', value: contact.email } : null,
    instagram: social.instagram?.url ? { href: social.instagram.url, label: 'Instagram', value: social.instagram.handle } : null,
    facebook: social.facebook?.url
      ? {
          href: social.facebook.url,
          label: 'Facebook',
          value: social.facebook.handle,
          note: social.facebook.isSearch ? 'Opens a Facebook search for the page' : null,
        }
      : null,
    map: location.mapUrl ? { href: location.mapUrl, label: 'Google Maps' } : null,
  };
}
