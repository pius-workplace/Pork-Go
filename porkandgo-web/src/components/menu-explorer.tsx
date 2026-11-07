"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MENU, fromPrice, type MenuItem } from "@/lib/menu";
import { formatKsh } from "@/lib/site";
import { useStore } from "./providers";
import { IconBag, IconClose, IconFlame, IconMinus, IconPlus, IconSearch, IconUsers } from "./icons";

const FILTERS = ["Sharing", "Spicy", "Pork-free", "Bar"] as const;
const FLAVOURS = ["Dry Fry", "Wet Fry", "Choma"];

function priceLabel(i: MenuItem) {
  if (i.options.length === 1) return formatKsh(i.options[0].price);
  return `from ${formatKsh(fromPrice(i))}`;
}

function DishSheet({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const { add, setCartOpen } = useStore();
  const [opt, setOpt] = useState(0);
  const [flavour, setFlavour] = useState("Choma");
  const [qty, setQty] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!item) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the sheet for a new dish
    setOpt(0);
    setQty(1);
    setFlavour("Choma");
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    const html = document.documentElement;
    html.style.overflow = "hidden";
    dispatchEvent(new Event("pg:scroll-lock"));
    return () => {
      removeEventListener("keydown", onKey);
      html.style.overflow = "";
      dispatchEvent(new Event("pg:scroll-unlock"));
    };
  }, [item, onClose]);
  if (!item) return null;
  const isPlatter = item.categoryId === "platters";
  const o = item.options[opt];
  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={item.name}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div data-lenis-prevent className="sheet-in relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-[32px] bg-paper text-ink sm:rounded-[32px]">
        <button ref={closeRef} onClick={onClose} className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-paper/90 shadow" aria-label="Close">
          <IconClose />
        </button>
        {item.image ? (
          <div className="relative aspect-[16/10]">
            <Image src={item.image} alt={item.name} fill sizes="(min-width: 640px) 672px, 100vw" className="object-cover" />
          </div>
        ) : (
          <div aria-hidden className="relative flex aspect-[16/7] items-end overflow-hidden bg-gradient-to-br from-flame to-flame-deep p-8 text-[#1a0b04]">
            <IconFlame size={220} className="absolute -right-8 -top-10 opacity-20" />
            <p className="tnum font-[family-name:var(--font-display)] text-6xl font-extrabold leading-none">{priceLabel(item)}</p>
          </div>
        )}
        <div className="p-7">
          <p className="kicker text-flame-deep">{item.section ?? item.categoryName}</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight">{item.name}</h2>
          {item.description && <p className="mt-3 text-lg text-ink/70">{item.description}</p>}
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {item.serves && <span className="flex items-center gap-1 rounded-full bg-ink/5 px-3 py-1"><IconUsers size={14} /> For {item.serves}</span>}
            {item.freeDrinks && <span className="rounded-full bg-glow/40 px-3 py-1 font-semibold">{item.freeDrinks} free drinks</span>}
            {item.ageRestricted && <span className="rounded-full bg-ink px-3 py-1 text-bone">18+</span>}
          </div>

          {item.options.length > 1 && (
            <fieldset className="mt-6">
              <legend className="kicker mb-2 text-ink/60">Size</legend>
              <div className="flex flex-wrap gap-2">
                {item.options.map((op, k) => (
                  <button
                    key={op.label}
                    onClick={() => setOpt(k)}
                    aria-pressed={opt === k}
                    className={`tnum rounded-2xl px-4 py-3 text-left ring-1 transition ${opt === k ? "bg-ink text-bone ring-ink" : "ring-ink/15 hover:ring-ink/40"}`}
                  >
                    <span className="block text-sm font-semibold">{op.label}</span>
                    <span className="block text-sm opacity-75">{formatKsh(op.price)}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {isPlatter && (
            <fieldset className="mt-6">
              <legend className="kicker mb-2 text-ink/60">Pork style</legend>
              <div className="grid grid-cols-3 gap-2">
                {FLAVOURS.map((f) => (
                  <button key={f} onClick={() => setFlavour(f)} aria-pressed={flavour === f} className={`rounded-2xl py-3 font-semibold ring-1 transition ${flavour === f ? "bg-ink text-bone ring-ink" : "ring-ink/15"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-ink/5 p-1">
              <button className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-ink/10" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="One less">
                <IconMinus />
              </button>
              <span className="tnum w-8 text-center text-lg font-bold">{qty}</span>
              <button className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-ink/10" onClick={() => setQty((q) => q + 1)} aria-label="One more">
                <IconPlus />
              </button>
            </div>
            <button
              className="btn btn-flame flex-1 py-4 text-base"
              onClick={() => {
                add({ itemId: item.id, name: item.name, option: o.label, flavour: isPlatter ? flavour : undefined, price: o.price }, qty);
                onClose();
                setCartOpen(true);
              }}
            >
              Add {qty} · <span className="tnum">{formatKsh(o.price * qty)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MenuExplorer() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [active, setActive] = useState(MENU.categories[0].id);
  const [open, setOpen] = useState<MenuItem | null>(null);
  const { count, total, setCartOpen } = useStore();
  const close = useCallback(() => setOpen(null), []);

  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    return MENU.items.filter(
      (i) =>
        (!s || `${i.name} ${i.description ?? ""} ${i.section ?? ""} ${i.categoryName}`.toLowerCase().includes(s)) &&
        (!filter || i.tags.includes(filter)),
    );
  }, [q, filter]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    MENU.categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  return (
    <div className="bg-bone text-ink">
      {/* Sticky search and category rail */}
      <div className="sticky top-[calc(var(--header-h)+34px)] z-30 border-b border-ink/10 bg-bone/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:px-10">
          <label className="relative flex items-center lg:w-80">
            <IconSearch size={18} className="absolute left-4 text-ink/50" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: Mbogi, wet fry, mojito..."
              aria-label="Search the menu"
              className="w-full rounded-full bg-white py-3 pl-11 pr-4 ring-1 ring-ink/10 placeholder:text-ink/40 focus:ring-flame"
            />
          </label>
          <nav aria-label="Menu categories" className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            {MENU.categories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${active === c.id ? "bg-ink text-bone" : "bg-ink/5 hover:bg-ink/10"}`}
              >
                {c.name}
              </a>
            ))}
          </nav>
        </div>
        <div className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-4 pb-3 sm:px-6 lg:px-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter((x) => (x === f ? null : f))}
              aria-pressed={filter === f}
              className={`kicker shrink-0 rounded-full px-3 py-1.5 ring-1 transition ${filter === f ? "bg-flame text-[#1a0b04] ring-flame" : "ring-ink/15 hover:ring-ink/40"}`}
            >
              {f}
            </button>
          ))}
          {(q || filter) && (
            <span className="kicker self-center text-ink/50">
              {items.length} match{items.length === 1 ? "" : "es"}
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6 lg:px-10">
        {MENU.categories.map((c) => {
          const list = items.filter((i) => i.categoryId === c.id);
          if (!list.length) return null;
          const sections = [...new Set(list.map((i) => i.section ?? ""))];
          return (
            <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className="scroll-mt-48 pt-14">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 id={`${c.id}-h`} className="font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold tracking-tight">
                  {c.name} {c.ageRestricted && <span className="align-middle text-base">18+</span>}
                </h2>
                {c.note && <p className="max-w-[48ch] text-ink/60">{c.note}</p>}
              </div>
              {sections.map((s) => (
                <div key={s} className="mt-6">
                  {s && <h3 className="kicker mb-3 text-flame-deep">{s}</h3>}
                  <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {list
                      .filter((i) => (i.section ?? "") === s)
                      .map((i) => (
                        <li key={i.id + (i.section ?? "")}>
                          <button
                            onClick={() => setOpen(i)}
                            className={`group flex h-full w-full overflow-hidden rounded-3xl bg-paper text-left ring-1 ring-ink/[0.07] transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-ink/15 ${i.image ? "flex-col" : "items-start"}`}
                          >
                            {i.image && (
                              <span className="relative block aspect-[16/10] w-full overflow-hidden">
                                <Image src={i.image} alt="" fill sizes="(min-width:1280px) 30vw, (min-width:640px) 45vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                              </span>
                            )}
                            <span className="flex w-full flex-1 items-start gap-3 p-5">
                              <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-center gap-2">
                                  <span className="text-lg font-bold leading-snug">{i.name}</span>
                                  {i.tag && <span className="kicker rounded-full bg-glow px-2 py-0.5 text-[0.6rem] text-[#2a1600]">{i.tag}</span>}
                                </span>
                                {i.description && <span className="mt-1 line-clamp-2 block text-sm text-ink/60">{i.description}</span>}
                                {i.options.length > 1 && (
                                  <span className="tnum mt-2 block text-xs text-ink/55">{i.options.map((o) => `${o.label} ${o.price.toLocaleString("en-KE")}`).join(" · ")}</span>
                                )}
                              </span>
                              <span className="flex shrink-0 flex-col items-end gap-2">
                                <span className="tnum font-bold text-flame-deep">{priceLabel(i)}</span>
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-bone transition group-hover:bg-flame group-hover:text-[#1a0b04]" aria-hidden>
                                  <IconPlus size={16} />
                                </span>
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </section>
          );
        })}
        {items.length === 0 && (
          <p className="py-24 text-center text-lg text-ink/60">Nothing matches that. Try &ldquo;pork&rdquo;, &ldquo;platter&rdquo; or &ldquo;mojito&rdquo;.</p>
        )}
      </div>

      {count > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="btn btn-flame fixed bottom-24 left-1/2 z-30 -translate-x-1/2 px-6 py-4 shadow-2xl md:bottom-8"
        >
          <IconBag /> View order · {count} · <span className="tnum">{formatKsh(total)}</span>
        </button>
      )}
      <DishSheet item={open} onClose={close} />
    </div>
  );
}
