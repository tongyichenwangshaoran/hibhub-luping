"use client";

import { useEffect, useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { LyricLine } from '../utils/lrcParser';
import { 
  getRandomAnimationEffect, 
  getRandomStyleVariation, 
  getAnimationEffectById, 
  getStyleVariationById 
} from '../effects/registry';

// 定义一组背景色，每句歌词会从这里随机选择一个
const backgroundColors = [
  '#1a1a2e', // 深蓝黑
  '#16213e', // 深蓝
  '#0f3460', // 靛蓝
  '#541690', // 深紫
  '#4a0e5c', // 紫色
  '#7a0bc0', // 亮紫
  '#270082', // 深蓝紫
  '#7b113a', // 深红
  '#1e5128', // 深绿
  '#04293a', // 深青
  '#3d0000', // 深红褐
  '#150050', // 深紫蓝
  '#000000', // 纯黑
];

gsap.registerPlugin(useGSAP);

interface LyricsDisplayProps {
  currentTime: number;
  lyrics: LyricLine[];
  effectId?: string; // Optional effect ID for testing
  styleId?: string; // Optional style ID for testing
  onBackgroundChange?: (color: string) => void; // Callback to change background color
}

const LyricsDisplay = ({ currentTime, lyrics, effectId, styleId, onBackgroundChange }: LyricsDisplayProps) => {
  const [currentLyric, setCurrentLyric] = useState<string>('');
  const [currentLyricId, setCurrentLyricId] = useState<number>(-1);
  const [prevLyricId, setPrevLyricId] = useState<number>(-1);
  const [currentStyle, setCurrentStyle] = useState<string>('');
  const [usedBackgroundColors, setUsedBackgroundColors] = useState<string[]>([]);
  const lyricRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 获取一个随机背景色，避免连续使用相同的颜色
  const getRandomBackgroundColor = () => {
    // 过滤掉最近使用过的颜色（如果已经用了所有颜色，则重置）
    let availableColors = backgroundColors;
    if (usedBackgroundColors.length < backgroundColors.length) {
      availableColors = backgroundColors.filter(color => !usedBackgroundColors.includes(color));
    }
    
    // 随机选择一个颜色
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    const selectedColor = availableColors[randomIndex];
    
    // 更新已使用的颜色列表，保持最近使用的5个颜色
    setUsedBackgroundColors(prev => {
      const updated = [...prev, selectedColor];
      if (updated.length > 5) {
        return updated.slice(1); // 移除最旧的颜色
      }
      return updated;
    });
    
    return selectedColor;
  };

  // Apply animation and style when lyric changes
  useEffect(() => {
    if (!lyricRef.current || currentLyricId === -1) return;
    
    // Reset any previous animations
    gsap.set(lyricRef.current, { clearProps: "all" });
    lyricRef.current.innerHTML = currentLyric;
    
    // Get the specified effect or a random one
    const effect = effectId 
      ? getAnimationEffectById(effectId) || getRandomAnimationEffect()
      : getRandomAnimationEffect();
    
    // Get the specified style or a random one
    const style = styleId
      ? getStyleVariationById(styleId) || getRandomStyleVariation()
      : getRandomStyleVariation();
    
    setCurrentStyle(style.className);
    
    // Calculate duration until next lyric (if available)
    let animationDuration;
    if (currentLyricId >= 0 && currentLyricId < lyrics.length - 1) {
      // Calculate time until next lyric
      const currentLyricTime = lyrics[currentLyricId].time;
      const nextLyricTime = lyrics[currentLyricId + 1].time;
      animationDuration = nextLyricTime - currentLyricTime;
    }
    
    // Apply the effect with calculated duration
    effect.animate(lyricRef.current, animationDuration);
    
    // 更改背景色
    if (onBackgroundChange) {
      const newBackgroundColor = getRandomBackgroundColor();
      onBackgroundChange(newBackgroundColor);
    }
    
    // Log the effect and style used (for debugging)
    console.log(`Applied lyric effect: ${effect.name}, style: ${style.name}, duration: ${animationDuration}s`);
  }, [currentLyricId, currentLyric, effectId, styleId, lyrics]);

  // Update current lyric based on playback time
  useEffect(() => {
    if (lyrics.length === 0) return;

    // Find the current lyric based on time
    let currentLine = '';
    let foundMatch = false;
    let currentId = -1;
    
    // Find the exact match for current time
    for (let i = 0; i < lyrics.length - 1; i++) {
      if (currentTime >= lyrics[i].time && currentTime < lyrics[i + 1].time) {
        currentLine = lyrics[i].text;
        currentId = i;
        foundMatch = true;
        break;
      }
    }
    
    // Handle the last lyric or if no match was found
    if (!foundMatch) {
      // Check if we're at the last lyric
      const lastLyric = lyrics[lyrics.length - 1];
      if (currentTime >= lastLyric.time) {
        currentLine = lastLyric.text;
        currentId = lyrics.length - 1;
      } else {
        // If we're before any lyrics, show nothing or the first lyric
        currentLine = currentTime > 0 ? '' : lyrics[0].text;
        currentId = currentTime > 0 ? -1 : 0;
      }
    }
    
    // Only update if the lyric has changed
    if (currentId !== currentLyricId) {
      setPrevLyricId(currentLyricId);
      setCurrentLyricId(currentId);
      setCurrentLyric(currentLine);
    }
  }, [currentTime, lyrics, currentLyricId]);



  // Use useEffect to adjust font size to fill screen
  useEffect(() => {
    if (lyricRef.current && containerRef.current && currentLyric) {
      // Reset font size first to get accurate measurements
      lyricRef.current.style.fontSize = '16px';
      
      // Get container dimensions
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // Calculate the area available
      const availableArea = containerWidth * containerHeight * 0.8; // Use 80% of the area
      
      // Estimate characters (including spaces)
      const characters = currentLyric.length;
      
      // Calculate approximate font size based on area and character count
      // This is a heuristic that works reasonably well
      let fontSize = Math.sqrt(availableArea / (characters * 0.7));
      
      // Limit maximum font size
      fontSize = Math.min(fontSize, containerHeight * 0.5);
      
      // Apply the calculated font size
      lyricRef.current.style.fontSize = `${fontSize}px`;
    }
  }, [currentLyric]);

  return (
    <div className="flex items-center justify-center h-full w-full" ref={containerRef}>
      <div className="text-center w-full h-full flex justify-center relative">
        <p 
          ref={lyricRef}
          className={`tracking-wide leading-tight p-4 flex items-center justify-center transition-colors duration-300 ${currentStyle}`}
          style={{ 
            width: '100%',
            wordBreak: 'break-word',
            textAlign: 'center',
            lineHeight: '1.1',
            fontWeight: 'bold',
            position: 'relative'
          }}
        >
          {currentLyric || (lyrics.length > 0 ? '...' : 'Loading lyrics...')}
        </p>
      </div>
    </div>
  );

};

export default LyricsDisplay;
