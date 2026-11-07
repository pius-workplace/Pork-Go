import raw from "@/content/menu.json";

export type PriceOption = { label: string; price: number };

export type MenuItem = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  section?: string;
  description?: string;
  /** Single price, or several sizes (250g / 500g / 1kg, 1/4 / 1/2 / Full, Shot / Mzinga). */
  options: PriceOption[];
  serves?: number;
  freeDrinks?: number;
  tag?: string;
  tags: string[];
  image?: string;
  ageRestricted?: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  note?: string;
  ageRestricted?: boolean;
};

type RawItem = {
  name: string;
  price?: number;
  prices?: (number | null)[];
  description?: string;
  serves?: number;
  freeDrinks?: number;
  tag?: string;
};
type RawSection = { name: string; sizes?: string[]; items: RawItem[] };
type RawCategory = {
  id: string;
  name: string;
  note?: string;
  ageRestricted?: boolean;
  items?: RawItem[];
  sections?: RawSection[];
  extras?: RawItem[];
};

/** Real Pork & Go photos (from the owner's Google Business profile) where we have them. */
const R = (n: string) => `/images/real/${n}.webp`;
const IMAGES: Record<string, string> = {
  "raha-ya-wawili-platter": R("raha-platter"),
  "snacky-platter": R("snacky-platter"),
  "snack-attack-platter": R("snacky-platter"),
  "choma-choma-platter": R("choma-platter"),
  "bazuu-platter": R("bazuu-platter"),
  "mbogi-platter": R("mega-platter"),
  "mega-platter": R("mega-platter"),
  "pork-wet-fry": R("crispy-pork"),
  "pork-dry-fry": R("choma-platter"),
  "pork-choma-sizzling": R("choma-platter"),
  "pork-honey-glazed": R("honey-glazed"),
  "spicy-bbq-pork-ribs-and-fries": R("honey-glazed"),
  "stir-fried-pork-and-fries-rice": R("stir-fried-pork"),
  "coconut-fish": R("fish"),
  "fish-wet-dry-fry": R("fish"),
  "classic-burger-fries": R("burger"),
  "bacon-burger-fries": R("burger"),
  "eggsperience-burger-fries": R("burger"),
  "double-gourmet-burger-fries": R("burger"),
  "cheese-burger-extra": R("burger"),
  "masala-chips": R("loaded-fries"),
  "chips": R("loaded-fries"),
  "mango-juice": R("juices"),
  "passion-juice": R("juices"),
  "cocktail-juice": R("juices"),
  "apple-ginger": R("juices"),
  "rainbow-explosion": "/images/food/sundae.webp",
  "brain-freeze-platter-for-two": "/images/food/sundae.webp",
  "honey-pork-chops-and-fries": "/images/food/date-night.webp",
  "cake-slice-ice-cream": "/images/food/birthday.webp",
  "1kg-cake": "/images/food/birthday.webp",
};

/** Every dish gets a photo: its own, or its section's. The bar stays text-only. */
const CATEGORY_IMAGE: Record<string, string> = {
  platters: R("mega-platter"),
  pork: R("crispy-pork"),
  "white-meat": R("snacky-platter"),
  sides: R("saute-potatoes"),
  "burgers-wraps": R("burger"),
  drinks: R("juices"),
  desserts: "/images/food/sundae.webp",
};

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function tagsFor(name: string, cat: string, item: RawItem): string[] {
  const n = name.toLowerCase();
  const t: string[] = [];
  if (cat === "platters" || (item.serves ?? 0) >= 2) t.push("Sharing");
  if (/spicy|bbq/.test(n)) t.push("Spicy");
  if (cat === "white-meat" || /fish|chicken|rabbit|juice|mojito|mocktail|lemonade|shake|cake|sundae|explosion|freeze|water|tea|dawa|guacamole|greens|kachumbari|ugali|chapati|chips|samosa|pilau plain/.test(n)) {
    if (!/pork|bacon|sausage|meatball|shawarma|burger/.test(n)) t.push("Pork-free");
  }
  if (cat === "bar") t.push("Bar");
  return t;
}

function normalize(): { categories: MenuCategory[]; items: MenuItem[] } {
  const categories: MenuCategory[] = [];
  const items: MenuItem[] = [];
  for (const c of (raw as { categories: RawCategory[] }).categories) {
    categories.push({ id: c.id, name: c.name, note: c.note, ageRestricted: c.ageRestricted });
    const sections: RawSection[] = c.sections ?? [{ name: "", items: c.items ?? [] }];
    if (c.extras?.length) sections.push({ name: "Extras", items: c.extras });
    for (const s of sections) {
      for (const it of s.items) {
        const id = slug(it.name);
        let options: PriceOption[] = [];
        if (it.prices && s.sizes) {
          options = it.prices
            .map((p, i) => (p == null ? null : { label: s.sizes![i], price: p }))
            .filter(Boolean) as PriceOption[];
        } else if (typeof it.price === "number") {
          options = [{ label: "", price: it.price }];
        }
        items.push({
          id,
          name: it.name,
          categoryId: c.id,
          categoryName: c.name,
          section: s.name || undefined,
          description: it.description,
          options,
          serves: it.serves,
          freeDrinks: it.freeDrinks,
          tag: it.tag,
          tags: tagsFor(it.name, c.id, it),
          image: IMAGES[id] ?? CATEGORY_IMAGE[c.id],
          ageRestricted: c.ageRestricted,
        });
      }
    }
  }
  return { categories, items };
}

export const MENU = normalize();

export const PLATTERS = MENU.items.filter((i) => i.categoryId === "platters");

export const fromPrice = (item: MenuItem) => Math.min(...item.options.map((o) => o.price));

export const MENU_SOURCE_NOTE = (raw as { source: string }).source;
