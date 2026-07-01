"use client";

import { useEffect, useRef, useTransition } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function Error({ error, unstable_retry }: ErrorProps) {
  const retryInFlightRef = useRef(false);
  const [isRetryPending, startRetryTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  useEffect(() => {
    if (!isRetryPending) {
      retryInFlightRef.current = false;
    }
  }, [isRetryPending]);

  function handleRetry() {
    if (retryInFlightRef.current) {
      return;
    }

    retryInFlightRef.current = true;

    startRetryTransition(() => {
      unstable_retry();
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <section
        role="alert"
        aria-labelledby="part-finder-error-title"
        className="rounded-lg border bg-background p-6 shadow-sm"
      >
        <p className="mb-3 text-sm font-semibold text-primary uppercase">
          Part Finder
        </p>
        <h1
          id="part-finder-error-title"
          className="text-2xl font-bold tracking-normal text-foreground"
        >
          Unable to load the part finder
        </h1>
        <p className="mt-3 text-muted-foreground">
          Something went wrong while loading vehicle fitment data. Please try
          again.
        </p>

        <button
          type="button"
          onClick={handleRetry}
          disabled={isRetryPending}
          className="mt-6 cursor-pointer inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {isRetryPending ? "Retrying..." : "Try again"}
        </button>
      </section>
    </main>
  );
}
