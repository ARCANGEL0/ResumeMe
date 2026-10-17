import type { TemplateId } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';

type ThumbnailLayout = 'single' | 'leftRail' | 'rightRail' | 'centered' | 'columns' | 'cards' | 'mosaic' | 'timeline' | 'darkBand' | 'window' | 'desktop' | 'banner';

const LAYOUTS: Record<TemplateId, ThumbnailLayout> = {
  beacon: 'single',
  meridian: 'rightRail',
  vellum: 'columns',
  toon: 'cards',
  scribe: 'columns',
  corvus: 'darkBand',
  windows: 'window',
  retro95: 'desktop',
  dossier: 'timeline',
  modern: 'leftRail',
  classic: 'centered',
  minimal: 'single',
  creative: 'mosaic',
  professional: 'leftRail',
  executive: 'single',
  slate: 'columns',
  sarif: 'leftRail',
  ivory: 'rightRail',
  summit: 'single',
  studio: 'mosaic',
  atlas: 'cards',
  north: 'leftRail',
  zenith: 'timeline',
  editorial: 'columns',
  vertex: 'darkBand',
  harbor: 'leftRail',
  quartz: 'cards',
  cobalt: 'banner',
  linen: 'rightRail',
  praxis: 'columns',
  portrait: 'centered',
  insignia: 'leftRail',
  bulletin: 'banner',
  verso: 'columns',
  granite: 'single',
  palladio: 'centered',
  signal: 'cards',
  hexon: 'leftRail',
  lagoon: 'leftRail',
};

const PHOTO_TEMPLATES = new Set<TemplateId>([
  'modern', 'classic', 'creative', 'professional', 'executive', 'sarif', 'summit', 'studio',
  'atlas', 'zenith', 'editorial', 'vertex', 'harbor', 'quartz', 'cobalt', 'praxis', 'portrait',
  'insignia', 'bulletin', 'verso', 'granite', 'palladio', 'signal', 'scribe', 'corvus', 'windows',
  'retro95', 'beacon', 'meridian', 'vellum', 'toon', 'dossier', 'minimal', 'slate', 'north',
  'linen', 'vertex',
]);

export default function TemplateThumbnail({ id }: { id: TemplateId }) {
  const theme = TEMPLATE_THEMES[id];
  const colors = {
    page: theme.page,
    text: theme.text,
    muted: theme.muted,
    line: theme.line,
    accent: theme.accent,
    accentAlt: theme.accentAlt,
    soft: theme.accentSoft,
    dark: theme.accentDark,
  };
  const showPhoto = PHOTO_TEMPLATES.has(id);

  return (
    <svg viewBox="0 0 84 98" width="100%" height="100%" aria-hidden="true" focusable="false" style={{ display: 'block' }}>
      <rect x="8" y="3" width="68" height="92" rx="2.5" fill="#101820" opacity="0.12" />
      <rect x="7" y="2" width="68" height="92" rx="2.5" fill={colors.page} stroke={colors.line} strokeWidth="0.8" />
      <Artwork id={id} layout={LAYOUTS[id]} colors={colors} showPhoto={showPhoto} />
    </svg>
  );
}

type ArtColors = {
  page: string;
  text: string;
  muted: string;
  line: string;
  accent: string;
  accentAlt: string;
  soft: string;
  dark: string;
};

