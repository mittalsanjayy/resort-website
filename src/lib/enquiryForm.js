// Pure enquiry-form logic: options, validation, sanitising and message building.
// No React, no browser APIs and no network calls, so it can be tested on its own.
// Form data is only ever turned into a WhatsApp / email link that the VISITOR sends themselves.
import { resort } from '../data/resort';

export const ENQUIRY_TYPES = ['Accommodation', 'Day Outing', 'Corporate', 'Celebration'];
export const NOT_SURE = 'Not sure yet, please advise';

export const LIMITS = { name: 80, email: 120, message: 600, guests: 500 };

// ---- Room / package options -------------------------------------------------------------------
const stayNames = () => resort.accommodations.map((a) => a.name);
const stayPackageNames = () => (resort.stayPackages || []).map((p) => p.name);
const packagesByLabel = (label) => resort.packages.filter((p) => p.label === label).map((p) => p.name);

/** Room / package choices that make sense for an enquiry type. */
export function optionsForType(type) {
  switch (type) {
    case 'Accommodation':
      return [
        { group: 'Rooms and villas', items: stayNames() },
        { group: 'Stay packages', items: stayPackageNames() },
      ];
    case 'Day Outing':
      return [{ group: 'Day outing', items: packagesByLabel('Day outing') }];
    case 'Corporate':
      return [{ group: 'Corporate', items: packagesByLabel('Corporate') }];
    case 'Celebration':
      return [
        { group: 'Rooms and villas', items: stayNames() },
        { group: 'Packages', items: [...packagesByLabel('Day outing'), ...packagesByLabel('Corporate')] },
      ];
    default:
      return [];
  }
}

/** Which enquiry type a pre-selected room / package belongs to (used by the "Enquire" buttons). */
export function typeForSelection(name) {
  if (!name) return '';
  if (stayNames().includes(name) || stayPackageNames().includes(name)) return 'Accommodation';
  const pkg = resort.packages.find((p) => p.name === name);
  if (pkg) return pkg.label === 'Corporate' ? 'Corporate' : 'Day Outing';
  return '';
}

export function isValidSelection(type, selection) {
  if (!selection || selection === NOT_SURE) return true;
  return optionsForType(type).some((g) => g.items.includes(selection));
}

// ---- Sanitising -------------------------------------------------------------------------------
/** Single-line text: remove control characters, collapse whitespace, cap length. */
export function cleanLine(value, max = 200) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f​-‏‪-‮⁦-⁩]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** Multi-line text: keep line breaks, remove other control characters, cap length. */
export function cleanBlock(value, max = LIMITS.message) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f​-‏‪-‮⁦-⁩]/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);
}

// ---- Mobile number ----------------------------------------------------------------------------
/**
 * Returns { ok, e164, display } for a mobile number.
 * Indian numbers: 10 digits starting 6-9, with optional +91 / 91 / 0 prefix.
 * Other countries: must start with + and have 8-15 digits.
 */
export function normalizeMobile(raw) {
  const input = String(raw ?? '').trim();
  if (!input) return { ok: false };
  if (!/^[+\d\s().-]+$/.test(input)) return { ok: false };
  const hasPlus = input.startsWith('+');
  const digits = input.replace(/\D/g, '');

  if (hasPlus && !digits.startsWith('91')) {
    return digits.length >= 8 && digits.length <= 15
      ? { ok: true, e164: `+${digits}`, display: `+${digits}` }
      : { ok: false };
  }
  let national = digits;
  if (national.startsWith('91') && national.length === 12) national = national.slice(2);
  else if (national.startsWith('0') && national.length === 11) national = national.slice(1);
  if (!/^[6-9]\d{9}$/.test(national)) return { ok: false };
  return { ok: true, e164: `+91${national}`, display: `+91 ${national.slice(0, 5)} ${national.slice(5)}` };
}

// ---- Dates ------------------------------------------------------------------------------------
const pad = (n) => String(n).padStart(2, '0');

/** Local calendar date as YYYY-MM-DD (toISOString is UTC and can be a day behind in India). */
export function localDateString(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return localDateString(new Date(y, m - 1, d + days));
}

