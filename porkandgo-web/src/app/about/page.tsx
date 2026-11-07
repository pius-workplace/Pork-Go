import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/chrome";
import { IconArrow } from "@/components/icons";
import { BRANCHES } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Pork & Go",
  description:
    "Pork & Go is a pork grill in Nairobi CBD with two spots on Tom Mboya Street: big platters, fair prices and a free juice with every platter.",
};

const VALUES = [
  {
    title: "Generous plates",
    line: "Platters built for sharing, from a date for two to the whole squad. Nobody leaves hungry.",
    img: "/images/real/mega-platter.webp",
  },
  {
    title: "Fair prices",
    line: "Combos from KSh 350 and platters from KSh 1,450, with free juices or mojitos thrown in.",
    img: "/images/real/raha-platter.webp",
  },
  {
    title: "Pork done every way",
    line: "Choma, wet fry, dry fry, honey glazed, crispy and crunchy. Plus chicken, rabbit and fish.",
    img: "/images/real/crispy-pork.webp",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About us"
        title={<>We got the meats.</>}
        intro="Pork & Go is a pork grill in the middle of Nairobi CBD. Two spots on Tom Mboya Street, one simple idea: big, honest plates of pork at a price that makes sense."
        img="/images/real/choma-platter.webp"
      />

      <section className="mx-auto grid max-w-[1400px] gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-10">
        <Reveal>
          <p className="kicker text-glow">Our story</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
            From one grill to two spots.
          </h2>
          <p className="mt-5 text-lg text-bone/80">
            It started at Braidwood House, opposite the Fire Station, with a
            grill, a few tables and a menu built around pork. Word spread
            through office lunches, birthdays and a lot of TikTok, and the
            tables kept filling up.
          </p>
          <p className="mt-4 text-lg text-bone/80">
            So we opened a second spot at Development House, opposite Afya
            Centre. Same meats, same prices, more room for the mbogi.
          </p>
        </Reveal>
        <Reveal className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[28px]">
            <Image
              src="/images/real/bazuu-platter.webp"
              alt="A Bazuu platter with pork, chicken, chapati and ugali"
              fill
              sizes="(min-width:1024px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-[28px]">
            <Image
              src="/images/explore/tt-7606342626354253064.webp"
              alt="A Pork & Go crew member in the branded shirt"
              fill
              sizes="(min-width:1024px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="bg-bone py-20 text-ink">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <Reveal>
            <p className="kicker text-flame-deep">What we stand for</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
              Three things, every plate.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {VALUES.map((v) => (
              <Reveal key={v.title}>
                <article className="overflow-hidden rounded-[28px] bg-paper ring-1 ring-ink/10">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={v.img}
                      alt=""
                      fill
                      sizes="(min-width:768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl font-extrabold">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-ink/70">{v.line}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10">
        <Reveal className="flex flex-col gap-6 rounded-[32px] bg-ember p-8 ring-1 ring-white/10 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold sm:text-4xl">
              Come see for yourself.
            </h2>
            <p className="mt-2 text-bone/70">
              {BRANCHES.map((b) => b.name).join(" and ")}, both open 8AM to 10PM
              every day.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/reserve" className="btn btn-flame">
              Reserve a table <IconArrow size={18} />
            </Link>
            <Link href="/branches/braidwood-house" className="btn btn-ghost">
              Find us
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
