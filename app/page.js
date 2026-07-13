import { Cormorant_Garamond, Jost } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const label = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata = {
  title: "Lalo Stylings — Bespoke Fine Jewelry",
  description: "Bespoke fine jewelry, crafted in Los Angeles. A new space for your creations is on its way.",
};

const css = `
  .lalo-wrap {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 6vh 24px;
    background: radial-gradient(120% 90% at 50% 0%, #163021 0%, #11231A 46%, #0C1A13 100%);
    color: #EFE9DC;
    overflow: hidden;
    position: relative;
  }
  .lalo-eyebrow {
    font-size: clamp(10px, 1.1vw, 12px);
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: #B79A6B;
    margin: 0 0 34px;
    padding-left: 0.42em;
    opacity: 0;
    animation: lalo-rise 1s ease 0.1s forwards;
  }
  .lalo-mark {
    font-size: clamp(58px, 13vw, 132px);
    line-height: 0.92;
    font-weight: 400;
    letter-spacing: 0.01em;
    margin: 0;
    opacity: 0;
    animation: lalo-rise 1.1s ease 0.28s forwards;
  }
  .lalo-mark span { color: #B79A6B; }
  .lalo-sub {
    font-size: clamp(10px, 1.1vw, 12px);
    letter-spacing: 0.55em;
    text-transform: uppercase;
    color: rgba(239, 233, 220, 0.7);
    margin: 14px 0 0;
    padding-left: 0.55em;
    opacity: 0;
    animation: lalo-rise 1.1s ease 0.42s forwards;
  }
  .lalo-rule {
    position: relative;
    width: 132px;
    height: 1px;
    margin: 40px 0 38px;
    background: linear-gradient(90deg, transparent, #B79A6B 22%, #B79A6B 78%, transparent);
    transform: scaleX(0);
    animation: lalo-draw 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.7s forwards;
  }
  .lalo-rule::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 7px;
    height: 7px;
    background: #B79A6B;
    transform: translate(-50%, -50%) rotate(45deg);
    opacity: 0;
    animation: lalo-jewel 0.7s ease 1.5s forwards;
  }
  .lalo-tag {
    font-size: clamp(20px, 3.4vw, 31px);
    font-weight: 300;
    font-style: italic;
    line-height: 1.35;
    color: #EFE9DC;
    max-width: 22ch;
    margin: 0;
    opacity: 0;
    animation: lalo-rise 1.1s ease 0.9s forwards;
  }
  .lalo-note {
    font-size: clamp(12px, 1.3vw, 14px);
    font-weight: 300;
    letter-spacing: 0.04em;
    color: rgba(239, 233, 220, 0.55);
    margin: 22px 0 0;
    opacity: 0;
    animation: lalo-rise 1.1s ease 1.05s forwards;
  }
  .lalo-link {
    display: inline-block;
    margin-top: 52px;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #B79A6B;
    text-decoration: none;
    padding-bottom: 5px;
    border-bottom: 1px solid rgba(183, 154, 107, 0.35);
    transition: border-color 0.35s ease, color 0.35s ease;
    opacity: 0;
    animation: lalo-rise 1.1s ease 1.2s forwards;
  }
  .lalo-link:hover { color: #EFE9DC; border-color: #EFE9DC; }
  .lalo-link:focus-visible { outline: 2px solid #B79A6B; outline-offset: 6px; }
  @keyframes lalo-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lalo-draw {
    to { transform: scaleX(1); }
  }
  @keyframes lalo-jewel {
    to { opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .lalo-eyebrow, .lalo-mark, .lalo-sub, .lalo-tag, .lalo-note, .lalo-link {
      animation: none; opacity: 1; transform: none;
    }
    .lalo-rule { animation: none; transform: scaleX(1); }
    .lalo-rule::after { animation: none; opacity: 1; }
  }
`;

export default function Page() {
  return (
    <main className={display.className + " lalo-wrap"}>
      <p className={label.className + " lalo-eyebrow"}>
        Bespoke Fine Jewelry — Los Angeles
      </p>
      <h1 className="lalo-mark">LAL<span>O</span></h1>
      <p className={label.className + " lalo-sub"}>Stylings</p>
      <div className="lalo-rule" aria-hidden="true" />
      <p className="lalo-tag">A new space for your creations is being crafted.</p>
      <p className={label.className + " lalo-note"}>
        Estamos afinando cada detalle. Vuelve pronto.
      </p>
      <a className={label.className + " lalo-link"} href="https://lalostylings.com">
        Visit lalostylings.com
      </a>
      <style>{css}</style>
    </main>
  );
}
