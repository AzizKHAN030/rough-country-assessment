import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    "filter-data": {
      stale: 300,
      revalidate: 3600,
      expire: 86400,
    },
    products: {
      stale: 60,
      revalidate: 60 * 5,
      expire: 3600,
    },
  },
};

export default nextConfig;
