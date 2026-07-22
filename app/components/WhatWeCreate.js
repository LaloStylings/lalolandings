import Reveal from "./Reveal";
import MediaFrame from "./MediaFrame";
import styles from "./WhatWeCreate.module.css";

const ITEMS = [
  {
    title: "Bespoke Jewelry Design",
    body: "Start from a blank page. We guide you through 3D modeling and stone selection until the design on screen is the one in your head.",
    image: "/bespoke.webp",
    alt: "A bespoke chain-link bracelet mixing polished gold and diamond-pavé links with a central round diamond, presented in a green velvet box",
  },
  {
    title: "Engagement & Wedding Rings",
    body: "The piece she’ll wear every day for the rest of her life. GIA-certified diamonds and ethically sourced gemstones, set by hand.",
    image: "/engagement.webp",
    alt: "A hand wearing a custom princess-cut diamond engagement ring with a pavé band and matching diamond wedding band",
  },
  {
    title: "Re-Create an Heirloom",
    body: "That ring in the drawer nobody wears. We reset the stones and transform old gold into something she’ll actually put on.",
    image: "/re-create.webp",
    alt: "A Lalo Stylings jeweler modeling a ring in 3D CAD software and sketching it by hand while re-creating a piece",
  },
  {
    title: "Bracelets & Fine Gifts",
    body: "Personalized bracelets and necklaces for the milestones that deserve more than a gift card.",
    image: "/bracelets.webp",
    alt: "A diamond tennis bracelet in gold worn on the wrist, catching the sunlight",
  },
];

export default function WhatWeCreate() {
  return (
    <section id="what-we-create" className="section">
      <div className={`container ${styles.wide}`}>
        <div className="section-head">
          <span className="chip">What We Create</span>
          <h2 className="h2">What Can We Create Together?</h2>
          <p className="lede">
            Custom engagement rings, bespoke designs, fine gifts, and heirloom
            upgrades, all crafted by hand in our Los Angeles studio.
          </p>
        </div>

        <div className={styles.grid}>
          {ITEMS.map((item, i) => (
            <Reveal
              key={item.title}
              className={`card ${styles.card}`}
              delay={i * 80}
            >
              <div className={styles.media}>
                <MediaFrame
                  src={item.image}
                  alt={item.alt}
                  ratio="4 / 3"
                  zoom
                  loading="lazy"
                  sizes="(max-width: 860px) 50vw, 25vw"
                />
              </div>
              <div className={styles.body}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.copy}>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
