import gsap from 'gsap';
import { AnimationEffect } from '../types';

const blurIn: AnimationEffect = {
  id: 'blurIn',
  name: 'Blur In',
  description: 'Text comes into focus from a blurred state',
  animate: (element: HTMLElement) => {
    gsap.fromTo(element, 
      { opacity: 0, filter: 'blur(10px)' }, 
      { opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: "power2.out" }
    );
  }
};

export default blurIn;
