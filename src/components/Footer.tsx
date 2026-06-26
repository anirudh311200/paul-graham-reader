export function Footer() {
  return (
    <footer className="mt-auto px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 text-center sm:px-8 sm:text-left">
        <p className="font-serif text-sm text-muted">
          All essays ©{" "}
          <a
            href="https://www.paulgraham.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Paul Graham
          </a>
          {" · "}
          <a
            href="https://www.paulgraham.com/articles.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            original site
          </a>
        </p>
        <p className="font-serif text-xs text-muted/70">
          A personal reading room — not affiliated with Paul Graham or Y
          Combinator.
        </p>
      </div>
    </footer>
  );
}
