import Reveal from "./Reveal";
import MediaFrame from "./MediaFrame";
import styles from "./FinalCta.module.css";

// Sends back to the quote builder (#start) — one conversion mechanism, no
// separate form.
export default function FinalCta() {
  return (
    <section className={styles.section}>
      <div className={styles.media}>
        <MediaFrame
          alt=""
          label="Background: the workshop / a finished piece"
          radius="0"
          tone="dark"
          stretch
          hideLabel
          sizes="100vw"
          className={styles.mediaFrame}
        />
        <div className={styles.overlay} aria-hidden="true" />
      </div>

      <Reveal className={`container ${styles.inner}`}>
        <h2 className={`h2 h2--on-green ${styles.heading}`}>
          From Our Collections
          <br />
          To Your Own <span className={styles.accent}>Creations.</span>
        </h2>
        <p className={styles.body}>
          Discover exclusive designs or bring your vision to life with custom
          jewelry.
        </p>
        <a href="#start" className="btn btn--on-green">
          Start My Design
        </a>
      </Reveal>
    </section>
  );
}
