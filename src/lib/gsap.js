import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// Phone browsers resize the viewport whenever the address bar slides away. Without this, every such
// resize re-measures every trigger on the page, which shows up as jank while scrolling.
ScrollTrigger.config({ ignoreMobileResize: true });
gsap.defaults({ ease: 'expo.out', duration: 1 });

export { gsap, ScrollTrigger };
