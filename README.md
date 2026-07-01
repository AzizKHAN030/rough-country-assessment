# Rough Country - Test assessment Part Finder

A Next.js App Router implementation of a product finder depending on Year|Make|Model filter params, built for the Senior Next.js Developer take-home assessment.

**Example URL shape:**

```
/part-finder?year=2021&make=ford&model=bronco
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/part-finder](http://localhost:3000/part-finder) or [http://localhost:3000](http://localhost:3000) (redirects to a needed route)

Optional env vars (control the mock API's simulated latency/failure rate):

```bash
MOCK_API_FAILURE_RATE=0.15
MOCK_API_MIN_LATENCY_MS=500
MOCK_API_MAX_LATENCY_MS=3000
```

---

## App Router Structure

```
app/
  part-finder/
    page.tsx         # Server component shell-renders static copy, delegates to PartFinderContent component
    loading.tsx      # Route-level fallback (shown on hard navigation)
    error.tsx        # Route-level error boundary with retry

lib/part-finder/
  mock-api.ts        # Provided mock API (unmodified)
  data.ts            # "use cache" wrappers around the mock API (caching lives here, not in components)
  validation.ts      # Pure functions: raw searchParams to ValidatedPartFinderSelection
  url.ts             # Pure functions: selection to canonical URL

components/part-finder/
  filter-form/        # Client Components: dropdowns, optimistic UI, URL navigation
  product-results/    # Server Component: product fetch + rendering
```

The guiding principle: **data access, validation, URL logic, and UI are four separate concerns**, each in its own file/folder, rather than living inline in `page.tsx`. Nothing in `lib/` imports React; nothing in `components/` talks to the mock API directly.

### Render flow

`page.tsx` renders static content immediately (no data dependency), then suspends on:

```tsx
<Suspense fallback={<PartFinderContentSkeleton />}>
  <PartFinderContent searchParams={searchParams} />
</Suspense>
```

`PartFinderContent` (async Server Component) does the minimum work needed to render the _form_:

```tsx
const [params, vehicleData] = await Promise.all([
  searchParams,
  getVehicleFilterData(),
]);
const selection = validatePartFinderParams(params, vehicleData);
```

It then renders `VehicleFilterForm` and **another independent** Suspense boundary around `ProductResults`:

```tsx
<VehicleFilterForm vehicleData={vehicleData} selection={selection} />
<Suspense fallback={<ProductResultsSkeleton />}>
  <ProductResults selection={selection} />
</Suspense>
```

This split matters: the product fetch is the slow, failure-prone call. If it shared a boundary with the form, a 3-second product-lookup would leave the dropdowns themselves stuck behind a skeleton. Splitting them means the form (backed by the faster, more heavily cached vehicle data) becomes interactive first, and only the results grid waits on the product fetch.

---

## Server vs. Client Boundaries

| Component                    | Type          | Why                                                                           |
| ---------------------------- | ------------- | ----------------------------------------------------------------------------- |
| `app/part-finder/page.tsx`   | Server        | Static shell, no interactivity                                                |
| `PartFinderContent`          | Server        | Reads `searchParams`, fetches vehicle data, validates - no browser API needed |
| `ProductResults`             | Server        | Fetches and renders products; benefits from SSR + streaming                   |
| `VehicleFilterForm`          | Client        | Needs `onChange` handlers, `useOptimistic`, `useTransition`                   |
| `SelectField`                | Client        | Controlled `<select>`, part of the interactive form                           |
| `useVehicleFilterNavigation` | Client (hook) | Owns the optimistic state + `router.replace` calls                            |

Only the dropdown layer is a Client Component. Everything that fetches or renders product/vehicle data stays server-side, which means:

- Initial product results are fully server-rendered HTML when the URL has a complete, valid selection - no client-side fetch on mount waterfall.
- The client bundle only ships the interactive parts (form state, navigation), not data-fetching or rendering logic for products.

---

## URL State Handling

The URL is the **only** source of truth for filter state - there is no separate "real" selection stored in component state that could drift from it.

- `year`, `make`, `model` are read from `searchParams` on the server and passed through `validatePartFinderParams`, which returns one of three shapes:
  - `{ status: "empty" }`
  - `{ status: "partial", year, make? }`
  - `{ status: "complete", year, make, model }` (with resolved `{ label, slug }` objects)
- `buildPartFinderUrl` is the single place that constructs the canonical query string, using stable slugs (`ford`, `grand-cherokee`).
- Invalid or stale combinations (e.g. a `make` that doesn't exist for the given `year`) are treated as `partial` rather than thrown, the validator silently drops what's no longer valid instead of erroring, so a shared/bookmarked URL that's since gone stale still degrades gracefully to "pick a make" rather than crashing.
- Navigation uses `router.replace (not push)` so filter changes update the URL in place rather than adding in browser history - one "back" press leaves the page instead of undoing filters one at a time.

Refresh, direct link, and share-the-URL all work identically because the server has no other state to reconstruct - it only reads the URL.

---

## Loading and Error States

**Loading** - two layers, intentionally different in scope:

- `app/part-finder/loading.tsx` is the route level fallback Next.js shows automatically on a hard navigation to `/part-finder`.
- The `<Suspense>` boundaries inside `PartFinderContent` and around `ProductResults` also kick back in when a dropdown changes. Since a filter change just updates the URL (not a full page navigation), Next.js re-runs the server components and shows each section's skeleton again while it loads - so the form and the results can each show "loading" independently instead of the whole page freezing.

**Errors** - `app/part-finder/error.tsx` is the route-level error boundary. It uses Next.js 16.2's `unstable_retry()` rather than the classic `reset()`:

```tsx
<button onClick={() => startTransition(() => unstable_retry())}>
  Try again
