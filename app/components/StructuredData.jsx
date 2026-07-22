import { FAQ_ITEMS } from "./faqData";
import { SOCIAL } from "./Footer";

// Canonical origin for absolute URLs inside the JSON-LD (schema.org prefers
// absolute). Kept in step with metadataBase in app/layout.js.
const SITE_URL = "https://mkt.lalostylings.com";
// Reuses the hero video poster until a dedicated OG/social image is designed.
const OG_IMAGE = `${SITE_URL}/hero-poster.jpg`;

// JewelryStore is the most specific LocalBusiness subtype for this business.
const jewelryStore = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "Lalo Stylings",
  url: SITE_URL,
  image: OG_IMAGE,
  telephone: "+1-213-431-3250",
  priceRange: "$$$",
  foundingDate: "1995",
  address: {
    "@type": "PostalAddress",
    streetAddress: "610 S. Broadway Suite 320",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    postalCode: "90014",
    addressCountry: "US",
  },
  // Same three links rendered in the footer (single source of truth).
  sameAs: SOCIAL.map((s) => s.href),
};

// Built from the same FAQ_ITEMS the page renders, so the schema can't drift.
const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jewelryStore) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
