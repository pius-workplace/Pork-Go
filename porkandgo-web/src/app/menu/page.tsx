import type { Metadata } from "next";
import Image from "next/image";
import { MenuExplorer } from "@/components/menu-explorer";
import { MENU, fromPrice } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu: pork choma, platters, burgers, shakes and cocktails",
  description:
    "The full Pork & Go menu with prices in KSh: nyama platters from 1,450, pork wet fry, dry fry and choma, chicken, rabbit, burgers, wraps, mocktails, milkshakes and the bar.",
};

const menuLd = {
  "@context": "https://schema.org",
  "@type": "Menu",
  name: "Pork & Go menu",
  inLanguage: "en",
  hasMenuSection: MENU.categories.map((c) => ({
    "@type": "MenuSection",
    name: c.name,
    hasMenuItem: MENU.items
      .filter((i) => i.categoryId === c.id)
      .map((i) => ({
        "@type": "MenuItem",
        name: i.name,
        description: i.description,
        offers: { "@type": "Offer", price: fromPrice(i), priceCurrency: "KES" },
      })),
  })),
};

export default function MenuPage() {
  return (
    <>
      <section id="order" className="relative overflow-hidden pb-14 pt-[calc(var(--header-h)+34px+3.5rem)]">
        <Image src="/images/real/mega-platter.webp" alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover opacity-35" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/80 to-charcoal" />
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <p className="kicker text-glow">Menu · order online</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.035em]">
            Pick it. Tap it.
            <br />
            <span className="text-flame">Send it.</span>
          </h1>
          <p className="mt-5 max-w-[50ch] text-lg text-bone/75">
            Add what you want, choose pickup or dine-in, and your order lands in our WhatsApp with a number. Pay by M-Pesa when we confirm.
          </p>
        </div>
      </section>
      <MenuExplorer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(menuLd) }} />
    </>
  );
}
