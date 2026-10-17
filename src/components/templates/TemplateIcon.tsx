import type { CSSProperties, ReactNode } from 'react';
import type { TemplateId } from '../../types/cv';
// XP flag extracted from Microsoft's Windows XP Home Edition box artwork:
// https://download.microsoft.com/download/e/0/2/e02793e2-ab82-4763-9ed5-03789e0d8815/MS_Box_Windows_XP_Home.pdf
import windowsXpFlag from '../../assets/template-logos/windows-xp-flag.png';
// Windows 95 mark by Microsoft, via NoZombie55, Wikimedia Commons, CC BY-SA 4.0.
// https://commons.wikimedia.org/wiki/File:Windows_logo_(1992-2001)_(199x200).svg
import windows95Flag from '../../assets/template-logos/windows-95-flag.svg?url';
import { TEMPLATE_THEMES } from './templateCatalog';

const ICONS: Record<TemplateId, ReactNode> = {
  hexon: <>
    <path d="m12 2.5 8 4.7v9.6l-8 4.7-8-4.7V7.2l8-4.7Z" />
    <path d="m12 7.1 4 2.3v4.8l-4 2.4-4-2.4V9.4l4-2.3Z" />
  </>,
  beacon: <>
    <path d="M8 21h8M9 18h6l-1.2-9h-3.6L9 18Z" />
    <path d="M10 9V6h4v3M12 2v2M5 5l2 2m12-2-2 2M4 10h3m10 0h3" />
    <path d="M10.5 12.5h3" />
  </>,
  meridian: <>
    <path d="M3 5h8v2H3zM3 9h8v8H3zM3 19h8" />
    <circle cx="16.5" cy="6" r="1.5" />
    <path d="M20 6h1M14 11h7m-7 3h7m-7 3h5m-5 3h7" />
  </>,
  vellum: <>
    <path d="M6 3h8l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M14 3v5h5M8 12h8M8 15h8M8 18h5" />
    <path d="M4 7H2v13a2 2 0 0 0 2 2h12" />
  </>,
  toon: <>
    <path d="M4 5h16v12h-8l-5 4v-4H4V5Z" />
    <path d="m14 7 .9 2.4 2.6.1-2 1.6.7 2.5-2.2-1.5-2.2 1.5.7-2.5-2-1.6 2.6-.1L14 7Z" />
    <circle cx="7" cy="9" r=".6" fill="currentColor" />
  </>,
  scribe: <>
    <path d="m5 18 2.2-5.2L17.8 2.2l4 4L11.2 16.8 6 19l-1-1Z" />
    <path d="m15.7 4.3 4 4M5 22h14M8 13l3 3" />
  </>,
  corvus: <>
    <path d="m4.2 8.2 2.7-4.1L12 2.8l4.1 2 4.2 3.9-1.7 4.1.8 4.5-4.5 3.6-4.1-1-4.1 1.3-4.2-3.5-1.1-4.2 2.8-5.3Z" fill="#252525" stroke="#111" strokeWidth=".8" />
    <path d="m6.9 4.1 5.1-1.3-1.5 5.8-6.3-.4 2.7-4.1Z" fill="#4a4a4a" stroke="none" />
    <path d="m12 2.8 4.1 2 4.2 3.9-4.5 2.1-5.3-2.2L12 2.8Z" fill="#343434" stroke="none" />
    <path d="m4.2 8.2 6.3.4-1.7 6.2-4.3 2.9-1.1-4.2 2.8-5.3Z" fill="#1a1a1a" stroke="none" />
    <path d="m10.5 8.6 5.3 2.2.3 5.7-5.1 1.5-2.2-3.2 1.7-6.2Z" fill="#2d2d2d" stroke="none" />
    <path d="m15.8 10.8 4.5-2.1-1.7 4.1.8 4.5-4.5 3.6-1.1-2.9 2.3-1.5-.3-5.7Z" fill="#111" stroke="none" />
    <path d="m6.9 4.1 3.6 4.5-1.7 6.2m3.2-12-1.5 5.8 5.3 2.2 4.5-2.1m-4.5 2.1.3 5.7-5.1 1.5m-2.2-3.2-4.3 2.9m12.9-1.2 3.3 1.8" fill="none" stroke="#656565" strokeWidth=".65" strokeLinejoin="round" />
    <path d="m4.2 8.2 2.7-4.1L12 2.8l4.1 2 4.2 3.9-1.7 4.1.8 4.5-4.5 3.6-4.1-1-4.1 1.3-4.2-3.5-1.1-4.2 2.8-5.3Z" fill="none" stroke="#111" strokeWidth=".8" strokeLinejoin="round" />
  </>,
  windows: <g stroke="none">
    <image href={windowsXpFlag} x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid meet" />
  </g>,
  retro95: <>
    <image href={windows95Flag} x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid meet" />
  </>,
  dossier: <>
    <path d="M3 6h7l2 2h9v11H3V6Z" />
    <path d="M3 9h18M6 12h12M6 15h9M6 18h11" />
    <path d="M7 3h14v3" />
  </>,
  modern: <>
    <circle cx="7" cy="8" r="4" />
    <path d="M2.5 20c.2-4.3 2-6.5 4.5-6.5s4.3 2.2 4.5 6.5M14 6h7m-7 4h7m-7 4h7m-7 4h5" />
  </>,
  classic: <>
    <path d="M3 20h18M5 18V8m4 10V8m6 10V8m4 10V8M3 7l9-4 9 4H3Z" />
    <path d="M4 21h16" />
  </>,
  minimal: <>
    <path d="M4 6h7m4 0h5M4 12h16M4 18h11" />
    <circle cx="13" cy="6" r="1.5" fill="currentColor" />
    <path d="M18 17v2" />
  </>,
  creative: <>
    <path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 1.7-4.4 1.7 1.7 0 0 1 1.1-3H19a2 2 0 0 0 2-2c0-4.7-4-8.6-9-8.6Z" />
    <circle cx="7.5" cy="10" r=".8" fill="currentColor" />
    <circle cx="11" cy="7" r=".8" fill="currentColor" />
    <circle cx="15.5" cy="8" r=".8" fill="currentColor" />
  </>,
  professional: <>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
    <path d="m12 10 2 1.2v2.2l-2 1.2-2-1.2v-2.2l2-1.2Z" />
  </>,
  executive: <>
    <path d="m3 9 4 3 5-7 5 7 4-3-2 10H5L3 9Z" />
    <path d="M5 22h14M8 16v3m4-3v3m4-3v3" />
    <circle cx="7" cy="8" r="1" fill="currentColor" />
    <circle cx="12" cy="4" r="1" fill="currentColor" />
    <circle cx="17" cy="8" r="1" fill="currentColor" />
  </>,
  slate: <>
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <path d="M7 8h10M7 12h7m-7 4h10" />
    <path d="m16 12 1.5 1.5L21 10" />
  </>,
  sarif: <>
    <path d="m12 2.2 8.2 4.6v10.4L12 21.8l-8.2-4.6V6.8L12 2.2Z" />
    <path d="m12 4.5 6.2 3.4v8.2L12 19.5l-6.2-3.4V7.9L12 4.5Z" />
    <path d="m9 8.1 3-1.4 3 1.4 1 3.1-1.1 4.2L12 17l-2.9-1.6L8 11.2l1-3.1Z" />
    <path d="M9.3 11h1.8m1.8 0h1.8M10 14.1h4M3.8 7.2H6m12 0h2.2M3.8 16.8H6m12 0h2.2" />
  </>,
  ivory: <>
    <path d="M3 5c3-1 6 0 9 2v14c-3-2-6-3-9-2V5Zm18 0c-3-1-6 0-9 2v14c3-2 6-3 9-2V5Z" />
    <path d="M6 9c1 0 2 .2 3 .7M6 12c1 0 2 .2 3 .7m9-3.4c-1 0-2 .2-3 .7m3 2.3c-1 0-2 .2-3 .7" />
  </>,
  summit: <>
    <path d="m12 2.5 9 5.2v8.6l-9 5.2-9-5.2V7.7l9-5.2Z" />
    <path d="m3.5 7.9 8.5 5 8.5-5M12 12.9v8.2M12 2.5v5.1" />
  </>,
  studio: <>
    <rect x="2.5" y="4" width="19" height="16" rx="2" />
    <path d="M3 8h18M6 6h.01M8.5 6h.01m2.5 6-2 2 2 2m3 0 2-2-2-2" />
  </>,
  atlas: <>
    <circle cx="11" cy="13" r="8" />
    <path d="M3.5 13h15M11 5a13 13 0 0 1 0 16M11 5a13 13 0 0 0 0 16M16.5 4l1.2-2 1.2 2-1.2 6-1.2-6Z" />
  </>,
  north: <>
    <circle cx="12" cy="12" r="9" />
    <path d="m12 4 2 6-2 10-2-10 2-6Zm-7 8h14M8 8l8 8m0-8-8 8" />
  </>,
  zenith: <>
    <path d="m2.5 19 6-9 3 4 3.2-7 6.8 12H2.5Z" />
    <path d="m8.5 10 2-3m4.2 0 1.1-2M6 19l5-5m5-7 3 5" />
    <path d="M17.5 3v2m3 1.5-1.5 1.5" />
  </>,
  editorial: <>
    <path d="M3 4h18v16H3zM3 9h18M6 7h5" />
    <path d="M6 12h5v6H6zm8 0h4m-4 3h4m-4 3h4" />
  </>,
  vertex: <>
    <path d="m3 5 6 7-6 7m7-14 6 7-6 7m7-14 6 7-6 7" />
  </>,
  harbor: <>
    <path d="M3 20h18M5 18V9h14v9M8 18v-5m4 5v-5m4 5v-5M3 8l9-5 9 5H3Z" />
    <path d="M6 22c2-1 4-1 6 0 2-1 4-1 6 0" />
  </>,
  quartz: <>
    <path d="m12 2 8 5-2 11-6 4-6-4L4 7l8-5Z" />
    <path d="m4 7 8 3 8-3m-8 3v12m-6-7 6-5 6 5M8 4l4 6 4-6" />
  </>,
  cobalt: <>
    <path d="M3 4h18v16H3zM3 9h18M12 9v11" />
    <path d="M6 6.5h6M15 12h3m-3 3h3m-9-3H6m0 3h3m-3 3h4" />
  </>,
  linen: <>
    <path d="M4 3v18M8 3v18M12 3v18M16 3v18M20 3v18M3 5h18M3 9h18M3 13h18M3 17h18M3 21h18" />
    <path d="M4 5h4v4H4zm8 0h4v4h-4zm-4 8h4v4H8zm8 0h4v4h-4z" fill="currentColor" opacity=".15" />
  </>,
  praxis: <>
    <path d="M12 4v15M5 7h14M8 7l-4 7h8L8 7Zm8 0-4 7h8l-4-7ZM8 21h8" />
    <circle cx="12" cy="4" r="1.5" />
  </>,
  portrait: <>
    <path d="M4 3h16v18H4z" />
    <circle cx="12" cy="9" r="3" />
    <path d="M6.5 19c.4-3.5 2.2-5.3 5.5-5.3s5.1 1.8 5.5 5.3" />
  </>,
  insignia: <>
    <circle cx="12" cy="10" r="7" />
    <path d="m8 16-1 6 5-2 5 2-1-6m-4-10 1.3 2.6 2.9.4-2.1 2 .5 2.9L12 12.5l-2.6 1.4.5-2.9-2.1-2 2.9-.4L12 6Z" />
  </>,
  bulletin: <>
    <path d="M3 4h18v16H3zM3 8h18" />
    <path d="M6 11h5v6H6zm8 0h4m-4 3h4m-4 3h4" />
    <path d="M6 6h4" />
  </>,
  verso: <>
    <path d="M6 3h12v18H6z" fill="currentColor" opacity=".1" />
    <path d="M6 3h12v18H6zM12 3v18M9 7h1m5 0h1M9 11h1m5 0h1M9 15h1m5 0h1" />
  </>,
  granite: <>
    <path d="m4 8 5-5h7l4 6-2 10-7 3-8-6 1-8Z" />
    <path d="m4 8 7 2 8-1m-8 1 0 12m0-12 5-7m-5 7-7 7m15-8-8 1 6 9" />
  </>,
  palladio: <>
    <path d="M2 8 12 3l10 5H2ZM4 20h16M6 9v9m4-9v9m4-9v9m4-9v9M3 21h18" />
    <path d="M8 6h8" />
  </>,
  signal: <>
    <circle cx="12" cy="17" r="2" fill="currentColor" />
    <path d="M12 15V4m-4 5a6 6 0 0 1 8 0m-11-3a10 10 0 0 1 14 0M2 3a14 14 0 0 1 20 0" />
  </>,
  lagoon: <>
    <path d="M3 8c2.2 0 2.2-3 4.5-3S9.8 8 12 8s2.2-3 4.5-3S18.8 8 21 8M3 14c2.2 0 2.2-3 4.5-3s2.3 3 4.5 3 2.2-3 4.5-3 2.3 3 4.5 3M3 20c2.2 0 2.2-3 4.5-3s2.3 3 4.5 3 2.2-3 4.5-3 2.3 3 4.5 3" />
    <circle cx="18" cy="4" r="1.4" fill="currentColor" />
  </>,
};

export default function TemplateIcon({ id }: { id: TemplateId }) {
  const theme = TEMPLATE_THEMES[id];
  const style: CSSProperties = id === 'sarif'
    ? { color: '#d6b354', backgroundColor: '#11110f', borderColor: '#6e582d' }
    : id === 'windows'
      ? { color: '#1b4f8d', backgroundColor: '#edf4fb', borderColor: '#9bb9d5' }
      : id === 'retro95'
        ? { color: '#000080', backgroundColor: '#c0c0c0', borderColor: '#666' }
        : id === 'corvus'
          ? { color: '#202020', backgroundColor: '#e7e7e7', borderColor: '#777' }
          : { color: theme.accentDark, backgroundColor: theme.accentSoft };

  return (
    <span className="template-list-card__icon" style={style} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" focusable="false">
        {ICONS[id]}
      </svg>
    </span>
  );
}
