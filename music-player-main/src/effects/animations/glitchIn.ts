import gsap from 'gsap';
import { AnimationEffect } from '../types';

const glitchIn: AnimationEffect = {
  id: 'glitchIn',
  name: 'Glitch In',
  description: 'Text appears with a digital glitch effect',
  animate: (element: HTMLElement) => {
    const timeline = gsap.timeline();
    
    // Initial state
    gsap.set(element, { opacity: 0 });
    
    // Glitch effect
    timeline
      .to(element, { opacity: 0.3, x: -10, duration: 0.1 })
      .to(element, { opacity: 0.6, x: 5, duration: 0.1 })
      .to(element, { opacity: 0.2, x: -5, duration: 0.1 })
      .to(element, { opacity: 0.8, x: 10, duration: 0.1 })
      .to(element, { opacity: 1, x: 0, duration: 0.2 });
  }
};

export default glitchIn;
