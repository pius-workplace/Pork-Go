import Image from "next/image";

/** Shared header for inner pages: photo, kicker, big title, one line of intro. */
export function PageHero({
  kicker,
  title,
  intro,
  img,
  children,
}: {
  kicker: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  img: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-14 pt-[calc(var(--header-h)+34px+3rem)] sm:pb-20">
      <Image
        src={img}
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="object-cover opacity-35"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/80 to-charcoal"
      />
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <p className="kicker text-glow">{kicker}</p>
        <h1 className="mt-3 max-w-[16ch] font-[family-name:var(--font-display)] text-[clamp(2.8rem,8vw,6.2rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
          {title}
        </h1>
        {intro && (
          <p className="mt-5 max-w-[52ch] text-lg text-bone/80">{intro}</p>
        )}
        {children}
      </div>
    </section>
  );
}

/** Long-form text block used by About, Privacy and Terms. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose-pg mx-auto max-w-[760px] px-4 pb-24 text-[1.05rem] leading-relaxed text-bone/85 sm:px-6">
      {children}
    </div>
  );
}
