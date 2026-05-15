import { Fragment, useState, type CSSProperties } from 'react';
import { t, type UILanguage } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData, CVSection, CVEntry, SocialPlatform } from '../../types/cv';
import ContactIcon from '../../ui/ContactIcon';
import { getContactItems, getEntryTitle, getEntryDate, getEntryDetailLines } from './templateUtils';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import type { TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

const G = {
  gold: '#C9A84C',
  goldBright: '#E8C547',
  goldDim: '#9A7B2C',
  goldDark: '#8B6914',
  black: '#0A0A0A',
  blackPanel: '#151515',
  grey: '#1E1E1E',
  greyLight: '#2A2A2A',
  text: '#B8B8B8',
  textDim: '#666666',
  textBright: '#E0E0E0',
};

// Static SVG string with no dynamic data
const darkHex = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23202020' stroke-width='0.5' viewBox='0 0 100 169.5'%3E%3Cpolygon fill='%230a0a0a' fill-opacity='0.2' points='50,34.75 93.5,59.75 93.5,109.75 50,134.75 6.5,109.75 6.5,59.75'/%3E%3Cpolygon fill='%230a0a0a' fill-opacity='0.2' points='0,-50 43.5,-25 43.5,25 0,50 -43.5,25 -43.5,-25'/%3E%3Cpolygon fill='%230a0a0a' fill-opacity='0.2' points='100,-50 143.5,-25 143.5,25 100,50 56.5,25 56.5,-25'/%3E%3Cpolygon fill='%230a0a0a' fill-opacity='0.2' points='0,119.5 43.5,144.5 43.5,194.5 0,219.5 -43.5,194.5 -43.5,144.5'/%3E%3Cpolygon fill='%230a0a0a' fill-opacity='0.2' points='100,119.5 143.5,144.5 143.5,194.5 100,219.5 56.5,194.5 56.5,144.5'/%3E%3C/svg%3E")`;

// Static SVG string with no dynamic data
const goldHex = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23B8952E' stroke-width='0.4' viewBox='0 0 100 169.5'%3E%3Cpolygon points='50,34.75 93.5,59.75 93.5,109.75 50,134.75 6.5,109.75 6.5,59.75'/%3E%3Cpolygon points='0,-50 43.5,-25 43.5,25 0,50 -43.5,25 -43.5,-25'/%3E%3Cpolygon points='100,-50 143.5,-25 143.5,25 100,50 56.5,25 56.5,-25'/%3E%3Cpolygon points='0,119.5 43.5,144.5 43.5,194.5 0,219.5 -43.5,194.5 -43.5,144.5'/%3E%3Cpolygon points='100,119.5 143.5,144.5 143.5,194.5 100,219.5 56.5,194.5 56.5,144.5'/%3E%3C/svg%3E")`;

const S: Record<string, CSSProperties> = {
  container: {
    fontFamily: "'Play', sans-serif",
    fontSize: '10px',
    lineHeight: '1.5',
    color: G.text,
    background: G.black,
    minHeight: '297mm',
    position: 'relative' as const,
    overflow: 'hidden',
    padding: '40px 50px',
    border: `1px solid rgba(201, 168, 76, 0.15)`,
  },
  bgDark: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: darkHex,
    backgroundSize: '40px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  bgGold: {
    position: 'absolute',
    top: 0, right: 0,
    width: '100%', height: '100%',
    backgroundImage: goldHex,
    backgroundSize: '40px',
    pointerEvents: 'none',
    zIndex: 1,
    WebkitMaskImage: 'radial-gradient(ellipse 25% 20% at 96% 4%, black 0%, black 10%, rgba(0,0,0,0.4) 25%, transparent 40%)',
    maskImage: 'radial-gradient(ellipse 25% 20% at 96% 4%, black 0%, black 10%, rgba(0,0,0,0.4) 25%, transparent 40%)',
  },
  content: {
    position: 'relative',
    zIndex: 2,
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: `1px solid rgba(201, 168, 76, 0.2)`,
    position: 'relative' as const,
  },
  headerLine: {
    position: 'absolute' as const,
    bottom: '-1px',
    left: '25%',
    width: '50%',
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${G.gold}, transparent)`,
  },
  name: {
    fontFamily: "'Electrolize', sans-serif",
    fontSize: '30px',
    fontWeight: 900,
    color: G.gold,
    letterSpacing: '6px',
    textTransform: 'uppercase' as const,
  },
  title: {
    fontFamily: "'Electrolize', sans-serif",
    fontSize: '9px',
    color: G.goldDim,
    textTransform: 'uppercase' as const,
    letterSpacing: '8px',
    marginTop: '4px',
    marginBottom: '16px',
    fontWeight: 600,
  },
  contacts: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    gap: '6px 12px',
    fontSize: '9px',
  },
  contactPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 12px',
    background: G.blackPanel,
    border: `1px solid rgba(201, 168, 76, 0.1)`,
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    color: G.textDim,
    fontFamily: "'Play', sans-serif",
    fontWeight: 600,
    letterSpacing: '1px',
  },
  summary: {
    fontSize: '9px',
    color: G.text,
    lineHeight: '1.7',
    textAlign: 'left' as const,
    marginTop: '16px',
  },
  section: {
    marginBottom: '14px',
  },
  sectionTitle: {
    fontFamily: "'Electrolize', sans-serif",
    fontSize: '9px',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
    letterSpacing: '6px',
    color: G.gold,
    marginBottom: '12px',
    paddingBottom: '6px',
    borderBottom: `1px solid rgba(201, 168, 76, 0.1)`,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  diamond: {
    width: '7px',
    height: '7px',
    background: G.goldDim,
    transform: 'rotate(45deg)',
    opacity: 0.7,
    boxShadow: '0 0 6px rgba(201, 168, 76, 0.3)',
  },
  entry: {
    marginBottom: '10px',
    padding: '10px 12px',
    background: G.blackPanel,
    border: `1px solid rgba(201, 168, 76, 0.06)`,
    borderLeft: `2px solid ${G.goldDim}`,
    borderRadius: '0 2px 2px 0',
    position: 'relative' as const,
  },
  entryTopLine: {
    position: 'absolute' as const,
    top: 0, left: 0,
    width: '30px',
    height: '1px',
    background: `linear-gradient(90deg, ${G.goldDim}, transparent)`,
  },
  entryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '2px',
  },
  entryTitle: {
    fontFamily: "'Electrolize', sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    color: G.textBright,
    letterSpacing: '1px',
  },
  entryDate: {
    fontFamily: "'Play', sans-serif",
    fontSize: '10px',
    color: G.goldDim,
    whiteSpace: 'nowrap' as const,
    fontWeight: 600,
    letterSpacing: '2px',
  },
  entryCompany: {
    fontSize: '11px',
    color: G.textDim,
    marginBottom: '4px',
  },
  entryDesc: {
    fontSize: '11px',
    color: G.text,
    paddingLeft: '10px',
    borderLeft: `1px solid rgba(201, 168, 76, 0.1)`,
    marginTop: '4px',
  },
  entryDescLi: {
    marginBottom: '2px',
    listStyle: 'none' as const,
  },
  project: {
    marginBottom: '8px',
    padding: '10px 12px',
    background: G.blackPanel,
    border: `1px solid rgba(201, 168, 76, 0.06)`,
    position: 'relative' as const,
    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
  },
  projectTitle: {
    fontFamily: "'Electrolize', sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    color: G.textBright,
    letterSpacing: '1px',
  },
  projectLink: {
    color: G.gold,
    textDecoration: 'none',
  },
  projectDesc: {
    fontSize: '11px',
    color: G.text,
    lineHeight: '1.6',
  },
  projectStack: {
    fontFamily: "'Play', sans-serif",
    fontSize: '10px',
    color: G.textDim,
    marginTop: '4px',
    fontWeight: 600,
  },
  edu: {
    marginBottom: '6px',
    padding: '8px 10px',
    background: G.blackPanel,
    border: `1px solid rgba(201, 168, 76, 0.06)`,
    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
  },
  eduTitle: {
    fontFamily: "'Electrolize', sans-serif",
    fontSize: '12px',
    fontWeight: 700,
    color: G.textBright,
    letterSpacing: '1px',
  },
  eduSchool: {
    fontSize: '11px',
    color: G.textDim,
  },
  eduDate: {
    fontFamily: "'Segoe UI', 'Arial Narrow', Arial, sans-serif",
    fontSize: '10px',
    color: G.goldDim,
    fontWeight: 500,
  },
  skillRow: {
    display: 'flex',
    marginBottom: '8px',
    fontSize: '10px',
    lineHeight: '1.6',
  },
  skillLabel: {
    fontWeight: 700,
    color: G.textBright,
    marginRight: '8px',
    whiteSpace: 'nowrap' as const,
    minWidth: '120px',
    fontFamily: "'Electrolize', sans-serif",
  },
  skillValues: {
    color: G.text,
  },
  skillsDivider: {
    height: '1px',
    background: `linear-gradient(90deg, ${G.goldDim}, transparent)`,
    margin: '12px 0',
    opacity: 0.3,
  },
  skillCategoryLabel: {
    fontWeight: 700,
    color: G.goldDim,
    fontSize: '9px',
    textTransform: 'uppercase' as const,
    letterSpacing: '3px',
    marginBottom: '10px',
    fontFamily: "'Electrolize', sans-serif",
    borderBottom: `1px solid rgba(201, 168, 76, 0.15)`,
    paddingBottom: '4px',
  },
  skillBarsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginBottom: '8px',
  },
  skillBarContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  skillBarHeader: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center',
  },
  skillBarName: {
    fontSize: '9px',
    color: G.textBright,
    fontWeight: 600,
    fontFamily: "'Electrolize', sans-serif",
    letterSpacing: '0.5px',
  },
  skillBarLevel: {
    fontSize: '8px',
    color: G.goldDim,
    fontFamily: "'Orbitron', monospace",
  },
  skillBarTrack: {
    height: '4px',
    background: 'rgba(201, 168, 76, 0.1)',
    borderRadius: '2px',
    overflow: 'hidden' as const,
    position: 'relative' as const,
    border: `1px solid rgba(201, 168, 76, 0.08)`,
  },
  skillBarFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${G.goldDark}, ${G.gold} 60%, ${G.goldBright})`,
    borderRadius: '1px',
    transition: 'width 0.6s ease',
    position: 'relative' as const,
    boxShadow: `0 0 8px rgba(201, 168, 76, 0.3)`,
  },
  skillBarGlow: {
    position: 'absolute' as const,
    right: 0,
    top: 0,
    bottom: 0,
    width: '20px',
    background: `linear-gradient(90deg, transparent, rgba(232, 197, 71, 0.4))`,
    borderRadius: '0 1px 1px 0',
  },
  langGrid: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap' as const,
  },
  langItem: {
    fontSize: '9px',
    padding: '6px 14px',
    background: G.blackPanel,
    border: `1px solid rgba(201, 168, 76, 0.08)`,
    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
    display: 'inline-flex',
    gap: '8px',
  },
  langName: {
    fontWeight: 700,
    color: G.textBright,
    fontFamily: "'Electrolize', sans-serif",
  },
  langLevel: {
    color: G.textDim,
    fontFamily: "'Electrolize', sans-serif",
    fontSize: '9px',
    fontWeight: 500,
    letterSpacing: '1px',
  },
  course: {
    fontSize: '11px',
    color: G.text,
    marginBottom: '3px',
    padding: '3px 10px',
    background: 'rgba(21, 21, 21, 0.5)',
    borderLeft: `2px solid rgba(201, 168, 76, 0.08)`,
  },
  courseName: {
    color: '#bbb',
    fontWeight: 600,
    fontFamily: "'Electrolize', sans-serif",
  },
  courseOrg: {
    color: G.textDim,
  },
};

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={S.sectionTitle}>
      <div style={S.diamond} />
      {title}
    </div>
  );
}

