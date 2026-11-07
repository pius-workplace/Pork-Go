# Pork & Go website (phase 1 prototype)

Next.js 16 (App Router, TypeScript, Tailwind v4) rebuild of porkandgokenya.com.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Static preview build (used for the shareable preview link): `EXPORT=1 npx next build`, output in `out/`.

## What's in phase 1

| Area | Where |
| --- | --- |
| Scroll journey hero: street, stairs, dining room, platter. Scroll down to walk in | `src/components/scroll-journey.tsx` |
| Still hero for phones, portrait tablets and reduced motion (the five gates) | same file + `globals.css` |
| Header: branch switcher, Pages dropdown, cart, Reserve, mobile curtain menu, ticker | `src/components/header.tsx` |
| Book-a-table bar, platter rail (pinned horizontal scroll on desktop) | `src/components/home/` |
| Hold-to-fire-the-grill deal reveal, happy hour, Sundays | `src/components/home/offers.tsx` |
| Menu teaser, The Experience occasion cards, stories slider, Visit Us | `src/components/home/sections.tsx` |
| Full menu: search, category chips, filters, dish sheet | `src/components/menu-explorer.tsx` |
| Cart and WhatsApp checkout with order number | `src/components/cart-drawer.tsx` |
| Reservation form (sends a booking request to WhatsApp) | `src/components/reserve-form.tsx` |
| Menu data (92 items, transcribed from the live menu images) | `src/content/menu.json` |
| Branches, phone, WhatsApp, socials | `src/lib/site.ts` |
| Logo (SVG redraw), icon | `public/brand/`, `src/app/icon.svg` |

## Before launch

- **Photos:** everything in `public/images/` is AI concept imagery. Swap in real Pork & Go photography (same file names work).
- **Hero video:** the journey runs on 4 stills today. When there is footage, encode it for scrubbing (short keyframe interval) and swap the frames for a scrubbed video with the same caption bands.
- **Stories:** the testimonial slider uses clearly labelled sample text. Replace with real, consented reviews (phase 2 connects Google reviews).
- **Menu:** verify prices and freebie counts with the client (Choma Choma and Bazuu differ between the old site and the menu images).
- **Domain:** set `metadataBase` in `src/app/layout.tsx` to the live domain.

## Next phases

2. Booking engine (holds, Postgres constraints), staff portal (Payload), WhatsApp confirmations and reminders, Google rating, review QR.
3. M-Pesa Daraja deposits with idempotent callbacks and reconciliation.
4. Order status board and Table QR mode.
5. 360° tour (Pannellum) with "Reserve this spot".
6. Analytics and optimisation.
