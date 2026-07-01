import type { VehicleFilterData } from "@/lib/part-finder/mock-api"
import type { ValidatedPartFinderSelection } from "@/lib/part-finder/validation"

export interface VehicleFilterFormProps {
  vehicleData: VehicleFilterData
  selection: ValidatedPartFinderSelection
}

export type OptimisticSelection = {
  year: string
  make: string
  model: string
}
