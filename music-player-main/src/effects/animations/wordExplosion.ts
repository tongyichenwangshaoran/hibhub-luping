import gsap from 'gsap';
import { AnimationEffect } from '../types';

const wordAppear: AnimationEffect = {
  id: 'wordAppear',
  name: 'Word Appear',
  description: 'Words appear in center with a smooth fade-in effect',
  animate: (element: HTMLElement, duration?: number) => {
    // Make sure element is visible
    gsap.set(element, { opacity: 1 });
    
    // Store the original text content
    const originalText = element.textContent || '';
    
    // Clear the element for our new structure
    element.textContent = '';
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.style.width = '100%';
    element.style.height = '100%';
    
    // Create a container for the animation
    const container = document.createElement('div');
    container.className = 'word-appear-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.zIndex = '1';
    container.style.pointerEvents = 'none';
    element.appendChild(container);
    
    // Get viewport dimensions
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    
    // Create word elements
    const words: HTMLElement[] = [];
    const wordArray = originalText.split(/\\s+/);
    
    wordArray.forEach((word) => {
      if (word.trim() === '') return; // Skip empty words
      
      const wordEl = document.createElement('div');
      wordEl.className = 'appear-word';
      wordEl.textContent = word;
      wordEl.style.position = 'absolute';
      wordEl.style.display = 'inline-block';
      wordEl.style.color = 'white';
      wordEl.style.fontWeight = 'bold';
      wordEl.style.fontSize = '8vw'; // 使用视口宽度的百分比，类似于gridExpand的4vw但更大
      wordEl.style.opacity = '0';
      wordEl.style.willChange = 'transform, opacity';
      wordEl.style.transformOrigin = 'center center';
      wordEl.style.padding = '5px 10px';
      wordEl.style.textAlign = 'center';
      
      container.appendChild(wordEl);
      words.push(wordEl);
    });
    
    // Calculate animation duration
    let animationDuration;
    
    if (duration) {
      // If duration is provided, use most of the available time
      animationDuration = duration * 0.95;
      
      // Ensure a minimum duration for visibility
      animationDuration = Math.max(2, animationDuration);
      
      console.log(`WordAppear animation: duration ${animationDuration}s of ${duration}s available`);
    } else {
      // Default duration if none provided
      animationDuration = 4; // Default to 4 seconds
    }
    
    // Create timeline
    const timeline = gsap.timeline();
    
    // Set initial state - all words in center
    gsap.set(words, { 
      opacity: 0,
      scale: 0.5,
      x: 0,
      y: 0,
      rotation: () => gsap.utils.random(-20, 20)
    });
    
    // Words appear in center with smooth fade-in (no bounce)
    timeline.to(words, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      ease: "power1.out", // Changed from back.out to power1.out for smooth non-bouncy animation
      duration: animationDuration * 0.3,
      stagger: 0.05
    });
    
    // Hold for the remainder of the animation duration
    timeline.to(words, {
      duration: animationDuration * 0.7,
      onComplete: () => {
        // We're not removing the container since words should remain visible
        // The container will be removed when the next lyric is displayed
      }
    });
    
    // If we have a specific duration, make sure the timeline fits within it
    if (duration) {
      const timelineCurrentDuration = timeline.duration();
      if (timelineCurrentDuration > duration * 0.95) {
        // If timeline is longer than 95% of available duration, speed it up
        timeline.timeScale(timelineCurrentDuration / (duration * 0.95));
      }
    }
  }
};

export default wordAppear;
