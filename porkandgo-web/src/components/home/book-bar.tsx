"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "../providers";
import { BRANCHES, type BranchId } from "@/lib/site";
import { IconArrow, IconCalendar, IconPin, IconUsers } from "../icons";

const today = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

/** Pre-filled booking widget near the top of Home: a visible, native booking bar lifts booking clicks. */
export function BookBar() {
  const router = useRouter();
  const { branchId, setBranchId } = useStore();
  const [date, setDate] = useState("");
  const [min, setMin] = useState<string | undefined>(undefined);
  const [guests, setGuests] = useState(2);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- today's date only exists on the client
    setDate(today());
    setMin(today());
  }, []);

  return (
    <section aria-label="Book a table" className="relative z-10 mx-auto -mt-10 max-w-[1200px] px-4 sm:px-6 lg:-mt-14">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/reserve?branch=${branchId}&date=${date || today()}&guests=${guests}`);
        }}
        className="grid gap-2 rounded-3xl bg-paper p-2 text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr_auto]"
      >
        <label className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-ink/[0.04]">
          <IconPin className="shrink-0 text-flame-deep" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="kicker text-[0.65rem] text-ink/55">Branch</span>
            <select value={branchId} onChange={(e) => setBranchId(e.target.value as BranchId)} className="w-full bg-transparent font-semibold outline-none">
              {BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </span>
        </label>
        <label className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-ink/[0.04]">
          <IconCalendar className="shrink-0 text-flame-deep" />
          <span className="flex flex-1 flex-col">
            <span className="kicker text-[0.65rem] text-ink/55">Date</span>
            <input type="date" value={date} min={min} onChange={(e) => setDate(e.target.value)} className="bg-transparent font-semibold outline-none" />
          </span>
        </label>
        <label className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-ink/[0.04]">
          <IconUsers className="shrink-0 text-flame-deep" />
          <span className="flex flex-1 flex-col">
            <span className="kicker text-[0.65rem] text-ink/55">Guests</span>
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="bg-transparent font-semibold outline-none">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </span>
        </label>
        <button type="submit" className="btn btn-flame rounded-2xl px-7 py-5 text-base sm:col-span-2 lg:col-span-1">
          Find a table <IconArrow size={18} />
        </button>
      </form>
    </section>
  );
}
