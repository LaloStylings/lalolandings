// Inline SVG icons for the quote builder cards. No external files, no next/image:
// they inherit color via currentColor and weigh almost nothing. 64x64 viewBox,
// rendered at 48px. Referenced from quoteSteps.js.

function Svg(props) {
  return (
    <svg
      viewBox="0 0 64 64"
      width="48"
      height="48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export function RingIcon(props) {
  return (
    <Svg {...props}>
      <ellipse cx="32" cy="36" rx="18" ry="20" />
      <ellipse cx="32" cy="36" rx="12" ry="14" />
    </Svg>
  );
}

export function EngagementRingIcon(props) {
  return (
    <Svg {...props}>
      <ellipse cx="32" cy="40" rx="16" ry="17" />
      <ellipse cx="32" cy="40" rx="10.5" ry="11.5" />
      <path d="M25.5 17.5h13L44 24l-12 8-12-8 5.5-6.5Z" />
      <path d="M20 24h24M25.5 17.5 32 32M38.5 17.5 32 32" />
    </Svg>
  );
}

export function WeddingBandIcon(props) {
  return (
    <Svg {...props}>
      <ellipse cx="32" cy="32" rx="18" ry="21" />
      <ellipse cx="32" cy="32" rx="12.5" ry="15" />
      <path d="M32 11v6M25 12.4l1.6 5.8M39 12.4l-1.6 5.8" />
    </Svg>
  );
}

export function BraceletIcon(props) {
  return (
    <Svg {...props}>
      <ellipse cx="32" cy="32" rx="21" ry="15" />
      <circle cx="32" cy="17.2" r="3.1" />
      <circle cx="32" cy="46.8" r="3.1" />
      <circle cx="11.4" cy="32" r="2.6" />
      <circle cx="52.6" cy="32" r="2.6" />
      <circle cx="17.5" cy="21" r="2.2" />
      <circle cx="46.5" cy="21" r="2.2" />
      <circle cx="17.5" cy="43" r="2.2" />
      <circle cx="46.5" cy="43" r="2.2" />
    </Svg>
  );
}

export function NecklaceIcon(props) {
  return (
    <Svg {...props}>
      <path d="M14 14c0 16 8 26 18 26s18-10 18-26" />
      <path d="M27 40.5h10L40 47l-8 9-8-9 3-6.5Z" />
      <path d="M24 47h16M27 40.5 32 56M37 40.5 32 56" />
    </Svg>
  );
}

export function EarringsIcon(props) {
  return (
    <Svg {...props}>
      <path d="M20 14a5.5 5.5 0 1 1 0 8" />
      <path d="M20 22v7" />
      <path d="M15.5 29h9L27 35l-6.5 12L14 35l1.5-6Z" />
      <path d="M44 14a5.5 5.5 0 1 0 0 8" />
      <path d="M44 22v7" />
      <path d="M39.5 29h9L51 35l-6.5 12L38 35l1.5-6Z" />
    </Svg>
  );
}

export function NotSureIcon(props) {
  return (
    <Svg {...props}>
      <path d="M22 20h20l6 9-16 17-16-17 6-9Z" />
      <path d="M16 29h32M22 20l10 26M42 20 32 46" />
    </Svg>
  );
}
