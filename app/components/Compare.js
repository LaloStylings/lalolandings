import Reveal from "./Reveal";
import styles from "./Compare.module.css";

const THEM = [
  "Pick from what’s in the case",
  "Mass-produced, cast in batches",
  "Retail markup on every stone",
  "Salesperson, not a jeweler",
  "Identical to thousands of others",
];

const US = [
  "Designed around your idea from zero",
  "Hand-crafted, one at a time",
  "Direct from the workshop, no middlemen",
  "You speak with the master jeweler",
  "Yours alone. Literally one in the world",
];

export default function Compare() {
  return (
    <section id="why-us" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.head}>
          <span className="chip chip--on-green">Why We&rsquo;re Different</span>
          <h2 className={`h2 h2--on-green ${styles.heading}`}>
            Why Our Rings Aren&rsquo;t Like the Ones in the Mall
          </h2>
          <p className={styles.intro}>
            Most engagement rings pass through four hands before they reach you:
            designer, manufacturer, distributor, retailer. Each one adds a
            margin. We&rsquo;re the workshop. You&rsquo;re talking directly to
            the people cutting, setting, and polishing your ring.
          </p>
        </div>

        <Reveal className={styles.compare}>
          <div className={styles.them}>
            <p className={styles.colTitle}>A traditional jewelry store</p>
            <ul className={styles.list}>
              {THEM.map((t) => (
                <li key={t} className={styles.item}>
                  <span className={`${styles.mark} ${styles.cross}`} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.us}>
            <p className={styles.usTitle}>Lalo Stylings</p>
            <ul className={styles.list}>
              {US.map((u) => (
                <li key={u} className={`${styles.item} ${styles.itemUs}`}>
                  <span className={`${styles.mark} ${styles.check}`} aria-hidden="true" />
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
