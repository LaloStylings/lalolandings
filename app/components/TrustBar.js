import Reveal from "./Reveal";
import styles from "./TrustBar.module.css";

// Real, verifiable claims only (no Google-review or piece-count stats the
// business can't substantiate). Long text values (`long`) render one size down
// so all four cells read as the same visual tier.
const STATS = [
  { value: "31", label: "Years of craftsmanship" },
  { value: "GIA", label: "Certified diamonds" },
  { value: "2 to 4 weeks", label: "Average delivery", long: true },
  { value: "Free Consultation", long: true },
];

export default function TrustBar() {
  return (
    <section className={`surface-white ${styles.section}`} aria-label="At a glance">
      <Reveal className={`container ${styles.grid}`}>
        {STATS.map((s) => (
          <div key={s.value} className={styles.item}>
            <span className={`${styles.value} ${s.long ? styles.valueLong : ""}`}>
              {s.value}
            </span>
            {s.label && <span className={styles.label}>{s.label}</span>}
          </div>
        ))}
      </Reveal>
    </section>
  );
}
