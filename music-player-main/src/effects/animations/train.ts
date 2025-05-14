import gsap from 'gsap';
import { AnimationEffect } from '../types';

const train: AnimationEffect = {
  id: 'train',
  name: 'Train Scroll',
  description: 'Text scrolls from right to left like a train, filling the screen width',
  animate: (element: HTMLElement, duration?: number) => {
    // Make sure element is visible and set to nowrap for the text
    gsap.set(element, { opacity: 1, whiteSpace: 'nowrap' });
    
    // Set up the container to prevent page scrolling but allow content to be visible
    // We'll use position relative/absolute to achieve this
    gsap.set(element, { position: 'relative' });
    
    // Make sure the page doesn't scroll horizontally
    document.body.style.overflowX = 'hidden';

    // Store the original text content
    const originalText = element.textContent || '';

    // Clear the element for our new structure
    element.textContent = '';

    // Create an inner span for the text to measure and animate
    const innerSpan = document.createElement('span');
    innerSpan.textContent = originalText;
    innerSpan.style.display = 'inline-block'; // Important for measuring width
    innerSpan.style.fontWeight = 'bold';
    innerSpan.style.position = 'absolute'; // Position absolutely to allow overflow
    innerSpan.style.whiteSpace = 'nowrap'; // Prevent text wrapping
    element.appendChild(innerSpan);

    // Use viewport width to ensure text can be seen across the full screen
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const containerWidth = element.offsetWidth;
    const parentWidth = viewportWidth; // Use full viewport width for animation
    
    // Adjust font size to make text more prominent
    // For train animation, make the text twice as large as other effects
    const containerHeight = element.offsetHeight;
    
    // Get the base font size (similar to other effects)
    const baseFontSize = Math.min(containerHeight * 0.8, 120); // Cap at 120px or 80% of container height
    
    // Double the font size for the train effect
    const fontSize = baseFontSize * 1.5;
    
    // Apply the larger font size
    innerSpan.style.fontSize = `${fontSize}px`;
    innerSpan.style.fontWeight = 'bold';
    
    // After setting font size, measure the text width
    const textWidth = innerSpan.offsetWidth;
    
    // Calculate animation duration based on the provided duration or default
    let animationDuration;
    
    if (duration) {
      // If duration is provided, calculate a reasonable speed based on text length
      // This ensures longer texts move faster to complete within the available time
      const totalDistance = textWidth + parentWidth;
      const minDuration = 2; // Minimum duration to ensure animation is visible
      const maxDuration = duration * 0.95; // Use at most 95% of available time
      
      // Calculate speed based on text length and available time
      // For very short durations, we'll use a minimum to ensure visibility
      animationDuration = Math.max(minDuration, Math.min(maxDuration, totalDistance / 500));
      
      console.log(`Train animation: text width ${textWidth}px, total distance ${totalDistance}px, duration ${animationDuration}s of ${duration}s available`);
    } else {
      // Default duration if none provided
      animationDuration = Math.max(5, (textWidth + parentWidth) / 200); // Base speed on text length, min 5s
    }

    // Create a timeline for better control
    const timeline = gsap.timeline();
    
    // Add the main animation to the timeline
    timeline.fromTo(
      innerSpan,
      { x: parentWidth }, // Start from right outside the parent container
      {
        x: -textWidth, // End at left outside the container
        duration: animationDuration,
        ease: 'linear', // Constant speed like a train
        onComplete: () => {
          // Optional: Clean up or reset after animation
          gsap.set(innerSpan, { x: parentWidth, opacity: 0 }); // Reset position for next time
        }
      }
    );
    
    // If we have a specific duration, make sure the timeline fits within it
    if (duration) {
      // Adjust timeline to fit exactly within the available duration if needed
      const timelineCurrentDuration = timeline.duration();
      if (timelineCurrentDuration > duration * 0.95) {
        // If timeline is longer than 95% of available duration, speed it up
        timeline.timeScale(timelineCurrentDuration / (duration * 0.95));
      }
    }
  }
};

export default train;
