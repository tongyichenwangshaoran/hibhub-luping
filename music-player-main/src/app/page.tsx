"use client";

import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import AudioPlayer from '../components/AudioPlayer';
import LyricsDisplay from '../components/LyricsDisplay';
import { parseLRC, LyricLine } from '../utils/lrcParser';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies 

function HomeContent() {
  const { theme } = useTheme();
  const container = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentGradient, setCurrentGradient] = useState<string>('--gradient-purple-haze');

  // Fetch and parse lyrics
  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const response = await fetch('/lyrics.lrc');
        const text = await response.text();
        const parsedLyrics = parseLRC(text);
        setLyrics(parsedLyrics);
      } catch (error) {
        console.error('Failed to load lyrics:', error);
      }
    };

    fetchLyrics();
  }, []);

  // Handle audio time updates
  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  // Handle play/pause state
  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  // 处理背景色变化 - 直接应用渐变背景
  const handleBackgroundChange = (color: string) => {
    // 如果是黑白主题，不改变背景颜色
    if (theme === 'blackAndWhite') {
      return;
    }
    
    // 预定义的渐变背景
    const gradients = [
      'linear-gradient(111.45deg, rgb(255, 135, 9) 19.42%, rgb(247, 189, 248) 73.08%)',
      'linear-gradient(166.9deg, rgb(10, 228, 72) 53.19%, rgb(0, 133, 208) 107.69%)',
      'linear-gradient(131.77deg, rgb(10, 21, 122) 30.82%, rgb(21, 191, 228) 81.82%)',
      'linear-gradient(153.58deg, rgb(247, 189, 248) 32.25%, rgb(47, 60, 192) 92.68%)',
      'linear-gradient(144.02deg, rgb(0, 186, 226) 4.56%, rgb(254, 197, 251) 72.98%)'
    ];
    
    const newGradient = gradients[Math.floor(Math.random() * gradients.length)];
    
    // 使用GSAP平滑过渡渐变背景
    if (container.current) {
      gsap.to(container.current, {
        background: newGradient,
        duration: 1.5, // 1.5秒平滑过渡
        ease: 'power2.inOut'
      });
    }
  };

  // 添加噪点纹理样式
  useEffect(() => {
    if (container.current) {
      // 添加噪点纹理
      container.current.style.position = 'relative';
    }
  }, []);

  return (
    <div 
      ref={container}
      className="flex items-center justify-items-center min-h-screen p-4 font-[family-name:var(--font-geist-sans)] text-white transition-colors duration-1000"
      style={{
        background: theme === 'blackAndWhite' 
          ? 'black' 
          : 'linear-gradient(111.45deg, rgb(255, 135, 9) 19.42%, rgb(247, 189, 248) 73.08%)',
        position: 'relative'
      }}
    >
      {/* 噪点纹理层 - 彩色模式下显示 */}
      {theme === 'color' && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/noise.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: 'auto',  // 使用原始大小，不拉伸
            backgroundPosition: '0 0',  // 从左上角开始平铺
            opacity: 0.4,
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      )}
      <main className="w-full flex flex-col items-center justify-center">
        <div className="w-full h-[70vh] mb-8">
          <LyricsDisplay 
            currentTime={currentTime} 
            lyrics={lyrics} 
            onBackgroundChange={handleBackgroundChange}
          />
        </div>
        <div className="w-full max-w-4xl relative z-10" style={{ position: 'relative', zIndex: 10 }}>
          <AudioPlayer 
            audioSrc="/audio/song.mp3" 
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
          />
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
