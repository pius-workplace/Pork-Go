export const WHATSAPP_NUMBER = "254710554077";
export const PHONE_DISPLAY = "0710 554 077";
export const PHONE_TEL = "+254710554077";

export type BranchId = "development-house" | "braidwood-house";

export type Branch = {
  id: BranchId;
  name: string;
  short: string;
  tag: string;
  address: string;
  landmark: string;
  hours: string;
  open: number; // 24h hour
  close: number;
  mapsUrl: string;
  services: string[];
  /** How to find the door once you are on the street. */
  findUs: string;
  photo: string;
};

export const BRANCHES: Branch[] = [
  {
    id: "braidwood-house",
    name: "Braidwood House",
    short: "Braidwood",
    tag: "The OG",
    address: "1st floor, Braidwood House, Tom Mboya Street, Nairobi CBD",
    landmark: "Opposite the Fire Station",
    hours: "8AM to 10PM, every day",
    open: 8,
    close: 22,
    mapsUrl: "https://maps.app.goo.gl/swjF8fk4HTB4Aq9A9",
    services: ["Dine-in", "Takeaway", "Delivery"],
    findUs: "Head down Tom Mboya Street to the Fire Station. We are across the road, upstairs on the first floor of Braidwood House. Follow the smell of the grill up the stairs.",
    photo: "/images/real/choma-platter.webp",
  },
  {
    id: "development-house",
    name: "Development House",
    short: "Development Hse",
    tag: "Just opened",
    address: "Development House, Tom Mboya Street, Nairobi CBD",
    landmark: "Opposite Afya Centre",
    hours: "8AM to 10PM, every day",
    open: 8,
    close: 22,
    mapsUrl: "https://maps.app.goo.gl/Ry71wsTaM5CkxEsd6",
    services: ["Dine-in", "Takeaway", "Delivery"],
    findUs: "Find Afya Centre on Tom Mboya Street. We are in Development House, right across from it.",
    photo: "/images/real/mega-platter.webp",
  },
];

export const SOCIALS: { id: "tiktok" | "instagram" | "facebook"; name: string; handle: string; url: string }[] = [
  { id: "tiktok", name: "TikTok", handle: "@porkandgo", url: "https://www.tiktok.com/@porkandgo" },
  { id: "instagram", name: "Instagram", handle: "@pork_and_go", url: "https://www.instagram.com/pork_and_go/" },
  { id: "facebook", name: "Facebook", handle: "porkandgokenya", url: "https://www.facebook.com/porkandgokenya" },
];

export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function getBranch(id: BranchId | null | undefined): Branch {
  return BRANCHES.find((b) => b.id === id) ?? BRANCHES[0];
}

/** Nairobi is UTC+3 all year. */
export function isOpenNow(branch: Branch, now = new Date()) {
  const h = (now.getUTCHours() + 3) % 24;
  return h >= branch.open && h < branch.close;
}

export const formatKsh = (n: number) => `KSh ${n.toLocaleString("en-KE")}`;
