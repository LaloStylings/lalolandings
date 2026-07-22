import Reveal from "./Reveal";
import MediaFrame from "./MediaFrame";
import styles from "./Gallery.module.css";

// Asymmetric grid so it doesn't read like an e-commerce catalogue. Real photos
// from /public/galeria (1–6, in order). SEO-intent alt text, tailored per photo.
const PIECES = [
  {
    key: 1,
    cell: "tall",
    image: "/galeria/1.webp",
    alt: "Handcrafted diamond engagement rings custom made in our Los Angeles studio, styled on white carnations",
  },
  {
    key: 2,
    cell: "sq",
    image: "/galeria/2.webp",
    alt: "Handcrafted white gold diamond engagement rings and wedding bands, custom made in our Los Angeles studio",
  },
  {
    key: 3,
    cell: "sq",
    image: "/galeria/3.webp",
    alt: "Handcrafted yellow gold ring with green gemstones, custom made in our Los Angeles studio",
  },
  {
    key: 4,
    cell: "sq",
    image: "/galeria/4.webp",
    alt: "Handcrafted toi et moi ring with a pear-cut diamond and emerald-cut green gemstone, custom made in our Los Angeles studio",
  },
  {
    key: 5,
    cell: "sq",
    image: "/galeria/5.webp",
    alt: "Handcrafted gold drop earrings with blue, green and pink gemstones, custom made in our Los Angeles studio",
  },
  {
    key: 6,
    cell: "sq",
    image: "/galeria/6.webp",
    alt: "Handcrafted gold sapphire rings and a textured diamond band, custom made in our Los Angeles studio",
  },
  {
    key: 7,
    cell: "sq",
    image: "/galeria/7.webp",
    alt: "Handcrafted gold necklace set with an array of multicolored gemstones, custom made in our Los Angeles studio",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="section surface-white">
      {/* Header stays in the normal 1180 container. */}
      <div className="container">
        <div className="section-head">
          <span className="chip">Our Work</span>
          <h2 className="h2">Creations That Tell a Story</h2>
          <p className={`lede ${styles.intro}`}>
            We believe custom jewelry should be as unique as the person who wears
            it. Each handcrafted piece in this gallery is a testament to that
            belief, a story of love, celebration, or personal expression, brought
            to life through master craftsmanship in our Los Angeles studio. This
            is more than jewelry; it&rsquo;s a legacy in the making.
          </p>
        </div>
      </div>

      {/* Gallery is wider than the rest of the page so the pieces shine. */}
      <Reveal className={styles.galleryWrap}>
        <div className={styles.grid}>
          {PIECES.map((p) => (
            <div key={p.key} className={styles[p.cell]}>
              <MediaFrame
                src={p.image}
                alt={p.alt}
                stretch
                zoom
                radius="var(--r-lg)"
                loading="lazy"
                sizes="(max-width: 460px) 100vw, (max-width: 860px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
