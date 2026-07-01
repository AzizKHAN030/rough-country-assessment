type PartFinderUrlParams = {
  year?: string
  make?: string
  model?: string
}

export function buildPartFinderUrl(params: PartFinderUrlParams): string {
  const searchParams = new URLSearchParams()
  if (params.year) {
    searchParams.set("year", params.year)
  }
  if (params.make) {
    searchParams.set("make", params.make)
  }
  if (params.model) {
    searchParams.set("model", params.model)
  }

  const query = searchParams.toString()

  return query ? `/part-finder?${query}` : "/part-finder"
}
