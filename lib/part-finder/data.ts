"use cache";

import { cacheLife } from "next/cache";
import { fetchFilterData, fetchProducts } from "./mock-api";

export async function getVehicleFilterData() {
  cacheLife("filter-data");

  return fetchFilterData();
}

export async function getProductsForVehicle(params: {
  year: number;
  make: string;
  model: string;
}) {
  cacheLife("products");

  return fetchProducts(params);
}
