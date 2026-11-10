import { ScrollJourney } from "@/components/scroll-journey";
import { BookBar } from "@/components/home/book-bar";
import { PlatterRail } from "@/components/home/platter-rail";
import { Offers } from "@/components/home/offers";
import { Crew } from "@/components/home/crew";
import { ExploreTeaser } from "@/components/home/explore-teaser";
import { RealNights } from "@/components/home/real-nights";
import { Experience, MenuTeaser, Stories, VisitUs } from "@/components/home/sections";

export default function Home() {
  return (
    <>
      <ScrollJourney />
      <BookBar />
      <PlatterRail />
      <Offers />
      <MenuTeaser />
      <Experience />
      <Crew />
      <ExploreTeaser />
      <RealNights />
      <Stories />
      <VisitUs />
    </>
  );
}
