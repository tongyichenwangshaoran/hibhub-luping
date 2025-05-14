import gsap from 'gsap';
import { AnimationEffect } from '../types';

const flip3D: AnimationEffect = {
  id: 'flip3D',
  name: '3D Flip',
  description: 'Text flips in with a 3D perspective',
  animate: (element: HTMLElement) => {
    gsap.fromTo(element, 
      { opacity: 0, rotationX: 90, transformPerspective: 600 }, 
      { opacity: 1, rotationX: 0, duration: 0.8, ease: "back.out(1.2)" }
    );
  }
};

export default flip3D;
