import { getEssayCatalog } from "@/lib/essays";
import { AnimatedHeroTitle } from "@/components/AnimatedHeroTitle";
import {
  LatestSection,
  NewEssaysSection,
  NewSinceVisitBanner,
  PaulsPicksSection,
  SyncStatus,
} from "@/components/HomeSections";

export default async function HomePage() {
  const catalog = await getEssayCatalog();

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-14">
      <section className="mb-10 text-center sm:mb-16">
        <AnimatedHeroTitle />
        <p className="mx-auto mt-3 max-w-2xl px-1 font-serif text-[15px] leading-relaxed text-muted sm:mt-4 sm:px-0 sm:text-lg sm:leading-normal">
          A personal reading room for the greatest essays on startups, writing,
          and life — synced live from{" "}
          <a
            href="https://www.paulgraham.com"
            className="text-accent underline-offset-4 hover:underline"
          >
            paulgraham.com
          </a>
          .
        </p>
        <div className="mt-4 sm:mt-6">
          <SyncStatus syncedAt={catalog.syncedAt} />
        </div>
      </section>

      <div className="space-y-10 sm:space-y-14">
        <NewSinceVisitBanner essays={catalog.essays} />
        <NewEssaysSection essays={catalog.newEssays} />
        <LatestSection essays={catalog.essays} />
        <PaulsPicksSection picks={catalog.picks} />
      </div>
    </div>
  );
}
