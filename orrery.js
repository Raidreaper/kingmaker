// Interactive 3D Orrery System for Portfolio
import * as THREE from 'three';

export class OrrerySystem {
  constructor(threeBackground) {
    this.threeBackground = threeBackground;
    this.planets = [];
    this.planetInfo = [];
    this.isOrreryMode = false;
    this.isOrreryActive = false; // Track if orrery has been activated
    this.controls = null;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.animationId = null;
    this.backgroundAnimationId = null; // Separate animation for background mode
    
    // Orrery settings
    this.timeSpeed = 1;
    this.showOrbits = true;
    this.showLabels = true;
    
    this.init();
  }

  // Utility: generate a radial glow texture for sprite corona
  createRadialGlowTexture(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
    gradient.addColorStop(0, 'rgba(255, 210, 120, 0.9)');
    gradient.addColorStop(0.4, 'rgba(255, 180, 90, 0.35)');
    gradient.addColorStop(1, 'rgba(255, 160, 80, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  init() {
    // Use existing Three.js setup
    this.scene = this.threeBackground.scene;
    this.camera = this.threeBackground.camera;
    this.renderer = this.threeBackground.renderer;
    
    this.createSolarSystem();
    this.setupOrreryControls();
    this.createUI();
  }

  createSolarSystem() {
    // Clear existing particles temporarily
    if (this.threeBackground.particles) {
      this.scene.remove(this.threeBackground.particles);
    }

    // Sun
    const sunGeometry = new THREE.SphereGeometry(15, 32, 32);
    const sunMaterial = new THREE.MeshPhongMaterial({
      color: 0xffc04d,
      emissive: 0xff7a00,
      emissiveIntensity: 0.8,
      shininess: 60
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.name = 'Sun';
    this.scene.add(sun);

    // Add sun glow shell (soft halo)
    const sunGlowGeometry = new THREE.SphereGeometry(22, 32, 32);
    const sunGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffc04d,
      transparent: true,
      opacity: 0.18,
      depthWrite: false
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    sunGlow.name = 'SunGlow';
    this.scene.add(sunGlow);

    // Add an additive sprite to simulate bright corona
    const glowTexture = this.createRadialGlowTexture(256);
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xffd27a,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sunSprite = new THREE.Sprite(glowMaterial);
    sunSprite.name = 'SunCorona';
    sunSprite.scale.set(140, 140, 1); // size of the glow
    this.scene.add(sunSprite);

    // Planet data
    const planetData = [
      { name: 'Mercury', radius: 3, distance: 40, speed: 0.04, color: 0x8c7853 },
      { name: 'Venus', radius: 4, distance: 60, speed: 0.03, color: 0xffc649 },
      { name: 'Earth', radius: 4.5, distance: 80, speed: 0.02, color: 0x6b93d6 },
      { name: 'Mars', radius: 3.5, distance: 100, speed: 0.015, color: 0xc1440e },
      { name: 'Jupiter', radius: 12, distance: 140, speed: 0.008, color: 0xd8ca9d },
      { name: 'Saturn', radius: 10, distance: 180, speed: 0.005, color: 0xfad5a5 },
      { name: 'Uranus', radius: 6, distance: 220, speed: 0.003, color: 0x4fd0e7 },
      { name: 'Neptune', radius: 6, distance: 260, speed: 0.002, color: 0x4b70dd }
    ];

    // Create planets
    planetData.forEach((data, index) => {
      const planetGeometry = new THREE.SphereGeometry(data.radius, 16, 16);
      const planetMaterial = new THREE.MeshPhongMaterial({
        color: data.color,
        shininess: 30
      });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      
      // Create planet group for orbit
      const planetGroup = new THREE.Group();
      planetGroup.add(planet);
      
      // Position planet
      planet.position.x = data.distance;
      
      // Store planet data
      planet.userData = {
        ...data,
        angle: Math.random() * Math.PI * 2,
        originalDistance: data.distance
      };
      
      this.planets.push(planetGroup);
      this.planetInfo.push(data);
      this.scene.add(planetGroup);
      
      // Create orbit ring
      if (this.showOrbits) {
        const orbitGeometry = new THREE.RingGeometry(data.distance - 0.5, data.distance + 0.5, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0x444444,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        orbit.name = `${data.name}Orbit`;
        this.scene.add(orbit);
      }
      
      // Add planet labels
      if (this.showLabels) {
        this.createPlanetLabel(data.name, planet.position);
      }
    });

    // Add lighting (warmer, more dynamic)
    // Soft ambient from sky/ground
    const hemiLight = new THREE.HemisphereLight(0xfff1e0, 0x0a0a1a, 0.3);
    this.scene.add(hemiLight);

    // Bright point light at the Sun position to illuminate planets
    const sunLight = new THREE.PointLight(0xffdd99, 2.2, 0, 2);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = false;
    sunLight.name = 'SunLight';
    this.scene.add(sunLight);

    // Add asteroid belt
    this.createAsteroidBelt();
  }

  createAsteroidBelt() {
    const asteroidCount = 100;
    const asteroidGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0x666666 });
    
    for (let i = 0; i < asteroidCount; i++) {
      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
      
      // Random position in belt
      const angle = Math.random() * Math.PI * 2;
      const distance = 120 + Math.random() * 20;
      
      asteroid.position.x = Math.cos(angle) * distance;
      asteroid.position.z = Math.sin(angle) * distance;
      asteroid.position.y = (Math.random() - 0.5) * 10;
      
      asteroid.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      asteroid.userData = {
        angle: angle,
        distance: distance,
        speed: 0.01 + Math.random() * 0.01
      };
      
      this.scene.add(asteroid);
    }
  }

  createPlanetLabel(name, position) {
    // Create HTML label (simplified version)
    const label = document.createElement('div');
    label.textContent = name;
    label.style.position = 'absolute';
    label.style.color = 'white';
    label.style.fontSize = '12px';
    label.style.pointerEvents = 'none';
    label.style.zIndex = '1000';
    label.className = 'planet-label';
    label.dataset.planet = name;
    
    document.body.appendChild(label);
  }

  setupOrreryControls() {
    // Camera controls for orrery
    this.camera.position.set(0, 50, 300);
    this.camera.lookAt(0, 0, 0);
    
    // Mouse controls
    let isMouseDown = false;
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousedown', (e) => {
      if (!this.isOrreryMode) return;
      isMouseDown = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    document.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!this.isOrreryMode || !isMouseDown) return;
      
      const deltaX = e.clientX - mouseX;
      const deltaY = e.clientY - mouseY;
      
      // Rotate camera around the solar system
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(this.camera.position);
      
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      
      this.camera.position.setFromSpherical(spherical);
      this.camera.lookAt(0, 0, 0);
      
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Zoom controls
    document.addEventListener('wheel', (e) => {
      if (!this.isOrreryMode) return;
      e.preventDefault();
      
      const zoomSpeed = 0.1;
      const direction = e.deltaY > 0 ? 1 : -1;
      
      this.camera.position.multiplyScalar(1 + direction * zoomSpeed);
      
      // Limit zoom
      const distance = this.camera.position.length();
      if (distance < 50) {
        this.camera.position.normalize().multiplyScalar(50);
      } else if (distance > 500) {
        this.camera.position.normalize().multiplyScalar(500);
      }
    });
  }

  createUI() {
    // Create orrery control panel
    const controlsPanel = document.createElement('div');
    controlsPanel.id = 'orrery-controls';
    controlsPanel.innerHTML = `
      <div class="orrery-control-panel">
        <h3>Solar System Controls</h3>
        <div class="control-group">
          <label>Time Speed:</label>
          <input type="range" id="timeSpeed" min="0" max="5" step="0.1" value="1">
          <span id="speedValue">1x</span>
        </div>
        <div class="control-group">
          <label>
            <input type="checkbox" id="showOrbits" checked>
            Show Orbits
          </label>
        </div>
        <div class="control-group">
          <label>
            <input type="checkbox" id="showLabels" checked>
            Show Labels
          </label>
        </div>
        <div class="control-group">
          <button id="resetView">Reset View</button>
          <button id="exitOrrery">Exit Interactive Mode</button>
          <button id="disableOrrery">Disable Solar System</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(controlsPanel);
    
    // Add event listeners
    const timeSpeedSlider = document.getElementById('timeSpeed');
    const speedValue = document.getElementById('speedValue');
    const showOrbitsCheck = document.getElementById('showOrbits');
    const showLabelsCheck = document.getElementById('showLabels');
    const resetViewBtn = document.getElementById('resetView');
    const exitOrreryBtn = document.getElementById('exitOrrery');
    const disableOrreryBtn = document.getElementById('disableOrrery');
    
    timeSpeedSlider.addEventListener('input', (e) => {
      this.timeSpeed = parseFloat(e.target.value);
      speedValue.textContent = `${this.timeSpeed}x`;
    });
    
    showOrbitsCheck.addEventListener('change', (e) => {
      this.showOrbits = e.target.checked;
      this.toggleOrbits();
    });
    
    showLabelsCheck.addEventListener('change', (e) => {
      this.showLabels = e.target.checked;
      this.toggleLabels();
    });
    
    resetViewBtn.addEventListener('click', () => {
      this.resetCamera();
    });
    
    exitOrreryBtn.addEventListener('click', () => {
      this.exitOrreryMode();
    });
    
    disableOrreryBtn.addEventListener('click', () => {
      this.disableOrrery();
    });
  }

  toggleOrbits() {
    this.scene.children.forEach(child => {
      if (child.name && child.name.includes('Orbit')) {
        child.visible = this.showOrbits;
      }
    });
  }

  toggleLabels() {
    const labels = document.querySelectorAll('.planet-label');
    labels.forEach(label => {
      label.style.display = this.showLabels ? 'block' : 'none';
    });
  }

  resetCamera() {
    this.camera.position.set(0, 50, 300);
    this.camera.lookAt(0, 0, 0);
  }

  enterOrreryMode() {
    this.isOrreryMode = true;
    this.isOrreryActive = true; // Mark orrery as active
    
    // Create solar system if it doesn't exist
    if (this.planets.length === 0) {
      this.createSolarSystem();
    }
    
    // Hide original particles
    if (this.threeBackground.particles) {
      this.threeBackground.particles.visible = false;
    }
    
    // Show controls
    const controlsPanel = document.getElementById('orrery-controls');
    if (controlsPanel) {
      controlsPanel.style.display = 'block';
    }
    
    // Update labels position
    this.updateLabelPositions();
    
    // Start orrery animation
    this.startOrreryAnimation();
    
    // Update button visual state
    this.updateButtonState();
  }

  exitOrreryMode() {
    this.isOrreryMode = false;
    
    // Show original particles
    if (this.threeBackground.particles) {
      this.threeBackground.particles.visible = true;
    }
    
    // Hide controls
    const controlsPanel = document.getElementById('orrery-controls');
    if (controlsPanel) {
      controlsPanel.style.display = 'none';
    }
    
    // Hide labels
    const labels = document.querySelectorAll('.planet-label');
    labels.forEach(label => label.style.display = 'none');
    
    // Stop interactive orrery animation but keep background animation
    this.stopOrreryAnimation();
    
    // Start background solar system animation if orrery is active
    if (this.isOrreryActive) {
      this.startBackgroundSolarSystemAnimation();
    }
    
    // Update button visual state
    this.updateButtonState();
    
    // Reset camera
    this.camera.position.set(0, 0, 300);
  }

  clearSolarSystem() {
    // Only clear if orrery is being completely disabled
    if (!this.isOrreryActive) {
      // Remove all orrery objects
      const objectsToRemove = [];
      this.scene.children.forEach(child => {
        if (child.name && (
          child.name === 'Sun' || 
          child.name === 'SunGlow' || 
          child.name.includes('Orbit') ||
          child.userData.angle !== undefined // Asteroids and planets
        )) {
          objectsToRemove.push(child);
        }
      });
      
      objectsToRemove.forEach(obj => {
        this.scene.remove(obj);
      });
      
      // Remove labels
      const labels = document.querySelectorAll('.planet-label');
      labels.forEach(label => label.remove());
      
      this.planets = [];
    }
  }

  // New method to completely disable orrery
  disableOrrery() {
    this.isOrreryActive = false;
    this.isOrreryMode = false;
    
    // Stop all animations
    this.stopOrreryAnimation();
    this.stopBackgroundSolarSystemAnimation();
    
    // Clear solar system
    this.clearSolarSystem();
    
    // Show original particles
    if (this.threeBackground.particles) {
      this.threeBackground.particles.visible = true;
    }
    
    // Hide controls
    const controlsPanel = document.getElementById('orrery-controls');
    if (controlsPanel) {
      controlsPanel.style.display = 'none';
    }
    
    // Update button visual state
    this.updateButtonState();
    
    // Reset camera
    this.camera.position.set(0, 0, 300);
  }

  startOrreryAnimation() {
    const animate = () => {
      if (!this.isOrreryMode) return;
      
      this.animationId = requestAnimationFrame(animate);
      
      // Animate planets
      this.planets.forEach(planetGroup => {
        const planet = planetGroup.children[0];
        const userData = planet.userData;
        
        userData.angle += userData.speed * this.timeSpeed;
        planetGroup.rotation.y = userData.angle;
      });
      
      // Animate asteroids
      this.scene.children.forEach(child => {
        if (child.userData && child.userData.angle !== undefined && child.userData.distance !== undefined) {
          const userData = child.userData;
          userData.angle += userData.speed * this.timeSpeed;
          
          child.position.x = Math.cos(userData.angle) * userData.distance;
          child.position.z = Math.sin(userData.angle) * userData.distance;
          child.rotation.x += 0.01;
          child.rotation.y += 0.01;
        }
        // Make corona sprite follow the sun (at origin)
        if (child.name === 'SunCorona') {
          child.position.set(0, 0, 0);
        }
      });
      
      // Update label positions
      this.updateLabelPositions();
      
      this.renderer.render(this.scene, this.camera);
    };
    
    animate();
  }

  stopOrreryAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  startBackgroundSolarSystemAnimation() {
    const animate = () => {
      if (!this.isOrreryActive) return; // Stop if orrery is completely disabled
      
      this.backgroundAnimationId = requestAnimationFrame(animate);
      
      // Animate planets in background mode (slower, more subtle)
      this.planets.forEach(planetGroup => {
        const planet = planetGroup.children[0];
        const userData = planet.userData;
        
        userData.angle += userData.speed * 0.3; // Slower background speed
        planetGroup.rotation.y = userData.angle;
      });
      
      // Animate asteroids in background mode
      this.scene.children.forEach(child => {
        if (child.userData && child.userData.angle !== undefined && child.userData.distance !== undefined) {
          const userData = child.userData;
          userData.angle += userData.speed * 0.3; // Slower background speed
          
          child.position.x = Math.cos(userData.angle) * userData.distance;
          child.position.z = Math.sin(userData.angle) * userData.distance;
          child.rotation.x += 0.005; // Slower rotation
          child.rotation.y += 0.005;
        }
      });
      
      // Continue with normal Three.js background animation
      this.threeBackground.animate();
    };
    
    animate();
  }

  stopBackgroundSolarSystemAnimation() {
    if (this.backgroundAnimationId) {
      cancelAnimationFrame(this.backgroundAnimationId);
      this.backgroundAnimationId = null;
    }
  }

  updateLabelPositions() {
    const labels = document.querySelectorAll('.planet-label');
    
    labels.forEach(label => {
      const planetName = label.dataset.planet;
      const planet = this.scene.children.find(child => 
        child.children && child.children[0] && child.children[0].name === planetName
      );
      
      if (planet && planet.children[0]) {
        const worldPosition = new THREE.Vector3();
        planet.children[0].getWorldPosition(worldPosition);
        
        // Project 3D position to screen coordinates
        worldPosition.project(this.camera);
        
        const x = (worldPosition.x * 0.5 + 0.5) * window.innerWidth;
        const y = (worldPosition.y * -0.5 + 0.5) * window.innerHeight;
        
        label.style.left = x + 'px';
        label.style.top = y + 'px';
      }
    });
  }

  updateButtonState() {
    const orreryFab = document.getElementById('orreryFab');
    if (orreryFab) {
      if (this.isOrreryActive) {
        orreryFab.classList.add('active');
        // Update tooltip based on current state
        if (this.isOrreryMode) {
          orreryFab.title = 'Exit to Background Mode';
        } else {
          orreryFab.title = 'Enter Interactive Mode';
        }
      } else {
        orreryFab.classList.remove('active');
        orreryFab.title = 'Interactive Solar System';
      }
    }
  }

  destroy() {
    this.disableOrrery();
    const controlsPanel = document.getElementById('orrery-controls');
    if (controlsPanel) {
      controlsPanel.remove();
    }
  }
}

// Export function to create orrery
export function createOrrery(threeBackground) {
  return new OrrerySystem(threeBackground);
}
