"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PLATTERS, fromPrice, type MenuItem } from "@/lib/menu";
import { formatKsh } from "@/lib/site";
import { useStore } from "../providers";
import { IconArrow, IconPlus, IconUsers } from "../icons";

const FLAVOURS = ["Dry Fry", "Wet Fry", "Choma"] as const;

function PlatterCard({ p }: { p: MenuItem }) {
  const { add, setCartOpen } = useStore();
  const [flavour, setFlavour] = useState<(typeof FLAVOURS)[number]>("Choma");
  return (
    <article className="rail-card group relative flex w-[82vw] max-w-[420px] shrink-0 snap-center flex-col overflow-hidden rounded-[28px] bg-ember ring-1 ring-white/10 sm:w-[380px] lg:w-[420px]">
      <div className="relative aspect-[4/3] overflow-hidden">
        {p.image && (
          <Image
            src={p.image}
            alt={`${p.name} served at Pork & Go`}
            fill
            sizes="(min-width: 1024px) 420px, 82vw"
            className="object-cover transition duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ember via-transparent to-transparent" />
        {p.freeDrinks ? (
          <span className="absolute right-4 top-4 rounded-full bg-glow px-3 py-1.5 text-xs font-bold text-[#2a1600]">
            {p.freeDrinks} FREE drinks
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight">{p.name.replace(" Platter", "")}</h3>
          <p className="tnum shrink-0 text-lg font-bold text-flame">{formatKsh(fromPrice(p))}</p>
        </div>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-bone/70">{p.description}</p>
        {p.serves && (
          <p className="mt-3 flex items-center gap-2 text-sm text-glow">
            <IconUsers size={16} /> Made for {p.serves}
          </p>
        )}
        <div className="mt-auto pt-5">
          <div role="radiogroup" aria-label={`Pork style for ${p.name}`} className="mb-3 grid grid-cols-3 gap-1 rounded-full bg-white/5 p-1">
            {FLAVOURS.map((f) => (
              <button
                key={f}
                role="radio"
                aria-checked={flavour === f}
                onClick={() => setFlavour(f)}
                className={`rounded-full py-2 text-sm font-semibold transition ${flavour === f ? "bg-bone text-ink" : "text-bone/70 hover:text-bone"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              add({ itemId: p.id, name: p.name, option: "", flavour, price: fromPrice(p) });
              setCartOpen(true);
            }}
            className="btn btn-flame w-full"
          >
            <IconPlus size={18} /> Add to order
          </button>
        </div>
      </div>
    </article>
  );
}

export function PlatterRail() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const dist = () => Math.max(0, t.scrollWidth - window.innerWidth + 80);
        gsap.to(t, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
      ctx = mm;
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section id="platters" aria-labelledby="platters-title" className="relative">
      {/* GSAP pins this inner wrapper, so React still owns the section it removes on navigation */}
      <div ref={section} className="relative overflow-hidden py-20 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:pb-6 lg:pt-[calc(var(--header-h)+34px+1rem)]">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker text-glow">Nyama nyama platters</p>
            <h2 id="platters-title" className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
              Masaa ni ya platter.
            </h2>
            <p className="mt-4 max-w-[48ch] text-lg text-bone/70">
              Seven platters, from a date for two to the whole squad. Every one comes with free juices or fizzy mojitos. Pick dry fry, wet fry or choma.
            </p>
          </div>
          <Link href="/menu#platters" className="btn btn-ghost self-start lg:self-auto">
            Full menu <IconArrow size={18} />
          </Link>
        </div>
      </div>
      <div
        ref={track}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:mt-14 lg:snap-none lg:overflow-visible lg:px-10 lg:will-change-transform"
      >
        {PLATTERS.map((p) => (
          <PlatterCard key={p.id} p={p} />
        ))}
      </div>
      </div>
    </section>
  );
}
