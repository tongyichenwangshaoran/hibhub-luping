import gsap from 'gsap';
import { AnimationEffect } from '../types';

const gridExpand: AnimationEffect = {
  id: 'gridExpand',
  name: 'Grid Expand',
  description: 'Lyrics appear in slanted rows moving in opposite directions',
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
    
    // Make sure the page doesn't scroll horizontally
    document.body.style.overflowX = 'hidden';
    
    // Use viewport dimensions for full screen effect
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    
    // Create a container with perspective that covers the full viewport
    const container = document.createElement('div');
    container.className = 'grid-container';
    container.style.position = 'fixed'; // Fixed position to cover viewport
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw'; // Full viewport width
    container.style.height = '100vh'; // Full viewport height
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.perspective = '600px';
    container.style.transform = 'rotate(-20deg)'; // Slant the entire container
    container.style.zIndex = '1'; // Ensure it's above other content
    container.style.pointerEvents = 'none'; // Allow clicking through
    element.appendChild(container);
    
    // Number of rows to create
    const numRows = 10;
    
    // Create rows of text
    const rows = [];
    
    for (let i = 0; i < numRows; i++) {
      const row = document.createElement('div');
      row.className = 'lyrics-row';
      row.style.position = 'absolute';
      row.style.width = '250%'; // Make it wider than the container
      row.style.left = '-75%'; // Position it to extend beyond both sides
      row.style.top = `${(i * 100 / numRows)}%`;
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'center';
      row.style.whiteSpace = 'nowrap';
      
      // Create a repeating text container for continuous scrolling
      const textContainer = document.createElement('div');
      textContainer.style.display = 'flex';
      textContainer.style.width = 'auto';
      textContainer.style.whiteSpace = 'nowrap';
      
      // Create multiple copies of the text to ensure continuous visibility
      for (let j = 0; j < 3; j++) { // Create 3 copies side by side
        const textEl = document.createElement('div');
        textEl.textContent = originalText;
        textEl.style.color = 'white';
        textEl.style.fontWeight = 'bold';
        textEl.style.fontSize = '4vw'; // Increased font size
        textEl.style.textTransform = 'uppercase';
        textEl.style.letterSpacing = '0.2em';
        textEl.style.marginRight = '100px'; // Add spacing between repeated texts
        
        textContainer.appendChild(textEl);
      }
      
      row.appendChild(textContainer);
      container.appendChild(row);
      rows.push(row);
    }
    
    // Create timeline
    const timeline = gsap.timeline();
    
    // Calculate animation duration based on provided duration or default
    let animationDuration;
    
    if (duration) {
      // For gridExpand, we want to use the entire available duration for one complete scroll
      // This ensures text scrolls exactly once during the lyric display time
      animationDuration = duration * 0.95; // Use 95% of available time to ensure completion
      
      // Ensure a minimum duration for visibility
      animationDuration = Math.max(2, animationDuration);
      
      console.log(`GridExpand animation: duration ${animationDuration}s of ${duration}s available`);
    } else {
      // Default duration if none provided
      animationDuration = 5; // Default to 5 seconds
    }
    
    // Set initial opacity to ensure visibility
    gsap.set(rows, { opacity: 1 });
    
    // Animate rows in alternating directions
    rows.forEach((row, index) => {
      // Alternate direction based on even/odd index
      const direction = index % 2 === 0 ? 1 : -1;
      
      // Calculate starting position (off screen in opposite directions)
      const startX = direction === 1 ? -100 : 100;
      
      // Create continuous scrolling effect
      // For continuous scrolling, we need to animate the text container
      const textContainer = row.firstChild as HTMLElement;
      
      // Calculate the width of one text item (including margin)
      const textWidth = textContainer.scrollWidth / 3; // We have 3 copies
      
      // Create scrolling animation that starts from off-screen
      // For alternating rows, we'll start from different sides
      const startPosition = direction === 1 ? viewportWidth : -textWidth - viewportWidth;
      const endPosition = direction === 1 ? -textWidth : viewportWidth;
      
      // Set initial position off-screen
      gsap.set(textContainer, { x: startPosition });
      
      // Animate from off-screen to off-screen in the opposite direction
      timeline.to(textContainer, {
          x: endPosition, // Move to opposite off-screen position
          duration: animationDuration, // Full animation duration for one complete cycle
          ease: "linear", // Linear motion for smooth continuous scrolling
          immediateRender: true // Ensure immediate rendering
        }, 
        0); // Start animation immediately
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

export default gridExpand;
