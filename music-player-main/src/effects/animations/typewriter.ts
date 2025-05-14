import gsap from 'gsap';
import { AnimationEffect } from '../types';
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const typewriter: AnimationEffect = {
  id: 'typewriter',
  name: 'Typewriter',
  description: 'Words appear with random rotation and bounce effect',
  animate: (element: HTMLElement) => {
    // Make sure element is visible
    gsap.set(element, { opacity: 1 });
    
    // Store the original text content
    const originalText = element.textContent || '';
    
    // Add a wrapper to preserve the original text structure
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline';
    wrapper.innerHTML = originalText.split(' ').map(word => 
      `<span class="word-wrapper" style="display: inline-block; margin-right: 0.3em;">${word}</span>`
    ).join('');
    
    // Replace the element content with our wrapper
    element.textContent = '';
    element.appendChild(wrapper);
    
    // Get all word wrappers
    const wordWrappers = element.querySelectorAll('.word-wrapper');
    
    // Clear any existing animations
    gsap.killTweensOf(wordWrappers);
    
    // Create the animation with random rotations
    gsap.from(wordWrappers, {
      y: -50,
      opacity: 0,
      rotation: () => gsap.utils.random(-60, 60), // Random rotation for each word
      duration: 0.7,
      ease: "back.out(1.7)", // Bounce effect
      stagger: 0.15 // Stagger the animation of each word
    });
    
    // No need for cleanup as we're not using SplitText
  }
};

export default typewriter;
