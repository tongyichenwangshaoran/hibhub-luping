import { StyleVariation } from '../types';

// Collection of text style variations
const textStyles: StyleVariation[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Default white text',
    className: 'text-white font-bold'
  },
  {
    id: 'blue',
    name: 'Blue',
    description: 'Blue text',
    className: 'text-blue-400 font-bold'
  },
  {
    id: 'purple',
    name: 'Purple',
    description: 'Purple text',
    className: 'text-purple-400 font-bold'
  },
  {
    id: 'green',
    name: 'Green',
    description: 'Green text',
    className: 'text-green-400 font-bold'
  },
  {
    id: 'yellow',
    name: 'Yellow',
    description: 'Yellow text',
    className: 'text-yellow-300 font-bold'
  },
  {
    id: 'pink',
    name: 'Pink',
    description: 'Pink text',
    className: 'text-pink-400 font-bold'
  },
  {
    id: 'boldItalic',
    name: 'Bold Italic',
    description: 'Bold italic text',
    className: 'text-white font-bold italic'
  },
  {
    id: 'uppercase',
    name: 'Uppercase',
    description: 'Uppercase text',
    className: 'text-white uppercase tracking-wide font-bold'
  },
  {
    id: 'lowercase',
    name: 'Lowercase',
    description: 'Lowercase text',
    className: 'text-white lowercase tracking-tight font-bold'
  },
  {
    id: 'glow',
    name: 'Glow',
    description: 'Text with glowing effect',
    className: 'text-white font-bold text-shadow-glow'
  },
];

export default textStyles;
