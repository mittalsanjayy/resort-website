import Button from './Button';
import { requestEnquiry } from '../../lib/enquiry';

/**
 * Hands the visitor to the enquiry form with "Interested in" pre-selected.
 * Without JavaScript it still works as a plain link to #enquiry.
 * Pass onNavigate to close a drawer first; the scroll then waits for its exit animation.
 */
export default function EnquireButton({ interest = '', onNavigate, children, ...props }) {
  const handle = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate();
    requestEnquiry(interest, { delay: onNavigate ? 500 : 0 });
  };
  return (
    <Button href="#enquiry" onClick={handle} {...props}>
      {children}
    </Button>
  );
}
