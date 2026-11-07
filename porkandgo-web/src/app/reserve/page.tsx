import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { ReserveForm } from "@/components/reserve-form";

export const metadata: Metadata = {
  title: "Reserve a table, birthdays and celebrations",
  description: "Book a table at Pork & Go, Braidwood House or Development House, Nairobi CBD. Birthdays, graduations, date nights and squad platters.",
};

export default function ReservePage() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pb-24 pt-[calc(var(--header-h)+34px+3rem)]">
      <Image src="/images/journey/03-dining.webp" alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-charcoal/75" />
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="text-center">
          <p className="kicker text-glow">Book a table online</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,6vw,4.8rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
            Reservation. Choose your table.
          </h1>
        </div>
        <Suspense>
          <ReserveForm />
        </Suspense>
      </div>
    </section>
  );
}
