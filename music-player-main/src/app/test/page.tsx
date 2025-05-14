"use client";

import { useState, useEffect } from 'react';
import LyricsDisplay from '../../components/LyricsDisplay';
import { getAllAnimationEffects, getAllStyleVariations } from '../../effects/registry';
import { AnimationEffect, StyleVariation } from '../../effects/types';
import { LyricLine } from '../../utils/lrcParser';

export default function TestPage() {
  const [effects, setEffects] = useState<AnimationEffect[]>([]);
  const [styles, setStyles] = useState<StyleVariation[]>([]);
  const [selectedEffect, setSelectedEffect] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [testLyric, setTestLyric] = useState<string>('This is a test lyric to preview the animation effect');
  const [triggerAnimation, setTriggerAnimation] = useState<number>(0);
  
  // Sample lyrics for testing
  const sampleLyrics: LyricLine[] = [
    { time: 0, text: testLyric }
  ];

  // Load all available effects and styles
  useEffect(() => {
    setEffects(getAllAnimationEffects());
    setStyles(getAllStyleVariations());
  }, []);

  // Function to trigger the animation
  const handleTriggerAnimation = () => {
    setTriggerAnimation(prev => prev + 1);
  };

  // Define container style
  const containerClass = "min-h-screen bg-black text-white p-8 pb-32";

  return (
    <div className={containerClass}>
      <div className="mx-auto">
        <h1 className="text-3xl font-bold mb-8">Animation Effect Test Page</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Effect selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Animation Effect</h2>
            <div className="grid grid-cols-2 gap-4">
              {effects.map(effect => (
                <button
                  key={effect.id}
                  onClick={() => setSelectedEffect(effect.id)}
                  className={`p-3 rounded border ${
                    selectedEffect === effect.id 
                      ? 'bg-blue-600 border-blue-400' 
                      : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium">{effect.name}</div>
                  {effect.description && (
                    <div className="text-xs text-gray-400 mt-1">{effect.description}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Style selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Text Style</h2>
            <div className="grid grid-cols-2 gap-4">
              {styles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded border ${
                    selectedStyle === style.id 
                      ? 'bg-blue-600 border-blue-400' 
                      : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium">{style.name}</div>
                  {style.description && (
                    <div className="text-xs text-gray-400 mt-1">{style.description}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
        {/* Test lyric input */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Lyric</h2>
          <input
            type="text"
            value={testLyric}
            onChange={(e) => setTestLyric(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Enter test lyric text"
          />
        </div>
        
        {/* Preview button */}
        <div className="mb-8">
          <button
            onClick={handleTriggerAnimation}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded font-medium"
          >
            Preview Animation
          </button>
        </div>
        
        {/* Preview area */}
        <div className="border border-gray-700 rounded-lg p-8 h-[300px] flex items-center justify-center">
          <div className="w-full">
            {/* We use the key prop with triggerAnimation to force re-render and restart animation */}
            <div key={triggerAnimation}>
              <LyricsDisplay 
                currentTime={0} 
                lyrics={sampleLyrics}
                effectId={selectedEffect || undefined}
                styleId={selectedStyle || undefined}
              />
            </div>
          </div>
        </div>
        
        {/* Selected effect and style info */}
        <div className="mt-8 text-center text-gray-400">
          {selectedEffect && selectedStyle && (
            <p>
              Testing: <span className="text-white">{effects.find(e => e.id === selectedEffect)?.name}</span> animation 
              with <span className="text-white">{styles.find(s => s.id === selectedStyle)?.name}</span> style
            </p>
          )}
        </div>
        </div>
        </div>
      </div>
    </div>
    
  );
}
