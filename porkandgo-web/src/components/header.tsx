"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "./providers";
import { BRANCHES, PHONE_DISPLAY, PHONE_TEL, getBranch, isOpenNow, type BranchId } from "@/lib/site";
import { IconBag, IconChevron, IconClose, IconMenu, IconPin } from "./icons";

const NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/menu#order", label: "Order Online" },
  { href: "/explore", label: "Explore" },
  { href: "/#experience", label: "The Experience" },
  { href: "/offers", label: "Offers & Events" },
];
const PAGES = [
  { href: "/about", label: "About us" },
  { href: "/celebrations", label: "Celebrations" },
  { href: "/branches/braidwood-house", label: "Braidwood House" },
  { href: "/branches/development-house", label: "Development House" },
  { href: "/faq", label: "FAQs" },
  { href: "/reserve", label: "Reserve a table" },
];

const TICKER = [
  "New spot now open · Development House",
  "We got the meats",
  "Braidwood House · Tom Mboya St",
  "Free juice or mocktail with every platter",
  "Order on WhatsApp",
  "Happy hour 4PM to 9PM",
];

export function Ticker() {
  const row = (
    <div className="flex shrink-0 items-center">
      {TICKER.map((t) => (
        <span key={t} className="flex items-center gap-6 px-6">
          <span>{t}</span>
          <span aria-hidden className="opacity-60">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative z-50 overflow-hidden bg-flame text-[#1a0b04]" aria-label="Announcements">
      <div className="marquee kicker py-2 font-semibold tracking-[0.12em]">
        {row}
        <div aria-hidden className="flex">{row}</div>
      </div>
    </div>
  );
}

export function BranchSwitcher({ compact = false }: { compact?: boolean }) {
  const { branchId, setBranchId } = useStore();
  const b = getBranch(branchId);
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clock only exists on the client
    setNow(new Date());
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const openNow = now ? isOpenNow(b, now) : null;
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm ring-1 ring-white/15 transition hover:bg-white/10"
      >
        <IconPin size={16} className="text-flame" />
        <span className="font-semibold">{compact ? b.short : b.name}</span>
        {openNow !== null && (
          <span className={`h-2 w-2 rounded-full ${openNow ? "bg-kachumbari" : "bg-smoke"}`} aria-label={openNow ? "Open now" : "Closed now"} />
        )}
        <IconChevron size={14} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        role="listbox"
        aria-label="Choose your branch"
        className={`absolute right-0 top-[calc(100%+8px)] z-50 w-72 origin-top-right rounded-2xl bg-ember p-2 shadow-2xl ring-1 ring-white/10 transition duration-300 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {BRANCHES.map((br) => (
          <button
            key={br.id}
            role="option"
            aria-selected={br.id === branchId}
            onClick={() => {
              setBranchId(br.id as BranchId);
              setOpen(false);
            }}
            className={`flex w-full flex-col items-start rounded-xl px-3 py-2.5 text-left transition hover:bg-white/5 ${
              br.id === branchId ? "bg-white/[0.07]" : ""
            }`}
          >
            <span className="flex w-full items-baseline justify-between">
              <span className="font-semibold">{br.name}</span>
              <span className="kicker text-glow">{br.tag}</span>
            </span>
            <span className="text-sm text-smoke">{br.landmark} · {br.hours}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const { count, setCartOpen, branchId } = useStore();
  const [solid, setSolid] = useState(!overHero);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);

  useEffect(() => {
    if (!overHero) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- route change resets header state
      setSolid(true);
      return;
    }
    const on = () => setSolid(window.scrollY > 40);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, [overHero]);

  useEffect(() => {
    if (!menuOpen) return;
    document.documentElement.style.overflow = "hidden";
    dispatchEvent(new Event("pg:scroll-lock"));
    return () => {
      document.documentElement.style.overflow = "";
      dispatchEvent(new Event("pg:scroll-unlock"));
    };
  }, [menuOpen]);

  const b = getBranch(branchId);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <Ticker />
      <div
        className={`transition-colors duration-500 ${
          solid ? "bg-charcoal/85 shadow-[0_1px_0_rgba(245,239,230,0.08)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <nav aria-label="Main" className="mx-auto flex h-[var(--header-h)] max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <Link href="/" className="shrink-0" aria-label="Pork & Go home">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo, no optimisation needed */}
            <img src="/brand/logo-on-dark.svg" alt="Pork & Go, we got the meats" width={150} height={62} className="h-11 w-auto sm:h-12" />
          </Link>

          <ul className="ml-6 hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition hover:bg-white/5 hover:text-white ${
                    pathname === n.href ? "text-flame" : "text-bone/85"
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="relative" onMouseLeave={() => setPagesOpen(false)}>
              <button
                type="button"
                aria-expanded={pagesOpen}
                onClick={() => setPagesOpen((o) => !o)}
                onMouseEnter={() => setPagesOpen(true)}
                className="flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-bone/85 transition hover:bg-white/5"
              >
                Pages <IconChevron size={14} className={`transition ${pagesOpen ? "rotate-180" : ""}`} />
              </button>
              <div
                className={`absolute left-0 top-full w-56 pt-2 transition duration-300 ${
                  pagesOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                <ul className="rounded-2xl bg-ember p-2 shadow-2xl ring-1 ring-white/10">
                  {PAGES.map((p) => (
                    <li key={p.href}>
                      <Link href={p.href} onClick={() => setPagesOpen(false)} className="block rounded-xl px-3 py-2.5 transition hover:bg-white/5">
                        {p.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:block">
              <BranchSwitcher />
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/15 transition hover:bg-white/10"
              aria-label={`Open your order, ${count} item${count === 1 ? "" : "s"}`}
            >
              <IconBag size={20} />
              {count > 0 && (
                <span className="tnum absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-flame px-1 text-[11px] font-bold text-[#1a0b04]">
                  {count}
                </span>
              )}
            </button>
            <Link href="/reserve" className="btn btn-flame hidden sm:inline-flex">
              Reserve
            </Link>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/15 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <IconMenu />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile curtain menu */}
      <div
        className="fixed inset-0 z-[60] bg-charcoal transition-[clip-path] duration-700 ease-[var(--ease-in-out-soft)] lg:hidden"
        style={{ clipPath: menuOpen ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div data-lenis-prevent className="flex h-full flex-col overflow-y-auto overscroll-contain px-6 pb-10 pt-5">
          <div className="flex items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-on-dark.svg" alt="Pork & Go" width={130} height={54} className="h-10 w-auto" />
            <button onClick={() => setMenuOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5" aria-label="Close menu">
              <IconClose />
            </button>
          </div>
          <ul className="mt-10 space-y-1">
            {[...NAV, ...PAGES].map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 font-[family-name:var(--font-display)] text-[2rem] font-extrabold leading-tight tracking-tight"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <BranchSwitcher />
          </div>
          <div className="mt-auto space-y-2 pt-10 text-smoke">
            <p className="kicker text-glow">Visit us</p>
            <p className="text-bone">{b.name}, {b.landmark}</p>
            <p>{b.hours}</p>
            <a href={`tel:${PHONE_TEL}`} className="block text-bone underline decoration-flame underline-offset-4">
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
