import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, Check, CheckCircle2, Copy, Mail, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import Reveal from '../../components/motion/Reveal';
import Button from '../../components/ui/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { resort } from '../../data/resort';
import { duration, ease } from '../../lib/motion';
import { subscribeEnquiry, whatsappUrl } from '../../lib/enquiry';
import {
  ENQUIRY_TYPES,
  LIMITS,
  NOT_SURE,
  buildWhatsAppMessage,
  emptyValues,
  localDateString,
  mailtoLink,
  optionsForType,
  softHints,
  telLink,
  typeForSelection,
  validateEnquiry,
  whatsappLink,
} from '../../lib/enquiryForm';
import './Enquiry.css';

// Order used to focus the first problem and list the summary.
const FIELD_ORDER = ['name', 'mobile', 'email', 'type', 'selection', 'date', 'endDate', 'guests', 'message'];
const FIELD_LABEL = {
  name: 'Name',
  mobile: 'Mobile number',
  email: 'Email',
  type: 'Enquiry type',
  selection: 'Room or package',
  date: 'Preferred date',
  endDate: 'Check-out date',
  guests: 'Guests',
  message: 'Message',
};
const TYPE_NOTE = {
  Accommodation: 'Stays at the resort',
  'Day Outing': 'A day among the trees',
  Corporate: 'Teams and retreats',
  Celebration: 'Birthdays, anniversaries, gatherings',
};

const listVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: duration.ui, ease: ease.out } },
};

