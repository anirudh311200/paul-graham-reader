import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/essays", label: "Essays" },
  { href: "/starred", label: "Starred" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8 sm:py-5">
        <Link href="/" className="group min-w-0 shrink">
          <span className="font-logo text-2xl tracking-wide text-foreground transition-opacity group-hover:opacity-80 sm:text-4xl">
            <span className="sm:hidden">PG Essays</span>
            <span className="hidden sm:inline">Paul Graham Essays</span>
          </span>
          <span className="mt-0.5 hidden font-serif text-[11px] uppercase tracking-[0.2em] text-muted sm:block">
            unofficial reader
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-0.5 sm:gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full px-2.5 font-serif text-xs text-muted transition-colors hover:bg-white/5 hover:text-foreground sm:min-h-0 sm:min-w-0 sm:px-4 sm:py-1.5 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