function Artwork({ id, layout, colors, showPhoto }: { id: TemplateId; layout: ThumbnailLayout; colors: ArtColors; showPhoto: boolean }) {
  const { page, text, muted, line, accent, accentAlt, soft, dark } = colors;
  const photo = showPhoto ? <PhotoMark cx={63} cy={15} fill={accentAlt} line={page} /> : null;

  if (id === 'windows' || id === 'retro95') {
    const isRetro = id === 'retro95';
    return (
      <g>
        <rect x="11" y="7" width="60" height="82" rx={isRetro ? 0 : 3} fill={isRetro ? '#c5c5c5' : '#f8fbff'} stroke={isRetro ? '#595959' : '#7aa9dc'} strokeWidth="1.5" />
        <rect x="12.5" y="8.5" width="57" height="9" fill={isRetro ? '#000080' : '#1467b3'} />
        <circle cx="64" cy="13" r="1.7" fill={isRetro ? '#c5c5c5' : '#f4f7fb'} />
        <rect x="16" y="22" width="15" height="61" fill={isRetro ? '#d7d7d7' : '#e7f0fa'} stroke={isRetro ? '#888' : '#c5d9ed'} strokeWidth="0.8" />
        <rect x="35" y="22" width="31" height="61" fill={page} stroke={line} strokeWidth="0.7" />
        <TextRows x={38} y={29} width={25} color={muted} count={7} gap={6} />
        {isRetro && <><rect x="18" y="27" width="11" height="10" fill="#c5c5c5" stroke="#777" /><rect x="18" y="42" width="11" height="10" fill="#c5c5c5" stroke="#777" /></>}
      </g>
    );
  }

  if (id === 'corvus') {
    return <g>
      <rect x="7.8" y="2.8" width="66.4" height="90.4" rx="2" fill="#15191f" />
      <rect x="12" y="8" width="20" height="78" rx="2" fill="#20252d" />
      <rect x="37" y="10" width="28" height="6" rx="1" fill="#424955" />
      <rect x="37" y="20" width="13" height="2" fill={accentAlt} />
      <SectionMarks x={37} y={28} width={28} color="#555c68" line="#333943" count={5} />
      <PhotoMark cx={22} cy={19} fill="#3d444e" line={accentAlt} />
      <TextRows x={13} y={38} width={18} color="#5a626e" count={5} gap={7} />
    </g>;
  }

  if (layout === 'leftRail') {
    return <g>
      <rect x="7.5" y="2.5" width="19" height="91" fill={id === 'hexon' ? dark : id === 'lagoon' ? accent : soft} />
      {id === 'hexon' && <HexPattern x={9} y={9} color={accentAlt} />}
      {id === 'lagoon' && <path d="M8 55 Q18 43 26 53 V94 H8Z" fill={accentAlt} opacity="0.8" />}
      {photo && <PhotoMark cx={17} cy={15} fill={accentAlt} line={page} small />}
      <TextRows x={10} y={id === 'hexon' || id === 'lagoon' ? 13 : 37} width={14} color={id === 'hexon' || id === 'lagoon' ? '#ffffff' : muted} count={5} gap={7} />
      <NameMark x={32} y={13} width={35} color={dark} accent={accent} />
      <SectionMarks x={32} y={31} width={35} color={muted} line={line} count={6} />
      {id !== 'hexon' && id !== 'lagoon' && <path d="M32 76H67" stroke={accentAlt} strokeWidth="1.2" />}
    </g>;
  }

  if (layout === 'rightRail') {
    return <g>
      <NameMark x={12} y={14} width={39} color={dark} accent={accent} />
      <SectionMarks x={12} y={32} width={39} color={muted} line={line} count={7} />
      <rect x="56" y="2.5" width="19" height="91" fill={soft} />
      {photo && <PhotoMark cx={65.5} cy={15} fill={accentAlt} line={page} small />}
      <TextRows x={59} y={34} width={13} color={muted} count={5} gap={7} />
      <path d="M59 77H72" stroke={accent} strokeWidth="1.2" />
    </g>;
  }

  if (layout === 'centered') {
    return <g>
      {id === 'palladio' && <><path d="M14 9H68M14 12H68" stroke={accentAlt} strokeWidth="0.7" /><path d="M14 31H68" stroke={line} strokeWidth="0.7" /></>}
      {id === 'portrait' && photo && <PhotoMark cx={41} cy={17} fill={accentAlt} line={page} />}
      <NameMark x={id === 'portrait' && photo ? 23 : 20} y={id === 'portrait' && photo ? 30 : 16} width={id === 'portrait' && photo ? 36 : 42} color={dark} accent={accent} centered />
      <path d="M25 25H57" stroke={accentAlt} strokeWidth="1" />
      <TextRows x={23} y={30} width={36} color={muted} count={2} gap={5} centered />
      <path d="M14 43H68" stroke={line} strokeWidth="0.8" />
      <SectionMarks x={15} y={49} width={54} color={muted} line={line} count={5} />
      <path d="M14 82H68" stroke={accentAlt} strokeWidth="1.2" />
    </g>;
  }

  if (layout === 'timeline') {
    return <g>
      <rect x="7.5" y="2.5" width="4" height="91" fill={accent} />
      <NameMark x={17} y={13} width={49} color={dark} accent={accent} />
      <TextRows x={17} y={25} width={38} color={muted} count={2} gap={5} />
      <path d="M19 39V83" stroke={accentAlt} strokeWidth="1" />
      {[41, 54, 67, 80].map((y) => <g key={y}><circle cx="19" cy={y} r="2" fill={page} stroke={accent} strokeWidth="1.2" /><rect x="25" y={y - 1.3} width="29" height="2.6" rx="1" fill={muted} /><TextRows x={25} y={y + 3} width={37} color={line} count={1} gap={3} /></g>)}
    </g>;
  }

  if (layout === 'darkBand') {
    return <g>
      <rect x="7.5" y="2.5" width="67" height="27" fill={dark} />
      {photo && <PhotoMark cx={63} cy={15} fill={accent} line={page} small />}
      <NameMark x={13} y={12} width={photo ? 41 : 54} color="#ffffff" accent={accentAlt} />
      <TextRows x={13} y={34} width={48} color={muted} count={2} gap={5} />
      <path d="M13 48H69" stroke={accentAlt} strokeWidth="1" />
      <SectionMarks x={13} y={54} width={56} color={muted} line={line} count={5} />
    </g>;
  }

  if (layout === 'columns') {
    const isVellum = id === 'vellum';
    const isMeridian = id === 'meridian';
    return <g>
      {id === 'verso' || id === 'palladio' ? <path d="M14 10H68" stroke={accentAlt} strokeWidth="1.2" /> : null}
      <NameMark x={13} y={14} width={isMeridian ? 37 : 47} color={dark} accent={accent} />
      {photo && <PhotoMark cx={64} cy={15} fill={accentAlt} line={page} small />}
      <TextRows x={13} y={25} width={45} color={muted} count={2} gap={4} />
      <path d="M13 35H70" stroke={isVellum ? accentAlt : line} strokeWidth="0.8" />
      <path d="M42 39V86" stroke={line} strokeWidth="0.8" />
      <SectionMarks x={13} y={41} width={25} color={muted} line={line} count={5} />
      <SectionMarks x={46} y={41} width={23} color={muted} line={line} count={5} />
      {isMeridian && <rect x="59" y="35" width="11" height="51" fill={soft} opacity="0.8" />}
      {id === 'scribe' && <path d="M13 89H70" stroke={text} strokeWidth="0.7" />}
    </g>;
  }

  if (layout === 'cards' || layout === 'mosaic') {
    const mosaic = layout === 'mosaic';
    if (id === 'toon') {
      return <g>
        <rect x="10" y="6" width="62" height="20" rx="5" fill={soft} stroke={dark} strokeWidth="1.3" />
        <circle cx="20" cy="16" r="5" fill={accentAlt} stroke={dark} strokeWidth="1" />
        <rect x="29" y="13" width="34" height="5" rx="2.5" fill={dark} />
        <rect x="11" y="32" width="27" height="51" rx="4" fill={soft} stroke={accent} strokeWidth="1" />
        <rect x="43" y="32" width="28" height="51" rx="4" fill={page} stroke={accentAlt} strokeWidth="1" />
        <SectionMarks x={15} y={39} width={18} color={muted} line={line} count={4} />
        <SectionMarks x={47} y={39} width={19} color={muted} line={line} count={4} />
      </g>;
    }
    return <g>
      {mosaic ? <><rect x="7.5" y="2.5" width="67" height="24" fill={accent} /><rect x="50" y="6" width="19" height="16" rx="2" fill={accentAlt} opacity="0.9" /><NameMark x={13} y={12} width={32} color="#ffffff" accent={page} /></> : <NameMark x={13} y={12} width={43} color={dark} accent={accent} />}
      {photo && !mosaic && <PhotoMark cx={64} cy={15} fill={accentAlt} line={page} small />}
      <rect x="12" y={mosaic ? 32 : 28} width="27" height="23" rx="2" fill={soft} stroke={line} strokeWidth="0.6" />
      <rect x="43" y={mosaic ? 32 : 28} width="27" height="23" rx="2" fill={page} stroke={line} strokeWidth="0.6" />
      <rect x="12" y="60" width="58" height="26" rx="2" fill={soft} opacity="0.65" />
      <SectionMarks x={16} y={34} width={19} color={muted} line={line} count={2} />
      <SectionMarks x={47} y={34} width={19} color={muted} line={line} count={2} />
      <SectionMarks x={16} y={64} width={49} color={muted} line={line} count={3} />
    </g>;
  }

  if (layout === 'banner') {
    return <g>
      <rect x="7.5" y="2.5" width="67" height={id === 'bulletin' ? 26 : 22} rx={id === 'bulletin' ? 3 : 0} fill={id === 'bulletin' ? dark : accent} />
      {photo && <PhotoMark cx={63} cy={14} fill={accentAlt} line={page} small />}
      <NameMark x={13} y={11} width={photo ? 41 : 54} color="#ffffff" accent={accentAlt} />
      <TextRows x={13} y={id === 'bulletin' ? 34 : 30} width={50} color={muted} count={2} gap={5} />
      <path d="M13 45H69" stroke={line} strokeWidth="0.8" />
      <SectionMarks x={13} y={51} width={55} color={muted} line={line} count={5} />
    </g>;
  }

  return <g>
    {id === 'granite' && <rect x="7.5" y="2.5" width="4" height="91" fill={accent} />}
    <NameMark x={id === 'granite' ? 16 : 13} y={14} width={id === 'granite' ? 49 : 52} color={dark} accent={accent} />
    {photo && <PhotoMark cx={64} cy={15} fill={accentAlt} line={page} small />}
    <TextRows x={id === 'granite' ? 16 : 13} y={26} width={47} color={muted} count={2} gap={5} />
    <path d="M13 38H69" stroke={accentAlt} strokeWidth={id === 'minimal' ? '0.6' : '1.2'} />
    <SectionMarks x={13} y={44} width={55} color={muted} line={line} count={7} />
  </g>;
}

