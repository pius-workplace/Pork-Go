import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/chrome";
import { IconArrow, IconClock, IconPhone, IconPin, IconWhatsApp } from "@/components/icons";
import { BRANCHES, PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/site";

export function generateStaticParams() {
  return BRANCHES.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const b = BRANCHES.find((x) => x.id === id);
  if (!b) return {};
  return {
    title: `${b.name}: directions, hours and booking`,
    description: `Pork & Go ${b.name}, ${b.landmark}, Tom Mboya Street, Nairobi CBD. Open ${b.hours}. ${b.services.join(", ")}.`,
  };
}

export default async function BranchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = BRANCHES.find((x) => x.id === id);
  if (!b) notFound();
  const other = BRANCHES.find((x) => x.id !== b.id)!;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `Pork & Go ${b.name}`,
    servesCuisine: ["Kenyan", "Barbecue"],
    address: { "@type": "PostalAddress", streetAddress: b.address, addressLocality: "Nairobi", addressCountry: "KE" },
    telephone: PHONE_TEL,
    openingHours: "Mo-Su 08:00-22:00",
    hasMap: b.mapsUrl,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="relative overflow-hidden pb-12 pt-[calc(var(--header-h)+34px+3rem)]">
        <Image src={b.photo} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover opacity-30" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/85 to-charcoal" />
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <p className="kicker text-glow">{b.tag}</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.8rem,8vw,6.2rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">{b.name}</h1>
          <p className="mt-4 flex items-start gap-2 text-lg text-bone/85">
            <IconPin size={20} className="mt-1 shrink-0 text-flame" /> {b.address}, {b.landmark.toLowerCase()}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-flame">
              Get directions <IconArrow size={18} />
            </a>
            <Link href={`/reserve?branch=${b.id}`} className="btn btn-ghost">
              Reserve here
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-10">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-ash ring-1 ring-white/10 lg:aspect-auto lg:h-full lg:min-h-[460px]">
            <iframe
              title={`Map of Pork & Go ${b.name}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent("Pork & Go " + b.name + " " + b.landmark + " Nairobi")}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full grayscale-[0.4] invert-[0.88] hue-rotate-180"
            />
          </div>
        </Reveal>
        <Reveal className="flex flex-col gap-5">
          <div className="rounded-[28px] bg-ember p-7 ring-1 ring-white/10">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold">Finding us</h2>
            <p className="mt-3 text-bone/80">{b.findUs}</p>
          </div>
          <div className="rounded-[28px] bg-ember p-7 ring-1 ring-white/10">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold">Hours</h2>
            <p className="mt-3 flex items-center gap-2 text-bone/80">
              <IconClock size={18} className="text-glow" /> {b.hours}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {b.services.map((s) => (
                <span key={s} className="rounded-full bg-white/[0.07] px-3 py-1.5 text-sm ring-1 ring-white/10">{s}</span>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] bg-ember p-7 ring-1 ring-white/10">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold">Talk to this branch</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={whatsappLink(`Hi Pork & Go ${b.name}!`)} target="_blank" rel="noopener noreferrer" className="btn btn-flame">
                <IconWhatsApp /> WhatsApp
              </a>
              <a href={`tel:${PHONE_TEL}`} className="btn btn-ghost">
                <IconPhone size={18} /> {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-10">
        <Reveal className="grid gap-4 sm:grid-cols-3">
          <Link href="/menu" className="group rounded-[24px] bg-flame p-6 text-[#1a0b04]">
            <p className="font-[family-name:var(--font-display)] text-2xl font-extrabold">Order from {b.short}</p>
            <p className="mt-1 flex items-center gap-1 font-semibold">Open the menu <IconArrow size={16} className="transition group-hover:translate-x-1" /></p>
          </Link>
          <Link href="/offers" className="group rounded-[24px] bg-ember p-6 ring-1 ring-white/10">
            <p className="font-[family-name:var(--font-display)] text-2xl font-extrabold">Today&apos;s deals</p>
            <p className="mt-1 flex items-center gap-1 text-bone/70">Combos from KSh 350 <IconArrow size={16} className="transition group-hover:translate-x-1" /></p>
          </Link>
          <Link href={`/branches/${other.id}`} className="group rounded-[24px] bg-ember p-6 ring-1 ring-white/10">
            <p className="font-[family-name:var(--font-display)] text-2xl font-extrabold">{other.name}</p>
            <p className="mt-1 flex items-center gap-1 text-bone/70">Our other spot <IconArrow size={16} className="transition group-hover:translate-x-1" /></p>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
