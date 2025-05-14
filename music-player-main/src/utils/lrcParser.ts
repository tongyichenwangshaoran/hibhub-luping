export interface LyricLine {
  time: number;
  text: string;
}

/**
 * Parse LRC format lyrics file
 * @param lrcContent - The content of the LRC file
 * @returns Array of parsed lyrics with timestamps
 */
export const parseLRC = (lrcContent: string): LyricLine[] => {
  const lines = lrcContent.split('\n');
  const result: LyricLine[] = [];

  lines.forEach(line => {
    // Skip empty lines
    if (!line.trim()) return;
    
    // Extract time tags [mm:ss.xxx]
    const timeTagMatches = line.match(/\[(\d{2}):(\d{2})\.(\d{3})\]/g);
    if (!timeTagMatches) return;
    
    // Get the content after removing all time tags
    let content = line;
    timeTagMatches.forEach(tag => {
      content = content.replace(tag, '');
    });
    content = content.trim();
    
    // Check for section markers like [Verse 1] or [Hook]
    if (!content) {
      const sectionMatch = line.match(/\[(\w+\s*\d*)\]/);
      if (sectionMatch) {
        content = sectionMatch[1];
      }
    }
    
    // Skip if no content
    if (!content) return;
    
    // Process each time tag
    timeTagMatches.forEach(timeTag => {
      const match = timeTag.match(/\[(\d{2}):(\d{2})\.(\d{3})\]/);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const milliseconds = parseInt(match[3], 10);
        const time = minutes * 60 + seconds + milliseconds / 1000;
        
        result.push({ time, text: content });
      }
    });
  });

  return result.sort((a, b) => a.time - b.time);
};