function PhotoMark({ cx, cy, fill, line, small = false }: { cx: number; cy: number; fill: string; line: string; small?: boolean }) {
  const radius = small ? 4.5 : 6;
  return <g>
    <circle cx={cx} cy={cy} r={radius + 1.2} fill={line} />
    <circle cx={cx} cy={cy} r={radius} fill={fill} />
    <circle cx={cx} cy={cy - radius * 0.23} r={radius * 0.25} fill={line} opacity="0.9" />
    <path d={`M${cx - radius * 0.52} ${cy + radius * 0.55} Q${cx} ${cy - radius * 0.08} ${cx + radius * 0.52} ${cy + radius * 0.55}`} fill={line} opacity="0.9" />
  </g>;
}

function NameMark({ x, y, width, color, accent, centered = false }: { x: number; y: number; width: number; color: string; accent: string; centered?: boolean }) {
  const lineX = centered ? x + (width - width * 0.68) / 2 : x;
  return <g>
    <rect x={lineX} y={y} width={width * 0.68} height="4.2" rx="1" fill={color} />
    <rect x={lineX} y={y + 6.1} width={width * 0.36} height="1.6" rx="0.8" fill={accent} />
  </g>;
}

function TextRows({ x, y, width, color, count, gap, centered = false }: { x: number; y: number; width: number; color: string; count: number; gap: number; centered?: boolean }) {
  return <g>{Array.from({ length: count }, (_, index) => {
    const factor = [0.95, 0.75, 0.88, 0.62, 0.8, 0.69, 0.91][index % 7]!;
    const rowWidth = width * factor;
    return <rect key={index} x={centered ? x + (width - rowWidth) / 2 : x} y={y + index * gap} width={rowWidth} height="1.45" rx="0.7" fill={color} opacity={index === 0 ? 0.9 : 0.65} />;
  })}</g>;
}