</button>
```

`reset()` alone only clears the error and re-renders with the same props - it wouldn't actually re-run the failed data fetch. `unstable_retry()` performs a `router.refresh()` + `reset()`, so retrying genuinely re-invokes `PartFinderContent` and re-attempts the fetch that failed (relevant here since failures come from the mock API's simulated `MOCK_API_FAILURE_RATE`, not from a render bug).

**Empty / partial / invalid states** - handled inside `ProductResults` via a small status-to-message map (`empty`, `partial`, `complete`-with-zero-results), so "no vehicle selected yet" and "valid vehicle, no matching parts" read as distinct, intentional states rather than both looking like a blank error.

**Known gap:** there's currently one shared error boundary for the whole `/part-finder` segment. A failure inside `ProductResults` (e.g. the mock API's random `Internal Server Error`) currently takes down the already-rendered, working filter form along with it, since there's no error boundary scoped just to the results region. See [Tradeoffs](#implementation-tradeoffs).

---

## Caching Strategy

Caching is implemented with the `"use cache"` directive and per-function `cacheLife` profiles in `lib/part-finder/data.ts`, configured in `next.config.ts`:

```ts
cacheLife: {
  "filter-data": { stale: 300, revalidate: 3600, expire: 86400 },
  products:      { stale: 60,  revalidate: 300,  expire: 3600  },
}
```

| Data                                         | Profile                                                      | Reasoning                                                                                                                                                                                             |
| -------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vehicle filter data (`getVehicleFilterData`) | `filter-data` - 5 min stale / 1 hr revalidate / 24 hr expire | Year/Make/Model taxonomy changes rarely (new model years, occasional new trims). Safe to serve stale for long stretches.                                                                              |
| Product results (`getProductsForVehicle`)    | `products` - 1 min stale / 5 min revalidate / 1 hr expire    | Inventory and pricing can change more frequently, so results go stale and revalidate much faster. Cached per `{year, make, model}` key so different vehicle combinations don't invalidate each other. |

**Mapping to a real API:** `fetchFilterData`/`fetchProducts` here are local async functions rather than real HTTP calls, but the caching layer sits _above_ them in `data.ts`, not inside them - so swapping the mock functions for real `fetch()` calls to an external service wouldn't require touching the caching strategy at all. In production, the `revalidate` window would likely be paired with `revalidateTag`/`revalidatePath` triggered from inventory-update webhooks, so pricing/stock changes can invalidate the `products` cache immediately rather than waiting out the window.

---

## Race Condition Safety

The UI stays correct during rapid filter changes for a combination of reasons, in order of importance:

1. **URL-driven navigation is the only trigger for re-fetching.** There's no local `useState` holding "the real selection" that could get out of sync with an in-flight request - every change goes through `router.replace`, and the _last_ call always wins. There's no scenario where a slow response for an earlier selection arrives after a newer one and overwrites it, because the server tree is re-derived from whatever URL is current at resolution time, not from a request that was kicked off earlier.
2. **`useOptimistic` + `useTransition`** (`use-vehicle-filter-navigation.ts`) give instant visual feedback - the dropdown reflects the new choice the moment the user picks it, before the network round-trip completes - while `isPending` marks the transition so the UI can show a subtle pending state without blocking interaction.
3. **Clearing dependent dropdowns is explicit**. Changing Year clears Make and Model, changing Make clears Model - instantly, so you never see a leftover Make/Model paired with a different Year.
4. **Dropdown options are derived locally**, from the already-fetched (and cached) `vehicleData`, not re-fetched per keystroke - so there's no extra network race introduced just to populate the Make/Model lists themselves.

---

## SEO and Accessibility

The important SEO choice is that a complete, valid URL renders product results on the server. A crawler or shared link can request `/part-finder?year=2021&make=ford&model=bronco` and receive meaningful HTML instead of waiting for a client-side fetch after hydration. The route also defines static metadata in `app/part-finder/page.tsx`.

I did not add canonical URL generation for every selection because the app currently tolerates invalid/stale params by degrading to a partial state instead of redirecting. In production, I'd normalize invalid URLs to their canonical form so crawlers don't index duplicate or misleading query combinations.

Accessibility is mostly handled through native controls and route semantics:

- The dropdowns are native `<select>` elements with labels, so keyboard and screen reader behavior comes from the platform.
- The form exposes pending work with `aria-busy`.
- Product results use `aria-live="polite"` so result changes can be announced without being disruptive.
- The route error UI uses `role="alert"` and a real button for retry.

---

## Implementation Tradeoffs

These are deliberate choices with real downsides, not just things left unfinished:

**One shared error boundary, not one per section.**
Right now, error.tsx covers the whole `/part-finder` route - so if the product fetch fails, it takes the whole page down, including the filter form that was working fine. I could give `ProductResults` its own error boundary so only that section breaks, but error boundaries have to be Client Components, so that means wrapping a Server Component in an extra client-side piece just to catch its errors. For a page this small, I went with the simpler, single boundary. On a bigger page with several sections that shouldn't take each other down, I'd split it up.

**`"use cache"` / `cacheComponents`, not the standard `fetch` + `revalidate` pattern.**
This is an experimental Next.js 16 API. It gives per-function cache profiles (`cacheLife`) that are more explicit and readable than tagging `fetch` calls, but it's still experimental - the API surface could change in a future Next.js release, and it's a less battle-tested pattern than `revalidate`/`revalidateTag` on `fetch`. I took the newer API because it fit the mock-API-as-function shape better and demonstrates the current direction of the framework, but a team with a lower risk tolerance on a production app might reasonably prefer the more established `fetch`-based caching.

**Silent fallback for invalid params, not a redirect.**
`validatePartFinderParams` treats an invalid `make`/`model` (one that doesn't exist for the given year) as if it were simply unselected - it degrades to `partial` rather than throwing or redirecting. This keeps the code simple and avoids an extra round trip, but it means a stale or manually-edited URL like `?year=2021&make=doesnotexist` renders identically to `?year=2021` with no signal to the user (or to a crawler) that something in the URL was actually invalid. A stricter version would redirect to the canonical, cleaned-up URL - better for SEO and clarity, at the cost of an extra request and more branching logic.

## What I'd Do Differently for a Production Version

- **Scope the error boundary to `ProductResults`**, per the tradeoff above - not doing it here was a size-of-task call, not a "this is fine long-term" call.
- **Swap `"use cache"` for the stable caching primitives** once the team's Next.js version and risk tolerance are settled, unless staying on the experimental API is a deliberate bet.
- **Add cache invalidation hooks** (`revalidateTag`) wired to real inventory/pricing webhooks, instead of relying purely on time-based `revalidate` windows - stale pricing is a worse failure mode than stale Year/Make/Model taxonomy.
- **Redirect stale/invalid URLs to their canonical form** instead of silently falling back, both for SEO (avoid indexing near-duplicate URLs) and so users get a signal that their link was out of date.
- **Reconsider `router.replace` vs `push` per-field.** Right now every change replaces history. For a real product page, a case could be made for `push`-ing only the final, complete selection (a state worth returning to) while `replace`-ing intermediate partial states - worth validating with real usage data rather than deciding it up front.
