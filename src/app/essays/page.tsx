import { getEssayCatalog } from "@/lib/essays";
import { EssayList } from "@/components/EssayList";
import { SyncStatus } from "@/components/HomeSections";

export const metadata = {
  title: "All Essays",
};

export default async function EssaysPage() {
  const catalog = await getEssayCatalog();

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-14">
      <div className="mb-8 sm:mb-10">
        <p className="font-serif text-xs uppercase tracking-[0.2em] text-muted">
          Complete catalog
        </p>
        <h1 className="mt-1 font-serif text-3xl font-medium text-foreground sm:text-4xl">
          All Essays
        </h1>
        <p className="mt-2 font-serif text-sm text-muted">
          {catalog.essays.length} essays, newest first.
        </p>
        <div className="mt-3">
          <SyncStatus syncedAt={catalog.syncedAt} />
        </div>
      </div>

      <EssayList essays={catalog.essays} />
    </div>
  );
}
