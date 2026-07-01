"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState, useOptimistic } from "react";

import { buildPartFinderUrl } from "@/lib/part-finder/url";
import { VehicleFilterFormProps, OptimisticSelection } from "./types";
import {
  getYearOptions,
  getMakeOptions,
  getModelOptions,
} from "./vehicle-filter-options";

export function useVehicleFilterNavigation({
  vehicleData,
  selection,
}: VehicleFilterFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [shouldShowProductProgress, setShouldShowProductProgress] =
    useState(false);

  const selectedYear =
    selection.status === "empty" ? undefined : String(selection.year);
  const selectedMake =
    selection.status !== "empty" ? selection.make : undefined;
  const selectedModel =
    selection.status === "complete" ? selection.model : undefined;

  const serverSelection: OptimisticSelection = {
    year: selectedYear ?? "",
    make: selectedMake?.slug ?? "",
    model: selectedModel?.slug ?? "",
  };

  const [optimisticSelection, setOptimisticSelection] = useOptimistic(
    serverSelection,
    (_current, next: OptimisticSelection) => next,
  );

  function handleYearChange(year: string) {
    const nextSelection = {
      year,
      make: "",
      model: "",
    };

    startTransition(() => {
      setOptimisticSelection(nextSelection);

      router.replace(buildPartFinderUrl({ year: year || undefined }), {
        scroll: false,
      });
    });
  }

  function handleMakeChange(make: string) {
    const nextSelection = {
      year: optimisticSelection.year,
      make,
      model: "",
    };

    startTransition(() => {
      setOptimisticSelection(nextSelection);

      router.replace(
        buildPartFinderUrl({
          year: nextSelection.year || undefined,
          make: make || undefined,
        }),
        { scroll: false },
      );
    });
  }

  function handleModelChange(model: string) {
    const nextSelection = {
      ...optimisticSelection,
      model,
    };

    setShouldShowProductProgress(
      Boolean(nextSelection.year && nextSelection.make && nextSelection.model),
    );

    startTransition(() => {
      setOptimisticSelection(nextSelection);
      router.replace(
        buildPartFinderUrl({
          year: nextSelection.year || undefined,
          make: nextSelection.make || undefined,
          model: nextSelection.model || undefined,
        }),
        { scroll: false },
      );
    });
  }

  return {
    optimisticSelection,
    isPending,
    shouldShowProductProgress,
    handleYearChange,
    handleMakeChange,
    handleModelChange,
    yearOptions: getYearOptions(vehicleData),
    makeOptions: getMakeOptions({
      vehicleData,
      year: optimisticSelection.year,
    }),
    modelOptions: getModelOptions({
      vehicleData,
      year: optimisticSelection.year,
      make: optimisticSelection.make,
    }),
  };
}