function Field({ id, label, error, hint, required, optional, wide, children }) {
  return (
    <motion.div className={`field${wide ? ' field--wide' : ''}${error ? ' field--invalid' : ''}`} variants={itemVariants}>
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {optional ? <span className="field__optional"> optional</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field__error" id={`${id}-error`} role="alert">
          <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </motion.div>
  );
}

export default function Enquiry() {
  const reduced = useReducedMotion();
  const uid = useId();
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null); // { message, wa, mail, blocked }
  const [copyState, setCopyState] = useState('idle'); // idle | done | failed

  const summaryRef = useRef(null);
  const resultRef = useRef(null);
  const today = localDateString();
  const hints = softHints(values);
  const groups = optionsForType(values.type);
  const hasWhatsApp = Boolean(whatsappLink('x'));
  const mailAvailable = Boolean(resort.contact.email);

  const idOf = (name) => `enq-${name}`;
  const describe = (name, hasHint) => {
    const ids = [];
    if (errors[name]) ids.push(`${idOf(name)}-error`);
    else if (hasHint) ids.push(`${idOf(name)}-hint`);
    return ids.length ? ids.join(' ') : undefined;
  };

  const setField = useCallback((name, value) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'type') {
        const stillValid = optionsForType(value).some((g) => g.items.includes(prev.selection));
        if (!stillValid) next.selection = '';
        if (value !== 'Accommodation') next.endDate = '';
      }
      return next;
    });
    // Clear the message for a field as soon as the visitor starts fixing it.
    setErrors((prev) => {
      if (!prev[name] && !(name === 'type' && prev.selection)) return prev;
      const next = { ...prev };
      delete next[name];
      if (name === 'type') delete next.selection;
      return next;
    });
  }, []);

  const onChange = (name) => (e) => setField(name, e.target.value);

  // Re-check one field when the visitor leaves it, so mistakes surface early but gently.
  const onBlur = (name) => () => {
    if (!values[name] && name !== 'name' && name !== 'mobile') return;
    const found = validateEnquiry(values);
    setErrors((prev) => {
      const next = { ...prev };
      if (found[name]) next[name] = found[name];
      else delete next[name];
      return next;
    });
  };

  // "Enquire" buttons elsewhere on the page pre-select the type and the room / package.
  useEffect(
    () =>
      subscribeEnquiry((interest) => {
        if (!interest) return;
        const type = typeForSelection(interest);
        setResult(null);
        setErrors({});
        setValues((prev) => ({ ...prev, type: type || prev.type, selection: interest }));
      }),
    []
  );

  const onSubmit = (e) => {
    e.preventDefault();

    // Honeypot: only automated form-fillers complete this hidden field. Do nothing for them.
    if (values.website) return;

    const found = validateEnquiry(values);
    setErrors(found);
    const firstBad = FIELD_ORDER.find((f) => found[f]);
    if (firstBad) {
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    const message = buildWhatsAppMessage(values);
    const wa = whatsappLink(message);
    const mail = mailtoLink(message);

    // Opened directly inside the submit (a user gesture) so mobile browsers allow it.
    let blocked = false;
    if (wa) {
      const w = window.open(wa, '_blank');
      if (w) w.opener = null;
      else blocked = true;
    }
    setCopyState('idle');
    setResult({ message, wa, mail, blocked });
  };

  useEffect(() => {
    if (result && resultRef.current) resultRef.current.focus({ preventScroll: false });
  }, [result]);

  const jumpTo = (name) => (e) => {
    e.preventDefault();
    const el = document.getElementById(idOf(name)) || document.querySelector(`[name="${name}"]`);
    el?.focus();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.message);
      setCopyState('done');
    } catch {
      setCopyState('failed');
    }
  };

  const reset = (keep) => {
    setResult(null);
    setErrors({});
    if (!keep) setValues(emptyValues);
  };

  const errorList = FIELD_ORDER.filter((f) => errors[f]);
  const motionProps = reduced
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: duration.ui, ease: ease.out } };

  return (
    <section id="enquiry" className="section enq" aria-labelledby="enquiry-title">
      <div className="container enq__grid">
        <div className="enq__intro">
          <Reveal as="p" className="eyebrow eyebrow--line">
            Booking enquiry
          </Reveal>
          <Reveal as="h2" id="enquiry-title" className="h1" delay={0.1}>
            Plan your <em>stay</em>
          </Reveal>
          <Reveal as="p" className="lede" delay={0.2}>
            Tell us when you would like to visit. We prepare your details as a WhatsApp message to the resort, and you send it yourself.
          </Reveal>

          <Reveal as="div" className="enq__assure" delay={0.3}>
            <p>
              <strong>This is an enquiry, not a booking.</strong> Availability and rates are confirmed by the resort after you send
              your message. Nothing is reserved or charged on this website.
            </p>
          </Reveal>

          <Reveal as="p" className="enq__direct" delay={0.35}>
            <Phone size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>
              Prefer to talk? <a href={telLink()}>{resort.contact.phone}</a>
              {' · '}
              <a href={whatsappUrl() || undefined} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </span>
          </Reveal>
        </div>

        <div className="enq__panel">
          <AnimatePresence mode="wait" initial={false}>
            {result ? (
              <motion.div key="result" className="enq__result" {...motionProps}>
                <div className="enq__result-inner" ref={resultRef} tabIndex={-1} role="status" aria-live="polite">
                  <p className="enq__badge">
                    <CheckCircle2 size={16} strokeWidth={1.75} aria-hidden="true" /> Enquiry prepared
                  </p>
                  <h3 className="h3">
                    {result.blocked || !result.wa ? 'Your enquiry is ready to send' : 'Almost there: send it in WhatsApp'}
                  </h3>

                  {result.wa && !result.blocked && (
                    <p className="enq__lede">
                      We have opened WhatsApp with your details already written. <strong>Press Send in WhatsApp</strong> to deliver it to
                      the resort. If WhatsApp did not open, use the button below.
                    </p>
                  )}
                  {result.wa && result.blocked && (
                    <p className="enq__lede enq__lede--warn">
                      Your browser blocked the WhatsApp window. Use the button below to open it. Your message is ready.
                    </p>
                  )}
                  {!result.wa && (
                    <p className="enq__lede enq__lede--warn">
                      The resort's WhatsApp number is not set up on this site, so you can send this by email or copy it.
                    </p>
                  )}

                  <div className="enq__notice" role="note">
                    <strong>Not confirmed yet.</strong> Your message has not reached the resort until you press Send. Even then, your stay is
                    only confirmed once the resort replies to confirm availability and rates.
                  </div>

                  <p className="enq__preview-label">Your message</p>
                  <pre className="enq__preview">{result.message}</pre>

                  <div className="enq__actions">
                    {result.wa && (
                      <Button href={result.wa} variant="solid" size="lg" target="_blank" rel="noopener noreferrer" iconNode={<MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />}>
                        {result.blocked ? 'Open WhatsApp' : 'Open WhatsApp again'}
                      </Button>
                    )}
                    {mailAvailable && result.mail && (
                      <Button href={result.mail} variant="primary" iconNode={<Mail size={16} strokeWidth={1.5} aria-hidden="true" />}>
                        Email instead
                      </Button>
                    )}
                    <Button onClick={copy} variant="primary" iconNode={copyState === 'done' ? <Check size={16} strokeWidth={1.5} aria-hidden="true" /> : <Copy size={16} strokeWidth={1.5} aria-hidden="true" />}>
                      {copyState === 'done' ? 'Copied' : 'Copy message'}
                    </Button>
                  </div>
                  {copyState === 'failed' && (
                    <p className="enq__note" role="alert">
                      Copy was not allowed by your browser. Select the message above and copy it manually.
                    </p>
                  )}
                  <p className="enq__note">
                    “Email instead” opens your own email app with the message filled in. This website does not send email for you.
                  </p>

                  <div className="enq__links">
                    <button type="button" className="enq__back" onClick={() => reset(true)}>
                      Edit my details
                    </button>
                    <button type="button" className="enq__back" onClick={() => reset(false)}>
                      Start a new enquiry
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="enq__form"
                onSubmit={onSubmit}
                noValidate
                aria-label="Booking enquiry form"
                variants={listVariants}
                initial={reduced ? false : 'hidden'}
                animate="show"
                exit={reduced ? undefined : { opacity: 0, y: -10, transition: { duration: 0.25 } }}
              >
                <AnimatePresence initial={false}>
                  {errorList.length > 0 && (
                    <motion.div
                      className="enq__summary field--wide"
                      ref={summaryRef}
                      tabIndex={-1}
                      role="alert"
                      key="summary"
                      initial={reduced ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: ease.out }}
                    >
                      <div>
                        <p className="enq__summary-title">
                          <AlertCircle size={16} strokeWidth={1.75} aria-hidden="true" /> Please check {errorList.length === 1 ? 'one thing' : `${errorList.length} things`} before we prepare your message
                        </p>
                        <ul>
                          {errorList.map((f) => (
                            <li key={f}>
                              <a href={`#${idOf(f)}`} onClick={jumpTo(f)}>
                                {FIELD_LABEL[f]}
                              </a>
                              : {errors[f]}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.fieldset className="field field--wide enq__types" variants={itemVariants} aria-describedby={errors.type ? `${idOf('type')}-error` : undefined}>
                  <legend>
                    Enquiry type <span aria-hidden="true">*</span>
                  </legend>
                  <div className="enq__type-grid" role="radiogroup" aria-label="Enquiry type" aria-invalid={Boolean(errors.type)}>
                    {ENQUIRY_TYPES.map((t, i) => (
                      <label key={t} className={`enq__type${values.type === t ? ' is-selected' : ''}`}>
                        <input
                          type="radio"
                          name="type"
                          id={i === 0 ? idOf('type') : `${uid}-type-${i}`}
                          value={t}
                          checked={values.type === t}
                          onChange={onChange('type')}
                        />
                        <span className="enq__type-name">{t}</span>
                        <span className="enq__type-note">{TYPE_NOTE[t]}</span>
                      </label>
                    ))}
                  </div>
                  {errors.type && (
                    <p className="field__error" id={`${idOf('type')}-error`} role="alert">
                      <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
                      <span>{errors.type}</span>
                    </p>
                  )}
                </motion.fieldset>

                <Field id={idOf('selection')} label="Room or package" error={errors.selection} optional wide>
                  <select
                    id={idOf('selection')}
                    name="selection"
                    value={values.selection}
                    onChange={onChange('selection')}
                    disabled={!values.type}
                    aria-invalid={Boolean(errors.selection)}
                    aria-describedby={describe('selection')}
                  >
                    <option value="">{values.type ? NOT_SURE : 'Choose an enquiry type first'}</option>
                    {groups.map((g) =>
                      g.items.length ? (
                        <optgroup key={g.group} label={g.group}>
                          {g.items.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </optgroup>
                      ) : null
                    )}
                  </select>
                </Field>

                <Field id={idOf('date')} label="Preferred date" required error={errors.date}>
                  <input
                    id={idOf('date')}
                    name="date"
                    type="date"
                    min={today}
                    value={values.date}
                    onChange={onChange('date')}
                    onBlur={onBlur('date')}
                    aria-required="true"
                    aria-invalid={Boolean(errors.date)}
                    aria-describedby={describe('date')}
                  />
                </Field>

                <Field id={idOf('guests')} label="Guests" required error={errors.guests} hint={hints.guests}>
                  <input
                    id={idOf('guests')}
                    name="guests"
                    type="number"
                    min="1"
                    max={LIMITS.guests}
                    step="1"
                    inputMode="numeric"
                    placeholder="e.g. 4"
                    value={values.guests}
                    onChange={onChange('guests')}
                    onBlur={onBlur('guests')}
                    aria-required="true"
                    aria-invalid={Boolean(errors.guests)}
                    aria-describedby={describe('guests', Boolean(hints.guests))}
                  />
                </Field>

                {values.type === 'Accommodation' && (
                  <Field id={idOf('endDate')} label="Check-out date" optional wide error={errors.endDate} hint="Leave blank if you are not sure yet.">
                    <input
                      id={idOf('endDate')}
                      name="endDate"
                      type="date"
                      min={values.date || today}
                      value={values.endDate}
                      onChange={onChange('endDate')}
                      onBlur={onBlur('endDate')}
                      aria-invalid={Boolean(errors.endDate)}
                      aria-describedby={describe('endDate', true)}
                    />
                  </Field>
                )}

                <Field id={idOf('name')} label="Your name" required error={errors.name}>
                  <input
                    id={idOf('name')}
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={LIMITS.name}
                    value={values.name}
                    onChange={onChange('name')}
                    onBlur={onBlur('name')}
                    aria-required="true"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={describe('name')}
                  />
                </Field>

                <Field id={idOf('mobile')} label="Mobile number" required error={errors.mobile} hint="The resort will use this to reply on WhatsApp or call.">
                  <input
                    id={idOf('mobile')}
                    name="mobile"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={20}
                    placeholder="98765 43210"
                    value={values.mobile}
                    onChange={onChange('mobile')}
                    onBlur={onBlur('mobile')}
                    aria-required="true"
                    aria-invalid={Boolean(errors.mobile)}
                    aria-describedby={describe('mobile', true)}
                  />
                </Field>

                <Field id={idOf('email')} label="Email" optional error={errors.email} wide>
                  <input
                    id={idOf('email')}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    maxLength={LIMITS.email}
                    value={values.email}
                    onChange={onChange('email')}
                    onBlur={onBlur('email')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={describe('email')}
                  />
                </Field>

                <Field id={idOf('message')} label="Additional message" optional wide error={errors.message} hint={`${values.message.length}/${LIMITS.message}`}>
                  <textarea
                    id={idOf('message')}
                    name="message"
                    rows="4"
                    maxLength={LIMITS.message}
                    placeholder="Occasion, dietary needs, arrival time, anything we should know"
                    value={values.message}
                    onChange={onChange('message')}
                    aria-describedby={describe('message', true)}
                  />
                </Field>

                {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
                <div className="enq__hp" aria-hidden="true">
                  <label htmlFor={`${uid}-website`}>Website</label>
                  <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange('website')} />
                </div>

                <motion.div className="field--wide enq__submit" variants={itemVariants}>
                  <Button type="submit" variant="solid" size="lg" iconNode={<MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />}>
                    {hasWhatsApp ? 'Send enquiry on WhatsApp' : 'Prepare my enquiry'}
                  </Button>
                  <p className="enq__privacy">
                    <ShieldCheck size={16} strokeWidth={1.5} aria-hidden="true" />
                    <span>
                      Your details stay in your browser. This website has no server and stores nothing. They go only into the WhatsApp
                      message you choose to send. Your booking is not confirmed until the resort confirms availability.
                    </span>
                  </p>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
