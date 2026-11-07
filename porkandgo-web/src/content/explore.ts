/**
 * Explore gallery.
 * Photos: posted by Pork & Go on their Google Business profile.
 * Videos: Pork & Go's own TikTok posts, played through TikTok's official embed player.
 * To add a TikTok: copy the number at the end of its link (tiktok.com/@porkandgo/video/<id>) and save a cover image.
 */

export type ExploreItem =
  | {
      kind: "video";
      id: string;
      tiktok: string;
      cover: string;
      w: number;
      h: number;
      title: string;
      views: string;
      tags: Tag[];
    }
  | {
      kind: "photo";
      id: string;
      src: string;
      w: number;
      h: number;
      title: string;
      tags: Tag[];
    };

export type Tag = "Food" | "Deals" | "Vibes";

const tt = (
  tiktok: string,
  title: string,
  views: string,
  tags: Tag[],
  h = 1280,
): ExploreItem => ({
  kind: "video",
  id: `tt-${tiktok}`,
  tiktok,
  cover: `/images/explore/tt-${tiktok}.webp`,
  w: 720,
  h,
  title,
  views,
  tags,
});
const ph = (
  name: string,
  title: string,
  w: number,
  h: number,
  tags: Tag[],
): ExploreItem => ({
  kind: "photo",
  id: `ph-${name}`,
  src: `/images/real/${name}.webp`,
  w,
  h,
  title,
  tags,
});

export const EXPLORE: ExploreItem[] = [
  tt(
    "7541659541767785784",
    "Snacky Platter: pull up with your person",
    "1.5M",
    ["Food", "Deals"],
  ),
  ph("raha-platter", "Raha ya Wawili with fresh juices", 1270, 1280, ["Food"]),
  tt(
    "7510099180472356102",
    "A platter for every squad, free juices included",
    "1.2M",
    ["Food", "Deals"],
  ),
  ph("mega-platter", "The Mega Platter", 1060, 1057, ["Food"]),
  tt("7641935598420299016", "Mix pork choma and chips at 490 bob", "919K", [
    "Food",
    "Deals",
  ]),
  ph("crispy-pork", "Crispy and crunchy pork", 1170, 1458, ["Food"]),
  tt("7427400257174064389", "Burger combo with a free soda or mojito", "821K", [
    "Deals",
  ]),
  ph("choma-platter", "Choma Choma Platter with ugali", 1400, 1050, ["Food"]),
  tt("7496759060373572870", "Pork chops and fries at 350 bob", "755K", [
    "Food",
    "Deals",
  ]),
  tt("7606342626354253064", "Single, taken or complicated? Come eat", "234K", [
    "Vibes",
  ]),
  ph("honey-glazed", "Honey glazed pork", 1170, 1442, ["Food"]),
  tt("7439666532768091447", "Deals you can't miss", "354K", ["Vibes", "Deals"]),
  ph("bazuu-platter", "Bazuu Platter", 1400, 1867, ["Food"]),
  tt("7611766618921717000", "Spicy pork ribs with a free mocktail", "454K", [
    "Food",
    "Deals",
  ]),
  ph("juices", "Fresh juices and mocktails", 1400, 933, ["Food"]),
  tt("7688691234348535092", "Restaurant POV", "277K", ["Vibes"]),
  ph("snacky-platter", "Snacky Platter", 1063, 1022, ["Food"]),
  tt("7644940245901151496", "Weekend deals reminder", "396K", [
    "Vibes",
    "Deals",
  ]),
  ph("stir-fried-pork", "Stir-fried pork and fries", 1400, 1867, ["Food"]),
  tt("7573221000737852683", "Meaty platters for the crew", "263K", ["Food"]),
  ph("burger", "Classic burger and fries", 800, 533, ["Food"]),
  tt(
    "7459758276779986182",
    "A juicy burger for 350 bob",
    "339K",
    ["Deals"],
    961,
  ),
  ph("fish", "Whole fried fish", 1400, 1863, ["Food"]),
  ph("loaded-fries", "Loaded fries with minced pork", 1170, 1435, ["Food"]),
  ph("cocktail-poster", "Cocktail party happy hour", 1080, 1080, ["Deals"]),
  ph("burger-deal", "BOGOF burger Thursdays", 1200, 628, ["Deals"]),
];
