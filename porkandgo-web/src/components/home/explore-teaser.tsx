import Image from "next/image";
import Link from "next/link";
import { EXPLORE } from "@/content/explore";
import { Reveal } from "../chrome";
import { IconArrow, IconTikTok } from "../icons";

const VIDEOS = EXPLORE.filter((i) => i.kind === "video").slice(0, 8);

export function ExploreTeaser() {
  return (
    <section aria-labelledby="explore-teaser" className="py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker flex items-center gap-2 text-glow">
              <IconTikTok size={14} /> On our TikTok
            </p>
            <h2 id="explore-teaser" className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.4rem,5.5vw,4.6rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
              Watch before you pull up.
            </h2>
          </div>
          <Link href="/explore" className="btn btn-flame self-start sm:self-auto">
            Explore all <IconArrow size={18} />
          </Link>
        </Reveal>
      </div>
      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:gap-4 sm:px-6 lg:px-10">
        {VIDEOS.map((v) =>
          v.kind === "video" ? (
            <Link
              key={v.id}
              href="/explore"
              className="swipe-card group relative aspect-[9/16] w-[46vw] max-w-[260px] shrink-0 snap-start overflow-hidden rounded-3xl bg-ember ring-1 ring-white/10 sm:w-[240px]"
              aria-label={`${v.title}, ${v.views} views. Open Explore`}
            >
              <Image src={v.cover} alt="" fill sizes="260px" className="object-cover transition duration-700 group-hover:scale-105" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-charcoal/75 px-2.5 py-1 text-xs font-semibold backdrop-blur">▶ {v.views}</span>
              <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-semibold leading-snug">{v.title}</span>
            </Link>
          ) : null,
        )}
      </div>
    </section>
  );
}
