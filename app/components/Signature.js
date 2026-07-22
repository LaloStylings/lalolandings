/**
 * The recurring brand mark: a green hairline with a rotated diamond at center.
 * Used as the divider between sections. `onGreen` draws it in hueso instead.
 */
export default function Signature({ onGreen = false }) {
  return (
    <div
      className={`signature${onGreen ? " signature--on-green" : ""}`}
      aria-hidden="true"
    >
      <span className="signature__diamond" />
    </div>
  );
}
