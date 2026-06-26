import { notFound } from "next/navigation";
import { fetchEssayContent } from "@/lib/essay-content";
import { getEssayBySlug, getEssayCatalog } from "@/lib/essays";
import { ReaderToolbar } from "@/components/ReaderToolbar";

interface EssayPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const catalog = await getEssayCatalog();
  return catalog.essays.slice(0, 20).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: EssayPageProps) {
  const { slug } = await params;
  const content = await fetchEssayContent(slug);
  if (!content) return { title: "Essay not found" };
  return { title: content.title };
}

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const [content, essay] = await Promise.all([
    fetchEssayContent(slug),
    getEssayBySlug(slug),
  ]);

  if (!content) notFound();

  return (
    <article className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-14">
      <ReaderToolbar
        slug={slug}
        title={content.title}
        originalUrl={content.originalUrl}
      />

      <div className="print-header">
        <h1 style={{ fontSize: "18pt", margin: 0 }}>{content.title}</h1>
        {content.date && (
          <p style={{ color: "#666", marginTop: "0.5rem" }}>{content.date}</p>
        )}
        <p style={{ fontSize: "9pt", color: "#888", marginTop: "0.5rem" }}>
          paulgraham.com/{slug}.html
        </p>
      </div>

      <header className="no-print mb-8 sm:mb-10">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {essay?.isNew && (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 font-serif text-[10px] uppercase tracking-wider text-accent">
              New
            </span>
          )}
          {content.date && (
            <span className="font-serif text-sm text-muted">{content.date}</span>
          )}
        </div>
        <h1 className="font-serif text-3xl font-medium leading-tight text-foreground sm:text-4xl">
          {content.title}
        </h1>
      </header>

      <div className="essay-reader">
        <div
          className="essay-prose"
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      </div>

      <div className="print-footer">
        <p>
          © Paul Graham · {content.originalUrl}
        </p>
        <p>Personal copy — not for redistribution.</p>
      </div>
    </article>
  );
}
