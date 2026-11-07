"use client";

import { useEffect, useRef } from "react";

/** Whisper-level rising embers. Pauses off-screen, on hidden tabs, and never runs with reduced motion. */
export function Embers({ density = 46, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0,
      h = 0,
      raf = 0,
      visible = true;
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    // seeded generator so the field looks the same on every load
    let seed = 1337;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    type E = { x: number; y: number; r: number; vy: number; vx: number; a: number; life: number; ph: number };
    let parts: E[] = [];
    const spawn = (fresh = false): E => ({
      x: rnd() * w,
      y: fresh ? rnd() * h : h + 10,
      r: 0.6 + rnd() * 1.8,
      vy: 0.25 + rnd() * 0.7,
      vx: (rnd() - 0.5) * 0.25,
      a: 0.25 + rnd() * 0.6,
      life: 0,
      ph: rnd() * Math.PI * 2,
    });
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(density * Math.min(1.4, w / 1200));
      parts = Array.from({ length: n }, () => spawn(true));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    let last = performance.now();
    function draw(now: number) {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min(3, (now - last) / 16.667);
      last = now;
      ctx!.clearRect(0, 0, w, h);
      ctx!.globalCompositeOperation = "lighter";
      for (const p of parts) {
        p.life += dt;
        p.y -= p.vy * dt;
        p.x += (p.vx + Math.sin((p.life + p.ph * 40) / 40) * 0.25) * dt;
        const fade = Math.min(1, p.y / (h * 0.25));
        const flicker = 0.75 + 0.25 * Math.sin(p.life / 6 + p.ph);
        const alpha = Math.max(0, p.a * fade * flicker);
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255,190,90,${alpha})`);
        g.addColorStop(0.4, `rgba(255,90,31,${alpha * 0.6})`);
        g.addColorStop(1, "rgba(255,90,31,0)");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx!.fill();
        if (p.y < -10) Object.assign(p, spawn());
      }
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    const onVis = () => {
      if (!document.hidden && visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);
  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
