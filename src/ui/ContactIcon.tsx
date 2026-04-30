import type { SVGProps } from 'react';
import type { SocialPlatform } from '../types/cv';

export type ContactIconName = 'email' | 'phone' | 'location' | SocialPlatform;

interface ContactIconProps extends SVGProps<SVGSVGElement> {
  name: ContactIconName;
}

export default function ContactIcon({ name, ...props }: ContactIconProps) {
  const baseProps = {
    viewBox: '0 0 24 24',
    'aria-hidden': 'true',
    ...props,
  } as const;

  switch (name) {
    case 'email':
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.25" y="5.25" width="17.5" height="13.5" rx="2.75" />
          <path d="m4.75 7 7.25 5.4L19.25 7" />
        </svg>
      );

    case 'phone':
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.9 4.6c.6-.6 1.5-.8 2.2-.4l1.9 1.1c.7.4 1 1.3.8 2l-.6 2c-.1.4 0 .9.3 1.2l1.8 1.8c.3.3.8.4 1.2.3l2-.6c.8-.2 1.6.1 2 .8l1.1 1.9c.4.7.2 1.6-.4 2.2l-1.6 1.6c-.9.9-2.2 1.2-3.4.8-3.2-1-6.2-3.7-8.3-5.9-2.2-2.1-4.9-5.1-5.9-8.3-.4-1.2-.1-2.5.8-3.4Z" />
        </svg>
      );

    case 'location':
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20.3s6-5.55 6-10.1a6 6 0 1 0-12 0c0 4.55 6 10.1 6 10.1Z" />
          <circle cx="12" cy="10.2" r="2.35" />
        </svg>
      );

    case 'github':
      return (
        <svg {...baseProps} fill="currentColor">
          <path d="M12 2.2c-5.4 0-9.8 4.38-9.8 9.8 0 4.32 2.8 7.98 6.68 9.28.49.09.67-.21.67-.47 0-.23-.01-.99-.01-1.8-2.72.59-3.29-1.15-3.29-1.15-.44-1.12-1.08-1.42-1.08-1.42-.88-.61.07-.6.07-.6.97.07 1.48 1 1.48 1 .87 1.48 2.27 1.06 2.82.81.09-.63.34-1.06.61-1.3-2.17-.25-4.45-1.09-4.45-4.85 0-1.07.38-1.95 1-2.64-.1-.25-.43-1.26.1-2.63 0 0 .82-.26 2.69 1a9.44 9.44 0 0 1 4.9 0c1.87-1.26 2.69-1 2.69-1 .53 1.37.2 2.38.1 2.63.62.69 1 1.57 1 2.64 0 3.77-2.29 4.6-4.47 4.84.35.31.67.93.67 1.88 0 1.36-.01 2.45-.01 2.78 0 .26.18.57.68.47A9.82 9.82 0 0 0 21.8 12c0-5.42-4.4-9.8-9.8-9.8Z" />
        </svg>
      );

    case 'custom':
      return (
        <svg {...baseProps} fill="currentColor">
          <circle cx="12" cy="12" r="4" />
        </svg>
      );

    case 'linkedin':
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
          <circle cx="8.1" cy="9" r="1.1" fill="currentColor" stroke="none" />
          <path d="M7.1 11.3v5.6" />
          <path d="M11.2 16.9v-5.6" />
          <path d="M11.2 13.1c0-1 1-1.8 2.1-1.8s2.1.8 2.1 1.8v3.8" />
        </svg>
      );

    case 'gitlab':
      return (
        <svg {...baseProps} fill="currentColor">
          <path d="M12 21 15.6 9.9H8.4L12 21Z" />
          <path d="m5.1 9.9 2.1 6.6L8.4 9.9H5.1Z" opacity="0.88" />
          <path d="m18.9 9.9-2.1 6.6-1.2-6.6h3.3Z" opacity="0.88" />
          <path d="M5.1 9.9 8 3.5a.55.55 0 0 1 1.03.1l1.17 6.3H5.1Z" opacity="0.76" />
          <path d="m18.9 9.9-2.9-6.4a.55.55 0 0 0-1.03.1L13.8 9.9h5.1Z" opacity="0.76" />
        </svg>
      );

    case 'hackthebox':
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 2.9 7.2 4.15v8.3L12 19.5l-7.2-4.15v-8.3L12 2.9Z" />
          <path d="M9 8.8h5.2v6.4H9Z" />
          <path d="m14.2 12 2.2-2.2" />
        </svg>
      );

    case 'instagram':
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4.1" y="4.1" width="15.8" height="15.8" rx="4.6" />
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="17" cy="7.2" r="1" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'facebook':
      return (
        <svg {...baseProps} fill="currentColor">
          <path d="M12 2.75a9.25 9.25 0 1 0 0 18.5 9.25 9.25 0 0 0 0-18.5Zm1.78 6.2h-1.26c-.34 0-.57.24-.57.64v1.33h1.8l-.29 1.9h-1.51v4.43h-1.97v-4.43H8.5v-1.9h1.48V9.37c0-1.48.9-2.62 2.78-2.62h1.02v2.2Z" />
        </svg>
      );

    case 'x':
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 4.5 19 19.5" />
          <path d="M19 4.5 5 19.5" />
        </svg>
      );

    case 'website':
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.8 12h16.4" />
          <path d="M12 3.5a13.5 13.5 0 0 1 0 17" />
          <path d="M12 3.5a13.5 13.5 0 0 0 0 17" />
        </svg>
      );

    case 'portfolio':
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="6.5" width="17" height="12" rx="2.5" />
          <path d="M9 6.5V5.4A1.9 1.9 0 0 1 10.9 3.5h2.2A1.9 1.9 0 0 1 15 5.4v1.1" />
          <path d="M3.5 11.4h17" />
        </svg>
      );

    case 'dribbble':
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M6.2 6.9c3 1.7 5.5 4.4 7.1 8.3" />
          <path d="M7.2 17.6c2.4-2 5.7-3 9.6-2.9" />
          <path d="M4.1 12.3c4.4.1 8.3-.8 11.9-2.8" />
        </svg>
      );

    case 'behance':
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5.2 7.4h5c1.7 0 2.8 1 2.8 2.3 0 1-.5 1.7-1.4 2 1.1.2 1.9 1.1 1.9 2.5 0 1.8-1.3 3-3.4 3H5.2V7.4Z" />
          <path d="M7.2 9.5h2.6c.8 0 1.2.4 1.2 1s-.4 1-1.2 1H7.2V9.5Z" />
          <path d="M7.2 13.2h2.9c1 0 1.5.4 1.5 1.2 0 .8-.5 1.2-1.5 1.2H7.2v-2.4Z" />
          <path d="M15.5 10.1h4.9" />
          <path d="M16.2 14.7c.3 1 1 1.5 2.1 1.5 1 0 1.6-.3 2-.9" />
          <path d="M20.2 13.4c0-1.6-.8-2.8-2.4-2.8-1.6 0-2.6 1.2-2.6 3 0 1.8 1 3 2.7 3" />
        </svg>
      );

    case 'stackoverflow':
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 18.2h9.7" />
          <path d="M8 14.9h8.7" />
          <path d="m9.2 11.9 7.3 1.5" />
          <path d="m10.6 8.9 6.2 3" />
          <path d="m12.3 6.2 4.2 4.2" />
          <path d="M6 20h12v-4.4" />
        </svg>
      );

    case 'youtube':
      return (
        <svg {...baseProps} fill="currentColor">
          <path d="M20.35 7.25a2.8 2.8 0 0 0-1.97-1.98C16.66 4.8 12 4.8 12 4.8s-4.66 0-6.38.47a2.8 2.8 0 0 0-1.97 1.98c-.46 1.72-.46 4.75-.46 4.75s0 3.03.46 4.75a2.8 2.8 0 0 0 1.97 1.98c1.72.47 6.38.47 6.38.47s4.66 0 6.38-.47a2.8 2.8 0 0 0 1.97-1.98c.46-1.72.46-4.75.46-4.75s0-3.03-.46-4.75ZM10.2 15.5V8.5l5.9 3.5-5.9 3.5Z" />
        </svg>
      );

    case 'discord':
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.1 6.8c2.7-1.2 7.1-1.2 9.8 0 .8 1.3 1.5 2.7 1.9 4.2-.7 1.8-1.8 3.6-3.3 5.2-1-.4-1.8-.8-2.3-1.2l.5-1" />
          <path d="m16.8 15 1.6 1" />
          <path d="M6 11c.4-1.5 1.1-2.9 1.9-4.2" />
          <path d="m7.2 15-1.6 1c1.5 1.6 2.6 2 3.6 2.4l.5-1" />
          <path d="M9.8 11.6h.01" />
          <path d="M14.2 11.6h.01" />
          <path d="M9 14.2c1.6.8 4.4.8 6 0" />
        </svg>
      );

    default:
      return (
        <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8.5" />
        </svg>
      );
  }
}
