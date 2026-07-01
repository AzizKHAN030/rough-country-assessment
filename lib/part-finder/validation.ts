import type {
  VehicleFilterData,
  VehicleMake,
  VehicleModel,
} from "@/lib/part-finder/mock-api";

export type RawPartFinderParams = {
  year?: string | string[];
  make?: string | string[];
  model?: string | string[];
};

export type ValidatedPartFinderSelection =
  | {
      status: "empty";
    }
  | {
      status: "partial";
      year: number;
      make?: VehicleMake;
    }
  | {
      status: "complete";
      year: number;
      make: VehicleMake;
      model: VehicleModel;
    };

function getSingleParam(value: string | string[] | undefined) {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

export function validatePartFinderParams(
  rawParams: RawPartFinderParams,
  vehicleData: VehicleFilterData,
): ValidatedPartFinderSelection {
  const rawYear = getSingleParam(rawParams.year);
  const rawMake = getSingleParam(rawParams.make);
  const rawModel = getSingleParam(rawParams.model);

  if (!rawYear) {
    return { status: "empty" };
  }

  const year = Number(rawYear);

  if (!Number.isInteger(year) || !vehicleData.years.includes(year)) {
    return { status: "empty" };
  }

  if (!rawMake) {
    return { status: "partial", year };
  }

  const make = vehicleData.makes[year]?.find((m) => m.slug === rawMake);

  if (!make) {
    return { status: "partial", year };
  }

  if (!rawModel) {
    return { status: "partial", year, make };
  }

  const model = vehicleData.models[year]?.[make.slug]?.find(
    (m) => m.slug === rawModel,
  );

  if (!model) {
    return { status: "partial", year, make };
  }

  return { status: "complete", year, make, model };
}
