import styles from "./Faq.module.css";

// The price objection is resolved by angle (same budget = better stone, because
// no markup), never a number. Native <details> = accessible, zero JS.
// Final answers (delivery time and remote/showroom now resolved). No em dashes.
const FAQS = [
  {
    q: "How much does a custom ring cost?",
    a: "It depends entirely on the stone and the design, which is why we don't publish prices. It would be like quoting a suit without taking measurements. What we can tell you is this: because we're the workshop, you're not paying a retail markup. The same budget that buys a ring at a traditional jeweler buys a noticeably better stone here. Tell us your range and we'll show you exactly what's possible within it, no obligation.",
  },
  {
    q: "How long does it take?",
    a: "Most pieces are ready within two to four weeks from the moment you approve the design. If you have a date in mind, a proposal or an anniversary, tell us early and we'll work to that timeline.",
  },
  {
    q: "What if I don’t like the design?",
    a: "You never get to that point. Before anything is made, you see a photorealistic 3D model of your piece, and we adjust it as many times as needed: the stone, the setting, the metal, the proportions. Nothing is crafted, and you're not committed, until you approve that design.",
  },
  {
    q: "I don’t know anything about diamonds. Is that a problem?",
    a: "Not at all. Most of our clients arrive exactly the same way, and that's what the consultation is for. We'll walk you through cut, clarity and color in plain language, and more importantly, which of those things you actually see with the naked eye and which ones only raise the price. You'll make the decision knowing exactly what you're buying.",
  },
  {
    q: "Can you work with a stone or a ring I already have?",
    a: "Yes, and it's some of our favorite work. We can reuse stones from an inherited piece, melt down old gold, or build something entirely new around an element that already means something to you. Some of the pieces we're proudest of started out sitting in a drawer.",
  },
  {
    q: "Do I have to come to the studio?",
    a: "You don't. We can run the whole process over video and messages, and we ship insured across the United States. That said, if you're in Los Angeles, you're welcome to visit the workshop. Seeing where and how your piece is made changes the experience entirely.",
  },
];

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
