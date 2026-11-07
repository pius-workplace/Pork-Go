"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MENU, type MenuCategory, type MenuItem } from "@/lib/menu";
import { BRANCHES, PHONE_DISPLAY, whatsappLink } from "@/lib/site";
import { IconWhatsApp } from "./icons";

/**
 * A4 menu book built from the live menu data (src/content/menu.json), so it never goes out of date.
 * Wide screens: an open book, the right page turns over the spine.
 * Phones: one page at a time, the page peels away to the left.
 * Swipe, arrow keys, or the buttons turn pages. Section tabs jump straight to a part of the menu.
 */

type Page =
  | { kind: "cover" }
  | { kind: "items"; cat: MenuCategory; items: MenuItem[]; first: boolean }
  | { kind: "back" }
  | { kind: "blank" };

type Mode = "single" | "spread";

const PAGINATION = {
  spread: { cap: 30, chars: 62 },
  single: { cap: 21, chars: 44 },
};

function paginate(mode: Mode): Page[] {
  const { cap, chars } = PAGINATION[mode];
  const pages: Page[] = [{ kind: "cover" }];
  for (const cat of MENU.categories) {
    const items = MENU.items.filter((i) => i.categoryId === cat.id);
    let cur: MenuItem[] = [];
    let first = true;
    let used = 4.5 + (cat.note ? Math.ceil(cat.note.length / chars) * 0.9 : 0);
    let lastSection: string | undefined;
    for (const it of items) {
      const sectionCost = it.section && it.section !== lastSection ? 1.8 : 0;
      const cost = 1.9 + (it.description ? Math.ceil(it.description.length / chars) * 0.9 : 0) + (it.options.length > 1 ? 1 : 0) + sectionCost;
      if (used + cost > cap && cur.length) {
        pages.push({ kind: "items", cat, items: cur, first });
        cur = [];
        first = false;
        used = 2.5;
        lastSection = undefined;
      }
      cur.push(it);
      used += cost;
      lastSection = it.section;
    }
    if (cur.length) pages.push({ kind: "items", cat, items: cur, first });
  }
  // the back cover should land on a left-hand page in the open book
  if (mode === "spread" && pages.length % 2 === 0) pages.push({ kind: "blank" });
  pages.push({ kind: "back" });
  return pages;
}

/** Pack real measured heights into pages, so every page is full and nothing is cut off. */
function packMeasured(mode: Mode, root: HTMLElement): Page[] | null {
  const pages: Page[] = [{ kind: "cover" }];
  const cont = root.querySelector<HTMLElement>("[data-cont] ul");
  const label = root.querySelector<HTMLElement>("[data-label-probe]");
  if (!cont || !label) return null;
  const contAvail = cont.clientHeight;
  const ls = getComputedStyle(label);
  const labelH = label.getBoundingClientRect().height + parseFloat(ls.marginTop) + parseFloat(ls.marginBottom);
  for (const cat of MENU.categories) {
    const ul = root.querySelector<HTMLElement>(`[data-cat="${cat.id}"] ul`);
    if (!ul) return null;
    const items = MENU.items.filter((i) => i.categoryId === cat.id);
    const lis = [...ul.querySelectorAll<HTMLElement>(":scope > li")];
    if (lis.length !== items.length) return null;
    let avail = ul.clientHeight;
    let used = 0;
    let cur: MenuItem[] = [];
    let first = true;
    lis.forEach((li, idx) => {
      const mb = parseFloat(getComputedStyle(li).marginBottom);
      const h = li.offsetHeight + mb;
      const it = items[idx];
      // an item that opens a page shows its section label even if the previous dish shared it
      const extra = it.section && it.section === items[idx - 1]?.section ? labelH : 0;
      // the last dish's bottom margin may hang off the page; keep a little room for descenders
      if (cur.length && used + h - mb > avail - 8) {
        pages.push({ kind: "items", cat, items: cur, first });
        cur = [];
        first = false;
        avail = contAvail;
        used = extra;
      }
      cur.push(it);
      used += h;
    });
    if (cur.length) pages.push({ kind: "items", cat, items: cur, first });
  }
  if (mode === "spread" && pages.length % 2 === 0) pages.push({ kind: "blank" });
  pages.push({ kind: "back" });
  return pages;
}

