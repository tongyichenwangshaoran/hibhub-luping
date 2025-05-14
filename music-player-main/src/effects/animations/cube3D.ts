import gsap from 'gsap';
import { AnimationEffect } from '../types';

const cube3D: AnimationEffect = {
  id: 'cube3D',
  name: '3D Cube',
  description: 'Words appear on rotating 3D cubes with each word on its own line',
  animate: (element: HTMLElement) => {
    // Make sure element is visible
    gsap.set(element, { opacity: 1 });
    
    // Store the original text content
    const originalText = element.textContent || '';
    
    // Clear the element for our new structure
    element.textContent = '';
    element.style.position = 'relative';
    element.style.minHeight = '400px'; // Allow for multiple lines in vertical stack
    
    // Create the POV container
    const pov = document.createElement('div');
    pov.className = 'lyrics-pov';
    pov.style.width = '100%';
    pov.style.height = '100%';
    pov.style.display = 'flex';
    pov.style.flexDirection = 'column';
    pov.style.alignItems = 'center';
    pov.style.justifyContent = 'center';
    element.appendChild(pov);
    
    // Create the tray container
    const tray = document.createElement('div');
    tray.className = 'lyrics-tray';
    tray.style.position = 'relative';
    tray.style.width = '100%';
    tray.style.display = 'flex';
    tray.style.flexDirection = 'column'; // Vertical layout
    tray.style.alignItems = 'center';
    tray.style.justifyContent = 'center';
    tray.style.gap = '0px'; // 减小行间距
    pov.appendChild(tray);
    
    // Split text into lines and then words
    const lines = originalText.split('\n');
    
    // Number of cubes to create
    const totalCubes = 19;
    let cubeCount = 0;
    
    // Process all words from all lines as a single array
    const allWords: string[] = [];
    lines.forEach(line => {
      const words = line.split(' ').filter(word => word.trim() !== '');
      allWords.push(...words);
    });
    
    // Create a cube for each word, each on its own line
    allWords.forEach((word, wordIndex) => {
      if (cubeCount >= totalCubes) return; // Limit the number of cubes
      
      // Create die container
      const die = document.createElement('div');
      die.className = 'lyrics-die';
      die.style.width = 'auto';
      die.style.minWidth = '120px';
      die.style.height = '50px'; // 增加高度
      die.style.margin = '5px 0';
      die.style.paddingBottom = '9px';
      die.style.perspective = '999px';
      die.style.display = 'inline-block';
      tray.appendChild(die); // Append directly to tray for vertical stack
      
      // Create cube
      const cube = document.createElement('div');
      cube.className = 'lyrics-cube';
      cube.style.position = 'absolute';
      cube.style.width = '100%';
      cube.style.height = '100%';
      cube.style.transformStyle = 'preserve-3d';
      die.appendChild(cube);
      
      // Define rotations for the 4 faces (exactly as in reference)
      const rotations = [
        { ry: 270, a: 0.5 },
        { ry: 0, a: 0.85 },
        { ry: 90, a: 0.4 },
        { ry: 180, a: 0 }
      ];
      
      // Create 4 faces with the same word
      for (let i = 0; i < 4; i++) {
        const face = document.createElement('div');
        face.className = 'lyrics-face';
        face.textContent = word;
        face.style.position = 'absolute';
        face.style.width = '100%';
        face.style.height = '100%';
        face.style.display = 'flex';
        face.style.alignItems = 'center';
        face.style.justifyContent = 'center';
        face.style.backfaceVisibility = 'hidden';
        face.style.fontWeight = 'bold';
        face.style.fontSize = `${Math.max(32, 56 - word.length)}px`; // 增大字体大小
        
        // Set initial position and rotation (exactly as in reference)
        gsap.set(face, {
          z: 200,
          rotateY: rotations[i].ry,
          transformOrigin: '50% 50% -201px'
        });
        
        cube.appendChild(face);
      }
      
      // 创建动画时间线
      const timeline = gsap.timeline({
        repeat: -1, 
        yoyo: true, 
        defaults: { ease: 'power3.inOut', duration: 1 }
      });
      
      // 设置固定颜色，不再变化
      gsap.set(cube.querySelectorAll('.lyrics-face'), {
        color: '#FFFFFF' // 使用纯白色
      });
      
      timeline
        .to(cube, {
          rotateY: "+=360", // 持续朝一个方向旋转360度
          ease: 'power2.inOut',
          duration: 4,
          repeat: -1, // 无限重复
          delay: 0.1 * cubeCount // 从上到下依次延迟增加0.1秒
        })
      
      // Increment cube count
      cubeCount++;
    });
    
    // Add animations to the entire tray (matching the reference)
    gsap.timeline()
      .from('.lyrics-tray', { yPercent: -3, duration: 2, ease: 'power1.inOut', yoyo: true, repeat: -1 }, 0)
      .fromTo('.lyrics-tray', { rotate: -15 }, { rotate: 15, duration: 4, ease: 'power1.inOut', yoyo: true, repeat: -1 }, 0)
      .from('.lyrics-die', { 
        duration: 0.5, // 减慢每个立方体的出现速度
        opacity: 0,    // 从透明开始
        stagger: { 
          each: 0.1,   // 每个立方体之间的间隔
          from: "start" // 从上到下出现
        }, 
        ease: 'power1.inOut' 
      }, 0)
      .to('.lyrics-tray', { scale: 1.2, duration: 2, ease: 'power3.inOut', yoyo: true, repeat: -1 }, 0);
  }
};

export default cube3D;
