import gsap from 'gsap';
import { AnimationEffect } from '../types';

const scaleDown: AnimationEffect = {
  id: 'scaleDown',
  name: 'Scale Down',
  description: 'Words scale down from large to normal size and stay on screen',
  animate: (element: HTMLElement, duration?: number) => {
    // Make sure element is visible
    gsap.set(element, { opacity: 1 });
    
    // Store the original text content
    const originalText = element.textContent || '';
    
    // Clear the element for our new structure
    element.textContent = '';
    
    // Create a wrapper to preserve the original text structure
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.justifyContent = 'center';
    wrapper.style.alignItems = 'center';
    element.appendChild(wrapper);
    
    // Split text into words
    const words = originalText.split(' ').filter(word => word.trim() !== '');
    
    // Create elements for each word
    const wordElements: HTMLElement[] = [];
    words.forEach(word => {
      const wordEl = document.createElement('span');
      wordEl.textContent = word;
      wordEl.style.display = 'inline-block';
      wordEl.style.margin = '0 0.15em'; // Add consistent spacing between words
      wordEl.style.opacity = '0';
      wordEl.style.transformOrigin = 'center center';
      wordEl.style.transform = 'scale(5)'; // Start large
      wrapper.appendChild(wordEl);
      wordElements.push(wordEl);
    });
    
    // Calculate timing for each word based on available duration
    const defaultDuration = 5; // Default duration if none provided
    const minWordDuration = 0.2; // Minimum time per word
    const maxWordDuration = 0.8; // Maximum time per word
    
    // Calculate how much time we have per word
    let timePerWord = defaultDuration / words.length;
    if (duration) {
      timePerWord = duration / words.length;
    }
    
    // Clamp the word duration between min and max
    const wordDuration = Math.max(minWordDuration, Math.min(timePerWord, maxWordDuration));
    
    // Create a timeline for the sequence
    const timeline = gsap.timeline();
    
    // Animate each word one after another
    wordElements.forEach((wordEl, index) => {
      // Calculate when this word should start
      const startTime = index * wordDuration;
      
      // Scale down from large to normal size and fade in
      timeline.to(wordEl, {
        scale: 1, // Scale down to normal size
        opacity: 1, // Fade in
        duration: wordDuration * 0.7, // Use 70% of the word's time for animation
        ease: "power2.out" // 平滑减速，没有弹跳效果
      }, startTime);
    });
    
    // If we have a specific duration, make sure the timeline fits within it
    if (duration) {
      // Adjust timeline to fit exactly within the available duration
      const timelineCurrentDuration = timeline.duration();
      if (timelineCurrentDuration < duration) {
        // If timeline is shorter than available duration, stretch it
        timeline.timeScale(timelineCurrentDuration / duration);
      } else if (timelineCurrentDuration > duration) {
        // If timeline is longer than available duration, speed it up
        timeline.timeScale(timelineCurrentDuration / duration);
      }
    }
  }
};

export default scaleDown;
