import gsap from 'gsap';
import { AnimationEffect } from '../types';

const fadeInUp: AnimationEffect = {
  id: 'fadeInUp',
  name: 'Fade In Up',
  description: 'Text fades in while moving up from below',
  animate: (element: HTMLElement) => {
    gsap.fromTo(element, 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
    );
  }
};

export default fadeInUp;