function ExperienceEntry({ entry }: { entry: CVEntry }) {
  const lines = getEntryDetailLines(entry);
  return (
    <div style={S.entry}>
      <div style={S.entryTopLine} />
      <div style={S.entryRow}>
        <span style={S.entryTitle}>{getEntryTitle(entry)}</span>
        <span style={S.entryDate}>{getEntryDate(entry)}</span>
      </div>
      <div style={S.entryCompany}>
        {entry.fields.company || entry.fields.institution || ''}
        {entry.fields.location ? ` | ${entry.fields.location}` : ''}
      </div>
      {lines.length > 0 && (
        <ul style={{ ...S.entryDesc, padding: 0, margin: 0 }}>
          {lines.map((desc, i) => (
            <li key={i} style={S.entryDescLi}>
              <span style={{ color: G.goldDim, fontWeight: 700 }}>› </span>
              {desc}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectEntry({ entry }: { entry: CVEntry }) {
  const platform = (entry.fields.platform || 'custom') as string;
  const iconName = platform === 'custom' ? 'website' : platform as SocialPlatform;
  
  return (
    <div style={S.project}>
      <div style={S.entryTopLine} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '16px', height: '16px', color: G.gold, flexShrink: 0 }}>
          {platform === 'custom' ? (
            <div style={{ width: '7px', height: '7px', background: G.goldDim, transform: 'rotate(45deg)', opacity: 0.7 }} />
          ) : (
            <ContactIcon name={iconName} width={16} height={16} />
          )}
        </div>
        <div style={S.projectTitle}>
          {entry.fields.url ? (
            <a href={entry.fields.url} style={S.projectLink} target="_blank" rel="noopener noreferrer">
              {entry.fields.name || entry.fields.title}
            </a>
          ) : (
            entry.fields.name || entry.fields.title
          )}
        </div>
      </div>
      <div style={S.projectDesc}>{entry.fields.description}</div>
      {entry.fields.technologies && <div style={S.projectStack}>{entry.fields.technologies}</div>}
    </div>
  );
}

function EducationEntry({ entry }: { entry: CVEntry }) {
  return (
    <div style={S.edu}>
      <div style={S.eduTitle}>{entry.fields.degree}</div>
      <div style={S.eduSchool}>{entry.fields.institution}</div>
      <div style={S.eduDate}>{getEntryDate(entry)}</div>
    </div>
  );
}

function SkillBar({ name, level }: { name: string; level: string }) {
  const levelNum = Math.min(5, Math.max(1, parseInt(level) || 3));
  const percentage = (levelNum / 5) * 100;
  
  return (
    <div style={S.skillBarContainer}>
      <div style={S.skillBarHeader}>
        <span style={S.skillBarName}>{name}</span>
        <span style={S.skillBarLevel}>{levelNum}/5</span>
      </div>
      <div style={S.skillBarTrack}>
        <div style={{...S.skillBarFill, width: `${percentage}%`}}>
          <div style={S.skillBarGlow} />
        </div>
      </div>
    </div>
  );
}

function SkillsSection({ entries }: { entries: CVEntry[] }) {
  const categorized: Record<string, {name: string; level: string}[]> = {};
  const uncategorized: {name: string; level: string}[] = [];

  entries.forEach((entry) => {
    const category = entry.fields.category || '';
    const name = entry.fields.name || '';
    const level = entry.fields.level || '3';
    if (category) {
      if (!categorized[category]) categorized[category] = [];
      categorized[category].push({name, level});
    } else {
      uncategorized.push({name, level});
    }
  });

  return (
    <>
      {Object.entries(categorized).map(([category, skills], i) => (
        <div key={i}>
          <div style={S.skillCategoryLabel}>{category}</div>
          <div style={S.skillBarsGrid}>
            {skills.map((skill, j) => (
              <SkillBar key={j} name={skill.name} level={skill.level} />
            ))}
          </div>
          {i < Object.keys(categorized).length - 1 && <div style={S.skillsDivider} />}
        </div>
      ))}
      {uncategorized.length > 0 && (
        <div style={S.skillBarsGrid}>
          {uncategorized.map((skill, i) => (
            <SkillBar key={i} name={skill.name} level={skill.level} />
          ))}
        </div>
      )}
    </>
  );
}

function LangItem({ entry }: { entry: CVEntry }) {
  return (
    <span style={S.langItem}>
      <span style={S.langName}>{entry.fields.language}</span>
      <span style={S.langLevel}>{entry.fields.proficiency}</span>
    </span>
  );
}

function CourseItem({ entry }: { entry: CVEntry }) {
  return (
    <div style={S.course}>
      <span style={S.courseName}>{entry.fields.name || entry.fields.degree}</span>
      {' — '}
      <span style={S.courseOrg}>{entry.fields.institution || entry.fields.issuer}</span>
    </div>
  );
}

function renderSectionContent(section: CVSection, language: UILanguage) {
  const title = section.title || t(language, section.type);

  if (!section.entries || section.entries.length === 0) {
    return null;
  }

  switch (section.type) {
    case 'experience':
      return (
        <div style={S.section}>
          <SectionTitle title={title} />
          {section.entries.map((entry, i) => (
            <ExperienceEntry key={i} entry={entry} />
          ))}
        </div>
      );
    case 'projects':
      return (
        <div style={S.section}>
          <SectionTitle title={title} />
          {section.entries.map((entry, i) => (
            <ProjectEntry key={i} entry={entry} />
          ))}
        </div>
      );
    case 'education':
      return (
        <div style={S.section}>
          <SectionTitle title={title} />
          {section.entries.map((entry, i) => (
            <EducationEntry key={i} entry={entry} />
          ))}
        </div>
      );
    case 'skills':
      return (
        <div style={S.section}>
          <SectionTitle title={title} />
          <SkillsSection entries={section.entries} />
        </div>
      );
    case 'languages':
      return (
        <div style={S.section}>
          <SectionTitle title={title} />
          <div style={S.langGrid}>
            {section.entries.map((entry, i) => (
              <LangItem key={i} entry={entry} />
            ))}
          </div>
        </div>
      );
    case 'certifications':
      return (
        <div style={S.section}>
          <SectionTitle title={title} />
          {section.entries.map((entry, i) => (
            <CourseItem key={i} entry={entry} />
          ))}
        </div>
      );
    case 'custom':
      return (
        <div style={S.section}>
          <SectionTitle title={title} />
          {section.entries.map((entry, i) => (
            <div key={i} style={S.edu}>
              <div style={S.eduTitle}>{entry.fields.title || entry.fields.name || ''}</div>
              <div style={{ ...S.eduSchool, lineHeight: '1.7' }}>{entry.fields.description || entry.fields.content || ''}</div>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

function SarifDraggableSection({
  layoutEditor,
  section,
  language,
}: {
  layoutEditor: TemplateLayoutEditor;
  section: CVSection;
  language: UILanguage;
}) {
  const isSource =
    layoutEditor?.dragState?.regionKey === 'main' &&
    layoutEditor?.dragState?.sectionId === section.id;

  return (
    <div
      draggable
      className={`template-preview-section ${isSource ? 'is-source' : ''}`}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/template-region', 'main');
        event.dataTransfer.setData('text/template-section-id', section.id);
        layoutEditor.onDragStart('main', section.id);
      }}
      onDragEnd={() => layoutEditor.onDragEnd()}
    >
      {renderSectionContent(section, language)}
    </div>
  );
}

function SarifDropZone({
  empty = false,
  layoutEditor,
  targetIndex,
}: {
  empty?: boolean;
  layoutEditor: TemplateLayoutEditor;
  targetIndex: number;
}) {
  const [isOver, setIsOver] = useState(false);
  const isActive = Boolean(layoutEditor?.dragState);

  return (
    <div
      className={`template-preview-drop-zone ${empty ? 'is-empty' : ''} ${isActive ? 'is-active' : ''} ${isOver ? 'is-over' : ''}`}
      onDragEnter={(event) => {
        event.preventDefault();
        if (layoutEditor?.dragState) setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDragOver={(event) => {
        if (!layoutEditor?.dragState) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setIsOver(true);
      }}
      onDrop={(event) => {
        event.preventDefault();
        if (!layoutEditor) return;
        const sourceRegion = event.dataTransfer.getData('text/template-region');
        const sectionId = event.dataTransfer.getData('text/template-section-id');
        if (sourceRegion && sectionId) {
          layoutEditor.onDrop(sourceRegion, 'main', sectionId, targetIndex);
        }
        setIsOver(false);
        layoutEditor.onDragEnd();
      }}
    />
  );
}

export default function Sarif({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const { personalInfo, sections } = data;
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo);
  const summary = personalInfo.summary.trim();
  const leadRole = '';

  const layoutState = ensureTemplateLayout('sarif', data.layoutOverride, sections);
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={S.container}>
      <div style={S.bgDark} />
      <div style={S.bgGold} />

      <div style={S.content}>
        {/* Header */}
        <div style={S.header}>
          <div style={S.headerLine} />

          <div style={S.name}>{displayName}</div>

          {leadRole && (
            <div style={S.title}>{leadRole}</div>
          )}

          <div style={S.contacts}>
            {contactItems.map((item, i) => (
              <div key={i} style={{ ...S.contactPill, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ContactIcon name={item.icon} style={{ width: '12px', height: '12px', color: G.gold }} />
                <a href={item.value} style={{ color: G.textDim, textDecoration: 'none' }}>
                  {item.value}
                </a>
              </div>
            ))}
          </div>

          {summary && <div style={S.summary}>{summary}</div>}
        </div>

        {/* Sections with drag-and-drop support */}
        {layoutEditor ? (
          <div
            className={`template-preview-region-stack ${layoutEditor.dragState ? 'is-drag-active' : ''}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '0' }}
          >
            <SarifDropZone layoutEditor={layoutEditor} targetIndex={0} empty={mainSections.length === 0} />
            {mainSections.map((section, index) => (
              <Fragment key={section.id}>
                <SarifDraggableSection
                  layoutEditor={layoutEditor}
                  section={section}
                  language={language}
                />
                <SarifDropZone layoutEditor={layoutEditor} targetIndex={index + 1} />
              </Fragment>
            ))}
          </div>
        ) : (
          mainSections.map((section) => (
            <div key={section.id}>
              {renderSectionContent(section, language)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
