import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer, MobileDock, SmoothScroll } from "@/components/chrome";
import { BRANCHES, PHONE_TEL } from "@/lib/site";

// Fonts are bundled in src/app/fonts so builds never need to reach Google Fonts.
const display = localFont({
  src: "./fonts/BricolageGrotesque-latin.woff2",
  weight: "700 800",
  variable: "--font-bricolage",
  display: "swap",
  fallback: ["Arial Black", "system-ui", "sans-serif"],
});
const sans = localFont({
  src: "./fonts/DMSans-latin.woff2",
  weight: "400 700",
  variable: "--font-dm-sans",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
});
const mono = localFont({
  src: "./fonts/JetBrainsMono-500-latin.woff2",
  weight: "500",
  variable: "--font-jetbrains",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  // DEPLOY STEP: set metadataBase to the live domain so og:image and og:url become absolute.
  metadataBase: new URL("https://www.porkandgokenya.com"),
  title: {
    default: "Pork & Go | We got the meats | Pork choma and platters in Nairobi CBD",
    template: "%s | Pork & Go",
  },
  description:
    "Sizzling pork choma, nyama platters with free juice, burgers, shakes and cocktails. Two spots in Nairobi CBD: Braidwood House on Tom Mboya St and Development House. Order on WhatsApp or reserve a table.",
  openGraph: {
    title: "Pork & Go | We got the meats",
    description: "Platters from KSh 1,450 with free juice. Two spots in Nairobi CBD.",
    images: ["/images/journey/04-platter.webp"],
    type: "website",
    locale: "en_KE",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0c0b",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": BRANCHES.map((b) => ({
    "@type": "Restaurant",
    name: `Pork & Go, ${b.name}`,
    servesCuisine: ["Kenyan", "Nyama choma", "Pork", "Burgers"],
    priceRange: "KSh 390 to KSh 4,750",
    telephone: PHONE_TEL,
    address: { "@type": "PostalAddress", streetAddress: `${b.address}, ${b.landmark}`, addressLocality: "Nairobi", addressCountry: "KE" },
    openingHours: "Mo-Su 08:00-22:00",
    hasMenu: "https://www.porkandgokenya.com/menu",
    acceptsReservations: true,
    hasMap: b.mapsUrl,
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-KE" className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only z-[100] rounded-full bg-flame px-4 py-2 font-bold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <div aria-hidden className="page-env" />
        <Providers>
          <SmoothScroll />
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <MobileDock />
          <CartDrawer />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
