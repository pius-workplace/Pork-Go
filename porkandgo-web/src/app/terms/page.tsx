import type { Metadata } from "next";
import { DraftNote } from "@/components/draft-note";
import { PageHero, Prose } from "@/components/page-hero";
import { PHONE_DISPLAY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms for ordering, booking tables and using the Pork & Go website.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero kicker="Legal" title="Terms of use" intro="The short version: we confirm everything with you on WhatsApp before you pay." img="/images/real/burger.webp" />
      <Prose>
        <DraftNote />
        <p><strong>Last updated:</strong> November 2026</p>
        <p>These terms apply when you use this website, order food or book a table at Pork &amp; Go. By using the site you agree to them.</p>

        <h2>Orders</h2>
        <ul>
          <li>Sending an order from this website opens WhatsApp with your order ready to send. Your order is confirmed only when our team replies to confirm it.</li>
          <li>Prices are in Kenyan shillings and include VAT where it applies. The team confirms your final total, including any delivery fee, before you pay.</li>
          <li>If a dish is not available, we will tell you and offer something else or remove it from your order.</li>
        </ul>

        <h2>Delivery and pickup</h2>
        <ul>
          <li>Delivery times are estimates and can change with traffic and weather.</li>
          <li>Please give a correct address and phone number. If the rider cannot reach you, we may not be able to refund the order.</li>
          <li>Pickup orders are held at the counter for your chosen time. Let us know if you are running late.</li>
        </ul>

        <h2>Reservations</h2>
        <ul>
          <li>A booking request becomes a reservation when the team confirms it.</li>
          <li>If you are running late or need to cancel, tell us on WhatsApp so we can give the table to someone else.</li>
          <li>For large groups we may ask for a deposit, and we will tell you the cancellation terms before you pay it.</li>
        </ul>

        <h2>Deals and offers</h2>
        <p>Deals run for a limited time, while stocks last, and cannot be combined with other offers unless we say so. Free drinks come with the dishes named in the offer.</p>

        <h2>Alcohol</h2>
        <p>We serve alcohol only to guests aged 18 and over. We may ask for ID and can refuse service.</p>

        <h2>Allergies</h2>
        <p>Our kitchen handles pork, gluten, dairy, eggs and nuts. Tell us about any allergy before you order. We cannot promise any dish is completely free of an allergen.</p>

        <h2>The website</h2>
        <p>
          Photos, videos, the Pork &amp; Go name and logo belong to Pork &amp; Go or are used with permission. Do not copy them without asking. We try to keep the menu and prices
          correct, but mistakes can happen, and the price confirmed by the team is the one that counts.
        </p>

        <h2>Questions</h2>
        <p>Message us on WhatsApp or call {PHONE_DISPLAY}. These terms are governed by the laws of Kenya.</p>
      </Prose>
    </>
  );
}
