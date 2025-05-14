import gsap from 'gsap';
import { AnimationEffect } from '../types';

const rotateIn: AnimationEffect = {
  id: 'rotateIn',
  name: 'Rotate In',
  description: 'Text rotates in from a slight angle',
  animate: (element: HTMLElement) => {
    gsap.fromTo(element, 
      { opacity: 0, rotation: -5, x: -30 }, 
      { opacity: 1, rotation: 0, x: 0, duration: 0.7, ease: "power1.out" }
    );
  }
};

export default rotateIn;
