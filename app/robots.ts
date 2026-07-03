import type { MetadataRoute } from "next";

const siteUrl = "https://www.9rosesjourney.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}