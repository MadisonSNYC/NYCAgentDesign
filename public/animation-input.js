/**
 * AnimationInput Class - Interactive animation generator component
 * This component provides a clean interface where users can type and see animations
 * responding to their input in real-time
 */
class AnimationInput {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container element with ID "${containerId}" not found.`);
      return;
    }
    
    // Initialize the component
    this.createElements();
    this.setupEventListeners();
    this.initParticles();
    this.initSVG();
    
    // Track the animation state
    this.animationState = {
      isProcessing: false,
      currentAnimations: [],
      particleElements: [],
      keywords: {
        bounce: ['bounce', 'jump', 'hop', 'spring'],
        rotate: ['rotate', 'spin', 'turn', 'twist'],
        fade: ['fade', 'dissolve', 'appear', 'vanish'],
        scale: ['grow', 'shrink', 'expand', 'scale', 'size'],
        color: ['color', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'orange', 'rainbow', 'neon'],
        shape: ['circle', 'square', 'triangle', 'heart', 'star', 'polygon', 'shape'],
        move: ['move', 'slide', 'travel', 'shift', 'translate'],
        path: ['path', 'curve', 'wave', 'zigzag', 'line'],
        speed: ['fast', 'slow', 'quick', 'rapid', 'smooth']
      }
    };
    
    // Initial animation to show the component is ready
    this.pulseReadyAnimation();
  }
  
  /**
   * Create all the DOM elements needed for the component
   */
  createElements() {
    // Create main container structure
    this.container.innerHTML = `
      <div class="animation-input-container">
        <div class="input-wrapper">
          <input id="animation-prompt" class="animation-input" 
            placeholder="Add some glow..." 
            type="text">
        </div>
        
        <div class="animation-preview">
          <div class="preview-label">Animation Preview</div>
          <div class="status-indicator">Ready to animate</div>
          
          <div class="canvas-container">
            <!-- Particle effects will be added here -->
          </div>
          