/** Off-screen copies of every section at the real page size, used only for measuring. */
function Measurer({ mode, w, h, onDone }: { mode: Mode; w: number; h: number; onDone: (p: Page[]) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let alive = true;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!alive || !ref.current) return;
      const p = packMeasured(mode, ref.current);
      if (p) onDone(p);
    });
    return () => {
      alive = false;
    };
  }, [mode, w, h, onDone]);
  const box = { width: w, height: h };
  return (
    <div ref={ref} aria-hidden className={`pointer-events-none fixed left-[-99999px] top-0 ${mode === "spread" ? "book-spread" : "book-single"}`} style={{ visibility: "hidden" }}>
      {MENU.categories.map((cat) => (
        <div key={cat.id} className="book-half" style={box} data-cat={cat.id}>
          <PageView page={{ kind: "items", cat, items: MENU.items.filter((i) => i.categoryId === cat.id), first: true }} />
        </div>
      ))}
      <div className="book-half" style={box} data-cont>
        <div className="book-page relative h-full w-full overflow-hidden">
          <ItemsPage page={{ kind: "items", cat: MENU.categories[0], items: [], first: false }} />
          <p data-label-probe className="kicker absolute left-0 top-0 mb-[0.4em] mt-[0.9em] text-[0.62em]">Section</p>
        </div>
      </div>
    </div>
  );
}

const ksh = (n: number) => n.toLocaleString("en-KE");

function Cover() {
  return (
    <div className="flex h-full flex-col items-center justify-between bg-charcoal p-[9%] text-center text-bone">
      <p className="kicker text-[0.75em] text-glow">Nairobi CBD</p>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-on-dark.svg" alt="Pork & Go" className="mx-auto w-[78%]" />
        <p className="mt-[8%] font-[family-name:var(--font-display)] text-[3.6em] font-extrabold leading-none tracking-tight">Menu</p>
        <p className="mt-[3%] text-[1em] text-bone/70">Pork done every way. Platters for every squad.</p>
      </div>
      <div className="text-[0.85em] text-bone/60">
        <p>{BRANCHES.map((b) => b.name).join(" · ")}</p>
        <p className="mt-1">Prices in Kenyan shillings</p>
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-[4%] rounded-[2px] border border-glow/30" />
    </div>
  );
}

function Back() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[5%] bg-charcoal p-[10%] text-center text-bone">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/icon.svg" alt="" className="w-[22%] rounded-[18%]" />
      <p className="font-[family-name:var(--font-display)] text-[2.4em] font-extrabold leading-[0.95]">Hungry yet?</p>
      <p className="text-[1em] text-bone/70">Order on WhatsApp or call {PHONE_DISPLAY}. Free juice with every platter.</p>
      <a
        href={whatsappLink("Hi Pork & Go! I'd like to order.")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-[0.5em] rounded-full bg-flame px-[1.4em] py-[0.8em] text-[1em] font-bold text-[#1a0b04]"
      >
        <IconWhatsApp size={16} /> Order now
      </a>
      <p className="text-[0.75em] text-bone/45">Bar menu for guests aged 18 and over.</p>
    </div>
  );
}

