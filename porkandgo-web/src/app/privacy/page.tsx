import type { Metadata } from "next";
import { DraftNote } from "@/components/draft-note";
import { PageHero, Prose } from "@/components/page-hero";
import { PHONE_DISPLAY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Pork & Go collects, uses and protects your personal data when you order, book a table or contact us, under Kenya's Data Protection Act, 2019.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Privacy policy"
        intro="What we collect when you order or book, why, and what you can ask us to do with it."
        img="/images/real/juices.webp"
      />
      <Prose>
        <DraftNote />
        <p>
          <strong>Last updated:</strong> November 2026
        </p>
        <p>
          Pork &amp; Go (&ldquo;we&rdquo;, &ldquo;us&rdquo;) runs restaurants at
          Braidwood House and Development House in Nairobi CBD. This policy
          explains how we handle personal data collected through this website
          and our WhatsApp line, in line with Kenya&apos;s Data Protection Act,
          2019.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Bookings:</strong> your name, phone number, date, time,
            number of guests, branch, occasion and any notes you add.
          </li>
          <li>
            <strong>Orders:</strong> what you order, whether it is pickup,
            dine-in or delivery, your delivery address or table number, and your
            notes for the kitchen.
          </li>
          <li>
            <strong>Messages:</strong> what you send us on WhatsApp, by phone or
            through social media.
          </li>
          <li>
            <strong>Payments:</strong> M-Pesa confirmation details (name, number
            and transaction code). We never see or store your M-Pesa PIN.
          </li>
          <li>
            <strong>On this device:</strong> your cart and chosen branch are
            saved in your own browser so they are still there when you come
            back. They are not sent to us until you send an order.
          </li>
        </ul>

        <h2>Why we use it</h2>
        <ul>
          <li>
            To confirm and prepare your booking or order, and to deliver it.
          </li>
          <li>
            To contact you about that booking or order, for example if we are
            running late or a dish is sold out.
          </li>
          <li>
            To keep records we are required to keep, such as payment records.
          </li>
          <li>
            To send offers, only if you have agreed to receive them. You can
            stop them at any time.
          </li>
        </ul>

        <h2>Who we share it with</h2>
        <p>
          We do not sell your data. We share only what is needed with the
          services that help us run: WhatsApp (Meta) for messages, Safaricom for
          M-Pesa payments, delivery riders for your address and phone number,
          and our website host.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep booking and order details for as long as we need them to serve
          you and meet legal and tax requirements, then delete or anonymise
          them.
        </p>

        <h2>Your rights</h2>
        <p>You can ask us to:</p>
        <ul>
          <li>tell you what personal data we hold about you</li>
          <li>correct anything that is wrong</li>
          <li>delete your data, where we are not required to keep it</li>
          <li>stop using your data for offers</li>
        </ul>
        <p>
          To make a request, message us on WhatsApp or call {PHONE_DISPLAY}. If
          you are not happy with our answer, you can complain to the Office of
          the Data Protection Commissioner (ODPC).
        </p>

        <h2>Photos and filming</h2>
        <p>
          We sometimes take photos and videos in our restaurants for social
          media. If you would rather not appear, tell the crew and we will leave
          you out.
        </p>

        <h2>Changes</h2>
        <p>
          If we change this policy we will update the date at the top of this
          page.
        </p>
      </Prose>
    </>
  );
}
