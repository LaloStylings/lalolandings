import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import WhatWeCreate from "./components/WhatWeCreate";
import Compare from "./components/Compare";
import Story from "./components/Story";
import Process from "./components/Process";
import Stories from "./components/Stories";
import Gallery from "./components/Gallery";
import QuoteBuilder from "./components/QuoteBuilder";
import Faq from "./components/Faq";
import FinalCta from "./components/FinalCta";
import Footer from "./components/Footer";

// Order: Nav → Hero → Trust bar → What We Create → Our Story → The Process →
// Why we're different → Client stories → Gallery → FAQ → CTA → Footer.
//
// The quote builder is now modal-only (no in-page section): <QuoteBuilder />
// renders just the <dialog>, mounted at the end. Every #start CTA opens it.
export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <WhatWeCreate />
        <Story />
        <Process />
        <Compare />
        <Stories />
        <Gallery />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <QuoteBuilder />
    </>
  );
}
