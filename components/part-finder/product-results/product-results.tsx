import type { ValidatedPartFinderSelection } from "@/lib/part-finder/validation";
import type { Product } from "@/lib/part-finder/mock-api";
import { ProductCard } from "./product-card";
import { getProductsForVehicle } from "@/lib/part-finder/data";

interface ProductResultsProps {
  selection: ValidatedPartFinderSelection;
}

const STATUS_MESSAGES = {
  empty: "Select a vehicle to see compatible parts.",
  partial: "Continue selecting your vehicle to see compatible parts.",
  complete: (year: number | string, make: string, model: string) =>
    `No compatible parts found for ${year} ${make} ${model}.`,
};

export async function ProductResults({ selection }: ProductResultsProps) {
  const products =
    selection.status === "complete"
      ? await getProductsForVehicle({
          year: selection.year,
          make: selection.make.slug,
          model: selection.model.slug,
        })
      : [];

  const resultCountLabel =
    selection.status === "complete"
      ? `${products.length} ${products.length === 1 ? "part" : "parts"}`
      : "Awaiting fitment";

  return (
    <section
      id="compatible-parts"
      aria-labelledby="results-heading"
      aria-live="polite"
      className="space-y-4"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id="results-heading"
          className="text-xl font-semibold tracking-normal text-foreground"
        >
          Compatible Parts
        </h2>
        <p className="text-sm font-medium text-muted-foreground">
          {resultCountLabel}
        </p>
      </div>

      {renderResultContent(selection, products)}
    </section>
  );
}

function renderResultContent(
  selection: ValidatedPartFinderSelection,
  products: Product[],
) {
  if (selection.status !== "complete") {
    return (
      <div className="rounded-lg border bg-background p-6 text-sm text-muted-foreground shadow-sm">
        {STATUS_MESSAGES[selection.status]}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border bg-background p-6 text-sm text-muted-foreground shadow-sm">
        {STATUS_MESSAGES.complete(
          selection.year,
          selection.make.label,
          selection.model.label,
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
