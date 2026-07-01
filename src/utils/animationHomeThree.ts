import * as THREE from 'three';

export interface ThreeSceneController {
  /** Alterna el pulso rápido de la esfera para simular que la IA está "hablando". */
  setSpeaking: (speaking: boolean) => void;
  dispose: () => void;
}

export function initializeThreeScene(containerId: string): ThreeSceneController {
  const container = document.getElementById(containerId);
  if (!container) return { setSpeaking: () => {}, dispose: () => {} };

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
  // Tope a 2: en pantallas retina/4K, devicePixelRatio (2–3) renderiza 4–9×
  // los píxeles con antialias activo, sin diferencia visual apreciable.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Main wireframe sphere
  const sphereRadius = 3.5;
  // detail 4 (≈500 triángulos) es visualmente idéntico a 15 (≈5.120) para un
  // wireframe difuminado al 0.3 de opacidad, y cuesta ~10× menos a la GPU.
  const geometry = new THREE.IcosahedronGeometry(sphereRadius, 4);

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
  let speaking = false;

  const introStart = performance.now();
  const introDuration = 1200;

  const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
  const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const introProgress = easeOutCubic(
      clamp01((performance.now() - introStart) / introDuration)
    );

    sphere.rotation.y += speaking ? 0.006 : 0.002;
    sphere.rotation.x += 0.001;
    particlesMesh.rotation.y += 0.0005;

    const time = Date.now() * 0.001;
    // "Hablando": pulso más rápido y marcado, simula que la esfera vibra al responder.
    const pulse = speaking
      ? Math.sin(time * 9) * 0.12 + 1
      : Math.sin(time) * 0.05 + 1;
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
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;

    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', handleResize);

  // Pausar el bucle de render cuando la pestaña no está visible: evita quemar
  // GPU/CPU (y batería) animando algo que nadie ve.
  function handleVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  document.addEventListener('visibilitychange', handleVisibility);

  return {
    setSpeaking: (value: boolean) => {
      speaking = value;
    },
    dispose: () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
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
    },
  };
}

export default initializeThreeScene;
