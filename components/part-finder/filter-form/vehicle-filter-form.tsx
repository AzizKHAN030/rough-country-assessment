"use client"

import { useVehicleFilterNavigation } from "./use-vehicle-filter-navigation"

import { SelectField } from "@/components/ui/select-field"
import { PageProgressBar } from "./page-progressbar"
import { VehicleFilterFormProps } from "./types"

export function VehicleFilterForm({
  vehicleData,
  selection,
}: VehicleFilterFormProps) {
  const {
    optimisticSelection,
    isPending,
    shouldShowProductProgress,
    handleYearChange,
    handleMakeChange,
    handleModelChange,
    yearOptions,
    makeOptions,
    modelOptions,
  } = useVehicleFilterNavigation({
    vehicleData,
    selection,
  })

  const fields = [
    {
      id: "year",
      label: "Year",
      value: optimisticSelection.year,
      disabled: isPending,
      options: yearOptions,
      onChange: handleYearChange,
      placeholder: "Select a year",
    },
    {
      id: "make",
      label: "Make",
      value: optimisticSelection.make,
      disabled: !optimisticSelection.year,
      options: makeOptions,
      onChange: handleMakeChange,
      placeholder: "Select a make",
    },
    {
      id: "model",
      label: "Model",
      value: optimisticSelection.model,
      disabled: !optimisticSelection.year || !optimisticSelection.make,
      options: modelOptions,
      onChange: handleModelChange,
      placeholder: "Select a model",
    },
  ]

  return (
    <>
      <form
        aria-busy={isPending}
        className="rounded-lg border bg-background p-4 shadow-sm sm:p-6"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {fields.map((field) => (
            <SelectField key={field.id} {...field} />
          ))}
        </div>
        <p className="sr-only" role="status">
          {isPending && shouldShowProductProgress
            ? "Updating compatible parts."
            : ""}
        </p>
      </form>
      <PageProgressBar isVisible={isPending && shouldShowProductProgress} />
    </>
  )
}
