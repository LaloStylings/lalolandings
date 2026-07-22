import Image from "next/image";
import styles from "./MediaFrame.module.css";

/**
 * A fixed-ratio, rounded media slot.
 *
 * When a real photo exists, pass `src` and it renders through next/image with
 * `fill`. Until then it renders an EXPLICIT placeholder marking where the photo
 * goes. Swapping in the real image is a one-prop change.
 *
 * @param {string} [src]      image source (omit to show the placeholder)
 * @param {string} alt        required descriptive alt text for the real photo
 * @param {string} label      short note shown on the placeholder
 * @param {string} [ratio]    CSS aspect-ratio, e.g. "4 / 5" (default "1 / 1")
 * @param {boolean} [stretch] fill the parent's height instead of holding a ratio
 * @param {string} [radius]   CSS border-radius (default var(--r-md); "0" = full bleed)
 * @param {boolean} [zoom]    subtle scale-up of the image on hover of the frame
 * @param {string} [sizes]    next/image sizes hint
 * @param {boolean} [priority] eager-load (use for the hero only)
 * @param {string} [objectPosition] CSS object-position for the image (default "center")
 * @param {"dark"|"light"} [tone] placeholder tone
 */
export default function MediaFrame({
  src,
  alt,
  label,
  ratio = "1 / 1",
  stretch = false,
  radius = "var(--r-md)",
  zoom = false,
  sizes = "(max-width: 720px) 100vw, 50vw",
  priority = false,
  loading,
  objectPosition = "center",
  tone = "light",
  hideLabel = false,
  className = "",
}) {
  const style = stretch
    ? { height: "100%", borderRadius: radius }
    : { aspectRatio: ratio, borderRadius: radius };

  return (
    <div
      className={`${styles.frame} ${zoom ? styles.zoom : ""} ${className}`}
      style={style}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : loading}
          className={styles.img}
          style={{ objectFit: "cover", objectPosition }}
        />
      ) : hideLabel ? (
        // Decorative background: just the tone, no marker text (it would show
        // through a translucent overlay and clash with the content on top).
        <div
          className={`${styles.placeholder} ${
            tone === "dark" ? styles.dark : ""
          }`}
          aria-hidden="true"
        />
      ) : (
        <div
          className={`${styles.placeholder} ${
            tone === "dark" ? styles.dark : ""
          }`}
          role="img"
          aria-label={`Photo placeholder: ${label}`}
        >
          <span className={styles.diamond} aria-hidden="true" />
          <span className={styles.tag}>Photo</span>
          <span className={styles.note}>{label}</span>
        </div>
      )}
    </div>
  );
}
