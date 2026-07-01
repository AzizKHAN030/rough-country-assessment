// mockApi.ts

export interface VehicleFilterData {
  years: number[]
  makes: Record<number, VehicleMake[]> // Year -> Makes
  models: Record<number, Record<string, VehicleModel[]>> // Year -> Make Slug -> Models
}

export interface VehicleMake {
  label: string
  slug: string
}

export interface VehicleModel {
  label: string
  slug: string
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
}

export interface Product {
  id: string
  name: string
  year: number
  makeSlug: string
  makeLabel: string
  modelSlug: string
  modelLabel: string
  price: number
  inStock: boolean
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
]

const FAILURE_RATE = Number(process.env.MOCK_API_FAILURE_RATE ?? 0.15)
const MIN_LATENCY = Number(process.env.MOCK_API_MIN_LATENCY_MS ?? 500)
const MAX_LATENCY = Number(process.env.MOCK_API_MAX_LATENCY_MS ?? 3000)

async function simulateNetwork() {
  const delay =
    Math.floor(Math.random() * (MAX_LATENCY - MIN_LATENCY + 1)) + MIN_LATENCY

  await new Promise((resolve) => setTimeout(resolve, delay))

  if (Math.random() < FAILURE_RATE) {
    throw new Error("Internal Server Error: Database connection timeout.")
  }
}

export async function fetchFilterData(): Promise<VehicleFilterData> {
  await simulateNetwork()
  return VEHICLE_DATA
}

export async function fetchProducts(params: {
  year: number
  make: string
  model: string
}): Promise<Product[]> {
  await simulateNetwork()

  return MOCK_PRODUCTS.filter(
    (product) =>
      product.year === params.year &&
      product.makeSlug === params.make &&
      product.modelSlug === params.model
  )
}
