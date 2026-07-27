import type { CSSProperties } from 'react';
import type { ContactIconName } from './ContactIcon';

import xpAddress from '../assets/winxp/address.png';
import xpBriefcase from '../assets/winxp/briefcase.png';
import xpCertificate from '../assets/winxp/certificate.png';
import xpClock from '../assets/winxp/clock.png';
import xpComputer from '../assets/winxp/computer.png';
import xpDocuments from '../assets/winxp/documents.png';
import xpEmail from '../assets/winxp/email.png';
import xpFolder from '../assets/winxp/folder.png';
import xpFont from '../assets/winxp/font.png';
import xpHelp from '../assets/winxp/help.png';
import xpInternet from '../assets/winxp/internet.png';
import xpKey from '../assets/winxp/key.png';
import xpLanguage from '../assets/winxp/language.png';
import xpPhone from '../assets/winxp/phone.png';
import xpPictures from '../assets/winxp/pictures.png';
import xpProgrammes from '../assets/winxp/programs.png';
import xpRegion from '../assets/winxp/region.png';
import xpSearch from '../assets/winxp/search.png';
import xpTextdoc from '../assets/winxp/textdoc.png';
import xpUser from '../assets/winxp/user.png';

import w95Address from '../assets/win95/address.png';
import w95Book from '../assets/win95/book.png';
import w95Briefcase from '../assets/win95/briefcase.png';
import w95Calendar from '../assets/win95/calendar.png';
import w95Certificate from '../assets/win95/certificate.png';
import w95Clock from '../assets/win95/clock.png';
import w95Computer from '../assets/win95/computer.png';
import w95Email from '../assets/win95/email.png';
import w95Globe from '../assets/win95/globe.png';
import w95Info from '../assets/win95/info.png';
import w95Key from '../assets/win95/key.png';
import w95Notepad from '../assets/win95/notepad.png';
import w95Paint from '../assets/win95/paint.png';
import w95Phone from '../assets/win95/phone.png';

export type RetroEra = 'xp' | 'w95';

export const XP_ICONS = {
  address: xpAddress,
  briefcase: xpBriefcase,
  certificate: xpCertificate,
  clock: xpClock,
  computer: xpComputer,
  documents: xpDocuments,
  email: xpEmail,
  folder: xpFolder,
  font: xpFont,
  help: xpHelp,
  internet: xpInternet,
  key: xpKey,
  language: xpLanguage,
  phone: xpPhone,
  pictures: xpPictures,
  programs: xpProgrammes,
  region: xpRegion,
  search: xpSearch,
  textdoc: xpTextdoc,
  user: xpUser,
};

export const W95_ICONS = {
  address: w95Address,
  book: w95Book,
  briefcase: w95Briefcase,
  calendar: w95Calendar,
  certificate: w95Certificate,
  clock: w95Clock,
  computer: w95Computer,
  email: w95Email,
  globe: w95Globe,
  info: w95Info,
  key: w95Key,
  notepad: w95Notepad,
  paint: w95Paint,
  phone: w95Phone,
};

const XP_CONTACT: Record<string, string> = {
  email: xpEmail,
  phone: xpPhone,
  location: xpRegion,
  website: xpInternet,
  portfolio: xpInternet,
  github: xpComputer,
  gitlab: xpComputer,
  linkedin: xpAddress,
  stackoverflow: xpHelp,
  youtube: xpPictures,
  instagram: xpPictures,
  dribbble: xpPictures,
  behance: xpPictures,
  facebook: xpUser,
  x: xpUser,
  discord: xpUser,
  hackthebox: xpKey,
  custom: xpInternet,
};

const W95_CONTACT: Record<string, string> = {
  email: w95Email,
  phone: w95Phone,
  location: w95Globe,
  website: w95Globe,
  portfolio: w95Globe,
  github: w95Computer,
  gitlab: w95Computer,
  linkedin: w95Address,
  stackoverflow: w95Book,
  youtube: w95Paint,
  instagram: w95Paint,
  dribbble: w95Paint,
  behance: w95Paint,
  facebook: w95Address,
  x: w95Address,
  discord: w95Address,
  hackthebox: w95Key,
  custom: w95Globe,
};

const XP_SECTION: Record<string, string> = {
  experience: xpBriefcase,
  education: xpFont,
  skills: xpProgrammes,
  languages: xpLanguage,
  projects: xpFolder,
  certifications: xpCertificate,
  custom: xpTextdoc,
};

const W95_SECTION: Record<string, string> = {
  experience: w95Briefcase,
  education: w95Book,
  skills: w95Paint,
  languages: w95Globe,
  projects: w95Notepad,
  certifications: w95Certificate,
  custom: w95Info,
};

export function getContactIconSrc(era: RetroEra, icon: ContactIconName | string): string {
  const table = era === 'xp' ? XP_CONTACT : W95_CONTACT;
  return table[icon] ?? table.custom!;
}

export function getSectionIconSrc(era: RetroEra, sectionType: string): string {
  const table = era === 'xp' ? XP_SECTION : W95_SECTION;
  return table[sectionType] ?? table.custom!;
}

export default function RetroIcon({
  size = 16,
  src,
  style,
}: {
  size?: number;
  src: string;
  style?: CSSProperties;
}) {
  return (
    <img
      src={src}
      alt=""
      style={{
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        imageRendering: 'auto',
        display: 'block',
        ...style,
      }}
    />
  );
}
