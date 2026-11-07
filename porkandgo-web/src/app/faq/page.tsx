import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { IconWhatsApp } from "@/components/icons";
import { PHONE_DISPLAY, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQs: hours, bookings, delivery and payment",
  description: "Answers to common questions about Pork & Go: opening hours, both branches, reservations, birthdays, delivery, M-Pesa payment and pork-free options.",
};

const FAQS: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Visiting",
    items: [
      { q: "When are you open?", a: "Both branches are open every day from 8AM to 10PM." },
      { q: "Where are you?", a: "Braidwood House on Tom Mboya Street, opposite the Fire Station, and Development House, opposite Afya Centre. Both are in Nairobi CBD." },
      { q: "Do I need to book a table?", a: "Walk-ins are welcome. For groups, birthdays and busy evenings or weekends, booking ahead makes sure you get the table you want." },
      { q: "Is there a bar? Can kids come?", a: "Yes to both. The bar menu is for guests aged 18 and over, and families are welcome for food." },
    ],
  },
  {
    group: "Bookings and celebrations",
    items: [
      { q: "How do I reserve?", a: "Use the Reserve page. Your request opens in WhatsApp, and the team confirms your table there." },
      { q: "Can you do a birthday cake?", a: "Yes. We do a 1kg cake with your own message. Mention it when you book so it is ready on the day." },
      { q: "Can I book for a big group or an office party?", a: "Yes. Tell us the number of people and the date, and we will set up the long tables and suggest the right platters." },
      { q: "Is there a deposit?", a: "Not for a normal table. For large group bookings the team may ask for a deposit, and will confirm it with you on WhatsApp first." },
    ],
  },
  {
    group: "Ordering and payment",
    items: [
      { q: "Do you deliver?", a: "Yes. Add your food to the order, choose Delivery and enter your address. The delivery fee depends on distance and is confirmed on WhatsApp before you pay." },
      { q: "Can I order ahead and pick up?", a: "Yes. Choose Pickup in your order and pick a time. We will have it ready at the counter." },
      { q: "How do I pay?", a: "M-Pesa is the easiest. The team confirms your order and total on WhatsApp first, then you pay." },
      { q: "Are the prices on the website current?", a: "We keep them up to date, but prices and deals can change. The team confirms your final total before you pay." },
    ],
  },
  {
    group: "Food",
    items: [
      { q: "Do you have food without pork?", a: "Yes. There is chicken, rabbit and fish, plus sides, burgers, desserts and drinks. Use the Pork-free filter on the menu." },
      { q: "What do the free drinks include?", a: "Platters come with free juices or fizzy mojitos. The number of drinks depends on the platter, and it is shown on each one." },
      { q: "I have an allergy. What should I do?", a: "Tell the team before you order. Add a note in your order, or let your server know, and they will tell you what is in each dish." },
    ],
  },
];

const ld = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.flatMap((g) => g.items).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero kicker="FAQs" title="Got questions? Sawa." intro="Quick answers about visiting, booking, delivery and the food." img="/images/real/juices.webp" />
      <section className="mx-auto max-w-[900px] px-4 pb-24 sm:px-6">
        {FAQS.map((g) => (
          <div key={g.group} className="mb-12">
            <h2 className="kicker mb-4 text-glow">{g.group}</h2>
            <div className="divide-y divide-white/10 overflow-hidden rounded-[24px] bg-ember ring-1 ring-white/10">
              {g.items.map((f) => (
                <details key={f.q} className="faq group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-lg font-semibold sm:px-7">
                    {f.q}
                    <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.07] text-flame transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="px-5 pb-6 text-bone/75 sm:px-7">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
        <div className="rounded-[24px] bg-flame p-7 text-[#1a0b04] sm:p-9">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold">Still stuck?</h2>
          <p className="mt-2 font-medium">Message us on WhatsApp or call {PHONE_DISPLAY}. We reply fast.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={whatsappLink("Hi Pork & Go! I have a question.")} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
              <IconWhatsApp /> Ask on WhatsApp
            </a>
            <Link href="/reserve" className="btn bg-white/30 text-[#1a0b04] hover:bg-white/45">Reserve a table</Link>
          </div>
        </div>
      </section>
    </>
  );
}
