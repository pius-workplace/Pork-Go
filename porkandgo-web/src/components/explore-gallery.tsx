"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EXPLORE, type ExploreItem, type Tag } from "@/content/explore";
import { IconClose } from "./icons";

const FILTERS: ("All" | "Videos" | Tag)[] = ["All", "Videos", "Food", "Deals", "Vibes"];

function PlayBadge() {
  return (
    <span aria-hidden className="grid h-14 w-14 place-items-center rounded-full bg-charcoal/70 ring-1 ring-white/30 backdrop-blur transition duration-300 group-hover:scale-110 group-hover:bg-flame">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
    </span>
  );
}

function Tile({ item, index, onOpen }: { item: ExploreItem; index: number; onOpen: (i: number) => void }) {
  const src = item.kind === "video" ? item.cover : item.src;
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className="explore-tile group relative mb-3 block w-full overflow-hidden rounded-2xl bg-ember text-left ring-1 ring-white/10 sm:mb-4 sm:rounded-3xl"
      style={{ aspectRatio: `${item.w} / ${Math.min(item.h, item.w * 1.6)}` }}
      aria-label={`${item.kind === "video" ? "Play video" : "Open photo"}: ${item.title}`}
    >
      <Image src={src} alt="" fill sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw" className="object-cover transition duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105" />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/0 to-charcoal/0" />
      {item.kind === "video" && (
        <>
          <span className="absolute inset-0 grid place-items-center">
            <PlayBadge />
          </span>
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-charcoal/75 px-2.5 py-1 text-xs font-semibold backdrop-blur">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5.5v13l11-6.5z" /></svg>
            {item.views}
          </span>
        </>
      )}
      <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-semibold leading-snug text-bone sm:p-4 sm:text-base">{item.title}</span>
    </button>
  );
}

function Viewer({ items, index, onClose, onStep }: { items: ExploreItem[]; index: number; onClose: () => void; onStep: (d: number) => void }) {
  const item = items[index];
  const touch = useRef<number | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    addEventListener("keydown", onKey);
    const html = document.documentElement;
    html.style.overflow = "hidden";
    dispatchEvent(new Event("pg:scroll-lock"));
    return () => {
      removeEventListener("keydown", onKey);
      html.style.overflow = "";
      dispatchEvent(new Event("pg:scroll-unlock"));
    };
  }, [onClose, onStep]);

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-black/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 60) onStep(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <div className="flex items-center justify-between gap-3 p-3 sm:p-5">
        <p className="min-w-0 truncate text-sm font-semibold text-bone/90 sm:text-base">{item.title}</p>
        <button onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close">
          <IconClose />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-6 sm:px-20">
        {item.kind === "video" ? (
          <iframe
            key={item.id}
            src={`https://www.tiktok.com/player/v1/${item.tiktok}?autoplay=1&description=1&music_info=0&rel=0&controls=1`}
            title={item.title}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            className="sheet-in aspect-[9/16] h-full max-h-[80dvh] w-auto max-w-full rounded-2xl bg-black"
          />
        ) : (
          <div key={item.id} className="sheet-in relative h-full w-full">
            <Image src={item.src} alt={item.title} fill sizes="100vw" className="object-contain" />
          </div>
        )}
        <button onClick={() => onStep(-1)} className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid sm:left-5" aria-label="Previous">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 6-6 6 6 6" /></svg>
        </button>
        <button onClick={() => onStep(1)} className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid sm:right-5" aria-label="Next">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 6 6 6-6 6" /></svg>
        </button>
      </div>
      <p className="pb-4 text-center text-xs text-bone/50 sm:hidden">Swipe for more</p>
    </div>
  );
}

export function ExploreGallery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [open, setOpen] = useState<number | null>(null);
  const items = useMemo(
    () => EXPLORE.filter((i) => filter === "All" || (filter === "Videos" ? i.kind === "video" : i.tags.includes(filter as Tag))),
    [filter],
  );
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + items.length) % items.length)), [items.length]);

  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${filter === f ? "bg-bone text-ink" : "bg-white/[0.06] text-bone/80 ring-1 ring-white/15 hover:text-bone"}`}
          >
            {f}
          </button>
        ))}
      </div>
      <div key={filter} className="mt-6 columns-2 gap-3 sm:gap-4 md:columns-3 xl:columns-4">
        {items.map((it, i) => (
          <Tile key={it.id} item={it} index={i} onOpen={setOpen} />
        ))}
      </div>
      {open !== null && <Viewer items={items} index={open} onClose={close} onStep={step} />}
    </div>
  );
}
