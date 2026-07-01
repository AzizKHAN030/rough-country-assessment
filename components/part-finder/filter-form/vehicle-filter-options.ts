import type {
  VehicleFilterData,
  VehicleMake,
  VehicleModel,
} from "@/lib/part-finder/mock-api"

import type { SelectOption } from "@/components/ui/select-field"

export function getYearOptions(vehicleData: VehicleFilterData): SelectOption[] {
  return vehicleData.years.map((year) => ({
    label: String(year),
    value: String(year),
  }))
}

export function getMakeOptions(params: {
  vehicleData: VehicleFilterData
  year: string
}): SelectOption[] {
  if (!params.year) {
    return []
  }

  const makes: VehicleMake[] =
    params.vehicleData.makes[Number(params.year)] ?? []

  return makes.map((make) => ({
    label: make.label,
    value: make.slug,
  }))
}

export function getModelOptions(params: {
  vehicleData: VehicleFilterData
  year: string
  make: string
}): SelectOption[] {
  if (!params.year || !params.make) {
    return []
  }

  const models: VehicleModel[] =
    params.vehicleData.models[Number(params.year)]?.[params.make] ?? []

  return models.map((model) => ({
    label: model.label,
    value: model.slug,
  }))
}
