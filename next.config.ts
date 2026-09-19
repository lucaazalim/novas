import type { NextConfig } from "next";

const ONE_HOUR = 60 * 60;

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Cache Components: static shell + streamed dynamic parts + "use cache" data caching.
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
  poweredByHeader: false,

  // Named cache profile used by `cacheLife()` in src/lib/news/api.ts.
  cacheLife: {
    news: { stale: 5 * 60, revalidate: 10 * 60, expire: ONE_HOUR },
  },

  images: {
    // Article images come from arbitrary publisher CDNs, so any HTTPS host is allowed.
    // Plain-HTTP URLs are upgraded to HTTPS before rendering (see ArticleImage).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: ONE_HOUR,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        // The service worker must never be served stale, or updates would never ship.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
