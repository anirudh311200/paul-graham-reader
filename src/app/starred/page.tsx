import { getEssayCatalog } from "@/lib/essays";
import { StarredList } from "@/components/StarredList";

export const metadata = {
  title: "Starred",
};

export default async function StarredPage() {
  const catalog = await getEssayCatalog();

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-14">
      <div className="mb-8 sm:mb-10">
        <p className="font-serif text-xs uppercase tracking-[0.2em] text-gold">
          Your collection
        </p>
        <h1 className="mt-1 font-serif text-3xl font-medium text-foreground sm:text-4xl">
          Starred Essays
        </h1>
        <p className="mt-2 font-serif text-sm text-muted">
          High-fi picks — the ones worth coming back to.
        </p>
      </div>

      <StarredList essays={catalog.essays} />
    </div>
  );
}
