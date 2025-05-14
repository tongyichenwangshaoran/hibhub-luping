import gsap from 'gsap';
import { AnimationEffect } from '../types';

const scaleUp: AnimationEffect = {
  id: 'scaleUp',
  name: 'Scale Up',
  description: 'Words scale up based on lyrics timing',
  animate: (element: HTMLElement, duration?: number) => {
    // Make sure element is visible
    gsap.set(element, { opacity: 1 });
    
    // Store the original text content
    const originalText = element.textContent || '';
    
    // Clear the element for our new structure
    element.textContent = '';
    
    // Create a container for the words
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    element.appendChild(container);
    
    // Split text into words
    const words = originalText.split(' ').filter(word => word.trim() !== '');
    
    // Create a wrapper for each word
    const wordElements: HTMLElement[] = [];
    words.forEach((word) => {
      const wordEl = document.createElement('div');
      wordEl.textContent = word;
      wordEl.style.position = 'absolute';
      wordEl.style.display = 'inline-block';
      wordEl.style.margin = '0 5px';
      wordEl.style.opacity = '0';
      wordEl.style.fontSize = '24px';
      wordEl.style.fontWeight = 'bold';
      wordEl.style.transformOrigin = 'center center';
      container.appendChild(wordEl);
      wordElements.push(wordEl);
    });
    
    // Hide all words initially
    gsap.set(wordElements, { opacity: 0, scale: 1 });
    
    // Calculate timing based on duration or default
    // If no duration provided, use default timing
    const totalDuration = duration || 2.5; // Default 2.5 seconds if no duration provided
    
    // Calculate how much time each word gets
    const wordCount = wordElements.length;
    const timePerWord = totalDuration / wordCount;
    
    // Minimum and maximum durations for a single word animation
    const minWordDuration = 0.3; // Minimum 0.3 seconds per word
    const maxWordDuration = 1.2; // Maximum 1.2 seconds per word
    
    // Clamp the word duration between min and max
    const wordDuration = Math.max(minWordDuration, Math.min(timePerWord, maxWordDuration));
    
    // Create a timeline for the sequence
    const timeline = gsap.timeline();
    
    // Animate each word one after another
    wordElements.forEach((wordEl, index) => {
      // Calculate when this word should start
      const startTime = index * wordDuration;
      
      // First make this word visible and bring it to front
      timeline.set(wordEl, { opacity: 1, zIndex: 10 }, startTime);
      
      // Then scale it up dramatically until it's off screen
      // Duration is based on the time available for each word
      timeline.to(wordEl, {
        scale: 20, // Scale up dramatically
        opacity: 0, // Fade out as it gets very large
        duration: wordDuration * 0.9, // Use 90% of the word's time for animation
        ease: "power2.in"
      });
      
      // After animation, hide the word
      timeline.set(wordEl, { zIndex: 1 });
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

export default scaleUp;
