import Reveal from "./Reveal";
import styles from "./TrustBar.module.css";

// Social proof for cold traffic. Pending stats render as explicit placeholders
// rather than invented numbers.
const STATS = [
  { value: "4.9 ★", label: "Google reviews", pending: true },
  { value: "30+", label: "Years of craftsmanship" },
  { value: "GIA", label: "Certified diamonds" },
  { value: "###", label: "Pieces handcrafted", pending: true },
];

export default function TrustBar() {
  return (
    <section className={`surface-white ${styles.section}`} aria-label="At a glance">
      <Reveal className={`container ${styles.grid}`}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.item}>
            {s.pending ? (
              <span className={`chip ${styles.pendingChip}`}>Pending</span>
            ) : (
              <span className={styles.value}>{s.value}</span>
            )}
            <span className={styles.label}>{s.label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
