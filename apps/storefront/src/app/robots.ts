import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/account/",
          "/checkout/",
          "/cart/",
          ...["us", "gb", "de", "dk", "se", "fr", "es", "it"].flatMap(
            (country) => [
              `/${country}/account/`,
              `/${country}/checkout/`,
              `/${country}/cart/`,
            ]
          ),
        ],
      },
    ],
    sitemap: "https://www.getaurapatch.com/sitemap.xml",
  }
}
