// Reusable enquiry handoff. Every "Enquire" button on the site goes through here so that
// Prompt 6 (booking system) has one place to plug in.
//
//   requestEnquiry('Assam Bamboo Hut')  -> pre-selects the enquiry type + room/package and scrolls to the form
//   whatsappUrl(enquiryText('X'))       -> direct WhatsApp link with a prepared message
import { resort } from '../data/resort';
import { scrollToTarget } from './lenis';

const listeners = new Set();

export function subscribeEnquiry(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function requestEnquiry(interest = '', { delay = 0 } = {}) {
  listeners.forEach((fn) => fn(interest));
  window.setTimeout(() => {
    scrollToTarget('#enquiry');
    // Land keyboard and screen-reader users in the form once the scroll has settled.
    window.setTimeout(() => {
      const field = document.getElementById('enq-name');
      if (field) field.focus({ preventScroll: true });
    }, 1300);
  }, delay);
}

export function enquiryText(subject) {
  return `Hello ${resort.name} ${resort.endorsement}, I would like to enquire about ${subject}. Please confirm availability and package details.`;
}

export function whatsappUrl(text = '') {
  const digits = (resort.contact.whatsapp || '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

// Validation, option lists and the WhatsApp message builder live in ./enquiryForm.js (pure, testable).
