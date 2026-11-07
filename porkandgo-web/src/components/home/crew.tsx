import Image from "next/image";
import Link from "next/link";
import { Reveal } from "../chrome";
import { IconArrow } from "../icons";

const CREW = [
  {
    id: "cake",
    img: "/images/crew/cake.webp",
    alt: "A Pork & Go server brings a birthday cake with sparklers to a cheering table",
    tag: "Birthdays",
    title: "We bring the cake out singing.",
    line: "Tell us when you book. A 1kg cake with your message, sparklers and the whole crew on backing vocals.",
    href: "/reserve?occasion=birthday",
    cta: "Plan a birthday",
  },
  {
    id: "crew",
    img: "/images/explore/tt-7606342626354253064.webp",
    alt: "A Pork & Go crew member in the branded tee, seen from behind in the dining room",
    tag: "The crew",
    title: "Look for the tee.",
    line: "Anyone in a Pork & Go shirt will sort you out, from your first order to your last refill.",
    href: "/explore",
    cta: "Watch the crew",
  },
  {
    id: "grill",
    img: "/images/crew/grill.webp",
    alt: "The grill master turns pork choma over glowing charcoal",
    tag: "The grill",
    title: "Coals lit from 8AM.",
    line: "Our grill masters turn out choma, wet fry and dry fry all day, every day, at both spots.",
    href: "/menu#pork",
    cta: "Order pork",
  },
];

export function Crew() {
  return (
    <section id="crew" aria-labelledby="crew-title" className="relative py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <p className="kicker text-glow">The crew</p>
          <h2 id="crew-title" className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
            The people behind the meats.
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg text-bone/75">Hosts, servers and grill masters who make a Tuesday lunch feel like a party, and a party feel like home.</p>
        </Reveal>
      </div>

      {/* swipe rail on phones, three columns from tablets up */}
      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 md:mx-auto md:grid md:max-w-[1400px] md:grid-cols-3 md:gap-6 md:overflow-visible lg:px-10">
        {CREW.map((c, i) => (
          <Reveal key={c.id} className={`swipe-card w-[84vw] max-w-[420px] shrink-0 snap-center md:w-auto md:max-w-none ${i === 1 ? "md:translate-y-12" : ""}`}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-ember ring-1 ring-white/10">
              <div className="relative aspect-[4/5] overflow-hidden">
                <div className="scroll-zoom absolute inset-0">
                  <Image src={c.img} alt={c.alt} fill sizes="(min-width: 768px) 33vw, 84vw" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ember via-ember/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-charcoal/80 px-3 py-1.5 text-xs font-semibold backdrop-blur">{c.tag}</span>
              </div>
              <div className="relative -mt-16 flex flex-1 flex-col p-6">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{c.title}</h3>
                <p className="mt-2 text-bone/70">{c.line}</p>
                <Link href={c.href} className="mt-5 inline-flex items-center gap-1.5 self-start font-bold text-flame">
                  {c.cta} <IconArrow size={17} className="transition group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
