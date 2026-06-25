"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Loginy() {
  const [isLogin, setIsLogin] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: any = null;
    let frameId = 0;
    let observer: ResizeObserver | null = null;

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0f172a, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    const pointLight = new THREE.PointLight(0x06b6d4, 1.4, 18);
    pointLight.position.set(4.5, 5.5, 6.5);
    scene.add(ambientLight, pointLight);

    const ringGeometry = new THREE.TorusGeometry(2.7, 0.05, 16, 120);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x002238,
      emissiveIntensity: 0.3,
      roughness: 0.35,
      metalness: 0.75,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    const coreGeometry = new THREE.IcosahedronGeometry(0.95, 2);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0x401200,
      emissiveIntensity: 0.6,
      roughness: 0.28,
      metalness: 0.85,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    const particleCount = 120;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 3.1 + Math.random() * 0.7;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.7;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.035,
      transparent: true,
      opacity: 0.72,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const clock = new THREE.Clock();

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height || !renderer) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      ring.rotation.z = elapsed * 0.1;
      core.rotation.y = elapsed * 0.18;
      particles.rotation.y = elapsed * 0.06;
      particles.rotation.x = Math.sin(elapsed * 0.3) * 0.08;
      if (renderer) renderer.render(scene, camera);
    };

    resize();
    animate();

    observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frameId);
      if (observer) observer.disconnect();
      ringGeometry.dispose();
      ringMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  const activeIndicatorStyle = {
    transform: isLogin ? "translateX(calc(100% + 8px))" : "translateX(0)",
    backgroundColor: isLogin ? "rgba(249, 115, 22, 0.15)" : "rgba(6, 182, 212, 0.18)",
    borderColor: isLogin ? "rgba(249, 115, 22, 0.45)" : "rgba(6, 182, 212, 0.45)",
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F172A] text-[#E5E1E4]">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-30" />
      <div className="absolute inset-0 bg-linear-to-br from-transparent via-[#0f172a]/90 to-[#090b12]" />
      <div className="relative flex min-h-screen">
        <main className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-6">
            <div className="scanline" />
            <div className="text-center space-y-3">
              <h2 className="text-[24px] uppercase tracking-[0.2em] text-[#F97316]">CRITICAL STATE</h2>
            </div>
            <div className="tactical-switch-container z-20">
              <button
                type="button"
                onClick={() => setIsLogin((value) => !value)}
                className="group relative w-48 h-16 overflow-hidden rounded-3xl bg-[rgba(15,23,42,0.7)] p-1 transition-transform duration-200 hover:scale-[0.99]"
              >
                <div className="absolute inset-0 flex justify-between px-4 items-center text-[11px] uppercase tracking-[0.3em]">
                  <span className={isLogin ? "text-[#06b6d4]/40" : "text-[#06b6d4] font-bold"}>REGISTER</span>
                  <span className={isLogin ? "text-[#F97316] font-bold" : "text-[#F97316]/40"}>LOGIN</span>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-[#0e0e10]/65" />
                <div
                  className="absolute left-1 top-1 bottom-1 w-[calc(50%-10px)] rounded-3xl flex items-center justify-center transition-all duration-500 ease-in-out"
                  style={activeIndicatorStyle}
                >
                  <span
                    className="h-3 w-3 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: isLogin ? "#F97316" : "#06B6D4",
                      boxShadow: isLogin ? "0 0 14px rgba(249,115,22,0.65)" : "0 0 8px rgba(6,182,212,0.55)",
                    }}
                  />
                </div>
              </button>
            </div>
            <div className="w-full max-w-md relative min-h-80">
              <div className={`absolute inset-0 rounded-[30px] bg-[#201f21]/90 p-6 shadow-[0_0_50px_rgba(0,0,0,0.35)] transition-all duration-500 ${isLogin ? "opacity-0 translate-y-8 pointer-events-none" : "opacity-100 translate-y-0"}`}>
                <div className="border-b border-[#3a494b] pb-3">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#06B6D4]">NODE REGISTRATION</h3>
                </div>
                <div className="space-y-3 pt-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">FULL NAME</label>
                    <input
                      type="text"
                      placeholder="JOHN DOE"
                      className="w-full rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#e5e1e4] outline-none transition focus:border-[#06b6d4] focus:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">CORPORATE EMAIL</label>
                    <input
                      type="email"
                      placeholder="USER@SEMTEX.CORE"
                      className="w-full rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#e5e1e4] outline-none transition focus:border-[#06b6d4] focus:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">ACCESS PASSWORD</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#e5e1e4] outline-none transition focus:border-[#06b6d4] focus:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">CONFIRM PASSWORD</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#e5e1e4] outline-none transition focus:border-[#06b6d4] focus:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    />
                  </div>
                </div>
                <button className="mt-6 w-full rounded-xl bg-[#06B6D4] py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0F172A] transition hover:brightness-110 active:scale-[0.98] shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  REGISTER NODE
                </button>
              </div>
              <div className={`absolute inset-0 rounded-[30px] bg-[#201f21]/90 p-6 shadow-[0_0_50px_rgba(0,0,0,0.35)] transition-all duration-500 ${isLogin ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}>
                <div className="border-b border-[#3a494b] pb-3">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#F97316]">SYSTEM LOGIN</h3>
                </div>
                <div className="space-y-3 pt-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">CORPORATE EMAIL</label>
                    <input
                      type="email"
                      placeholder="USER@SEMTEX.CORE"
                      className="w-full rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#e5e1e4] outline-none transition focus:border-[#F97316] focus:shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-[0.22em] text-[#b9cacb]">ACCESS PASSWORD</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#3a494b] bg-[#0e0e10] px-3 py-2 text-xs text-[#e5e1e4] outline-none transition focus:border-[#F97316] focus:shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                    />
                  </div>
                </div>
                <button className="mt-6 w-full rounded-xl bg-[#F97316] py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:brightness-110 active:scale-[0.98] shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                  AUTHORIZE ACCESS
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <style jsx global>{`
        .scanline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(6, 182, 212, 0.1);
          animation: scan 4s linear infinite;
          pointer-events: none;
          z-index: 5;
        }
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}