function ItemsPage({ page }: { page: Extract<Page, { kind: "items" }> }) {
  return (
    <div className="menu-paper flex h-full flex-col px-[8%] pb-[6%] pt-[7%] text-ink">
      <div className="flex items-center justify-between border-b border-ink/15 pb-[2.5%]">
        <span className="kicker text-[0.62em] text-flame-deep">Pork &amp; Go</span>
        <span className="kicker text-[0.62em] text-ink/45">{page.first ? "Menu" : page.cat.name}</span>
      </div>
      {page.first && (
        <div className="mt-[5%]">
          <h3 className="font-[family-name:var(--font-display)] text-[2.3em] font-extrabold leading-[0.95] tracking-tight">{page.cat.name}</h3>
          {page.cat.note && <p className="mt-[2%] text-[0.82em] italic text-ink/60">{page.cat.note}</p>}
        </div>
      )}
      <ul className={`min-h-0 flex-1 overflow-hidden ${page.first ? "mt-[4%]" : "mt-[5%]"}`}>
        {page.items.map((it, idx) => {
          const showSection = it.section && it.section !== page.items[idx - 1]?.section;
          const multi = it.options.length > 1;
          return (
            <li key={it.id} className="mb-[0.75em]">
              {showSection && <p className="kicker mb-[0.4em] mt-[0.9em] text-[0.62em] text-flame-deep">{it.section}</p>}
              <div className="flex items-baseline gap-[0.4em]">
                <span className="text-[1.02em] font-bold leading-tight">{it.name}</span>
                <span aria-hidden className="mx-[0.2em] min-w-[1.5em] flex-1 translate-y-[-0.25em] border-b border-dotted border-ink/30" />
                {!multi && it.options[0] && <span className="tnum text-[1em] font-bold text-flame-deep">{ksh(it.options[0].price)}</span>}
              </div>
              {it.description && <p className="mt-[0.15em] text-[0.8em] leading-snug text-ink/65">{it.description}</p>}
              {multi && (
                <p className="tnum mt-[0.2em] text-[0.82em] font-semibold text-flame-deep">
                  {it.options.map((o) => `${o.label} ${ksh(o.price)}`).join("  ·  ")}
                </p>
              )}
              {it.freeDrinks ? <p className="mt-[0.15em] text-[0.74em] font-semibold text-kachumbari">+ {it.freeDrinks} free drinks</p> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PageView({ page }: { page?: Page }) {
  if (!page) return null;
  return (
    <div className="book-page relative h-full w-full overflow-hidden">
      {page.kind === "cover" && <Cover />}
      {page.kind === "back" && <Back />}
      {page.kind === "blank" && <div className="menu-paper h-full" />}
      {page.kind === "items" && <ItemsPage page={page} />}
    </div>
  );
}

type Turn = { dir: 1 | -1; to: number } | null;

export function MenuBook() {
  const [mode, setMode] = useState<Mode>("single");
  const estimate = useMemo(() => paginate(mode), [mode]);
  const [measured, setMeasured] = useState<{ key: string; pages: Page[] } | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const sizeKey = size ? `${mode}:${size.w}x${size.h}` : "";
  const pages = measured && measured.key === sizeKey ? measured.pages : estimate;
  const onMeasured = useCallback((p: Page[]) => setMeasured({ key: sizeKey, pages: p }), [sizeKey]);
  // single: index of the page showing. spread: index of the spread (left page = 2s-1, right page = 2s).
  const [at, setAt] = useState(0);
  const [turn, setTurn] = useState<Turn>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  const last = mode === "spread" ? Math.ceil((pages.length - 1) / 2) : pages.length - 1;

  // track the real page size; re-measure when it changes
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      const h = Math.round(e.contentRect.height);
      if (w > 0 && h > 0) setSize((s) => (s && s.w === w && s.h === h ? s : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  // keep the open page valid if the page count changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clamp after re-pagination
    setAt((a) => Math.min(a, last));
  }, [last]);

  useEffect(() => {
    const mq = matchMedia("(min-width: 900px)");
    const apply = () => {
      setMode(mq.matches ? "spread" : "single");
      setAt(0);
      setTurn(null);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (turn) return;
      const to = at + dir;
      if (to < 0 || to > last) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) setAt(to);
      else setTurn({ dir, to });
    },
    [at, last, turn],
  );

  const jump = (pageIndex: number) => {
    if (turn) return;
    setAt(mode === "spread" ? Math.ceil(pageIndex / 2) : pageIndex);
  };

  // run the page turn
  useEffect(() => {
    if (!turn || !sheet.current) return;
    const full = mode === "spread" ? -180 : -115;
    const frames = turn.dir === 1 ? [{ transform: "rotateY(0deg)" }, { transform: `rotateY(${full}deg)` }] : [{ transform: `rotateY(${full}deg)` }, { transform: "rotateY(0deg)" }];
    const anim = sheet.current.animate(frames, { duration: mode === "spread" ? 820 : 620, easing: "cubic-bezier(.45,.05,.25,1)", fill: "forwards" });
    const shade = sheet.current.querySelector<HTMLElement>(".turn-shade");
    shade?.animate([{ opacity: turn.dir === 1 ? 0 : 0.35 }, { opacity: 0.35, offset: 0.5 }, { opacity: turn.dir === 1 ? 0.35 : 0 }], { duration: anim.effect?.getTiming().duration as number, fill: "forwards" });
    anim.onfinish = () => {
      setAt(turn.to);
      setTurn(null);
    };
    return () => anim.cancel();
  }, [turn, mode]);

  const P = (i: number) => (i >= 0 ? pages[i] : undefined);

  // which pages sit under the moving sheet
  let left: Page | undefined, right: Page | undefined, front: Page | undefined, back: Page | undefined;
  if (mode === "spread") {
    const s = at;
    left = P(2 * s - 1);
    right = P(2 * s);
    if (turn?.dir === 1) {
      right = P(2 * s + 2);
      front = P(2 * s);
      back = P(2 * s + 1);
    } else if (turn?.dir === -1) {
      left = P(2 * s - 3);
      front = P(2 * s - 2);
      back = P(2 * s - 1);
    }
  } else {
    right = P(at);
    if (turn?.dir === 1) {
      right = P(at + 1);
      front = P(at);
    } else if (turn?.dir === -1) {
      front = P(at - 1);
    }
  }

  // centre the closed book on its cover, and on its back cover at the end
  const shownSpread = mode === "spread" ? (turn ? turn.to : at) : 0;
  const shift = mode !== "spread" ? 0 : shownSpread === 0 ? -25 : shownSpread === last && !P(2 * last) ? 25 : 0;

  const starts = useMemo(() => {
    const map: { cat: MenuCategory; index: number }[] = [];
    pages.forEach((p, i) => p.kind === "items" && p.first && map.push({ cat: p.cat, index: i }));
    return map;
  }, [pages]);
  const currentPage = mode === "spread" ? Math.max(0, 2 * at - 1) : at;
  const activeCat = [...starts].reverse().find((s) => s.index <= currentPage + (mode === "spread" ? 1 : 0))?.cat.id;

  return (
    <div className="menu-book-wrap">
      <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:justify-center sm:px-0" aria-label="Jump to a section">
        <button onClick={() => jump(0)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${currentPage === 0 ? "bg-bone text-ink" : "bg-white/[0.06] text-bone/80 ring-1 ring-white/15"}`}>
          Cover
        </button>
        {starts.map((s) => (
          <button
            key={s.cat.id}
            onClick={() => jump(s.index)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${activeCat === s.cat.id && currentPage !== 0 ? "bg-bone text-ink" : "bg-white/[0.06] text-bone/80 ring-1 ring-white/15 hover:text-bone"}`}
          >
            {s.cat.name.replace("Nyama Nyama ", "")}
          </button>
        ))}
      </div>

      <div
        className={`book-stage mx-auto select-none ${mode === "spread" ? "book-spread" : "book-single"}`}
        tabIndex={0}
        role="region"
        aria-roledescription="menu book"
        aria-label="Menu book. Use the left and right arrow keys to turn pages."
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) return;
          const r = e.currentTarget.getBoundingClientRect();
          go(e.clientX > r.left + r.width / 2 ? 1 : -1);
        }}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        <div className="book" style={{ transform: `translateX(${shift}%)` }}>
          {mode === "spread" && (
            <div className="book-half book-left">
              <PageView page={left} />
              {left && <span aria-hidden className="spine-shade spine-left" />}
            </div>
          )}
          <div ref={pageRef} className="book-half book-right">
            <PageView page={right} />
            {right && <span aria-hidden className="spine-shade spine-right" />}
          </div>

          {turn && front && (
            <div ref={sheet} className="book-sheet" style={{ transform: turn.dir === 1 ? "rotateY(0deg)" : `rotateY(${mode === "spread" ? -180 : -115}deg)` }}>
              <div className="sheet-face">
                <PageView page={front} />
                <span aria-hidden className="turn-shade" />
              </div>
              <div className="sheet-face sheet-back">{mode === "spread" ? <PageView page={back} /> : <div className="menu-paper h-full" />}</div>
            </div>
          )}
        </div>
      </div>

      {size && <Measurer mode={mode} w={size.w} h={size.h} onDone={onMeasured} />}

      <div className="mt-6 flex items-center justify-center gap-4">
        <button onClick={() => go(-1)} disabled={at === 0} className="grid h-12 w-12 place-items-center rounded-full bg-white/[0.07] ring-1 ring-white/15 transition hover:bg-white/15 disabled:opacity-30" aria-label="Previous page">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 6-6 6 6 6" /></svg>
        </button>
        <p className="min-w-[10ch] text-center text-sm text-bone/60">{at === 0 ? "Tap to open" : at === last ? "The end" : "Swipe or tap"}</p>
        <button onClick={() => go(1)} disabled={at === last} className="grid h-12 w-12 place-items-center rounded-full bg-flame text-[#1a0b04] transition hover:brightness-110 disabled:opacity-30" aria-label="Next page">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m9 6 6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}

