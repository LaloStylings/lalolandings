import Reveal from "./Reveal";
import MediaFrame from "./MediaFrame";
import styles from "./Story.module.css";

export default function Story() {
  return (
    <section id="story" className={`section surface-white ${styles.section}`}>
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.copy}>
          <span className="chip">Our Story</span>
          <h2 className={`h2 ${styles.heading}`}>Three Decades at the Bench</h2>
          <p className={styles.body}>
            Our founder didn&rsquo;t start in a factory. He started in a small
            traditional workshop, learning an art that takes decades to master,
            and can&rsquo;t be automated.
          </p>
          <p className={styles.body}>
            Thirty years later, every piece that leaves our studio is still cast,
            set, and polished by hand. We&rsquo;re not just jewelers. We&rsquo;re
            artisans, storytellers, and keepers of a craft passed down through
            generations.
          </p>
          {/* Brand name corrected: the approved name is Lalo Stylings
              (the original copy read "Auruk Jewelers"). */}
          <p className={styles.body}>
            When you choose Lalo Stylings, you&rsquo;re not buying a beautiful
            object. You&rsquo;re commissioning one.
          </p>
          <a href="#start" className={`btn btn--secondary ${styles.cta}`}>
            Start My Design
          </a>
        </Reveal>

        <Reveal className={styles.media} delay={120}>
          <MediaFrame
            src="/decade.webp"
            alt="Master jeweler wearing a loupe, handcrafting a custom gold ring at the bench in the Lalo Stylings Los Angeles workshop"
            ratio="4 / 5"
            radius="var(--r-lg)"
            zoom
            loading="lazy"
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </Reveal>
      </div>
    </section>
  );
}
