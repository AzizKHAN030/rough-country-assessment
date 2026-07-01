# Take-Home Assessment: Rough Country Next.js Part Finder

**Role:** Senior Next.js Developer
**Expected Time:** 2–4 hours for core requirements
**Bonus Depth:** Optional, if you want to demonstrate additional senior-level judgment

## Overview

At Rough Country, performance, SEO, and fitment accuracy are critical. We need fast, crawlable product discovery experiences that help customers find parts for their specific vehicle.

Your task is to build a simplified **Year / Make / Model** part finder using the **Next.js App Router**.

We are not looking for pixel-perfect CSS. We are looking for clean architecture, strong rendering decisions, resilient data handling, and clear reasoning.

## The Challenge

Build a product listing page with three dependent dropdowns:

1. Year
2. Make
3. Model

Rules:

* Make cannot be selected until Year is chosen.
* Model cannot be selected until Make is chosen.
* Changing Year should clear Make and Model.
* Changing Make should clear Model.
* Once Year, Make, and Model are selected, matching mock products should display.

Example URL:

```txt
/part-finder?year=2021&make=ford&model=bronco
```

## Core Requirements

### 1. URL as the Source of Truth

Filter state must live in the URL search parameters.

A user should be able to:

* Refresh the page and preserve the selected filters.
* Share the URL and load the same filtered state.
* Navigate quickly between selections without the UI becoming stale or incorrect.

Use stable, readable URL values such as:

```txt
?year=2021&make=ford&model=grand-cherokee
```

Display labels may differ from URL values.

### 2. Server and Client Boundaries

Use the Next.js App Router thoughtfully.

We want to see that you understand where React Server Components and Client Components belong.

Expected behavior:

* Initial product results should be server-rendered when a valid full selection exists.
* Dropdowns should feel responsive on the client.
* Avoid making the entire page a Client Component unless you can clearly justify that decision.

### 3. Loading and Error States

The provided mock API includes artificial latency and optional random failures.

Your UI should gracefully handle:

* Loading states.
* Empty product results.
* Invalid URL combinations.
* API errors.

Use Suspense and/or route-level error handling where appropriate.

### 4. Caching Strategy

Vehicle filter data changes rarely. Product inventory may change more often.

Implement or clearly explain a caching strategy for:

* Year / Make / Model data.
* Product results.

Because this mock API is a local async utility rather than a real HTTP fetch, it is acceptable to explain how your strategy would map to real production data fetching.

### 5. Race Condition Safety

The UI should remain correct during rapid filter changes.

You may solve this through URL-driven navigation, request cancellation, keyed rendering, transition state, local derivation of dropdown options, or another appropriate approach.

Explain your decision in the README.

## Bonus Items

These are not required, but they may help demonstrate senior-level depth:

* Fine-grained Suspense boundaries.
* `error.tsx` boundaries with retry behavior.
* Metadata, canonical URL, or SEO strategy explanation.
* Accessibility improvements.
* Basic tests.
* Optimistic or pending UI with `useTransition`.
* Route normalization or redirects for invalid/stale params.
* A short Loom walkthrough.

## Mock API

Use or adapt the following mock API.

