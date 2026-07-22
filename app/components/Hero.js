import HeroMedia from "./HeroMedia";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      {/* Full-bleed background: looping video on desktop, poster image on
          mobile / reduced-motion. The poster is the LCP. Scrim runs on top. */}
      <div className={styles.media}>
        <HeroMedia poster="/hero-poster.jpg" />
        <div className={styles.scrim} aria-hidden="true" />
      </div>

      <div className={styles.inner}>
        <div className={styles.textCol}>
          {/* Founded 1995 (31 years of craftsmanship). */}
          <span className={`chip chip--on-green ${styles.chip}`}>
            Since 1995 · Free Consultation
          </span>
          <h1 className={styles.title}>
            Custom Fine Jewelry
            <br />
            Handcrafted in Los Angeles
          </h1>
          <p className={styles.lead}>
            Your vision is the beginning of a masterpiece. Guided by our master
            artisans, we&rsquo;ll transform your idea, from a simple sketch to a
            timeless piece that is yours alone. Let&rsquo;s create the one jewel
            that tells your story.
          </p>
          <div className={styles.actions}>
            <a href="#start" className={`btn btn--on-green ${styles.cta}`}>
              Start My Design · Free Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
