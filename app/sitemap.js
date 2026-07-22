const SITE_URL = "https://mkt.lalostylings.com";

// Single-page landing: one entry, top priority.
export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