```ts
// mockApi.ts

export interface VehicleFilterData {
  years: number[];
  makes: Record<number, VehicleMake[]>; // Year -> Makes
  models: Record<number, Record<string, VehicleModel[]>>; // Year -> Make Slug -> Models
}

export interface VehicleMake {
  label: string;
  slug: string;
}

export interface VehicleModel {
  label: string;
  slug: string;
}

const VEHICLE_DATA: VehicleFilterData = {
  years: [2021, 2022, 2023],
  makes: {
    2021: [
      { label: "Ford", slug: "ford" },
      { label: "Jeep", slug: "jeep" },
      { label: "Chevrolet", slug: "chevrolet" },
    ],
    2022: [
      { label: "Ford", slug: "ford" },
      { label: "Jeep", slug: "jeep" },
      { label: "Toyota", slug: "toyota" },
    ],
    2023: [
      { label: "Ford", slug: "ford" },
      { label: "Toyota", slug: "toyota" },
      { label: "Ram", slug: "ram" },
    ],
  },
  models: {
    2021: {
      ford: [
        { label: "Bronco", slug: "bronco" },
        { label: "Ranger", slug: "ranger" },
      ],
      jeep: [
        { label: "Wrangler", slug: "wrangler" },
        { label: "Grand Cherokee", slug: "grand-cherokee" },
      ],
      chevrolet: [
        { label: "Silverado", slug: "silverado" },
        { label: "Colorado", slug: "colorado" },
      ],
    },
    2022: {
      ford: [
        { label: "F-150", slug: "f-150" },
        { label: "Ranger", slug: "ranger" },
      ],
      jeep: [
        { label: "Wrangler", slug: "wrangler" },
        { label: "Gladiator", slug: "gladiator" },
      ],
      toyota: [
        { label: "Tacoma", slug: "tacoma" },
        { label: "4Runner", slug: "4runner" },
      ],
    },
    2023: {
      ford: [
        { label: "F-150", slug: "f-150" },
        { label: "Bronco", slug: "bronco" },
      ],
      toyota: [
        { label: "Tundra", slug: "tundra" },
        { label: "Tacoma", slug: "tacoma" },
      ],
      ram: [
        { label: "1500", slug: "1500" },
        { label: "2500", slug: "2500" },
      ],
    },
  },
};

export interface Product {
  id: string;
  name: string;
  year: number;
  makeSlug: string;
  makeLabel: string;
  modelSlug: string;
  modelLabel: string;
  price: number;
  inStock: boolean;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "6-Inch Suspension Lift Kit",
    year: 2021,
    makeSlug: "ford",
    makeLabel: "Ford",
    modelSlug: "bronco",
    modelLabel: "Bronco",
    price: 1299.95,
    inStock: true,
  },
  {
    id: "2",
    name: "Heavy Duty Front Bumper",
    year: 2021,
    makeSlug: "ford",
    makeLabel: "Ford",
    modelSlug: "bronco",
    modelLabel: "Bronco",
    price: 749.99,
    inStock: true,
  },
  {
    id: "3",
    name: "Premium N3 Loaded Struts",
    year: 2022,
    makeSlug: "ford",
    makeLabel: "Ford",
    modelSlug: "f-150",
    modelLabel: "F-150",
    price: 349.95,
    inStock: false,
  },
  {
    id: "4",
    name: "Dual Row LED Light Bar",
    year: 2021,
    makeSlug: "jeep",
    makeLabel: "Jeep",
    modelSlug: "wrangler",
    modelLabel: "Wrangler",
    price: 189.99,
    inStock: true,
  },
  {
    id: "5",
    name: "Tubular Rock Sliders",
    year: 2022,
    makeSlug: "jeep",
    makeLabel: "Jeep",
    modelSlug: "wrangler",
    modelLabel: "Wrangler",
    price: 429.95,
    inStock: true,
  },
  {
    id: "6",
    name: "Vertex Coilovers Pair",
    year: 2023,
    makeSlug: "toyota",
    makeLabel: "Toyota",
    modelSlug: "tundra",
    modelLabel: "Tundra",
    price: 1599.99,
    inStock: true,
  },
];

const FAILURE_RATE = Number(process.env.MOCK_API_FAILURE_RATE ?? 0.15);
const MIN_LATENCY = Number(process.env.MOCK_API_MIN_LATENCY_MS ?? 500);
const MAX_LATENCY = Number(process.env.MOCK_API_MAX_LATENCY_MS ?? 3000);

async function simulateNetwork() {
  const delay =
    Math.floor(Math.random() * (MAX_LATENCY - MIN_LATENCY + 1)) + MIN_LATENCY;

  await new Promise((resolve) => setTimeout(resolve, delay));

  if (Math.random() < FAILURE_RATE) {
    throw new Error("Internal Server Error: Database connection timeout.");
  }
}

export async function fetchFilterData(): Promise<VehicleFilterData> {
  await simulateNetwork();
  return VEHICLE_DATA;
}

export async function fetchProducts(params: {
  year: number;
  make: string;
  model: string;
}): Promise<Product[]> {
  await simulateNetwork();

  return MOCK_PRODUCTS.filter(
    (product) =>
      product.year === params.year &&
      product.makeSlug === params.make &&
      product.modelSlug === params.model
  );
}
```

## Deliverables

Please provide:

1. A link to a public GitHub repository.
2. A `README.md` explaining:

   * Your App Router structure.
   * What is server-rendered vs client-rendered.
   * How URL state is handled.
   * How loading and error states are handled.
   * Your caching strategy.
   * How your solution avoids stale UI or race conditions.
   * Any tradeoffs you made due to time.
3. Optional: a 3–5 minute Loom video walking through your architecture.

## What We Are Looking For

### Architecture

* Clean App Router structure.
* Appropriate Server Component and Client Component boundaries.
* Clear separation between data access, validation, UI, and URL state.

### Performance

* Server-rendered product results when possible.
* Minimal unnecessary client-side rendering.
* Responsive filter interactions.
* Thoughtful caching decisions.

### Resilience

* Graceful loading states.
* Graceful error handling.
* Correct behavior during rapid filter changes.
* Safe handling of invalid or incomplete URL params.

### Senior-Level Judgment

We are not looking for the most complex solution.

We are looking for someone who can make practical technical decisions, explain tradeoffs clearly, and build something that resembles how they would approach production code.