function SectionMarks({ x, y, width, color, line, count }: { x: number; y: number; width: number; color: string; line: string; count: number }) {
  const gap = 8.2;
  return <g>{Array.from({ length: count }, (_, index) => {
    const top = y + index * gap;
    const lineWidth = width * (index % 3 === 0 ? 0.92 : index % 3 === 1 ? 0.75 : 0.84);
    return <g key={index}>
      <rect x={x} y={top} width={width * 0.38} height="1.7" rx="0.7" fill={index % 2 === 0 ? color : line} />
      <rect x={x} y={top + 3.2} width={lineWidth} height="1" rx="0.5" fill={line} />
      <rect x={x} y={top + 5.1} width={lineWidth * 0.72} height="0.9" rx="0.4" fill={line} opacity="0.72" />
    </g>;
  })}</g>;
}

function HexPattern({ x, y, color }: { x: number; y: number; color: string }) {
  return <g fill="none" stroke={color} strokeWidth="0.65" opacity="0.72">
    {[0, 1, 2].map((col) => [0, 1, 2, 3].map((row) => {
      const cx = x + 4 + col * 6 + (row % 2 ? 3 : 0);
      const cy = y + 3 + row * 7;
      return <path key={`${col}-${row}`} d={`M${cx - 2.2} ${cy - 1.25}L${cx} ${cy - 2.5}L${cx + 2.2} ${cy - 1.25}L${cx + 2.2} ${cy + 1.25}L${cx} ${cy + 2.5}L${cx - 2.2} ${cy + 1.25}Z`} />;
    }))}
  </g>;
}
