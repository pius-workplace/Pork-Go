"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BRANCHES, type BranchId } from "@/lib/site";

export type CartLine = {
  key: string;
  itemId: string;
  name: string;
  option: string;
  flavour?: string;
  price: number;
  qty: number;
};

type Ctx = {
  branchId: BranchId;
  setBranchId: (b: BranchId) => void;
  lines: CartLine[];
  count: number;
  total: number;
  add: (l: Omit<CartLine, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  note: string;
  setNote: (s: string) => void;
  cartOpen: boolean;
  setCartOpen: (o: boolean) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

const safeGet = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const safeSet = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* storage unavailable: keep state in memory */
  }
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [branchId, setBranchIdState] = useState<BranchId>(BRANCHES[0].id);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [note, setNote] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const b = safeGet("pg.branch") as BranchId | null;
    const c = safeGet("pg.cart");
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from storage */
    if (b && BRANCHES.some((x) => x.id === b)) setBranchIdState(b);
    if (c) {
      try {
        setLines(JSON.parse(c));
      } catch {}
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (hydrated) safeSet("pg.cart", JSON.stringify(lines));
  }, [lines, hydrated]);

  const setBranchId = useCallback((b: BranchId) => {
    setBranchIdState(b);
    safeSet("pg.branch", b);
  }, []);

  const add = useCallback((l: Omit<CartLine, "key" | "qty">, qty = 1) => {
    const key = [l.itemId, l.option, l.flavour ?? ""].join("|");
    setLines((prev) => {
      const hit = prev.find((p) => p.key === key);
      if (hit) return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { ...l, key, qty }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((p) => p.key !== key) : prev.map((p) => (p.key === key ? { ...p, qty } : p))));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<Ctx>(() => {
    const count = lines.reduce((a, l) => a + l.qty, 0);
    const total = lines.reduce((a, l) => a + l.qty * l.price, 0);
    return { branchId, setBranchId, lines, count, total, add, setQty, clear, note, setNote, cartOpen, setCartOpen };
  }, [branchId, setBranchId, lines, add, setQty, clear, note, cartOpen]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside Providers");
  return c;
}
