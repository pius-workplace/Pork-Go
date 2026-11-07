import type { Metadata } from "next";
import Image from "next/image";
import { ExploreGallery } from "@/components/explore-gallery";
import { MenuBook } from "@/components/menu-book";
import { IconFacebook, IconInstagram, IconTikTok } from "@/components/icons";
import { SOCIALS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Explore: videos and photos from Pork & Go",
  description: "Watch Pork & Go on TikTok and browse real photos of the platters, pork choma, burgers, juices and deals at our two Nairobi CBD spots.",
};

const ICON = { tiktok: IconTikTok, instagram: IconInstagram, facebook: IconFacebook };

export default function ExplorePage() {
  return (
    <>
      <section className="relative overflow-hidden pb-10 pt-[calc(var(--header-h)+34px+3rem)]">
        <Image src="/images/real/choma-platter.webp" alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover opacity-30" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/85 to-charcoal" />
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <p className="kicker text-glow">Explore</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.035em]">
            See it. Then
            <br />
            come taste it.
          </h1>
          <p className="mt-5 max-w-[48ch] text-lg text-bone/80">The platters, the deals and the vibe, straight from our kitchen and our TikTok. Tap any video to play it here.</p>
          <ul className="mt-6 flex flex-wrap gap-2.5" aria-label="Follow Pork & Go">
            {SOCIALS.map((s) => {
              const Icon = ICON[s.id];
              return (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-4 py-3 text-sm">
                    <Icon size={18} /> {s.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <section id="menu-book" aria-labelledby="book-title" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pb-24 sm:px-6 lg:px-10">
        <div className="mb-8 text-center">
          <p className="kicker text-glow">The menu book</p>
          <h2 id="book-title" className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
            Flip through the menu.
          </h2>
          <p className="mx-auto mt-3 max-w-[44ch] text-bone/70">Every dish and price, page by page. Tap the right side or swipe to turn.</p>
        </div>
        <MenuBook />
      </section>
      <section aria-label="Videos and photos" className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6 lg:px-10">
        <div className="mb-6">
          <p className="kicker text-glow">Videos and photos</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">Straight from the grill.</h2>
        </div>
        <ExploreGallery />
      </section>
    </>
  );
}
