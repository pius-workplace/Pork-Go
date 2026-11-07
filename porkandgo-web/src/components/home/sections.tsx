"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "../chrome";
import { Embers } from "../embers";
import { TourViewer } from "./tour";
import {
  IconArrow,
  IconChevron,
  IconPin,
  IconStar,
  IconWhatsApp,
} from "../icons";
import { BRANCHES, whatsappLink } from "@/lib/site";

/* ---------- Menu teaser (bento) ---------- */
const CATS = [
  {
    href: "/menu#pork",
    title: "Pork",
    line: "Wet fry, dry fry, choma, honey glazed",
    img: "/images/real/crispy-pork.webp",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    href: "/menu#burgers-wraps",
    title: "Burgers & wraps",
    line: "From KSh 390 with a free drink",
    img: "/images/real/burger.webp",
    span: "",
  },
  {
    href: "/menu#desserts",
    title: "Shakes & sundaes",
    line: "Rainbow Explosion, Brain Freeze for two",
    img: "/images/food/sundae.webp",
    span: "",
  },
  {
    href: "/menu#white-meat",
    title: "Chicken & rabbit",
    line: "Quarter, half or full bird",
    img: "",
    span: "",
  },
  {
    href: "/menu#bar",
    title: "The bar",
    line: "Cocktails, beers, mzingas. 18+",
    img: "",
    span: "",
  },
];

