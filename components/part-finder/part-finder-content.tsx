import { Suspense } from "react";

import { ProductResults } from "@/components/part-finder/product-results/product-results";
import { VehicleFilterForm } from "@/components/part-finder/filter-form/vehicle-filter-form";
import { getVehicleFilterData } from "@/lib/part-finder/data";
import { validatePartFinderParams } from "@/lib/part-finder/validation";
import { ProductResultsSkeleton } from "@/components/part-finder";

type PageProps = {
  searchParams: Promise<{
    year?: string | string[];
    make?: string | string[];
    model?: string | string[];
  }>;
};

export async function PartFinderContent({ searchParams }: PageProps) {
  const [params, vehicleData] = await Promise.all([
    searchParams,
    getVehicleFilterData(),
  ]);
  const selection = validatePartFinderParams(params, vehicleData);

  return (
    <>
      <VehicleFilterForm vehicleData={vehicleData} selection={selection} />

      <Suspense fallback={<ProductResultsSkeleton />}>
        <ProductResults selection={selection} />
      </Suspense>
    </>
  );
}
