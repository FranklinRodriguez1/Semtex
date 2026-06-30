"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { supabase } from "@/lib/supabase";

const AFTER_AUTH_ROUTE = "/view/transfer";

export function Loginy() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  async function handleLogin() {
    setError(null);
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      if (signInError) throw signInError;
      router.push(AFTER_AUTH_ROUTE);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F172A] text-[#E5E1E4]">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/60 via-[#0f172a]/80 to-[#090b12]" />
      <div className="scanline" />

      <div className="relative flex min-h-screen">

        {/* LEFT — branding panel */}
        <div className="hidden lg:flex w-[45%] flex-col justify-between px-16 py-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#06B6D4]/50">TACTICAL MANAGEMENT SYSTEM</p>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-[5rem] font-black uppercase leading-none tracking-[0.1em] text-[#74f5ff]"
                style={{ textShadow: "0 0 40px rgba(116,245,255,0.25)" }}>
                SEMTEX
              </h1>
              <div className="mt-4 h-px w-20 bg-gradient-to-r from-[#06B6D4]/60 to-transparent" />
            </div>
            <p className="max-w-xs text-[13px] leading-relaxed text-[#b9cacb]/70">
              Plataforma de transferencia segura y auditoría de documentos financieros para equipos corporativos.
            </p>
            <div className="space-y-3 pt-2">
              {[
                { icon: "⬢", label: "Transferencia cifrada de documentos" },
                { icon: "⚖", label: "Auditoría y trazabilidad completa" },
                { icon: "👥", label: "Control de acceso por rol (RBAC)" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <span className="text-[#06B6D4]/40 text-xs">{f.icon}</span>
                  <span className="text-[11px] text-[#3a494b]">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#3a494b]">v2.0 · CRITICAL STATE</p>
          </div>
        </div>

        {/* RIGHT — login panel */}
        <div className="flex flex-1 flex-col items-center justify-center px-10 py-12">
          <div className="w-full max-w-[560px] space-y-6">

            <div className="lg:hidden text-center mb-2">
              <h1 className="text-[2.5rem] font-black uppercase tracking-[0.15em] text-[#74f5ff]">SEMTEX</h1>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#3a494b]">CRITICAL STATE</p>
            </div>

            <div className="text-center">
              <h2 className="text-[16px] uppercase tracking-[0.25em] text-[#F97316]">SYSTEM LOGIN</h2>
              <p className="mt-1.5 text-[11px] tracking-[0.2em] text-[#3a494b]">AUTHENTICATION REQUIRED</p>
            </div>

            {error && (
              <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/8 px-4 py-2.5 text-[11px] text-[#EF4444]">
                {error}
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-[#3a494b]/50 bg-[#0e0e10]/70 backdrop-blur-sm"
              style={{ boxShadow: "0 0 0 1px rgba(249,115,22,0.08), 0 0 60px rgba(0,0,0,0.5)" }}>
              <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(249,115,22,0.4), transparent)" }} />
              <div className="flex flex-col justify-center p-8">
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] uppercase tracking-[0.22em] text-[#b9cacb]/80">CORPORATE EMAIL</label>
                    <input
                      type="email"
                      placeholder="user@semtex.core"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full rounded-lg border border-[#3a494b]/60 bg-[#131315] px-4 py-3 text-sm text-[#e5e1e4] outline-none transition-all placeholder:text-[#3a494b] focus:border-[#F97316]/60 focus:shadow-[0_0_14px_rgba(249,115,22,0.18)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] uppercase tracking-[0.22em] text-[#b9cacb]/80">ACCESS PASSWORD</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !loading && handleLogin()}
                      className="w-full rounded-lg border border-[#3a494b]/60 bg-[#131315] px-4 py-3 text-sm text-[#e5e1e4] outline-none transition-all placeholder:text-[#3a494b] focus:border-[#F97316]/60 focus:shadow-[0_0_14px_rgba(249,115,22,0.18)]"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="mt-6 w-full rounded-lg bg-[#F97316] py-3.5 text-sm font-bold uppercase tracking-[0.25em] text-white transition-all hover:brightness-110 active:scale-[0.98] shadow-[0_0_24px_rgba(249,115,22,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? "VERIFYING..." : "AUTHORIZE ACCESS"}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style jsx global>{`
        .scanline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(6, 182, 212, 0.08);
          animation: scan 5s linear infinite;
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
