"use client";

import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import styles from './AudioPlayer.module.css';

interface AudioPlayerProps {
  audioSrc: string;
  onTimeUpdate: (currentTime: number) => void;
  onPlay: () => void;
  onPause: () => void;
}

const AudioPlayer = ({ audioSrc, onTimeUpdate, onPlay, onPause }: AudioPlayerProps) => {
  const { theme, toggleTheme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Set initial volume
    audio.volume = volume;
    
    // Event listeners for metadata and duration
    const setAudioData = () => {
      // Check if duration is valid and update state
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
        console.log('Audio duration loaded:', audio.duration);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onPause) onPause();
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate(audio.currentTime);
      
      // If duration wasn't set yet, try to get it now
      if (duration === 0 && audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      
      // Update progress bar
      if (progressRef.current && audio.duration && !isNaN(audio.duration)) {
        const progressPercent = audio.currentTime / audio.duration;
        gsap.to(progressRef.current, { 
          scaleX: progressPercent,
          duration: 0.1,
          ease: 'none'
        });
      }
    };
    
    // Chrome sometimes needs these additional events to get the duration
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('durationchange', setAudioData);
    audio.addEventListener('canplay', setAudioData);
    audio.addEventListener('canplaythrough', setAudioData);
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    // Force metadata preload
    if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or higher
      setAudioData();
    }
    
    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('durationchange', setAudioData);
      audio.removeEventListener('canplay', setAudioData);
      audio.removeEventListener('canplaythrough', setAudioData);
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      
      // Cancel animation frame on unmount
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onPause, volume, duration, onTimeUpdate]);
  
  // Animation for progress bar
  useGSAP(() => {
    if (!progressRef.current) return;
    
    // Reset animation when component mounts
    gsap.set(progressRef.current, { 
      scaleX: 0,
      transformOrigin: 'left center'
    });
  }, { scope: containerRef });
  
  // Handle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (onPause) onPause();
      setIsPlaying(false);
    } else {
      setTimeout(() => {
        audio.play()
          .catch(error => {
            console.error("Error playing audio:", error);
          });
        if (onPlay) onPlay();
        setIsPlaying(true);
      }, 70);
    }
  };
  
  // Handle seeking
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = e.currentTarget;
    if (!audio || !progressBar) return;
    
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    
    audio.currentTime = percent * duration;
    setCurrentTime(audio.currentTime);
    onTimeUpdate(audio.currentTime);
    
    // Update progress bar immediately
    if (progressRef.current) {
      gsap.to(progressRef.current, { 
        scaleX: percent,
        duration: 0.1,
        ease: 'none'
      });
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audio.volume = newVolume;
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={styles.audioPlayer} ref={containerRef}>
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        preload="auto" 
        autoPlay
        style={{display: 'none'}}
        onLoadedMetadata={(e) => {
          const target = e.target as HTMLAudioElement;
          if (target.duration && !isNaN(target.duration)) {
            setDuration(target.duration);
          }
        }}
      />
      
      <div className={styles.controls}>
        <button 
          className={styles.playPauseButton} 
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <div className={styles.timeInfo}>
          <span className={styles.currentTime}>{formatTime(currentTime)}</span>
          <div 
            className={styles.progressContainer}
            onClick={handleProgressClick}
          >
            <div className={styles.progressBar}>
              <div className={styles.progress} ref={progressRef}></div>
            </div>
          </div>
          <span className={styles.duration}>{formatTime(duration)}</span>
        </div>
        
        <div className={styles.volumeContainer}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.volumeIcon}>
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
            <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
          </svg>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
          />
        </div>
        
        {/* 主题切换按钮 */}
        <button 
          onClick={toggleTheme} 
          className={styles.themeToggle}
          aria-label={theme === 'color' ? '切换到黑白主题' : '切换到彩色主题'}
        >
          {theme === 'color' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