          <svg class="animation-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
            <!-- SVG elements will be added here dynamically -->
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              <!-- Path definitions for text to follow -->
              <path id="wavePath" d="M0,50 Q100,0 200,50 T400,50" />
            </defs>
          </svg>
        </div>
      </div>
    `;
    
    // Store references to elements for easy access
    this.prompt = document.getElementById('animation-prompt');
    this.preview = this.container.querySelector('.animation-preview');
    this.status = this.container.querySelector('.status-indicator');
    this.canvasContainer = this.container.querySelector('.canvas-container');
    this.svg = this.container.querySelector('.animation-svg');
  }
  
  /**
   * Set up event listeners for user interaction
   */
  setupEventListeners() {
    // Dynamic animation as user types
    this.prompt.addEventListener('input', () => this.handleInput());
    
    // Focus effects
    this.prompt.addEventListener('focus', () => {
      this.container.querySelector('.input-wrapper').classList.add('input-focus');
      this.triggerParticleEffect();
    });
    
    this.prompt.addEventListener('blur', () => {
      this.container.querySelector('.input-wrapper').classList.remove('input-focus');
    });
    
    // Add keyup delay for more natural typing response
    let typingTimer;
    this.prompt.addEventListener('keyup', (e) => {
      clearTimeout(typingTimer);
      
      // If Enter key was pressed, process immediately
      if (e.key === 'Enter') {
        this.processAnimationRequest();
      } else {
        typingTimer = setTimeout(() => this.processAnimationRequest(), 800);
      }
    });
  }
  
  /**
   * Initialize particle effects in the background
   */
  initParticles() {
    // Create initial particles for the background
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random properties
      particle.style.width = (3 + Math.random() * 5) + 'px';
      particle.style.height = particle.style.width;
      particle.style.left = (Math.random() * 100) + '%';
      particle.style.top = (Math.random() * 100) + '%';
      particle.style.opacity = 0.3 + (Math.random() * 0.5);
      
      // Save reference and add to DOM
      this.animationState.particleElements.push(particle);
      this.canvasContainer.appendChild(particle);
    }
    
    // Animate particles floating
    this.animateParticles();
  }
  
  /**
   * Initialize SVG elements for vector animations
   */
  initSVG() {
    // Create initial shape in the center for morphing
    const centerShape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerShape.classList.add('morph-shape');
    centerShape.setAttribute('cx', '200');
    centerShape.setAttribute('cy', '150');
    centerShape.setAttribute('r', '30');
    centerShape.setAttribute('fill', 'rgba(255, 0, 255, 0.2)');
    centerShape.setAttribute('stroke', '#ff00ff');
    centerShape.setAttribute('stroke-width', '2');
    centerShape.setAttribute('filter', 'url(#glow)');
    
    this.svg.appendChild(centerShape);
    this.centerShape = centerShape;
    
    // Create a text element that will follow a path
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.classList.add('path-text');
    textElement.setAttribute('fill', '#ffffff');
    textElement.setAttribute('filter', 'url(#glow)');
    
    const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    textPath.setAttribute('href', '#wavePath');
    textPath.setAttribute('startOffset', '0%');
    textPath.textContent = 'Type to animate...';
    
    textElement.appendChild(textPath);
    this.svg.appendChild(textElement);
    this.textPath = textPath;
  }
  
  /**
   * Handle input from the user as they type
   */
  handleInput() {
    const text = this.prompt.value.toLowerCase();
    
    // Update the status message
    if (text.length > 3) {
      this.status.textContent = "Processing your animation idea...";
      this.status.classList.add('active');
      
      // Enhance particle activity to indicate processing
      this.triggerParticleEffect();
    } else {
      this.status.textContent = "Ready to animate";
      this.status.classList.remove('active');
    }
    
    // Update the text path content for longer inputs
    if (text.length > 0) {
      this.textPath.textContent = text.length > 50 ? text.substring(0, 50) + '...' : text;
      
      // Animate the text path
      anime({
        targets: this.textPath,
        startOffset: ['0%', '100%'],
        duration: 20000,
        loop: true,
        easing: 'linear'
      });
    }
  }
  
  /**
   * Process the animation request after user finishes typing
   */
  processAnimationRequest() {
    const text = this.prompt.value.toLowerCase();
    if (text.length < 1) return;
    
    // Set processing state
    this.animationState.isProcessing = true;
    this.status.textContent = "Creating animations...";
    
    // Clear any existing major animations
    this.clearCurrentAnimations();
    
    // Create new animations based on the text input
    setTimeout(() => {
      // Look for keywords in the text
      this.parseKeywords(text);
      
      // Update status
      this.status.textContent = "Animation ready!";
      this.animationState.isProcessing = false;
      
      // Schedule a reset of the status after a few seconds
      setTimeout(() => {
        if (!this.animationState.isProcessing) {
          this.status.textContent = "Ready for more ideas";
          this.status.classList.remove('active');
        }
      }, 3000);
    }, 800);
  }
  
  /**
   * Parse keywords from the input text and trigger appropriate animations
   */
  parseKeywords(text) {
    let animationsAdded = 0;
    
    // Check for each type of animation keyword
    for (const [animationType, keywords] of Object.entries(this.animationState.keywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword) && animationsAdded < 5) {
          this.addAnimation(animationType, keyword);
          animationsAdded++;
          break; // Only add one animation per type
        }
      }
    }
    
    // If no specific animations were found, add a default one
    if (animationsAdded === 0) {
      this.addAnimation('default', 'default');
    }
  }
  
  /**
   * Add a specific animation based on detected keywords
   */
  addAnimation(type, keyword) {
    let animation;
    
    switch (type) {
      case 'bounce':
        animation = this.createBounceAnimation();
        break;
      case 'rotate':
        animation = this.createRotateAnimation();
        break;
      case 'fade':
        animation = this.createFadeAnimation();
        break;
      case 'scale':
        animation = this.createScaleAnimation();
        break;
      case 'color':
        animation = this.createColorAnimation(keyword);
        break;
      case 'shape':
        animation = this.createShapeAnimation(keyword);
        break;
      case 'move':
        animation = this.createMoveAnimation();
        break;
      case 'path':
        animation = this.createPathAnimation(keyword);
        break;
      case 'default':
      default:
        animation = this.createDefaultAnimation();
        break;
    }
    
    if (animation) {
      this.animationState.currentAnimations.push(animation);
    }
  }
  
  /**
   * Clear currently playing animations
   */
  clearCurrentAnimations() {
    // Stop all existing animations
    this.animationState.currentAnimations.forEach(anim => {
      if (anim && typeof anim.pause === 'function') {
        anim.pause();
      }
    });
    
    // Reset the array
    this.animationState.currentAnimations = [];
    
    // Reset the center shape to default
    anime.set(this.centerShape, {
      cx: 200,
      cy: 150,
      r: 30,
      fill: 'rgba(255, 0, 255, 0.2)',
      stroke: '#ff00ff',
      opacity: 1
    });
  }
  
  /**
   * Animate floating particles
   */
  animateParticles() {
    this.animationState.particleElements.forEach(particle => {
      anime({
        targets: particle,
        translateX: () => anime.random(-20, 20),
        translateY: () => anime.random(-20, 20),
        opacity: () => 0.3 + (Math.random() * 0.5),
        easing: 'easeInOutQuad',
        duration: () => anime.random(3000, 6000),
        complete: (anim) => {
          // Reset position after animation
          anime.set(particle, { translateX: 0, translateY: 0 });
          // Recursive call to keep particles moving
          this.animateParticles();
        }
      });
    });
  }
  
  /**
   * Trigger increased particle activity
   */
  triggerParticleEffect() {
    // Add more particles temporarily
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle', 'temp-particle');
      
      particle.style.width = (3 + Math.random() * 5) + 'px';
      particle.style.height = particle.style.width;
      particle.style.left = (Math.random() * 100) + '%';
      particle.style.top = (Math.random() * 100) + '%';
      
      this.canvasContainer.appendChild(particle);
      
      // Animate and remove
      anime({
        targets: particle,
        translateX: () => anime.random(-50, 50),
        translateY: () => anime.random(-50, 50),
        opacity: [1, 0],
        easing: 'easeOutExpo',
        duration: 1500,
        complete: () => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }
      });
    }
  }
  
  /**
   * Initial ready animation pulse
   */
  pulseReadyAnimation() {
    anime({
      targets: this.centerShape,
      r: [30, 35, 30],
      opacity: [0.5, 1, 0.5],
      stroke: ['#ff00ff', '#00ffff', '#ff00ff'],
      easing: 'easeInOutSine',
      duration: 2000,
      loop: true
    });
    
    // Text path animation
    anime({
      targets: this.container.querySelector('.path-text'),
      opacity: [0, 1],
      duration: 2000,
      easing: 'easeInOutQuad'
    });
  }
  
  /**
   * Create a bouncing animation
   */
  createBounceAnimation() {
    return anime({
      targets: this.centerShape,
      translateY: [-30, 0],
      duration: 1200,
      easing: 'easeOutElastic(1.2, 0.5)',
      loop: true,
      direction: 'alternate'
    });
  }
  
  /**
   * Create a rotation animation
   */
  createRotateAnimation() {
    // Create a group for rotation
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform-origin', '200 150');
    
    // Move the center shape into this group
    this.svg.removeChild(this.centerShape);
    group.appendChild(this.centerShape);
    this.svg.appendChild(group);
    
    return anime({
      targets: group,
      rotate: 360,
      duration: 3000,
      easing: 'easeInOutQuad',
      loop: true
    });
  }
  
  /**
   * Create a fade animation
   */
  createFadeAnimation() {
    return anime({
      targets: this.centerShape,
      opacity: [0, 1],
      duration: 2000,
      easing: 'easeInOutSine',
      loop: true,
      direction: 'alternate'
    });
  }
  
  /**
   * Create a scale animation
   */
  createScaleAnimation() {
    return anime({
      targets: this.centerShape,
      r: [10, 50, 10],
      duration: 3000,
      easing: 'easeInOutQuart',
      loop: true
    });
  }
  
  /**
   * Create a color change animation
   */
  createColorAnimation(colorKeyword) {
    // Define colors based on keyword
    let colors = ['#ff00ff', '#00ffff', '#ffff00'];
    
    // Override with specific color if mentioned
    if (colorKeyword === 'blue') colors = ['#0000ff', '#00aaff', '#00ffff'];
    if (colorKeyword === 'red') colors = ['#ff0000', '#ff3333', '#ff6666'];
    if (colorKeyword === 'green') colors = ['#00ff00', '#33ff33', '#66ff66'];
    if (colorKeyword === 'yellow') colors = ['#ffff00', '#ffff33', '#ffff66'];
    if (colorKeyword === 'purple') colors = ['#9900ff', '#aa33ff', '#bb66ff'];
    if (colorKeyword === 'pink') colors = ['#ff00ff', '#ff33ff', '#ff66ff'];
    if (colorKeyword === 'orange') colors = ['#ff6600', '#ff8833', '#ffaa66'];
    if (colorKeyword === 'rainbow') {
      colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    }
    
    return anime({
      targets: this.centerShape,
      stroke: colors,
      fill: colors.map(color => color.replace(')', ', 0.2)')),
      duration: 3000,
      easing: 'easeInOutSine',
      loop: true
    });
  }
  
  /**
   * Create a shape morphing animation
   */
  createShapeAnimation(shapeKeyword) {
    // Remove the original center shape
    this.svg.removeChild(this.centerShape);
    
    // Create a path for morphing
    const morphPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    morphPath.classList.add('morph-shape');
    morphPath.setAttribute('fill', 'rgba(255, 0, 255, 0.2)');
    morphPath.setAttribute('stroke', '#ff00ff');
    morphPath.setAttribute('stroke-width', '2');
    morphPath.setAttribute('filter', 'url(#glow)');
    
    this.svg.appendChild(morphPath);
    this.centerShape = morphPath;
    
    // Shape paths
    const circle = 'M200,150 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0';
    const square = 'M160,110 L240,110 L240,190 L160,190 Z';
    const triangle = 'M200,110 L240,190 L160,190 Z';
    const heart = 'M200,120 C230,90 270,120 240,160 L200,190 L160,160 C130,120 170,90 200,120';
    const star = 'M200,110 L210,140 L240,140 L215,160 L225,190 L200,170 L175,190 L185,160 L160,140 L190,140 Z';
    
    // Determine shapes to use
    let shapes = [circle, square, triangle];
    if (shapeKeyword === 'heart') shapes = [circle, heart, circle];
    if (shapeKeyword === 'star') shapes = [circle, star, circle];
    if (shapeKeyword === 'polygon') shapes = [triangle, square, triangle];
    
    return anime({
      targets: morphPath,
      d: shapes,
      duration: 3000,
      easing: 'easeInOutQuad',
      loop: true
    });
  }
  
  /**
   * Create a movement animation
   */
  createMoveAnimation() {
    return anime({
      targets: this.centerShape,
      cx: [
        { value: 100, duration: 1000, delay: 500 },
        { value: 300, duration: 1000, delay: 500 },
        { value: 200, duration: 1000, delay: 500 }
      ],
      cy: [
        { value: 100, duration: 1000, delay: 500 },
        { value: 200, duration: 1000, delay: 500 },
        { value: 150, duration: 1000, delay: 500 }
      ],
      easing: 'easeInOutQuad',
      loop: true
    });
  }
  
  /**
   * Create a path-following animation
   */
  createPathAnimation(pathKeyword) {
    // Create path elements
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.classList.add('animation-path');
    pathElement.setAttribute('fill', 'none');
    pathElement.setAttribute('stroke', 'rgba(255, 0, 255, 0.3)');
    pathElement.setAttribute('stroke-width', '2');
    
    // Define path based on keyword
    let pathD = 'M100,150 C150,100 250,100 300,150';  // Default curve
    
    if (pathKeyword === 'wave') {
      pathD = 'M50,150 C100,100 150,200 200,150 S300,100 350,150';
    } else if (pathKeyword === 'zigzag') {
      pathD = 'M50,150 L100,100 L150,200 L200,100 L250,200 L300,100 L350,150';
    } else if (pathKeyword === 'line') {
      pathD = 'M50,150 L350,150';
    }
    
    pathElement.setAttribute('d', pathD);
    this.svg.appendChild(pathElement);
    
    // Create a small circle to follow the path
    const follower = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    follower.setAttribute('r', '10');
    follower.setAttribute('fill', '#ff00ff');
    follower.setAttribute('filter', 'url(#glow)');
    this.svg.appendChild(follower);
    
    // Create a motion path animation
    const timeline = anime.timeline({
      loop: true,
      duration: 3000
    });
    
    // Add animation to draw the path
    timeline.add({
      targets: pathElement,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1000
    });
    
    // Add animation to follow the path
    timeline.add({
      targets: follower,
      translateX: function(el) {
        const path = document.querySelector('.animation-path');
        const pathLength = path.getTotalLength();
        
        return anime.setDashoffset(path) - pathLength;
      },
      translateY: function(el) {
        const path = document.querySelector('.animation-path');
        const pathLength = path.getTotalLength();
        
        return anime.setDashoffset(path) - pathLength;
      },
      easing: 'linear',
      duration: 2000,
      update: function(anim) {
        const path = document.querySelector('.animation-path');
        const progress = anim.progress / 100;
        
        // Get point position along the path
        const point = path.getPointAtLength(path.getTotalLength() * progress);
        follower.setAttribute('cx', point.x);
        follower.setAttribute('cy', point.y);
      }
    }, '-=500');
    
    return timeline;
  }
  
  /**
   * Create a default animation that combines multiple effects
   */
  createDefaultAnimation() {
    return anime({
      targets: this.centerShape,
      r: [20, 40, 20],
      fill: ['rgba(255, 0, 255, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(255, 0, 255, 0.2)'],
      stroke: ['#ff00ff', '#00ffff', '#ff00ff'],
      translateY: [0, -20, 0],
      easing: 'easeInOutSine',
      duration: 3000,
      loop: true
    });
  }
}

// Export the component
window.AnimationInput = AnimationInput; 