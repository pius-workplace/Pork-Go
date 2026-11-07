"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "./providers";
import { formatKsh, getBranch, whatsappLink } from "@/lib/site";
import { IconClose, IconMinus, IconPlus, IconWhatsApp } from "./icons";
import Link from "next/link";

type Mode = "Pickup" | "Dine-in" | "Delivery";

const MODES: { id: Mode; hint: string }[] = [
  { id: "Pickup", hint: "Collect at the counter" },
  { id: "Dine-in", hint: "Ready at your table" },
  { id: "Delivery", hint: "Brought to your door" },
];

const WHEN: Record<Mode, string> = { Pickup: "Pickup time", "Dine-in": "Arriving", Delivery: "Deliver" };

function orderNumber() {
  const t = Date.now().toString(36).toUpperCase().slice(-5);
  return `PG-${t}`;
}

export function CartDrawer() {
  const { lines, total, count, setQty, cartOpen, setCartOpen, branchId, note, setNote, clear } = useStore();
  const [mode, setMode] = useState<Mode>("Pickup");
  const [time, setTime] = useState("As soon as possible");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [table, setTable] = useState("");
  const branch = getBranch(branchId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  // Freeze the page behind the drawer so a swipe scrolls the order, not the site.
  useEffect(() => {
    if (!cartOpen) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    dispatchEvent(new Event("pg:scroll-lock"));
    return () => {
      html.style.overflow = prev;
      document.body.style.overflow = "";
      dispatchEvent(new Event("pg:scroll-unlock"));
    };
  }, [cartOpen]);

  const needsAddress = mode === "Delivery" && address.trim().length < 4;

  const buildMessage = useMemo(() => (no: string) => {
    const rows = lines.map((l) => {
      const opt = [l.option, l.flavour].filter(Boolean).join(", ");
      return `• ${l.qty} x ${l.name}${opt ? ` (${opt})` : ""} = ${formatKsh(l.qty * l.price)}`;
    });
    return [
      `Hi Pork & Go! New order ${no}`,
      ``,
      ...rows,
      ``,
      `Total: ${formatKsh(total)}`,
      `Branch: ${branch.name}`,
      `${mode}: ${time}`,
      mode === "Delivery" ? `Deliver to: ${address.trim()}` : "",
      mode === "Dine-in" && table ? `Table: ${table}` : "",
      name ? `Name: ${name}` : "",
      note ? `Notes: ${note}` : "",
    ]
      .filter((x, i, a) => !(x === "" && a[i - 1] === ""))
      .join("\n")
      .trim();
  }, [lines, total, branch.name, mode, time, name, note, address, table]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${cartOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setCartOpen(false)}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        inert={!cartOpen}
        className={`fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col bg-paper text-ink shadow-2xl transition-transform duration-500 ease-[var(--ease-out-soft)] ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <p className="kicker text-flame-deep">Your order</p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold">
              {count ? `${count} item${count === 1 ? "" : "s"}` : "Nothing yet"}
            </h2>
          </div>
          <button onClick={() => setCartOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 hover:bg-ink/10" aria-label="Close order">
            <IconClose />
          </button>
        </div>

        <div data-lenis-prevent className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain px-6 py-4 [-webkit-overflow-scrolling:touch]">
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-semibold">Your tray is empty.</p>
              <p className="mt-1 text-ink/60">Pick a platter, a burger or a cold mocktail to get going.</p>
              <Link href="/menu" onClick={() => setCartOpen(false)} className="btn btn-ink mt-6">
                Browse the menu
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {lines.map((l) => (
                <li key={l.key} className="flex items-start gap-3 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">{l.name}</p>
                    <p className="text-sm text-ink/60">{[l.option, l.flavour].filter(Boolean).join(" · ") || "Regular"}</p>
                    <p className="tnum mt-1 text-sm font-semibold text-flame-deep">{formatKsh(l.price * l.qty)}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-ink/5 p-1">
                    <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-ink/10" onClick={() => setQty(l.key, l.qty - 1)} aria-label={`One less ${l.name}`}>
                      <IconMinus size={16} />
                    </button>
                    <span className="tnum w-6 text-center font-semibold">{l.qty}</span>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-ink/10" onClick={() => setQty(l.key, l.qty + 1)} aria-label={`One more ${l.name}`}>
                      <IconPlus size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {lines.length > 0 && (
            <div className="mt-4 space-y-4 pb-6">
              <fieldset>
                <legend className="kicker mb-2 text-ink/60">How you want it</legend>
                <div className="grid grid-cols-3 gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setMode(m.id);
                        if (m.id !== "Pickup")
                          requestAnimationFrame(() => document.getElementById("order-extra")?.scrollIntoView({ behavior: "smooth", block: "center" }));
                      }}
                      aria-pressed={mode === m.id}
                      className={`rounded-xl px-2 py-3 text-left ring-1 transition ${
                        mode === m.id ? "bg-ink text-bone ring-ink" : "ring-ink/15 hover:ring-ink/40"
                      }`}
                    >
                      <span className="block text-sm font-bold">{m.id}</span>
                      <span className={`mt-0.5 block text-[0.72rem] leading-tight ${mode === m.id ? "text-bone/70" : "text-ink/55"}`}>{m.hint}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              {mode === "Delivery" && (
                <label id="order-extra" className="block">
                  <span className="kicker mb-2 block text-ink/60">Delivery address</span>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    required
                    autoComplete="street-address"
                    placeholder="Building, floor and a landmark, e.g. Hazina Towers, 6th floor, near KICC"
                    className="w-full rounded-xl bg-white px-3 py-3 ring-1 ring-ink/15"
                  />
                  <span className="mt-1.5 block text-xs text-ink/55">Delivery fee depends on distance. The team confirms it on WhatsApp before you pay.</span>
                </label>
              )}
              {mode === "Dine-in" && (
                <label id="order-extra" className="block">
                  <span className="kicker mb-2 block text-ink/60">Table number (if you are seated)</span>
                  <input value={table} onChange={(e) => setTable(e.target.value)} inputMode="numeric" className="w-full rounded-xl bg-white px-3 py-3 ring-1 ring-ink/15" />
                </label>
              )}
              <label className="block">
                <span className="kicker mb-2 block text-ink/60">{WHEN[mode]}</span>
                <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-xl bg-white px-3 py-3 ring-1 ring-ink/15">
                  {["As soon as possible", "In 30 minutes", "In 1 hour", "Lunch (12PM to 2PM)", "Evening (6PM to 8PM)"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="kicker mb-2 block text-ink/60">Your name (optional)</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl bg-white px-3 py-3 ring-1 ring-ink/15" autoComplete="given-name" />
              </label>
              <label className="block">
                <span className="kicker mb-2 block text-ink/60">Notes for the kitchen</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Extra kachumbari, no chilli, cut the ribs..."
                  className="w-full rounded-xl bg-white px-3 py-3 ring-1 ring-ink/15"
                />
              </label>
              <button onClick={clear} className="text-sm text-ink/50 underline underline-offset-4 hover:text-ink">
                Clear order
              </button>
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-ink/10 bg-paper px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 sm:px-6 sm:py-5">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-ink/60">Total</span>
              <span className="tnum font-[family-name:var(--font-display)] text-2xl font-extrabold">{formatKsh(total)}</span>
            </div>
            {needsAddress ? (
              <p className="mb-3 rounded-lg bg-flame/10 px-3 py-2 text-sm font-medium text-flame-deep">Add a delivery address above to send this order.</p>
            ) : (
              <p className="mb-3 text-xs text-ink/55 sm:mb-4 sm:text-sm">
                {mode} from {branch.name}. Opens in WhatsApp, ready to send. Pay by M-Pesa when the team confirms.
              </p>
            )}
            <a
              aria-disabled={needsAddress}
              href={whatsappLink(buildMessage("PG"))}
              onClick={(e) => {
                if (needsAddress) {
                  e.preventDefault();
                  return;
                }
                // a fresh order number at the moment of sending
                e.currentTarget.href = whatsappLink(buildMessage(orderNumber()));
              }}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-flame w-full py-4 text-base ${needsAddress ? "pointer-events-none opacity-50" : ""}`}
            >
              <IconWhatsApp /> Send order on WhatsApp
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
