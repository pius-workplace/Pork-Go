"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Embers } from "./embers";
import { IconArrow, IconWhatsApp } from "./icons";
import { BRANCHES, isOpenNow, whatsappLink } from "@/lib/site";

/**
 * Scroll journey hero: the whole visit, from the street to the walk home.
 * Runs on phones and desktops alike (each frame has a portrait and a landscape cut);
 * only reduced motion gets the still hero instead.
 */

type Frame = { key: string; src: string; m: string; alt: string; origin: string; drop?: boolean };

const FRAMES: Frame[] = [
  { key: "street", src: "/images/journey/01-entrance.webp", m: "/images/journey/m/street.webp", alt: "Warm light and grill smoke spilling from the Pork & Go doorway onto a Nairobi street at dusk", origin: "28% 55%" },
  { key: "stairs", src: "/images/journey/stairs.webp", m: "/images/journey/m/stairs-up.webp", alt: "A guest climbs the warm-lit stairs up to the dining room", origin: "50% 30%" },
  { key: "door", src: "/images/journey/door.webp", m: "/images/journey/m/door.webp", alt: "At the top of the stairs, the host waves you in", origin: "40% 45%" },
  { key: "seated", src: "/images/journey/seated.webp", m: "/images/journey/m/seated.webp", alt: "A waiter pulls out a green chair for guests at a window table", origin: "55% 50%" },
  { key: "menu", src: "/images/journey/menu.webp", m: "/images/journey/m/menu.webp", alt: "A guest reads the menu with a fresh passion juice on the table", origin: "45% 55%" },
  { key: "arrive", src: "/images/journey/arrive.webp", m: "/images/journey/m/arrive.webp", alt: "A sizzling platter is set down as friends reach in", origin: "48% 52%" },
  { key: "platter", src: "/images/journey/04-platter.webp", m: "/images/journey/m/platter.webp", alt: "A loaded platter of pork choma, wings, fries, ugali and kachumbari with juice", origin: "50% 50%", drop: true },
  { key: "exit", src: "/images/journey/exit.webp", m: "/images/journey/m/exit.webp", alt: "Friends walk out laughing into the Nairobi night", origin: "55% 50%" },
];

type Band = { kicker?: string; title: string[]; sub: string; align: "left" | "right"; final?: boolean };

const BANDS: Band[] = [
  { title: ["Hungry?", "Pull up."], sub: "Follow the smoke. It leads to the meats.", align: "right" },
  { kicker: "Head upstairs", title: ["The smell", "gets louder."], sub: "The grill has been going since 8AM. Follow it up the stairs.", align: "left" },
  { kicker: "Walk in", title: ["Karibu.", "Come on in."], sub: "The crew is waiting at the top. Braidwood House on Tom Mboya St, or our new spot at Development House.", align: "left" },
  { kicker: "Grab a seat", title: ["Bring the", "whole mbogi."], sub: "Long tables, loud laughs, birthdays, dates and office links.", align: "right" },
  { kicker: "Pick your plate", title: ["Choma, wet fry", "or dry fry?"], sub: "Platters, burgers, wings and shakes. Every platter comes with a free juice.", align: "left" },
  { kicker: "Here it comes", title: ["Hot off", "the grill."], sub: "Sizzling pork choma from KSh 650, still talking back when it lands.", align: "right" },
  { kicker: "Dig in", title: ["We got", "the meats."], sub: "Platters from KSh 1,450, made for two up to the whole squad.", align: "left" },
  { kicker: "On your way out", title: ["Tell us", "how it went."], sub: "Leave us a review on the way home, then come back hungry.", align: "left", final: true },
];

const N = FRAMES.length;
const SEG = 1 / N;
const bandRange = (i: number): [number, number] => [i === 0 ? 0 : i * SEG + 0.012, i === N - 1 ? 1 : (i + 1) * SEG - 0.012];

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smoothstep = (p: number, e0: number, e1: number) => {
  const t = clamp((p - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Landscape screens get the wide cut, portrait screens (most phones) the tall one. */
function ArtImage({ fr, alt, priority }: { fr: Frame; alt: string; priority?: boolean }) {
  const common = { alt, fill: true, sizes: "100vw", quality: 72 };
  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, src: fr.src });
  const {
    props: { srcSet: tall, ...rest },
  } = getImageProps({ ...common, src: fr.m });
  return (
    <picture>
      <source media="(min-aspect-ratio: 1/1)" srcSet={wide} />
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...rest} srcSet={tall} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} className="object-cover" />
    </picture>
  );
}