function isRealDate(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const [y, m, d] = str.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Sun, 15 Nov 2026". Parses the parts directly so no timezone can shift the day. */
export function formatDate(str) {
  if (!isRealDate(str)) return '';
  const [y, m, d] = str.split('-').map(Number);
  return `${DAYS[new Date(y, m - 1, d).getDay()]}, ${d} ${MONTHS[m - 1]} ${y}`;
}

// ---- Validation -------------------------------------------------------------------------------
const EMAIL_RE = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export const emptyValues = {
  name: '',
  mobile: '',
  email: '',
  type: '',
  selection: '',
  date: '',
  endDate: '',
  guests: '',
  message: '',
  website: '', // honeypot: real visitors never see or fill this
};

/** Returns an object of { field: message }. Empty object means valid. */
export function validateEnquiry(v, now = new Date()) {
  const e = {};
  const today = localDateString(now);
  const name = cleanLine(v.name, LIMITS.name);

  if (!name) e.name = 'Please enter your name.';
  else if (name.length < 2) e.name = 'Please enter your full name.';
  else if (!/\p{L}/u.test(name)) e.name = 'Your name should contain letters.';

  if (!String(v.mobile ?? '').trim()) e.mobile = 'Please enter your mobile number so the resort can reach you.';
  else if (!normalizeMobile(v.mobile).ok) {
    e.mobile = 'Enter a 10-digit Indian mobile number, or start with + and the country code.';
  }

  const email = cleanLine(v.email, LIMITS.email);
  if (email && !EMAIL_RE.test(email)) e.email = 'This email address does not look right. Please check it.';

  if (!ENQUIRY_TYPES.includes(v.type)) e.type = 'Please choose what you are enquiring about.';
  else if (!isValidSelection(v.type, v.selection)) e.selection = 'Please choose an option from the list.';

  if (!v.date) e.date = 'Please choose your preferred date.';
  else if (!isRealDate(v.date)) e.date = 'Please enter a valid date.';
  else if (v.date < today) e.date = 'The date cannot be in the past.';
  else if (v.date > addDays(today, 730)) e.date = 'Please choose a date within the next two years.';

  if (v.endDate) {
    if (!isRealDate(v.endDate)) e.endDate = 'Please enter a valid date.';
    else if (v.date && v.endDate <= v.date) e.endDate = 'Check-out must be after your preferred date.';
  }

  const g = String(v.guests ?? '').trim();
  if (!g) e.guests = 'Please enter the number of guests.';
  else if (!/^\d+$/.test(g) || Number(g) < 1) e.guests = 'Please enter a whole number of guests, at least 1.';
  else if (Number(g) > LIMITS.guests) e.guests = `For groups above ${LIMITS.guests}, please call the resort.`;

  if (String(v.message ?? '').length > LIMITS.message + 200) e.message = `Please keep your message under ${LIMITS.message} characters.`;

  return e;
}

/** Non-blocking advice shown next to the form. Never prevents submission. */
export function softHints(v) {
  const hints = {};
  const pkg = resort.packages.find((p) => p.name === v.selection);
  const min = pkg && (pkg.conditions || []).map((c) => /minimum\s+(\d+)\s+guests?/i.exec(c)).find(Boolean);
  if (min && Number(v.guests) > 0 && Number(v.guests) < Number(min[1])) {
    hints.guests = `${pkg.name} is listed with a minimum of ${min[1]} guests. The resort will advise.`;
  }
  return hints;
}

// ---- Message ----------------------------------------------------------------------------------
/** Plain-text WhatsApp message containing every detail the visitor entered. */
export function buildWhatsAppMessage(raw) {
  const mobile = normalizeMobile(raw.mobile);
  const lines = [
    `Hello ${resort.name} ${resort.endorsement},`,
    'I would like to send a booking enquiry. Please check availability for me.',
    '',
    `*Enquiry type:* ${raw.type}`,
    `*Room / package:* ${cleanLine(raw.selection) || NOT_SURE}`,
    `*Preferred date:* ${formatDate(raw.date)}`,
  ];
  if (raw.endDate) lines.push(`*Check-out date:* ${formatDate(raw.endDate)}`);
  lines.push(`*Guests:* ${Number(raw.guests)}`);
  lines.push('', `*Name:* ${cleanLine(raw.name, LIMITS.name)}`);
  lines.push(`*Mobile:* ${mobile.ok ? mobile.display : cleanLine(raw.mobile, 30)}`);
  const email = cleanLine(raw.email, LIMITS.email);
  if (email) lines.push(`*Email:* ${email}`);
  const note = cleanBlock(raw.message);
  if (note) lines.push('', '*Message:*', note);
  lines.push(
    '',
    'I understand this is an enquiry only. My booking is not confirmed until the resort confirms availability and rates.'
  );
  return lines.join('\n');
}

export function whatsappLink(message) {
  const digits = (resort.contact.whatsapp || '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(message) {
  const to = resort.contact.email;
  if (!to) return null;
  const subject = `Booking enquiry: ${resort.name} ${resort.endorsement}`;
  // Email clients use CRLF line breaks in the body.
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message.replace(/\*/g, '').replace(/\n/g, '\r\n'))}`;
}

export function telLink(phone = resort.contact.phone) {
  return `tel:${String(phone).replace(/[^\d+]/g, '')}`;
}
