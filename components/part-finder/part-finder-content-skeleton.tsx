export function PartFinderContentSkeleton() {
  return (
    <div aria-busy="true" className="space-y-8">
      <section
        aria-label="Loading vehicle filters"
        className="rounded-lg border bg-background p-4 shadow-sm sm:p-6"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <SkeletonSelect label="Year" />
          <SkeletonSelect label="Make" />
          <SkeletonSelect label="Model" />
        </div>
      </section>
      <ProductResultsSkeleton />
    </div>
  );
}

export function ProductResultsSkeleton() {
  return (
    <section aria-labelledby="results-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="results-heading"
          className="text-xl font-semibold tracking-normal text-foreground"
        >
          Compatible Parts
        </h2>
        <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonProductCard />
        <SkeletonProductCard />
      </div>
    </section>
  );
}

function SkeletonSelect({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-muted-foreground">
        {label}
      </span>
      <div
        aria-hidden="true"
        className="h-11 w-full animate-pulse rounded-md border bg-muted"
      />
    </div>
  );
}

function SkeletonProductCard() {
  return (
    <article className="space-y-4 rounded-lg border bg-background p-4 shadow-sm">
      <div className="space-y-2">
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
      </div>
    </article>
  );
}
