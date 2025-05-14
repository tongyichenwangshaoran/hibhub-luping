import { AnimationEffect, StyleVariation } from './types';

// Import all animation effects
import fadeInUp from './animations/fadeInUp';
import scaleUp from './animations/scaleUp';
import scaleDown from './animations/scaleDown';
import rotateIn from './animations/rotateIn';
import typewriter from './animations/typewriter';
import blurIn from './animations/blurIn';
import glitchIn from './animations/glitchIn';
import flip3D from './animations/flip3D';
import cube3D from './animations/cube3D';
import train from './animations/train';
import gridExpand from './animations/gridExpand';
import wordAppear from './animations/wordExplosion';

// Import all style variations
import textStyles from './styles/textStyles';

// Registry of all available animation effects
const animationEffects: AnimationEffect[] = [
  fadeInUp,
  scaleUp,
  scaleDown,
  rotateIn,
  typewriter,
  blurIn,
  glitchIn,
  flip3D,
  cube3D,
  train,
  gridExpand,
  wordAppear
];

// Registry of all available style variations
const styleVariations: StyleVariation[] = textStyles;

// Get a random animation effect
export const getRandomAnimationEffect = (): AnimationEffect => {
  const randomIndex = Math.floor(Math.random() * animationEffects.length);
  return animationEffects[randomIndex];
};

// Get a random style variation
export const getRandomStyleVariation = (): StyleVariation => {
  const randomIndex = Math.floor(Math.random() * styleVariations.length);
  return styleVariations[randomIndex];
};

// Get animation effect by ID
export const getAnimationEffectById = (id: string): AnimationEffect | undefined => {
  return animationEffects.find(effect => effect.id === id);
};

// Get style variation by ID
export const getStyleVariationById = (id: string): StyleVariation | undefined => {
  return styleVariations.find(style => style.id === id);
};

// Get all animation effects
export const getAllAnimationEffects = (): AnimationEffect[] => {
  return [...animationEffects];
};

// Get all style variations
export const getAllStyleVariations = (): StyleVariation[] => {
  return [...styleVariations];
};
