type P = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const IconWhatsApp = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.2-1.36A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.2 8.2 0 1 1 6.95 3.85Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.54.06a6.7 6.7 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.66.31 2.8 2.8 0 0 0-.87 2.08 4.85 4.85 0 0 0 1.02 2.57 11.1 11.1 0 0 0 4.25 3.76c.6.25 1.06.4 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
  </svg>
);
export const IconPhone = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </svg>
);
/** Solid handset, the familiar "call" glyph (Material Icons, Apache 2.0). */
export const IconPhoneSolid = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none">
    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
  </svg>
);
export const IconPin = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
export const IconBag = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
export const IconArrow = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconChevron = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const IconClose = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconPlus = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconMinus = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14" />
  </svg>
);
export const IconSearch = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
export const IconClock = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const IconUsers = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" />
  </svg>
);
export const IconCalendar = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);
export const IconMenu = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);
export const IconStar = ({ size = 16, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none">
    <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.1l-5.7 3.2 1.2-6.4L2.8 9.5l6.4-.8L12 2.8Z" />
  </svg>
);
export const IconFlame = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21c4 0 7-2.7 7-6.6 0-4.4-3.9-6.1-4.5-10.4-2.6 1.7-3.8 4.2-3.5 6.8-1.4-.6-2.3-1.8-2.5-3.3C6.6 9 5 11.4 5 14.4 5 18.3 8 21 12 21Z" />
  </svg>
);

/* Brand marks for social links */
export const IconTikTok = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none">
    <path d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
  </svg>
);
export const IconInstagram = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
export const IconFacebook = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none">
    <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.93.26-1.56 1.6-1.56h1.7V4.08A23 23 0 0 0 14.3 4c-2.46 0-4.14 1.5-4.14 4.25v2.36H7.4v3.2h2.76V22h3.34Z" />
  </svg>
);
