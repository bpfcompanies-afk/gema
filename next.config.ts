import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // La página de planes con precios se retiró; los precios ya no se publican.
      { source: "/precios", destination: "/pricecalculator", permanent: true },
    ];
  },
};

export default nextConfig;
