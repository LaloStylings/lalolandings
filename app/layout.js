import { Cormorant_Unicase, Cormorant_Garamond, Arimo } from "next/font/google";
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

export const metadata = {
  title: "Custom Engagement Rings, Handcrafted in Los Angeles · Lalo Stylings",
  description:
    "The ring you're imagining doesn't exist in a store, so we'll make it. Custom engagement rings and bespoke fine jewelry, handcrafted in our Los Angeles workshop. No middlemen. Start your design free.",
};

export default function RootLayout({ children }) {
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
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
