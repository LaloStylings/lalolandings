import { FAQ_ITEMS } from "./faqData";
import styles from "./Faq.module.css";

// The price objection is resolved by angle (same budget = better stone, because
// no markup), never a number. Native <details> = accessible, zero JS.
// Copy lives in faqData.js so the FAQPage JSON-LD stays in sync automatically.
const FAQS = FAQ_ITEMS;

export default function Faq() {
  return (
    <section id="faq" className={`section ${styles.section}`}>
      <div className="container">
        <div className={`section-head ${styles.head}`}>
          <span className="chip">FAQ</span>
          <h2 className="h2">Before You Ask</h2>
        </div>

        <div className={styles.list}>
          {FAQS.map((item, i) => (
            <details
              key={item.q}
              className={styles.item}
              open={i === 0}
              name="faq"
            >
              <summary className={styles.summary}>
                <span className={styles.q}>{item.q}</span>
                <span className={styles.icon} aria-hidden="true" />
              </summary>
              <p className={styles.answer}>
                {item.pending && (
                  <span className={styles.pendingTag}>Pending</span>
                )}
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
