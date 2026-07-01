import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/part-finder"
          className="flex items-center gap-3 font-bold tracking-normal text-foreground"
          aria-label="RC Kits part finder"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-black text-primary-foreground">
            RC
          </span>
          <span>Kits</span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-5"
        >
          <Link
            href="/part-finder"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Part Finder
          </Link>
          <a
            href="#compatible-parts"
            className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground sm:inline"
          >
            Compatible Parts
          </a>
        </nav>
      </div>
    </header>
  );
}
