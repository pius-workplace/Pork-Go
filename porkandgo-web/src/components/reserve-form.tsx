"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useStore } from "./providers";
import { BRANCHES, getBranch, whatsappLink, type BranchId } from "@/lib/site";
import { IconWhatsApp } from "./icons";

const OCCASIONS = [
  { id: "visit", label: "Normal visit", img: "/images/journey/03-dining.webp" },
  { id: "birthday", label: "Birthday", img: "/images/food/birthday.webp" },
  { id: "graduation", label: "Graduation", img: "/images/food/graduation.webp" },
  { id: "date-night", label: "Date night", img: "/images/food/date-night.webp" },
  { id: "squad", label: "Squad / office party", img: "/images/journey/04-platter.webp" },
  { id: "anniversary", label: "Anniversary", img: "/images/food/date-night.webp" },
];

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

function slotsFor(date: string) {
  const out: string[] = [];
  const now = new Date();
  const isToday = date === todayISO();
  for (let h = 8; h <= 21; h++) {
    for (const m of [0, 30]) {
      if (h === 21 && m === 30) continue;
      if (isToday && (h < now.getHours() + 1 || (h === now.getHours() + 1 && m < now.getMinutes()))) continue;
      out.push(`${String(h).padStart(2, "0")}:${m ? "30" : "00"}`);
    }
  }
  return out;
}

const field = "w-full rounded-xl bg-[#eef3fb] px-4 py-3.5 text-ink ring-1 ring-transparent transition placeholder:text-ink/40 focus:bg-white focus:ring-flame";

export function ReserveForm() {
  const params = useSearchParams();
  const { branchId, setBranchId } = useStore();
  const initialBranch = (params.get("branch") as BranchId) || branchId;
  const [branch, setBranch] = useState<BranchId>(BRANCHES.some((b) => b.id === initialBranch) ? initialBranch : branchId);
  const [occasion, setOccasion] = useState(OCCASIONS.some((o) => o.id === params.get("occasion")) ? params.get("occasion")! : "visit");
  const [date, setDate] = useState(params.get("date") || todayISO());
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(Number(params.get("guests")) || 2);
  const [seating, setSeating] = useState("No preference");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(true);
  const [sent, setSent] = useState<string | null>(null);
  const slots = useMemo(() => slotsFor(date), [date]);
  const occ = OCCASIONS.find((o) => o.id === occasion)!;
  const b = getBranch(branch);

  const phoneOk = /^(\+?254|0)?7\d{8}$|^(\+?254|0)?1\d{8}$/.test(phone.replace(/\s/g, ""));
  const valid = name.trim().length > 1 && phoneOk && time && date;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const ref = `BK-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    setBranchId(branch);
    const msg = [
      `Hi Pork & Go! Booking request ${ref}`,
      ``,
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : "",
      `Branch: ${b.name}`,
      `Date: ${date} at ${time}`,
      `Guests: ${guests}`,
      `Seating: ${seating}`,
      `Occasion: ${occ.label}`,
      notes ? `Requests: ${notes}` : "",
      consent ? `OK to send me booking updates on WhatsApp.` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
    setSent(ref);
  };

  return (
    <div className="mx-auto mt-10 grid overflow-hidden rounded-[28px] bg-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] lg:grid-cols-[1fr_1.15fr]">
      <div className="relative min-h-[260px] lg:min-h-full">
        <Image key={occ.img} src={occ.img} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="sheet-in object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-7">
          <p className="kicker text-glow">{b.name}</p>
          <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold">{occ.label === "Normal visit" ? "Pull up, we'll save you a seat." : `${occ.label}? We've got the table.`}</p>
          <p className="mt-1 text-bone/80">{b.landmark} · {b.hours}</p>
        </div>
      </div>

      {sent ? (
        <div className="flex flex-col justify-center p-8 text-ink sm:p-12">
          <p className="kicker text-flame-deep">Request {sent}</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold">Almost done.</h2>
          <p className="mt-3 text-lg text-ink/70">
            Your booking request opened in WhatsApp. Hit send and the {b.name} team confirms your table there. If WhatsApp didn&apos;t open, use the button below.
          </p>
          <p className="mt-3 text-sm text-ink/50">
            Coming next: instant confirmation, M-Pesa deposits for celebrations, and a reminder 3 hours before you arrive.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={whatsappLink(`Hi Pork & Go! Booking request ${sent}`)} target="_blank" rel="noopener noreferrer" className="btn btn-flame">
              <IconWhatsApp /> Open WhatsApp again
            </a>
            <button onClick={() => setSent(null)} className="btn btn-ink">
              Book another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="grid content-start gap-3 p-6 text-ink sm:grid-cols-2 sm:p-10" noValidate>
          <label className="sm:col-span-1">
            <span className="sr-only">Full name</span>
            <input className={field} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          </label>
          <label>
            <span className="sr-only">Phone (WhatsApp)</span>
            <input
              className={field}
              placeholder="Phone (WhatsApp) e.g. 0712 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={phone.length > 3 && !phoneOk}
              required
            />
          </label>
          <label>
            <span className="sr-only">Branch</span>
            <select className={field} value={branch} onChange={(e) => setBranch(e.target.value as BranchId)}>
              {BRANCHES.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Occasion</span>
            <select className={field} value={occasion} onChange={(e) => setOccasion(e.target.value)}>
              {OCCASIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Date</span>
            <input
              className={field}
              type="date"
              min={todayISO()}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              required
            />
          </label>
          <label>
            <span className="sr-only">Time</span>
            <select className={field} value={time} onChange={(e) => setTime(e.target.value)} required>
              <option value="">{slots.length ? "Choose a time" : "No more slots today"}</option>
              {slots.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Guests</span>
            <select className={field} value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Seating</span>
            <select className={field} value={seating} onChange={(e) => setSeating(e.target.value)}>
              {["No preference", "Inside", "Balcony", "Long table (groups)"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="sr-only">Email (optional)</span>
            <input className={field} type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="sm:col-span-2">
            <span className="sr-only">Special requests</span>
            <textarea
              className={`${field} min-h-[120px]`}
              placeholder="Special requests: cake message, decorations, high chair, the flower wall..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <label className="flex items-start gap-3 text-sm text-ink/70 sm:col-span-2">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 accent-[#FF5A1F]" />
            Send me booking updates on WhatsApp. We only use your details for this booking.
          </label>
          <div className="flex flex-wrap items-center gap-4 pt-2 sm:col-span-2">
            <button type="submit" disabled={!valid} className="btn btn-flame px-8 py-4 text-base disabled:cursor-not-allowed disabled:opacity-45">
              Book a table
            </button>
            {!valid && <span className="text-sm text-ink/50">Add your name, a Kenyan phone number and a time.</span>}
          </div>
        </form>
      )}
    </div>
  );
}