/** Location + live open status, on a solid chip so it reads over any photo. */
export function OpenPill() {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => setOpen(isOpenNow(BRANCHES[0]));
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-charcoal/85 py-2 pl-3 pr-4 text-sm font-semibold text-bone shadow-lg backdrop-blur-md [text-shadow:none] sm:text-[0.95rem]">
      <span className="relative flex h-2.5 w-2.5" aria-hidden>
        {open !== false && <span className="absolute inset-0 animate-ping rounded-full bg-[#3ddc84] opacity-60" />}
        <span className={`relative h-2.5 w-2.5 rounded-full ${open === false ? "bg-flame" : "bg-[#3ddc84]"}`} />
      </span>
      <span>
        {open === false ? "Closed now · opens 8AM" : open ? "Open now" : "Open daily"}
        <span className="text-bone/60"> · </span>
        Nairobi CBD
        <span className="text-bone/60"> · </span>
        8AM to 10PM
      </span>
    </p>
  );
}

function Words({ lines }: { lines: string[] }) {
  let i = 0;
  return (
    <>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden>
        {lines.map((line, li) => (
          <span key={li} className="mask-line block">
            {line.split(" ").map((w, wi, arr) => (
              <span key={wi} className="jw inline-block" style={{ "--i": i++ } as React.CSSProperties}>
                {w}
                {wi < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}

function HeadingTag({ level, className, children }: { level: 1 | 2; className: string; children: React.ReactNode }) {
  return level === 1 ? <h1 className={className}>{children}</h1> : <h2 className={className}>{children}</h2>;
}

function Ctas({ review }: { review?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/menu#order" className="btn btn-flame px-6 py-4 text-base">
        Order now <IconArrow size={18} />
      </Link>
      <Link href="/reserve" className="btn btn-ghost px-6 py-4 text-base">
        Reserve a table
      </Link>
      {review ? (
        <a href={BRANCHES[0].mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-6 py-4 text-base">
          Leave a review
        </a>
      ) : (
        <a href={whatsappLink("Hi Pork & Go! What's the deal today?")} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-4 py-4" aria-label="Chat on WhatsApp">
          <IconWhatsApp />
        </a>
      )}
    </div>
  );
}

export function ScrollJourney() {
  const root = useRef<HTMLElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let target = 0,
      shown = 0,
      raf: number | null = null,
      lastTick = 0,
      onScreen = true,
      armed = false;
    const loadStart = performance.now();
    const cache = new Map<HTMLElement, Record<string, string>>();
    const write = (node: HTMLElement | null, key: string, val: string) => {
      if (!node) return;
      let c = cache.get(node);
      if (!c) cache.set(node, (c = {}));
      if (c[key] === val) return;
      c[key] = val;
      if (key.startsWith("--")) node.style.setProperty(key, val);
      else (node.style as unknown as Record<string, string>)[key] = val;
    };

    const progress = () => {
      const r = el.getBoundingClientRect();
      const range = el.offsetHeight - innerHeight;
      return range > 0 ? clamp(-r.top / range) : 0;
    };

    const render = (p: number) => {
      const f = 0.32;
      frameRefs.current.forEach((node, i) => {
        const t = (p - i * SEG) / SEG;
        let op = 1;
        if (i > 0) op = smoothstep(t, -f, 0);
        if (i < N - 1) op *= 1 - smoothstep(t, 1 - f, 1);
        let s: number,
          rot = 0;
        if (FRAMES[i].drop) {
          const k = easeOut(clamp((t + f) / (0.85 + f)));
          s = 1.26 - 0.22 * k + 0.3 * smoothstep(t, 1 - f, 1);
          rot = -6 * (1 - k);
        } else {
          s = 1.04 + 0.14 * clamp(t) + 0.32 * smoothstep(t, 1 - f, 1);
        }
        write(node, "opacity", op.toFixed(3));
        write(node, "transform", `scale(${s.toFixed(4)}) rotate(${rot.toFixed(2)}deg)`);
        write(node, "visibility", op < 0.002 ? "hidden" : "visible");
      });
      const loadK = clamp((performance.now() - loadStart) / 1100);
      BANDS.forEach((_, i) => {
        const node = bandRefs.current[i];
        const [a, z] = bandRange(i);
        const ramp = Math.min(0.03, (z - a) / 3);
        let op = 1;
        if (i > 0) op = smoothstep(p, a, a + ramp);
        if (i < N - 1) op *= 1 - smoothstep(p, z - ramp, z);
        let k = clamp((p - a) / Math.min(0.05, (z - a) * 0.35));
        if (i === 0) k = Math.max(k, easeOut(loadK));
        write(node, "opacity", op.toFixed(3));
        write(node, "--k", k.toFixed(3));
        write(node, "pointerEvents", op > 0.6 ? "auto" : "none");
        write(node, "visibility", op < 0.002 ? "hidden" : "visible");
      });
      write(barRef.current, "transform", `scaleX(${p.toFixed(4)})`);
      return loadK < 1;
    };

    const tick = (now: number) => {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      shown += (target - shown) * (1 - Math.pow(1 - 0.16, dt / 16.667));
      let more = false;
      if (Math.abs(target - shown) < 0.0004) shown = target;
      else more = true;
      if (render(shown)) more = true;
      if (more && onScreen) raf = requestAnimationFrame(tick);
      else {
        raf = null;
        lastTick = 0;
      }
    };
    const kick = () => {
      if (raf === null && onScreen) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = progress();
      kick();
    };

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) kick();
    });
    io.observe(el);

    const enable = () => {
      if (armed) return;
      armed = true;
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", onScroll);
      target = shown = progress();
      cache.clear();
      kick();
    };
    const disable = () => {
      if (!armed) return;
      armed = false;
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => (reduce.matches ? disable() : enable());
    reduce.addEventListener("change", apply);
    apply();
    return () => {
      disable();
      io.disconnect();
      reduce.removeEventListener("change", apply);
    };
  }, []);

  return (
    <>
      <section ref={root} className="journey relative" aria-label="A visit to Pork & Go, from the street to your table">
        <div className="sticky top-0 h-[100svh] overflow-hidden bg-charcoal">
          {FRAMES.map((fr, i) => (
            <div
              key={fr.key}
              ref={(n) => {
                frameRefs.current[i] = n;
              }}
              className="absolute inset-0 will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden", transformOrigin: fr.origin, transform: "scale(1.04)" }}
            >
              <ArtImage fr={fr} alt={fr.alt} priority={i < 2} />
            </div>
          ))}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_45%,rgba(14,12,11,0)_35%,rgba(14,12,11,0.7)_100%)]" />
          {/* deeper floor on phones, where the words sit at the bottom */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-charcoal via-charcoal/75 to-transparent lg:h-40 lg:via-transparent" />
          <Embers />

          {BANDS.map((b, i) => (
            <div
              key={i}
              ref={(n) => {
                bandRefs.current[i] = n;
              }}
              className={`band absolute inset-0 flex items-end px-5 pb-[calc(env(safe-area-inset-bottom)+7.5rem)] sm:px-10 md:pb-16 lg:items-center lg:px-20 lg:pb-0 ${
                b.align === "right" ? "lg:justify-end lg:text-right" : "lg:justify-start"
              }`}
              style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
            >
              <div className="band-scrim relative isolate max-w-[640px] lg:pt-24">
                {i === 0 ? (
                  <div className="jk mb-5">
                    <OpenPill />
                  </div>
                ) : (
                  <p className="kicker jk mb-3 text-glow lg:mb-4">{b.kicker}</p>
                )}
                <HeadingTag
                  level={i === 0 ? 1 : 2}
                  className={`font-[family-name:var(--font-display)] font-extrabold leading-[0.92] tracking-[-0.035em] ${
                    b.final ? "text-[clamp(2.9rem,12vw,7rem)]" : "text-[clamp(2.9rem,12vw,6.6rem)]"
                  } lg:text-[clamp(3.2rem,7vw,6.6rem)]`}
                >
                  <Words lines={b.title} />
                </HeadingTag>
                <p className={`js mt-4 max-w-[34ch] text-base text-bone/90 sm:text-xl lg:mt-5 ${b.align === "right" ? "lg:ml-auto" : ""}`}>{b.sub}</p>
                {b.final && (
                  <div className="jb mt-6 lg:mt-8">
                    <Ctas review />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* progress line */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
            <div ref={barRef} className="h-full origin-left bg-flame" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </section>

      {/* Still hero for reduced motion */}
      <section className="hero-static relative min-h-[100svh] overflow-hidden" aria-label="Pork & Go">
        <ArtImage fr={FRAMES[6]} alt={FRAMES[6].alt} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/20" />
        <div className="band relative flex min-h-[100svh] flex-col justify-end px-5 pb-28 pt-40 sm:px-10 lg:px-20">
          <div className="mb-5">
            <OpenPill />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(3.4rem,13vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.035em]">
            Hungry?
            <br />
            Pull up.
          </h1>
          <p className="mt-4 max-w-[30ch] text-lg text-bone/90">Platters from KSh 1,450 with free juice. Two spots in the CBD.</p>
          <div className="mt-7">
            <Ctas />
          </div>
        </div>
      </section>
    </>
  );
}
