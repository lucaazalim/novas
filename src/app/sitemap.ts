import type { MetadataRoute } from "next";

import { CATEGORIES, COUNTRIES } from "@/lib/news/constants";
import { siteConfig } from "@/lib/site";

const absolute = (path: string) => new URL(path, siteConfig.url).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absolute("/"), changeFrequency: "hourly", priority: 1 },
    ...COUNTRIES.flatMap((country) =>
      CATEGORIES.map((category) => ({
        url: absolute(`/${country.code}/${category.key}`),
        changeFrequency: "hourly" as const,
        priority: country.code === "us" ? 0.8 : 0.6,
      })),
    ),
  ];
}
