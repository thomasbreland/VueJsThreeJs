<template>
  <div class="threejs" ref="threeJsContainer">
    <h1>This is a three.js page</h1>
  </div>
</template>

<script>
  import WebGL from 'three/addons/capabilities/WebGL.js';
  import * as THREE from 'three';
  import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

  export default {
    data() {
      return {
        // do not define here, because Vue3 reactivity bug does not work with three.js canvas
        // https://stackoverflow.com/questions/65693108/threejs-component-working-in-vuejs-2-but-not-3
      };
    },
    mounted() {
      if (WebGL.isWebGLAvailable()) {
        this.createScene();
        // Initialize variables to track mouse or touch movement
        this.isDragging = false;
        this.previousMousePosition = {
          x: 0,
          y: 0
        };

        // Add event listeners for mouse or touch events
        this.renderer.domElement.addEventListener('mousedown', this.onMouseDown);
        this.renderer.domElement.addEventListener('mouseup', this.onMouseUp);
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove);
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart);
        this.renderer.domElement.addEventListener('touchend', this.onTouchEnd);
        this.renderer.domElement.addEventListener('touchmove', this.onTouchMove);
        window.addEventListener('resize', this.handleWindowResize);
      } else {
        const warning = WebGL.getWebGLErrorMessage();
        this.$refs.threeJsContainer.appendChild(warning);
      }
    },
    beforeUnmount() {
      this.renderer.domElement.removeEventListener('mousedown', this.onMouseDown);
      this.renderer.domElement.removeEventListener('mouseup', this.onMouseUp);
      this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove);
      this.renderer.domElement.removeEventListener('touchstart', this.onTouchStart);
      this.renderer.domElement.removeEventListener('touchend', this.onTouchEnd);
      this.renderer.domElement.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('resize', this.handleWindowResize);
    },
    methods: {
      createScene() {
        // Create a new Three.js scene
        this.scene = new THREE.Scene();
        this.container = this.$refs.threeJsContainer;

        // Create a camera
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.z = 10;

        // Create a renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // Create a directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1); // Set light position (x, y, z)
        this.scene.add(directionalLight);

        // Load the STL model
        const loader = new STLLoader();
        this.material = null;
        this.mesh = null;
        loader.load('teapot.stl', (geometry) => {
          geometry.computeVertexNormals(); // Optional, but can improve shading
          // todo: enable shadows and add a plane? idk.
          // Can the plane be clear but have a shadow? shadow against website background?
          this.material = new THREE.MeshPhongMaterial({ color: 0x00ff00, specular: 0x111111, shininess: 200  });
          this.mesh = new THREE.Mesh(geometry, this.material);
          this.scene.add(this.mesh);
          this.mesh.rotation.x = 0.65;
          this.prevTime = performance.now();
          this.animate();
        });
      },
      animate() {
        // Update animation frames using requestAnimationFrame
        const animateFrame = () => {
          requestAnimationFrame(animateFrame);

          // Calculate time elapsed since last frame
          const now = performance.now();
          const deltaTime = now - this.prevTime;
          this.prevTime = now;

          // Update rotation based on elapsed time
          if(!this.isDragging) {
            const rotationSpeed = 0.001;
            const rotationIncrement = rotationSpeed * deltaTime;
            this.mesh.rotation.y += rotationIncrement;
          }

          this.renderer.render(this.scene, this.camera);
        };
        animateFrame(); // Start the animation loop
      },
      handleWindowResize() {
        // Update renderer size and aspect ratio when window is resized
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
      },
      onMouseDown(event) {
        this.isDragging = true;
        this.previousMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      },
      onMouseUp() {
        this.isDragging = false;
      },
      onMouseMove(event) {
        if (!this.isDragging) return;

        const deltaMove = {
          x: event.clientX - this.previousMousePosition.x,
          y: event.clientY - this.previousMousePosition.y
        };

        this.rotateMesh(deltaMove);

        this.previousMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      },
      onTouchStart(event) {
        if (event.touches.length === 1) {
          this.isDragging = true;
          this.previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
          };
        }
      },
      onTouchEnd() {
        this.isDragging = false;
      },
      onTouchMove(event) {
        if (!this.isDragging || event.touches.length !== 1) return;

        const deltaMove = {
          x: event.touches[0].clientX - this.previousMousePosition.x,
          y: event.touches[0].clientY - this.previousMousePosition.y
        };

        this.rotateMesh(deltaMove);

        this.previousMousePosition = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      },
      rotateMesh(delta) {
        this.mesh.rotation.x += delta.y * 0.01;
        this.mesh.rotation.y += delta.x * 0.01;
      }
    }
  };
</script>

<style scoped>
.threejs h1 {
  position: absolute; /* Position the header */
  z-index: 1;
  pointer-events: none;
}
.threejs {
  background-color: transparent;
  height: 50vh;
  display: flex;
  align-items: center;
}
@media (min-width: 1024px) {
  .threejs {
    min-height: 100vh;
  }
}
</style>
