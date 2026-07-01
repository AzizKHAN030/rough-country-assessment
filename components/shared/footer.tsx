export function Footer() {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:grid-cols-[1fr_auto] sm:px-6 lg:px-8">
        <div className="space-y-2">
          <p className="text-sm font-bold tracking-normal">RC Kits</p>
          <p className="max-w-xl text-sm text-secondary-foreground/70">
            Vehicle-focused parts for suspension, lighting, and recovery builds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-secondary-foreground/70">
          <a
            className="transition hover:text-secondary-foreground"
            href="#part-finder"
          >
            Fitment
          </a>
          <a
            className="transition hover:text-secondary-foreground"
            href="#compatible-parts"
          >
            Parts
          </a>
          <span>2026</span>
        </div>
      </div>
    </footer>
  );
}
