import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/chrome";
import { IconArrow, IconCalendar, IconUsers, IconWhatsApp } from "@/components/icons";
import { MENU, fromPrice } from "@/lib/menu";
import { formatKsh, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Celebrations: birthdays, graduations, office parties and date nights",
  description: "Celebrate at Pork & Go in Nairobi CBD: birthday cakes with your message, graduation feasts, office parties and date nights, with platters and free drinks.",
};

const price = (id: string) => {
  const it = MENU.items.find((i) => i.id === id);
  return it ? formatKsh(fromPrice(it)) : "";
};

const PACKAGES = [
  {
    id: "birthday",
    title: "Birthday bash",
    img: "/images/crew/cake.webp",
    size: "4 to 20 guests",
    platter: { name: "Bazuu Platter", price: price("bazuu-platter") },
    list: ["A 1kg cake with your own message", "The cake brought out with sparklers", "A platter big enough for the crew", "Free juices for the table", "The long table, reserved"],
  },
  {
    id: "graduation",
    title: "Graduation feast",
    img: "/images/food/graduation.webp",
    size: "6 to 25 guests",
    platter: { name: "Mega Platter", price: price("mega-platter") },
    list: ["Bazuu or Mega platter", "Up to five free drinks per platter", "Space for the whole family", "Photos with the gown, of course"],
  },
  {
    id: "squad",
    title: "Office party and team lunch",
    img: "/images/real/mega-platter.webp",
    size: "8 to 40 guests",
    platter: { name: "Mbogi Platter", price: price("mbogi-platter") },
    list: ["Long tables set up before you arrive", "Platters ordered ahead so food lands fast", "One bill for the office", "Weekday lunches or after-work evenings"],
  },
  {
    id: "date-night",
    title: "Date night and anniversary",
    img: "/images/real/raha-platter.webp",
    size: "2 guests",
    platter: { name: "Raha ya Wawili", price: price("raha-ya-wawili-platter") },
    list: ["Raha ya Wawili for two", "Two free juices or mojitos", "Brain Freeze dessert to share", "A quieter corner if you ask"],
  },
];

const STEPS = [
  { icon: IconCalendar, title: "Pick a date", line: "Choose the branch, date, time and number of guests on the Reserve page." },
  { icon: IconWhatsApp, title: "We confirm on WhatsApp", line: "The team confirms your table and helps you choose platters and the cake." },
  { icon: IconUsers, title: "Bring the people", line: "Your table is set when you arrive. All you do is celebrate." },
];

export default function CelebrationsPage() {
  return (
    <>
      <PageHero
        kicker="Celebrations"
        title="Your day. Our grill."
        intro="Birthdays, graduations, office parties and date nights. Tell us the occasion and we set the table for it."
        img="/images/crew/cake.webp"
      >
        <Link href="/reserve" className="btn btn-flame mt-7">
          Book a celebration <IconArrow size={18} />
        </Link>
      </PageHero>

      <section className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          {PACKAGES.map((p) => (
            <Reveal key={p.id}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-ember ring-1 ring-white/10">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="scroll-zoom absolute inset-0">
                    <Image src={p.img} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ember via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-charcoal/80 px-3 py-1.5 text-xs font-semibold backdrop-blur">{p.size}</span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight">{p.title}</h2>
                  <ul className="mt-4 space-y-2 text-bone/80">
                    {p.list.map((l) => (
                      <li key={l} className="flex gap-3">
                        <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-flame" />
                        {l}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm text-bone/60">
                    Suggested: <span className="font-semibold text-bone">{p.platter.name}</span> from <span className="font-semibold text-glow">{p.platter.price}</span>
                  </p>
                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    <Link href={`/reserve?occasion=${p.id}`} className="btn btn-flame">
                      Book this <IconArrow size={18} />
                    </Link>
                    <a href={whatsappLink(`Hi Pork & Go! I'm planning a ${p.title.toLowerCase()}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                      <IconWhatsApp /> Ask us
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-bone py-20 text-ink">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <Reveal>
            <p className="kicker text-flame-deep">How it works</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">Booked in a minute.</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <Reveal key={s.title}>
                <div className="h-full rounded-[24px] bg-paper p-7 ring-1 ring-ink/10">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-flame text-[#1a0b04]">
                    <s.icon size={22} />
                  </span>
                  <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-ink/70">{s.line}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
