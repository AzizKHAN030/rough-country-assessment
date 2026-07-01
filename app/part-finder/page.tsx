import { Suspense } from "react";
import type { Metadata } from "next";

import {
  PartFinderContent,
  PartFinderContentSkeleton,
} from "@/components/part-finder";

type PageProps = {
  searchParams: Promise<{
    year?: string | string[];
    make?: string | string[];
    model?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Part Finder",
  description:
    "Select a year, make, and model to find compatible Rough Country-style vehicle parts.",
};

export default function PartFinderPage({ searchParams }: PageProps) {
  return (
    <main
      id="part-finder"
      className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8"
    >
      <header className="space-y-3">
        <p className="text-sm font-semibold tracking-normal text-primary uppercase">
          Vehicle Fitment
        </p>
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          Part Finder
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Match suspension, lighting, and recovery parts to a vehicle fitment.
        </p>
      </header>
      <Suspense fallback={<PartFinderContentSkeleton />}>
        <PartFinderContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
