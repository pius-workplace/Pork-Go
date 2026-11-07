import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/chrome";
import { IconArrow, IconClock, IconWhatsApp } from "@/components/icons";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Offers and events: weekly deals and happy hour",
  description: "Pork & Go deals in Nairobi CBD: combos from KSh 350 with a free drink, BOGOF burger Thursdays, daily happy hour and platters with free juices.",
};

/** Deals as posted by Pork & Go on TikTok and their Google profile. Keep in step with what is running in the restaurant. */
const COMBOS = [
  { title: "Burger combo", price: "KSh 350", free: "Free soda or mojito", line: "Burger and chips.", img: "/images/real/burger.webp" },
  { title: "Shawarma combo", price: "KSh 350", free: "Free soda or mojito", line: "Pork shawarma wrap with fries.", img: "/images/explore/tt-7427400257174064389.webp" },
  { title: "Pork chops and fries", price: "KSh 350", free: "Free mocktail", line: "Tender chops that fall off the bone.", img: "/images/explore/tt-7496759060373572870.webp" },
  { title: "Spicy noodles and pork", price: "KSh 450", free: "Free drink", line: "Stir-fried noodles with spicy pork.", img: "/images/real/stir-fried-pork.webp" },
  { title: "Pork choma and chipo", price: "KSh 490", free: "Free mocktail or soda", line: "Mixed pork choma with chips.", img: "/images/explore/tt-7641935598420299016.webp" },
  { title: "Spicy pork ribs", price: "KSh 490", free: "Free mocktail or soda", line: "Sticky, spicy ribs.", img: "/images/explore/tt-7611766618921717000.webp" },
];

const WEEK = [
  { when: "Every day", time: "4PM to 9PM", title: "Happy hour", line: "Cocktail deals at the bar, and a free chaser with every mzinga. 18+ only.", img: "/images/real/cocktail-poster.webp" },
  { when: "Thursdays", time: "All day", title: "BOGOF burger Thursdays", line: "Buy one burger, get one free.", img: "/images/real/burger-deal.webp" },
  { when: "Weekends", time: "Fri to Sun", title: "Weekends are for platters", line: "Platters from KSh 1,450 with free juices or mocktails for the table.", img: "/images/explore/tt-7510099180472356102.webp" },
];

export default function OffersPage() {
  return (
    <>
      <PageHero
        kicker="Offers & events"
        title="Deals that hit different."
        intro="Combos from KSh 350 with a free drink, burger Thursdays, daily happy hour and weekend platters. Deals change often, so check here before you pull up."
        img="/images/real/burger.webp"
      />

      <section className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-10">
        <Reveal>
          <p className="kicker text-glow">Every week</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">What&apos;s on</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {WEEK.map((w) => (
            <Reveal key={w.title}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-ember ring-1 ring-white/10">
                <div className="relative aspect-[4/3] overflow-hidden bg-ash">
                  <Image src={w.img} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-flame px-3 py-1.5 text-xs font-bold text-[#1a0b04]">{w.when}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-center gap-2 text-sm text-glow">
                    <IconClock size={16} /> {w.time}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold">{w.title}</h3>
                  <p className="mt-2 text-bone/75">{w.line}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-bone py-20 text-ink">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kicker text-flame-deep">Combos</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">Lunch sorted, drink included.</h2>
            </div>
            <Link href="/menu" className="btn btn-ink self-start">
              Full menu <IconArrow size={18} />
            </Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {COMBOS.map((c) => (
              <Reveal key={c.title}>
                <article className="flex h-full flex-col overflow-hidden rounded-[22px] bg-paper ring-1 ring-ink/10 sm:rounded-[28px]">
                  <div className="relative aspect-square overflow-hidden">
                    <Image src={c.img} alt="" fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover object-center" />
                    <span className="absolute right-3 top-3 rounded-full bg-ink px-3 py-1.5 text-sm font-bold text-bone sm:text-base">{c.price}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-6">
                    <h3 className="text-lg font-bold leading-tight sm:text-xl">{c.title}</h3>
                    <p className="mt-1 text-sm text-ink/65">{c.line}</p>
                    <p className="mt-2 text-sm font-semibold text-kachumbari">{c.free}</p>
                    <a
                      href={whatsappLink(`Hi Pork & Go! I'd like the ${c.title} deal (${c.price}).`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-flame mt-auto w-full px-3 py-3 text-sm sm:text-base"
                      style={{ marginTop: "1rem" }}
                    >
                      <IconWhatsApp size={18} /> Order
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-sm text-ink/55">Deals run while stocks last and can change. The team confirms your price on WhatsApp before you pay.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10">
        <Reveal className="flex flex-col gap-6 rounded-[32px] bg-ember p-8 ring-1 ring-white/10 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="kicker text-glow">Events</p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold sm:text-4xl">Planning something?</h2>
            <p className="mt-2 max-w-[48ch] text-bone/70">Birthdays, graduations, office parties and Valentine&apos;s. We set the table, you bring the people.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/celebrations" className="btn btn-flame">See celebrations <IconArrow size={18} /></Link>
            <Link href="/explore" className="btn btn-ghost">Watch the deals</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
