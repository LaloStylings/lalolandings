import styles from "./Footer.module.css";

const SOCIAL = [
  { name: "Instagram", href: "https://www.instagram.com/lalostylings/" },
  { name: "TikTok", href: "https://www.tiktok.com/@lalostylings" },
  {
    name: "Facebook",
    href: "https://www.facebook.com/people/Lalo-Stylings/61556900092660/",
  },
];

// Deliberately minimal — this is a campaign landing, not a home page. Only
// trust-building links stay (physical address, real contact, socials); every
// other link would be a leak of paid traffic. Phone/address/email still pending.
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <a href="#top" className={styles.logoLink}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logotipos/lalostylings-logo.svg"
                alt="Lalo Stylings"
                width={1809}
                height={793}
                className={styles.logo}
              />
            </a>
            <p className={styles.tagline}>
              Handcrafted fine jewelry, made to order in Downtown Los Angeles.
            </p>
          </div>

          <div className={styles.col}>
            <p className={styles.colHead}>Studio</p>
            {/* Placeholder — real street address pending. */}
            <p className={styles.placeholder}>
              [ Studio address ]
              <br />
              Los Angeles, CA
            </p>
          </div>

          <div className={styles.col}>
            <p className={styles.colHead}>Contact</p>
            {/* Placeholders — the current +213 number is an Algeria code and
                must be replaced with the real LA number. */}
            <span className={styles.placeholderLink}>[ Phone ]</span>
            <span className={styles.placeholderLink}>[ Email ]</span>
            <span className={styles.placeholderLink}>[ WhatsApp ]</span>
          </div>

          <div className={styles.col}>
            <p className={styles.colHead}>Follow</p>
            {SOCIAL.map((s) => (
              <a
                key={s.name}
                href={s.href}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Lalo Stylings on ${s.name}`}
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        <p className={styles.legal}>
          {/* Privacy Policy link pending a real page — plain text, no dead href="#". */}
          &copy; 2026 Lalo Stylings · Privacy Policy · Designed by SCNDAL
        </p>
      </div>
    </footer>
  );
}
