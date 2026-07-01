import type { Product } from "@/lib/part-finder/mock-api";

interface ProductCardProps {
  product: Product;
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="space-y-4 rounded-lg border bg-background p-4 shadow-sm transition hover:border-primary/40">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-normal text-foreground">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          Fits {product.year} {product.makeLabel} {product.modelLabel}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xl font-bold text-foreground">
          {priceFormatter.format(product.price)}
        </p>
        <p
          className={
            product.inStock
              ? "rounded-full bg-[var(--success)]/10 px-3 py-1 text-sm font-medium text-[var(--success)]"
              : "rounded-full bg-[var(--accent)]/30 px-3 py-1 text-sm font-medium text-muted-foreground"
          }
        >
          {product.inStock ? "In stock" : "Out of stock"}
        </p>
      </div>
    </article>
  );
}
