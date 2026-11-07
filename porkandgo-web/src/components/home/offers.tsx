"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useStore } from "../providers";
import { formatKsh } from "@/lib/site";
import { IconClock, IconFlame, IconPlus } from "../icons";
import { Reveal } from "../chrome";

/**
 * The one interactive moment: press and hold to fire up the grill.
 * Progress builds while held, eases back if released early, and completion reveals the deal.
 * Reduced motion gets the deal straight away.
 */
function GrillHold({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [p, setP] = useState(0);
  const holding = useRef(false);
  const raf = useRef<number | null>(null);
  const prog = useRef(0);
  const last = useRef(0);
  const HOLD_MS = 1300;

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) onDone();
  }, [onDone]);

  const loop = (now: number) => {
    const dt = Math.min(64, now - (last.current || now));
    last.current = now;
    if (holding.current) prog.current = Math.min(1, prog.current + dt / HOLD_MS);
    else prog.current = Math.max(0, prog.current - dt / (HOLD_MS * 0.6));
    setP(prog.current);
    if (prog.current >= 1) {
      holding.current = false;
      raf.current = null;
      onDone();
      return;
    }
    if (prog.current > 0 || holding.current) raf.current = requestAnimationFrame(loop);
    else {
      raf.current = null;
      last.current = 0;
    }
  };
  const start = () => {
    if (done) return;
    holding.current = true;
    if (raf.current === null) raf.current = requestAnimationFrame(loop);
  };
  const stop = () => {
    holding.current = false;
  };

  const C = 2 * Math.PI * 54;
  return (
    <button
      type="button"
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), start())}
      onKeyUp={stop}
      onClick={(e) => e.detail === 0 && onDone()}
      aria-label={done ? "Grill is fired up" : "Press and hold to fire up the grill and reveal today's deal"}
      className="group relative mx-auto flex h-44 w-44 touch-none select-none items-center justify-center rounded-full"
    >
      <span aria-hidden className="absolute inset-0 rounded-full bg-flame/20 blur-2xl transition-opacity duration-500" style={{ opacity: 0.25 + p * 0.75 }} />
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(245,239,230,.12)" strokeWidth="5" />
        <circle cx="60" cy="60" r="54" fill="none" stroke="url(#grillGrad)" strokeWidth="5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - (done ? 1 : p))} />
        <defs>
          <linearGradient id="grillGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#FFB547" />
            <stop offset="1" stopColor="#E8331C" />
          </linearGradient>
        </defs>
      </svg>
      <span className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full bg-ember text-center ring-1 ring-white/10 transition group-active:scale-95">
        <IconFlame size={34} className="text-flame" style={{ transform: `scale(${1 + p * 0.4})`, transition: "transform .1s" }} />
        <span className="mt-1 text-xs font-bold uppercase tracking-wider text-bone/80">{done ? "Grill's hot" : p > 0 ? "Keep holding" : "Hold to fire up"}</span>
      </span>
    </button>
  );
}

export function Offers() {
  const [done, setDone] = useState(false);
  const { add, setCartOpen } = useStore();
  return (
    <section id="offers" aria-labelledby="offers-title" className="relative mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-10">
      <Reveal className="mb-12 max-w-3xl">
        <p className="kicker text-glow">Offers & events</p>
        <h2 id="offers-title" className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
          Today&apos;s deal is on the grill.
        </h2>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative grid min-h-[440px] overflow-hidden rounded-[32px] bg-ember ring-1 ring-white/10 md:grid-cols-2">
          <div className="relative flex flex-col items-center justify-center gap-6 p-8 text-center">
            <GrillHold done={done} onDone={() => setDone(true)} />
            <p className="max-w-[26ch] text-bone/70">{done ? "There it is. Grab it before the kitchen notices." : "Press and hold the button. Let it get hot."}</p>
          </div>
          <div aria-hidden className={`absolute inset-y-0 right-0 hidden w-1/2 overflow-hidden md:block ${done ? "opacity-0" : "opacity-100"} transition-opacity duration-700`}>
            <Image src="/images/real/raha-platter.webp" alt="" fill sizes="35vw" className="scale-110 object-cover opacity-30 blur-md grayscale" />
            <span className="kicker absolute inset-0 flex items-center justify-center text-bone/70">Deal hidden · fire the grill</span>
          </div>
          <div className={`relative min-h-[320px] overflow-hidden transition-[clip-path] duration-1000 ease-[var(--ease-out-soft)] ${done ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_0_100%)] md:[clip-path:inset(0_0_0_100%)]"}`}>
            <Image src="/images/real/raha-platter.webp" alt="Pork and chips with a free mocktail" fill sizes="(min-width: 768px) 35vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <p className="kicker text-glow">Deal of the day</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold leading-none">Mix Pork Choma + Chipo</p>
              <p className="tnum mt-2 text-2xl font-bold text-flame">{formatKsh(490)}</p>
              <p className="mt-1 text-bone/80">Comes with a free mocktail or soda.</p>
              <button
                className="btn btn-flame mt-5"
                onClick={() => {
                  add({ itemId: "mix-pork-choma-chipo", name: "Mix Pork Choma + Chipo", option: "Deal of the day", price: 490 });
                  setCartOpen(true);
                }}
                tabIndex={done ? 0 : -1}
              >
                <IconPlus size={18} /> Add to order
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <Reveal className="rounded-[28px] bg-flame p-7 text-[#1a0b04]">
            <p className="kicker flex items-center gap-2 font-bold"><IconClock size={16} /> Every day</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-4xl font-extrabold leading-none">Happy hour, 4PM to 9PM</p>
            <p className="mt-3 font-medium">Cocktails like Story za Jaba and Text my Ex, plus a free chaser with every mzinga. 18+ only.</p>
          </Reveal>
          <Reveal className="rounded-[28px] bg-paper p-7 text-ink">
            <p className="kicker text-flame-deep">On every platter</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight">Free juices or fizzy mojitos for the table.</p>
            <p className="mt-2 text-ink/65">From two drinks on Raha ya Wawili up to five on Mbogi and Mega.</p>
          </Reveal>
          <Reveal className="rounded-[28px] bg-ember p-7 ring-1 ring-white/10">
            <p className="kicker text-glow">Sundays</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight">Sundays are for family.</p>
            <p className="mt-2 text-bone/70">Choma Choma for three, Rainbow Explosion for the kids.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
