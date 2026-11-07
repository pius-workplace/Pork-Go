"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useStore } from "./providers";
import { BRANCHES, PHONE_DISPLAY, PHONE_TEL, SOCIALS, getBranch, whatsappLink } from "@/lib/site";
import { IconCalendar, IconFacebook, IconInstagram, IconPhone, IconPin, IconTikTok, IconWhatsApp } from "./icons";

const SOCIAL_ICON = { tiktok: IconTikTok, instagram: IconInstagram, facebook: IconFacebook };

/** IntersectionObserver reveal: adds .in, then .done so hover states lose the stagger delay. */
export function Reveal({ as: Tag = "div", className = "", children, ...rest }: { as?: React.ElementType; className?: string; children: React.ReactNode } & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          setTimeout(() => el.classList.add("done"), 1200);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/** Weighted smooth scrolling on desktop pointers only, never with reduced motion. Also pauses loops on hidden tabs. */
export function SmoothScroll() {
  useEffect(() => {
    const onVis = () => document.body.classList.toggle("paused", document.hidden);
    document.addEventListener("visibilitychange", onVis);
    let destroy: (() => void) | undefined;
    const fine = matchMedia("(pointer: fine)").matches;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduce) {
      import("lenis").then(({ default: Lenis }) => {
        const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
        let id = 0;
        const raf = (t: number) => {
          lenis.raf(t);
          id = requestAnimationFrame(raf);
        };
        id = requestAnimationFrame(raf);
        // drawers and sheets pause smooth scroll so the wheel scrolls them, not the page
        const lock = () => lenis.stop();
        const unlock = () => lenis.start();
        addEventListener("pg:scroll-lock", lock);
        addEventListener("pg:scroll-unlock", unlock);
        destroy = () => {
          cancelAnimationFrame(id);
          removeEventListener("pg:scroll-lock", lock);
          removeEventListener("pg:scroll-unlock", unlock);
          lenis.destroy();
        };
      });
    }
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      destroy?.();
    };
  }, []);
  return null;
}

export function MobileDock() {
  const { branchId } = useStore();
  const b = getBranch(branchId);
  return (
    <nav aria-label="Quick actions" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 gap-1 rounded-2xl bg-ember/90 p-1.5 shadow-2xl ring-1 ring-white/10 backdrop-blur-md md:hidden">
      <a href={whatsappLink(`Hi Pork & Go! I'd like to order from ${b.name}.`)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-semibold text-bone">
        <IconWhatsApp size={22} className="text-[#25D366]" />
        WhatsApp
      </a>
      <Link href="/reserve" className="flex flex-col items-center gap-0.5 rounded-xl bg-flame py-2 text-xs font-bold text-[#1a0b04]">
        <IconCalendar size={22} />
        Reserve
      </Link>
      <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-semibold text-bone">
        <IconPin size={22} className="text-flame" />
        Directions
      </a>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url(/images/journey/04-platter.webp)" }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/90 to-charcoal/95" />
      <div className="relative mx-auto max-w-[1400px] px-4 pb-28 pt-20 sm:px-6 md:pb-12 lg:px-10">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-on-dark.svg" alt="Pork & Go, we got the meats" width={220} height={91} className="h-20 w-auto" />
            <p className="mt-5 max-w-[34ch] text-lg text-bone/75">Two spots in Nairobi CBD. Big platters, free juice, and the meats you came for.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink("Hi Pork & Go!")} target="_blank" rel="noopener noreferrer" className="btn btn-flame">
              <IconWhatsApp /> Order on WhatsApp
            </a>
            <Link href="/reserve" className="btn btn-ghost">
              Reserve a table
            </Link>
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {BRANCHES.map((b) => (
            <div key={b.id}>
              <p className="kicker text-glow">{b.tag}</p>
              <p className="mt-2 text-lg font-bold">{b.name}</p>
              <p className="text-bone/70">{b.landmark}</p>
              <p className="text-bone/70">{b.hours}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-flame underline-offset-4 hover:underline">
                  Get directions
                </a>
                <Link href={`/branches/${b.id}`} className="text-bone/70 underline-offset-4 hover:text-bone hover:underline">
                  Branch details
                </Link>
              </div>
            </div>
          ))}
          <div>
            <p className="kicker text-glow">Company</p>
            <ul className="mt-3 space-y-2 text-bone/75">
              <li><Link href="/about" className="hover:text-bone">About us</Link></li>
              <li><Link href="/explore" className="hover:text-bone">Explore videos and photos</Link></li>
              <li><Link href="/offers" className="hover:text-bone">Offers and events</Link></li>
              <li><Link href="/celebrations" className="hover:text-bone">Celebrations</Link></li>
              <li><Link href="/faq" className="hover:text-bone">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <p className="kicker text-glow">Talk to us</p>
            <ul className="mt-3 space-y-3 text-bone/80">
              <li>
                <a href={whatsappLink("Hi Pork & Go!")} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 hover:text-bone">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366]/15 text-[#25D366] transition group-hover:bg-[#25D366] group-hover:text-[#06210f]">
                    <IconWhatsApp size={19} />
                  </span>
                  <span>
                    <span className="block text-xs text-bone/50">WhatsApp</span>
                    {PHONE_DISPLAY}
                  </span>
                </a>
              </li>
              <li>
                <a href={`tel:${PHONE_TEL}`} className="group flex items-center gap-3 hover:text-bone">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-flame/15 text-flame transition group-hover:bg-flame group-hover:text-[#1a0b04]">
                    <IconPhone size={18} />
                  </span>
                  <span>
                    <span className="block text-xs text-bone/50">Call us</span>
                    {PHONE_DISPLAY}
                  </span>
                </a>
              </li>
            </ul>
            <ul className="mt-5 flex gap-2.5" aria-label="Follow Pork & Go">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICON[s.id];
                return (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Pork & Go on ${s.name}`}
                      title={s.name}
                      className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.07] text-bone ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:bg-bone hover:text-ink"
                    >
                      <Icon size={19} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-bone/45 sm:flex-row sm:justify-between">
          <p>
            © 2026 Pork & Go · We got the meats ·{" "}
            <Link href="/privacy" className="hover:text-bone">Privacy</Link> ·{" "}
            <Link href="/terms" className="hover:text-bone">Terms</Link>
          </p>
          <p>Bar menu is for guests aged 18 and over. Prices in Kenyan shillings.</p>
        </div>
      </div>
    </footer>
  );
}
