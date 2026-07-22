import { Cormorant_Unicase, Cormorant_Garamond, Arimo } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import SmoothScroll from "./components/SmoothScroll";
import "./globals.css";

// Display — Cormorant Unicase, light (300). Always rendered UPPERCASE.
const cormorant = Cormorant_Unicase({
  subsets: ["latin"],
  weight: "300",
  display: "swap",
  variable: "--font-cormorant",
});

// Italic accent — Cormorant Garamond italic (same Cormorant lineage, but with
// real lowercase + true italics, which the Unicase variant lacks). Used sparingly
// for editorial accent words.
const cormorantItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  display: "swap",
  variable: "--font-cormorant-italic",
});

// Body / labels — Arimo (free metric-compatible substitute for Helvetica).
const arimo = Arimo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-arimo",
});

const SITE_URL = "https://mkt.lalostylings.com";
const TITLE = "Custom Fine Jewelry Handcrafted in Los Angeles | Lalo Stylings";
const DESCRIPTION =
  "Custom engagement rings, bespoke designs and heirloom redesigns, handcrafted by master jewelers in our Los Angeles studio. Free consultation, no obligation. 31 years of craftsmanship.";
// TODO: replace /hero-poster.jpg with a dedicated 1200x630 OG image (designed piece).
const OG_IMAGE = "/hero-poster.jpg";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Lalo Stylings",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Custom fine jewelry handcrafted by Lalo Stylings in Los Angeles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${cormorantItalic.variable} ${arimo.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Enables scroll-reveal styles only when JS runs; content stays
            visible without JS. Tiny, blocking, no network request. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
