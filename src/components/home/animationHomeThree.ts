import * as THREE from 'three';

export function initializeThreeScene(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return () => {};

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Main wireframe sphere
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

  // Particle field
  const particlesCount = 2000;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
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

  // Inner core
  const coreGeometry = new THREE.IcosahedronGeometry(sphereRadius * 0.95, 2);

  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x00dbe7,
    transparent: true,
    opacity: 0.05,
  });

  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  scene.add(core);

  let animationFrameId = 0;

  const introStart = performance.now();
  const introDuration = 1200;

  const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
  const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const introProgress = easeOutCubic(
      clamp01((performance.now() - introStart) / introDuration)
    );

    sphere.rotation.y += 0.002;
    sphere.rotation.x += 0.001;
    particlesMesh.rotation.y += 0.0005;

    const time = Date.now() * 0.001;
    const pulse = Math.sin(time) * 0.05 + 1;
    const introScale = 0.02 + introProgress * 0.98;

    sphere.scale.set(
      introScale * pulse,
      introScale * pulse,
      introScale * pulse
    );

    material.opacity = 0.3 * introProgress;
    coreMaterial.opacity = 0.05 * introProgress;
    particlesMaterial.opacity = 0.6 * introProgress;

    renderer.render(scene, camera);
  }

  animate();

  function handleResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;

    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', handleResize);

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
}

export default initializeThreeScene;