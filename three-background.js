// Three.js Animated Background for Portfolio
import * as THREE from 'three';

export class ThreeBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.geometry = null;
    this.material = null;
    this.animationId = null;
    this.mouse = { x: 0, y: 0 };
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createParticles();
    this.createGeometry();
    this.setupEventListeners();
    this.animate();
    this.isInitialized = true;
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 1, 1000);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 300;
  }

  createRenderer() {
    // Optimize renderer settings based on device
    const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // reduce GPU load; mobile already handled below
      powerPreference: isMobile ? "low-power" : "high-performance",
      preserveDrawingBuffer: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Cap pixel ratio to reduce memory pressure
    const maxPixelRatio = isMobile ? 1 : 1.5;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
    this.renderer.setClearColor(0x000000, 0);
    
    // Replace the existing particles container
    const container = document.getElementById('particles-js');
    if (container) {
      container.innerHTML = '';
      container.appendChild(this.renderer.domElement);
      
      // Hide loading indicator
      const loadingIndicator = document.getElementById('loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }
    }

    // Handle WebGL context loss/restoration
    const canvas = this.renderer.domElement;
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      this.pauseAnimation();
      // Try to free up GPU resources
      try {
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
      } catch (_) {}
    }, { passive: false });

    canvas.addEventListener('webglcontextrestored', () => {
      // Recreate scene resources and resume
      this.recreateResources();
      this.resumeAnimation();
    });
  }

  createParticles() {
    // Adjust particle count based on device performance
    const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const particleCount = isMobile ? 400 : 1500;
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Create particle positions, colors, and sizes
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a large sphere
      positions[i3] = (Math.random() - 0.5) * 2000;
      positions[i3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i3 + 2] = (Math.random() - 0.5) * 2000;
      
      // Random colors (blue to purple gradient)
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.5 + Math.random() * 0.3);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Random sizes
      sizes[i] = Math.random() * 3 + 1;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    // Match shader attribute name and updateTheme expectations
    this.geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create shader material for better performance
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2() },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        uniform float time;
        uniform vec2 mouse;
        
        void main() {
          vColor = customColor;
          vec3 pos = position;
          
          // Add wave motion
          pos.y += sin(time * 0.001 + position.x * 0.01) * 10.0;
          pos.x += cos(time * 0.001 + position.z * 0.01) * 5.0;
          
          // Mouse interaction
          vec2 mouseInfluence = (mouse - 0.5) * 100.0;
          pos.xy += mouseInfluence * 0.1;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create circular particles
          float distance = length(gl_PointCoord - vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
          
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      vertexColors: false
    });

    this.particles = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particles);
  }

  createGeometry() {
    // Add some floating geometric shapes for visual interest
    const geometries = [
      new THREE.TetrahedronGeometry(20, 0),
      new THREE.OctahedronGeometry(15, 0),
      new THREE.IcosahedronGeometry(25, 0)
    ];

    geometries.forEach((geo, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6 + index * 0.1, 0.8, 0.6),
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      this.scene.add(mesh);
    });
  }

  setupEventListeners() {
    // Mouse movement for interactive effects
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = event.clientX / window.innerWidth;
      this.mouse.y = 1.0 - (event.clientY / window.innerHeight);
      
      if (this.material.uniforms.mouse) {
        this.material.uniforms.mouse.value.set(
          this.mouse.x,
          this.mouse.y
        );
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (!this.isInitialized) return;
      
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      
      if (this.material.uniforms.resolution) {
        this.material.uniforms.resolution.value.set(
          window.innerWidth,
          window.innerHeight
        );
      }
    });

    // Performance optimization: pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimation();
      } else {
        this.resumeAnimation();
      }
    });
  }

  animate() {
    // Prevent multiple RAF loops
    if (this.animationId) return;
    const loop = () => {
      this.animationId = requestAnimationFrame(loop);
      
      if (!this.isInitialized) return;
  
      const time = Date.now();
      
      // Update shader uniforms
      if (this.material && this.material.uniforms && this.material.uniforms.time) {
        this.material.uniforms.time.value = time;
      }
      
      // Rotate particles
      if (this.particles) {
        this.particles.rotation.x += 0.0005;
        this.particles.rotation.y += 0.001;
      }
      
      // Rotate geometric shapes
      this.scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.x += 0.005;
          child.rotation.y += 0.01;
          child.rotation.z += 0.002;
        }
      });
      
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  pauseAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resumeAnimation() {
    if (!this.animationId) {
      this.animate();
    }
  }

  // Method to change theme colors
  updateTheme(themeIndex) {
    if (!this.geometry || !this.geometry.attributes.customColor) return;
    
    const colors = this.geometry.attributes.customColor.array;
    const colorSchemes = [
      { h: 0.6, s: 0.7, l: 0.5 }, // Purple/Blue
      { h: 0.5, s: 0.8, l: 0.6 }, // Cyan/Blue
      { h: 0.3, s: 0.7, l: 0.5 }, // Green
      { h: 0.0, s: 0.8, l: 0.6 }, // Red
      { h: 0.1, s: 0.9, l: 0.6 }, // Orange
      { h: 0.4, s: 0.8, l: 0.5 }  // Teal
    ];
    
    const scheme = colorSchemes[themeIndex % colorSchemes.length];
    
    for (let i = 0; i < colors.length; i += 3) {
      const color = new THREE.Color();
      color.setHSL(
        scheme.h + (Math.random() - 0.5) * 0.2,
        scheme.s,
        scheme.l + (Math.random() - 0.5) * 0.3
      );
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    
    this.geometry.attributes.customColor.needsUpdate = true;
  }

  // Cleanup method
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.geometry) {
      this.geometry.dispose();
    }
    
    if (this.material) {
      this.material.dispose();
    }
  }

  recreateResources() {
    // Rebuild scene objects without replacing the renderer instance
    // Clear scene
    while (this.scene.children.length > 0) {
      const child = this.scene.children[0];
      this.scene.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    }
    this.particles = null;
    this.geometry = null;
    this.material = null;
    
    // Recreate content
    this.createParticles();
    this.createGeometry();
  }
}

// Initialize Three.js background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for the page to load completely
  setTimeout(() => {
    window.threeBackground = new ThreeBackground();
  }, 1000);
});