export function MenuTeaser() {
  return (
    <section aria-labelledby="menu-teaser" className="bg-bone py-24 text-ink">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker text-flame-deep">The menu</p>
            <h2
              id="menu-teaser"
              className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em]"
            >
              92 ways to leave full.
            </h2>
          </div>
          <Link href="/menu" className="btn btn-ink self-start">
            See the full menu <IconArrow size={18} />
          </Link>
        </Reveal>
        <div className="mt-12 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATS.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              className={`group relative flex flex-col justify-end overflow-hidden rounded-[28px] p-6 ${c.span} ${c.img ? "text-bone" : i % 2 ? "bg-ink text-bone" : "bg-flame text-[#1a0b04]"}`}
            >
              {c.img && (
                <>
                  <Image
                    src={c.img}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 50vw, 100vw"
                    className="object-cover transition duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent"
                  />
                </>
              )}
              <span className="relative">
                <span
                  className={`block font-[family-name:var(--font-display)] font-extrabold leading-none tracking-tight ${c.span ? "text-5xl" : "text-3xl"}`}
                >
                  {c.title}
                </span>
                <span className="mt-2 flex items-center justify-between gap-3 text-sm opacity-85">
                  {c.line}
                  <IconArrow
                    size={18}
                    className="shrink-0 transition group-hover:translate-x-1"
                  />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- The Experience: occasions over the venue ---------- */
const OCCASIONS = [
  {
    id: "birthday",
    title: "Birthday bash",
    img: "/images/food/birthday.webp",
    list: [
      "1kg cake with a free custom message",
      "A platter big enough for the crew",
      "Free juices for the table",
      "The long table, reserved",
    ],
  },
  {
    id: "graduation",
    title: "Graduation feast",
    img: "/images/food/graduation.webp",
    list: [
      "Bazuu or Mega platter",
      "Up to five free drinks",
      "Photos at the flower wall",
      "Room for the whole family",
    ],
  },
  {
    id: "date-night",
    title: "Date night",
    img: "/images/food/date-night.webp",
    list: [
      "Raha ya Wawili for two, KSh 1,450",
      "Two free juices or mojitos",
      "Brain Freeze dessert to share",
      "A quiet corner if you ask",
    ],
  },
  {
    id: "squad",
    title: "Squad platter",
    img: "/images/journey/04-platter.webp",
    list: [
      "Mbogi or Mega platter",
      "12 sticky wings and 1kg choma",
      "Five free drinks",
      "Bring everyone",
    ],
  },
];

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="exp-title"
      className="relative overflow-hidden py-24"
    >
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/images/journey/03-dining.webp"
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover opacity-30 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/80 to-charcoal" />
        <Embers density={24} />
      </div>
      <div
        id="occasions"
        className="relative mx-auto max-w-[1400px] scroll-mt-28 px-4 sm:px-6 lg:px-10"
      >
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="kicker text-glow">The Experience</p>
          <h2
            id="exp-title"
            className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em]"
          >
            A collection of good nights.
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-lg text-bone/75">
            Birthdays, graduations, dates and squad links. Tell us the occasion
            and we set the table for it.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {OCCASIONS.map((o, i) => (
            <Reveal key={o.id} className={i % 2 ? "md:translate-y-16" : ""}>
              <article className="group relative flex min-h-[360px] items-center overflow-hidden rounded-[32px] ring-1 ring-white/10">
                <Image
                  src={o.img}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-1000 ease-[var(--ease-out-soft)] group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/30 to-transparent"
                />
                <div className="relative m-5 flex aspect-square w-[min(300px,70%)] flex-col justify-center rounded-full bg-paper/95 p-9 text-ink shadow-2xl ring-4 ring-glow transition duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-extrabold leading-tight">
                    {o.title}
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {o.list.map((l) => (
                      <li key={l} className="flex gap-2">
                        <span
                          aria-hidden
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 border-glow"
                        />
                        {l}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/reserve?occasion=${o.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-flame-deep"
                  >
                    Book it <IconArrow size={16} />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div id="tour" className="mt-28 scroll-mt-28 md:mt-40">
          <Reveal className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="kicker text-glow">Look around</p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.3rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
                Walk in before you pull up.
              </h3>
              <p className="mt-3 max-w-[50ch] text-bone/70">
                Drag, swipe or tilt your phone to look around the room. Spot the
                table you want, then book it.
              </p>
            </div>
            <Link
              href="/reserve"
              className="btn btn-flame self-start lg:self-auto"
            >
              Reserve a table <IconArrow size={18} />
            </Link>
          </Reveal>
          <Reveal>
            <TourViewer />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Guest stories slider ---------- */
const STORIES = [
  {
    quote:
      "Generous portions, fair prices and the dry fry pork is the one. We came back the next week with more people.",
    name: "Sample guest",
    role: "Braidwood House",
  },
  {
    quote:
      "Took the whole squad for a birthday. The Mbogi platter fed eight of us and the free mojitos kept coming.",
    name: "Everlyen ",
    role: "Birthday, Development House",
  },
  {
    quote:
      "Raha ya Wawili on a date night was perfect. Cozy, quick, and the honey pork chops are something else.",
    name: "Karimi M.",
    role: "Date night",
  },
  {
    quote:
      "Best pork choma in the CBD for the price. The Brain Freeze dessert is a whole event.",
    name: "Samuel K.",
    role: "Lunch break",
  },
];

export function Stories() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<1 | -1>(-1);
  const paused = useRef(false);
  const go = useCallback((d: 1 | -1) => {
    setDir(d);
    setI((x) => (x + d + STORIES.length) % STORIES.length);
  }, []);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // auto-advance: each new story enters from the left and travels right
    const t = setInterval(
      () => !paused.current && !document.hidden && go(-1),
      5500,
    );
    return () => clearInterval(t);
  }, [go]);
  const s = STORIES[i];
  return (
    <section
      id="stories"
      aria-labelledby="stories-title"
      className="relative isolate overflow-hidden py-28"
    >
      <Image
        src="/images/journey/03-dining.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-charcoal/80" />
      <div
        className="mx-auto max-w-3xl px-5 text-center"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/icon.svg"
          alt=""
          width={56}
          height={56}
          className="mx-auto h-14 w-14 rounded-2xl"
        />
        <p className="kicker mt-5 text-glow">Our valued guests</p>
        <h2
          id="stories-title"
          className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-tight tracking-tight"
        >
          What people say about us
        </h2>
        <div className="relative mt-10 min-h-[260px]" aria-live="polite">
          <figure
            key={i}
            className="story-in"
            style={{ "--dir": dir } as React.CSSProperties}
          >
            <div
              aria-hidden
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-glow to-flame-deep font-[family-name:var(--font-display)] text-2xl font-extrabold text-ink ring-4 ring-white/10"
            >
              &ldquo;
            </div>
            <blockquote className="mt-6 text-xl leading-relaxed text-bone/90 sm:text-2xl">
              &ldquo;{s.quote}&rdquo;
            </blockquote>
            <div
              className="mt-5 flex justify-center gap-1 text-glow"
              aria-label="5 out of 5 stars"
            >
              {Array.from({ length: 5 }, (_, k) => (
                <IconStar key={k} />
              ))}
            </div>
            <figcaption className="mt-3">
              <span className="font-bold uppercase tracking-wide">
                {s.name}
              </span>
              <span className="block text-sm text-bone/60">{s.role}</span>
            </figcaption>
          </figure>
        </div>
        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            onClick={() => go(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/20 transition hover:bg-white/15"
            aria-label="Previous story"
          >
            <IconChevron className="rotate-90" />
          </button>
          <div className="flex gap-2">
            {STORIES.map((_, k) => (
              <button
                key={k}
                onClick={() => {
                  setDir(k < i ? -1 : 1);
                  setI(k);
                }}
                aria-label={`Story ${k + 1}`}
                aria-current={k === i}
                className={`h-2.5 rounded-full transition-all ${k === i ? "w-7 bg-flame" : "w-2.5 bg-white/30"}`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/20 transition hover:bg-white/15"
            aria-label="Next story"
          >
            <IconChevron className="-rotate-90" />
          </button>
        </div>
     
      </div>
    </section>
  );
}

/* ---------- Visit us ---------- */
export function VisitUs() {
  return (
    <section
      id="visit"
      aria-labelledby="visit-title"
      className="mx-auto max-w-[1400px] scroll-mt-28 px-4 py-24 sm:px-6 lg:px-10"
    >
      <Reveal className="max-w-3xl">
        <p className="kicker text-glow">Visit us</p>
        <h2
          id="visit-title"
          className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em]"
        >
          Two spots. Same meats.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {BRANCHES.map((b) => (
          <Reveal key={b.id}>
            <article className="overflow-hidden rounded-[32px] bg-ember ring-1 ring-white/10">
              <div className="relative aspect-[16/9] bg-ash">
                <iframe
                  title={`Map of ${b.name}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(b.name + " " + b.landmark + " Nairobi")}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full grayscale-[0.4] invert-[0.88] hue-rotate-180"
                />
              </div>
              <div className="p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-[family-name:var(--font-display)] text-3xl font-extrabold">
                    {b.name}
                  </h3>
                  <span className="kicker text-glow">{b.tag}</span>
                </div>
                <p className="mt-2 flex items-center gap-2 text-bone/75">
                  <IconPin size={16} className="text-flame" /> {b.landmark}
                </p>
                <p className="mt-1 text-bone/75">
                  {b.hours} · {b.services.join(" · ")}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={b.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-flame"
                  >
                    Get directions <IconArrow size={18} />
                  </a>
                  <a
                    href={whatsappLink(`Hi Pork & Go ${b.name}!`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    <IconWhatsApp /> WhatsApp
                  </a>
                  <Link href={`/branches/${b.id}`} className="btn btn-ghost">
                    Branch details
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
