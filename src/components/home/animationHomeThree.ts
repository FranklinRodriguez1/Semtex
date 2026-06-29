import * as THREE from 'three';

export function initializeThreeScene(containerId: string) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return () => {};
  }

  try {
    // =========================
    // SCENE
    // =========================
    const scene = new THREE.Scene();

    // =========================
    // CAMERA
    // =========================
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // =========================
    // RENDERER
    // =========================
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // =========================
    // LIGHT (🔥 PULSING LIGHT)
    // =========================
    const light = new THREE.PointLight(0x00dbe7, 1.5, 50);
    light.position.set(0, 0, 5);
    scene.add(light);

    // =========================
    // MAIN SPHERE
    // =========================
    const sphereRadius = 3.5;

    const geometry = new THREE.IcosahedronGeometry(sphereRadius, 15);

    const material = new THREE.MeshBasicMaterial({
      color: 0x00dbe7,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // =========================
    // PARTICLES
    // =========================
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 15;
      posArray[i + 1] = (Math.random() - 0.5) * 15;
      posArray[i + 2] = (Math.random() - 0.5) * 15;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: 0x00dbe7,
      transparent: true,
      opacity: 0.6,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );

    scene.add(particlesMesh);

    // =========================
    // CORE GLOW
    // =========================
    const coreGeometry = new THREE.IcosahedronGeometry(
      sphereRadius * 0.95,
      2
    );

    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00dbe7,
      transparent: true,
      opacity: 0.05,
    });

    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // =========================
    // CAMERA POSITION
    // =========================
    camera.position.z = 8;

    // =========================
    // ANIMATION CLOCK
    // =========================
    const clock = new THREE.Clock();

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Sphere rotation
      sphere.rotation.y += 0.002;
      sphere.rotation.x += 0.001;

      // Particles rotation
      particlesMesh.rotation.y += 0.0005;

      // =========================
      // PULSE (SPHERE + LIGHT)
      // =========================
      const pulse =
        1 +
        Math.sin(time * 2.0) * 0.06 +
        Math.sin(time * 0.5) * 0.02;

      sphere.scale.set(pulse, pulse, pulse);

      // 🔥 LIGHT PULSE (NEW)
      light.intensity = 1.5 + Math.sin(time * 2.0) * 1.2;
      light.position.z = 5 + Math.sin(time * 2.0) * 1.5;

      // Render
      renderer.render(scene, camera);
    };

    animate();

    // =========================
    // RESIZE
    // =========================
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // =========================
    // CLEANUP
    // =========================
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  } catch (error) {
    console.error('Failed to initialize Three.js scene:', error);
    return () => {};
  }
}

export default initializeThreeScene;