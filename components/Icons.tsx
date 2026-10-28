import Image from "next/image";
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Svg({ children, ...p }: P) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...p}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: P) => (
  <Svg {...p}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </Svg>
);
export const Check = (p: P) => (
  <Svg {...p}>
    <path d="M3.5 8.5l3 3 6-7" />
  </Svg>
);
export const Flag = (p: P) => (
  <Svg {...p}>
    <path d="M3.5 14V2.5M3.5 3h8l-1.5 3 1.5 3h-8" />
  </Svg>
);
export const Cross = (p: P) => (
  <Svg {...p}>
    <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
  </Svg>
);
export const Play = (p: P) => (
  <Svg {...p}>
    <path d="M5 3.5v9l7-4.5z" />
  </Svg>
);
export const FileIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 1.75h5l3 3v9.5H4z" />
    <path d="M9 1.75v3h3" />
  </Svg>
);
export const Folder = (p: P) => (
  <Svg {...p}>
    <path d="M1.75 4.25v8.5h12.5v-7H8L6.5 3.75H1.75z" />
  </Svg>
);
export const Clock = (p: P) => (
  <Svg {...p}>
    <circle cx="8" cy="8" r="6.25" />
    <path d="M8 4.5V8l2.25 1.5" />
  </Svg>
);
export const Chat = (p: P) => (
  <Svg {...p}>
    <path d="M2.25 3.25h11.5v7.5H7l-3.25 2.5v-2.5h-1.5z" />
  </Svg>
);
export const Terminal = (p: P) => (
  <Svg {...p}>
    <path d="M2.5 4l3.5 4-3.5 4M8 12h5.5" />
  </Svg>
);
export const Eye = (p: P) => (
  <Svg {...p}>
    <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" />
    <circle cx="8" cy="8" r="2" />
  </Svg>
);
export const Plus = (p: P) => (
  <Svg {...p}>
    <path d="M8 3v10M3 8h10" />
  </Svg>
);
export const Link = (p: P) => (
  <Svg {...p}>
    <path d="M6.5 9.5l3-3M7 4.5l1.25-1.25a2.5 2.5 0 013.5 3.5L10.5 8M9 11.5l-1.25 1.25a2.5 2.5 0 01-3.5-3.5L5.5 8" />
  </Svg>
);
export const Mail = (p: P) => (
  <Svg {...p}>
    <path d="M1.75 3.5h12.5v9H1.75z" />
    <path d="M2 4l6 4.5L14 4" />
  </Svg>
);

const LOGO_RATIO = 496 / 384;

export function Logo({ size = 22 }: { size?: number }) {
  return <Image src="/logo.png" alt="" width={Math.round(size * LOGO_RATIO)} height={size} loading="eager" unoptimized />;
}
