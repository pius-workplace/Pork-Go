"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "../chrome";
import { IconArrow } from "../icons";

/**
 * Real nights: a phone video from a real table at Pork & Go (shot by regulars).
 * Plays muted on loop only while on screen; guests can turn the sound on.
 * Nothing downloads until the section is near the viewport. Reduced motion
 * gets the cover image and a play button instead of autoplay.
 */
export function RealNights() {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [reduce, setReduce] = useState(false);
  const inView = useRef(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(rm);
    // start loading a little before it scrolls into view
    const preload = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          preload.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    preload.observe(el);
    // play while visible, pause when it leaves (autoplay only without reduced motion)
    const view = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        const v = video.current;
        if (!v) return;
        if (e.isIntersecting && !rm && v.getAttribute("src")) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.35 },
    );
    view.observe(el);
    return () => {
      preload.disconnect();
      view.disconnect();
    };
  }, []);

  // the source is attached a moment after the section comes near; start it then if it's already on screen
  useEffect(() => {
    if (near && inView.current && !reduce) video.current?.play().catch(() => {});
  }, [near, reduce]);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  };
  const togglePlay = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <section aria-labelledby="real-nights-title" className="relative overflow-hidden bg-ember py-24">
      <div aria-hidden className="absolute -right-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-flame/15 blur-[120px]" />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:gap-20 lg:px-10">
        <Reveal className="max-w-xl">
          <p className="kicker text-glow">Real nights</p>
          <h2
            id="real-nights-title"
            className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,6vw,4.8rem)] font-extrabold leading-[0.95] tracking-[-0.03em]"
          >
            Real people. Real platters.
          </h2>
          <p className="mt-5 max-w-[46ch] text-lg text-bone/75">
            Shot on a phone at a real table by regulars on a night out. No actors, just the mbogi, the juices and the meats.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/reserve" className="btn btn-flame px-6 py-4 text-base">
              Book your table <IconArrow size={18} />
            </Link>
            <Link href="/menu" className="btn btn-ghost px-6 py-4 text-base">
              See the menu
            </Link>
          </div>
        </Reveal>

        <Reveal className="mx-auto w-full max-w-[340px] lg:max-w-none">
          <div ref={wrap} className="relative aspect-[9/16] w-full overflow-hidden rounded-[32px] border border-white/10 bg-charcoal shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
            <video
              ref={video}
              className="absolute inset-0 h-full w-full object-cover"
              poster="/videos/real-nights-poster.webp"
              src={near ? "/videos/real-nights.mp4" : undefined}
              muted
              loop
              playsInline
              preload="none"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              aria-label="Friends sharing platters and juices at a table at Pork & Go"
            />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-charcoal/80 to-transparent" />

            {/* big play button when paused (reduced motion, or paused by the guest) */}
            {!playing && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 grid place-items-center"
                aria-label="Play video"
              >
                <span className="grid h-16 w-16 place-items-center rounded-full bg-flame text-white shadow-lg transition-transform hover:scale-105">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.4-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5Z" />
                  </svg>
                </span>
              </button>
            )}

            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
              <span className="rounded-full bg-charcoal/80 px-3 py-1.5 text-xs font-semibold text-bone/85 backdrop-blur-md">
                Shot by Friends
              </span>
              <div className="flex gap-2">
                {playing && !reduce && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="grid h-10 w-10 place-items-center rounded-full bg-charcoal/80 text-bone backdrop-blur-md hover:bg-charcoal"
                    aria-label="Pause video"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-pressed={!muted}
                  className="grid h-10 w-10 place-items-center rounded-full bg-charcoal/80 text-bone backdrop-blur-md hover:bg-charcoal"
                  aria-label={muted ? "Turn sound on" : "Turn sound off"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                    {muted ? (
                      <>
                        <path d="m22 9-6 6" />
                        <path d="m16 9 6 6" />
                      </>
                    ) : (
                      <>
                        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                        <path d="M19 5a10 10 0 0 1 0 14" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
