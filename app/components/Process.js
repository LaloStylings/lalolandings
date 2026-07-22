import Reveal from "./Reveal";
import styles from "./Process.module.css";

const STEPS = [
  {
    n: "01",
    title: "Share Your Vision",
    body: "A sketch, a photo, or just a feeling. Bring us what you have. Your first consultation is free, with no obligation to go further.",
  },
  {
    n: "02",
    title: "Perfect the Design",
    body: "We turn your idea into a photorealistic 3D model and refine it together: the stone, the setting, the metal, as many times as you need. Nothing is crafted, and you’re not committed, until you approve it.",
  },
  {
    n: "03",
    title: "We Craft Your Piece",
    body: "Once you approve, your piece is cast, set, and polished by hand in our LA workshop, with updates as it comes to life.",
  },
  {
    n: "04",
    title: "Your Masterpiece Arrives",
    body: "Delivered ready for the moment: packaged, insured, and cared for long after you take it home. Most pieces are ready within two to four weeks of approving the design.",
  },
];

export default function Process() {
  return (
    <section id="process" className="section">
      <div className="container">
        <div className="section-head">
          <span className="chip">The Process</span>
          <h2 className="h2">How It Works</h2>
          <p className="lede">
            Four steps. No surprises, no commitment until you approve the design.
          </p>
        </div>

        <ol className={styles.grid}>
          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.n}
              className={`card ${styles.step}`}
              delay={i * 80}
            >
              <span className={styles.badge}>{step.n}</span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
