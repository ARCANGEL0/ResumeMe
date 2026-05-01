// src/components/templates/templateComponents.tsx
import { Fragment, useState, type CSSProperties } from 'react';
import { getDropSectionLabel, t, type UILanguage } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVEntry, CVSection } from '../../types/cv';
import ContactIcon from '../../ui/ContactIcon';
import { type ContactStyle, type LanguageStyle, type TemplateTheme } from './templateCatalog';
import {
  getEntryDate,
  getEntryDetailLines,
  getEntrySubtitle,
  getEntryTitle,
  getLangLevel,
  getLangScore,
  getSkillLevelScore,
  type ContactItem,
} from './templateUtils';

export interface TemplateDragState {
  regionKey: string;
  sectionId: string;
}

export interface TemplateLayoutEditor {
  dragState: TemplateDragState | null;
  onDragStart: (regionKey: string, sectionId: string) => void;
  onDragEnd: () => void;
  onDrop: (sourceRegion: string, targetRegion: string, sectionId: string, targetIndex: number) => void;
}

export function HeaderBlock({
  align,
  compact = false,
  contactItems,
  contactStyle,
  displayName,
  hideContact = false,
  hideDivider = false,
  language,
  onDark = false,
  showDivider = true,
  showSummaryLabel = true,
  subtitle = '',
  summary,
  theme,
  titleSize,
}: {
  align?: 'left' | 'center';
  compact?: boolean;
  contactItems: ContactItem[];
  contactStyle?: ContactStyle;
  displayName: string;
  hideContact?: boolean;
  hideDivider?: boolean;
  language: UILanguage;
  onDark?: boolean;
  showDivider?: boolean;
  showSummaryLabel?: boolean;
  subtitle?: string;
  summary: string;
  theme: TemplateTheme;
  titleSize?: string;
}) {
  const headerAlign = align ?? theme.headerAlign;
  const textColor = onDark ? theme.sidebarText ?? theme.headerText ?? '#ffffff' : theme.text;
  const mutedColor = onDark ? 'rgba(255,255,255,0.76)' : theme.muted;

  return (
    <div style={{ textAlign: headerAlign, marginBottom: compact ? '10px' : 0 }}>
      <h1
        style={{
          margin: 0,
          color: textColor,
          fontSize:
            titleSize ??
            (compact ? '24px' : theme.headerAlign === 'center' ? '30px' : '28px'),
          fontWeight: compact ? 800 : 700,
          letterSpacing: theme.nameLetterSpacing ?? '0',
          textTransform: theme.uppercaseName ? 'uppercase' : 'none',
          lineHeight: 1.08,
        }}
      >
        {displayName}
      </h1>

      {subtitle && (
        <div
          style={{
            marginTop: '8px',
            color: mutedColor,
            fontSize: compact ? '11px' : '12px',
            letterSpacing: compact ? '0.04em' : '0.08em',
            textTransform: compact ? 'none' : 'uppercase',
          }}
        >
          {subtitle}
        </div>
      )}

      {!hideDivider && showDivider && (
        <div
          style={{
            width: compact ? '42px' : headerAlign === 'center' ? '72px' : '54px',
            height: compact ? '3px' : '4px',
            margin: headerAlign === 'center' ? '12px auto 14px' : '12px 0 14px',
            borderRadius: '999px',
            background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentAlt})`,
          }}
        />
      )}

      {!hideContact && contactItems.length > 0 && (
        <ContactPanel
          contactItems={contactItems}
          theme={theme}
          onDark={onDark}
          contactStyle={contactStyle}
          align={headerAlign}
        />
      )}

      {summary && (
        <div style={{ marginTop: compact ? '16px' : '18px' }}>
          {showSummaryLabel && (
            <div
              style={{
                marginBottom: '8px',
                color: mutedColor,
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {t(language, 'profile')}
            </div>
          )}
          <SummaryBlock summary={summary} theme={theme} onDark={onDark} />
        </div>
      )}
    </div>
  );
}

export function ContactPanel({
  align = 'left',
  contactItems,
  contactStyle,
  onDark = false,
  theme,
}: {
  align?: 'left' | 'center';
  contactItems: ContactItem[];
  contactStyle?: ContactStyle;
  onDark?: boolean;
  theme: TemplateTheme;
}) {
  const styleVariant = contactStyle ?? theme.contactStyle;
  const iconColor = onDark ? theme.headerText ?? theme.sidebarText ?? '#ffffff' : theme.accent;
  const textColor = onDark ? theme.sidebarText ?? '#ffffff' : theme.text;
  const mutedColor = onDark ? 'rgba(255,255,255,0.72)' : theme.muted;
  const pillBg = onDark ? 'rgba(255,255,255,0.1)' : theme.accentSoft;

  if (!contactItems.length) return null;

  if (styleVariant === 'stack') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {contactItems.map((item) => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: textColor }}>
            <span
              style={{
                display: 'inline-flex',
                width: '22px',
                height: '22px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '999px',
                background: pillBg,
                color: iconColor,
              }}
            >
              <ContactIcon name={item.icon} style={{ width: '12px', height: '12px' }} />
            </span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: styleVariant === 'pills' ? '8px' : '14px',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      {contactItems.map((item) => (
        <span
          key={item.key}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: styleVariant === 'pills' ? '5px 10px' : 0,
            borderRadius: styleVariant === 'pills' ? '999px' : 0,
            background: styleVariant === 'pills' ? pillBg : 'transparent',
            color: styleVariant === 'pills' ? textColor : mutedColor,
          }}
        >
          <span style={{ display: 'inline-flex', width: '12px', height: '12px', color: iconColor }}>
            <ContactIcon name={item.icon} style={{ width: '100%', height: '100%' }} />
          </span>
          <span style={{ color: textColor }}>{item.value}</span>
        </span>
      ))}
    </div>
  );
}

export function SummaryBlock({
  onDark = false,
  summary,
  theme,
}: {
  onDark?: boolean;
  summary: string;
  theme: TemplateTheme;
}) {
  const mutedColor = onDark ? 'rgba(255,255,255,0.78)' : theme.muted;

  if (theme.summaryStyle === 'card') {
    return (
      <div
        style={{
          padding: '14px 16px',
          borderRadius: '14px',
          background: onDark ? 'rgba(255,255,255,0.08)' : theme.accentSoft,
          borderLeft: `4px solid ${theme.accent}`,
          color: mutedColor,
        }}
      >
        {summary}
      </div>
    );
  }

  if (theme.summaryStyle === 'quote') {
    return (
      <div
        style={{
          paddingLeft: '12px',
          borderLeft: `2px solid ${theme.accent}`,
          color: mutedColor,
          fontStyle: 'italic',
        }}
      >
        {summary}
      </div>
    );
  }

  return <p style={{ margin: 0, color: mutedColor }}>{summary}</p>;
}

export function SectionColumn({
  gap = '22px',
  layoutEditor,
  onDark = false,
  regionKey,
  sections,
  theme,
}: {
  gap?: string;
  layoutEditor?: TemplateLayoutEditor;
  onDark?: boolean;
  regionKey?: string;
  sections: CVSection[];
  theme: TemplateTheme;
}) {
  return (
    <SectionRegionStack
      gap={gap}
      layoutEditor={layoutEditor}
      onDark={onDark}
      regionKey={regionKey}
      sections={sections}
      theme={theme}
    />
  );
}

export function SectionPanels({
  gap = '16px',
  layoutEditor,
  onDark = false,
  regionKey,
  sections,
  shellStyle,
  theme,
}: {
  gap?: string;
  layoutEditor?: TemplateLayoutEditor;
  onDark?: boolean;
  regionKey?: string;
  sections: CVSection[];
  shellStyle?: CSSProperties;
  theme: TemplateTheme;
}) {
  return (
    <SectionRegionStack
      gap={gap}
      layoutEditor={layoutEditor}
      onDark={onDark}
      regionKey={regionKey}
      sections={sections}
      shellStyle={shellStyle}
      theme={theme}
    />
  );
}

function SectionRegionStack({
  gap,
  layoutEditor,
  onDark = false,
  regionKey,
  sections,
  shellStyle,
  theme,
}: {
  gap: string;
  layoutEditor?: TemplateLayoutEditor;
  onDark?: boolean;
  regionKey?: string;
  sections: CVSection[];
  shellStyle?: CSSProperties;
  theme: TemplateTheme;
}) {
  if (sections.length === 0 && !(layoutEditor && regionKey)) {
    return null;
  }

  if (!layoutEditor || !regionKey) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap }}>
        {sections.map((section) => (
          <div key={section.id} style={shellStyle}>
            <SectionBlock section={section} theme={theme} onDark={onDark} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`template-preview-region-stack ${layoutEditor.dragState ? 'is-drag-active' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap }}>
      <SectionDropZone layoutEditor={layoutEditor} regionKey={regionKey} targetIndex={0} empty={sections.length === 0} />
      {sections.map((section, index) => (
        <Fragment key={section.id}>
          <DraggableSection
            layoutEditor={layoutEditor}
            onDark={onDark}
            regionKey={regionKey}
            section={section}
            shellStyle={shellStyle}
            theme={theme}
          />
          <SectionDropZone layoutEditor={layoutEditor} regionKey={regionKey} targetIndex={index + 1} />
        </Fragment>
      ))}
    </div>
  );
}

function SectionDropZone({
  empty = false,
  layoutEditor,
  regionKey,
  targetIndex,
}: {
  empty?: boolean;
  layoutEditor: TemplateLayoutEditor;
  regionKey: string;
  targetIndex: number;
}) {
  const [isOver, setIsOver] = useState(false);
  const isActive = Boolean(layoutEditor.dragState);
  const language = useCVStore((state) => state.language);

  return (
    <div
      className={`template-preview-drop-zone ${empty ? 'is-empty' : ''} ${isActive ? 'is-active' : ''} ${isOver ? 'is-over' : ''}`}
      onDragEnter={(event) => {
        event.preventDefault();
        if (layoutEditor.dragState) setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDragOver={(event) => {
        if (!layoutEditor.dragState) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setIsOver(true);
      }}
      onDrop={(event) => {
        event.preventDefault();
        const sourceRegion = event.dataTransfer.getData('text/template-region');
        const sectionId = event.dataTransfer.getData('text/template-section-id');
        if (sourceRegion && sectionId) {
          layoutEditor.onDrop(sourceRegion, regionKey, sectionId, targetIndex);
        }
        setIsOver(false);
        layoutEditor.onDragEnd();
      }}
    >
      {empty ? getDropSectionLabel(language) : ''}
    </div>
  );
}

function DraggableSection({
  layoutEditor,
  onDark = false,
  regionKey,
  section,
  shellStyle,
  theme,
}: {
  layoutEditor: TemplateLayoutEditor;
  onDark?: boolean;
  regionKey: string;
  section: CVSection;
  shellStyle?: CSSProperties;
  theme: TemplateTheme;
}) {
  const isSource =
    layoutEditor.dragState?.regionKey === regionKey && layoutEditor.dragState.sectionId === section.id;

  return (
    <div
      draggable
      className={`template-preview-section ${isSource ? 'is-source' : ''}`}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/template-region', regionKey);
        event.dataTransfer.setData('text/template-section-id', section.id);
        layoutEditor.onDragStart(regionKey, section.id);
      }}
      onDragEnd={() => layoutEditor.onDragEnd()}
    >
      <div style={shellStyle}>
        <SectionBlock section={section} theme={theme} onDark={onDark} />
      </div>
    </div>
  );
}

function SectionBlock({
  onDark = false,
  section,
  theme,
}: {
  onDark?: boolean;
  section: CVSection;
  theme: TemplateTheme;
}) {
  const titleColor = onDark ? theme.sidebarText ?? '#ffffff' : theme.text;
  const borderColor = onDark ? 'rgba(255,255,255,0.14)' : theme.line;

  return (
    <section>
      <SectionHeading title={section.title} theme={theme} onDark={onDark} />
      {section.type === 'skills' ? (
        <SkillsSection section={section} theme={theme} onDark={onDark} />
      ) : section.type === 'languages' ? (
        <LanguagesSection section={section} theme={theme} onDark={onDark} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {section.entries.map((entry) => (
            <EntryBlock key={entry.id} entry={entry} theme={theme} onDark={onDark} borderColor={borderColor} titleColor={titleColor} />
          ))}
        </div>
      )}
    </section>
  );
}

export function SectionHeading({
  onDark = false,
  theme,
  title,
}: {
  onDark?: boolean;
  theme: TemplateTheme;
  title: string;
}) {
  const baseColor = onDark ? theme.sidebarText ?? '#ffffff' : theme.accent;

  if (theme.sectionHeading === 'pill') {
    return (
      <div
        style={{
          display: 'inline-flex',
          marginBottom: '12px',
          padding: '5px 12px',
          borderRadius: '999px',
          background: onDark ? 'rgba(255,255,255,0.12)' : theme.accentSoft,
          color: baseColor,
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>
    );
  }

  if (theme.sectionHeading === 'bar') {
    return (
      <div
        style={{
          marginBottom: '12px',
          paddingLeft: '10px',
          borderLeft: `4px solid ${theme.accent}`,
          color: baseColor,
          fontSize: '12px',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>
    );
  }

  if (theme.sectionHeading === 'label') {
    return (
      <div
        style={{
          marginBottom: '12px',
          color: onDark ? 'rgba(255,255,255,0.86)' : theme.muted,
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <span style={{ flex: 1, height: '1px', background: onDark ? 'rgba(255,255,255,0.2)' : theme.line }} />
      <span style={{ color: baseColor, fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</span>
      <span style={{ flex: 1, height: '1px', background: onDark ? 'rgba(255,255,255,0.2)' : theme.line }} />
    </div>
  );
}

function SkillsSection({
  onDark = false,
  section,
  theme,
}: {
  onDark?: boolean;
  section: CVSection;
  theme: TemplateTheme;
}) {
  const textColor = onDark ? theme.sidebarText ?? '#ffffff' : theme.text;
  const lineColor = onDark ? 'rgba(255,255,255,0.18)' : theme.line;

  if (theme.skillStyle === 'inline') {
    const labels = section.entries.map((entry) => entry.fields.name || entry.fields.title).filter(Boolean);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', textAlign: 'center', color: textColor }}>
        {labels.map((label, index) => (
          <span key={`${label}-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <span>{label}</span>
            {index < labels.length - 1 && <span style={{ color: theme.muted }}>•</span>}
          </span>
        ))}
      </div>
    );
  }

  if (theme.skillStyle === 'chips') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {section.entries.map((entry) => {
          const score = getSkillLevelScore(entry.fields.level || '');
          return (
            <span key={entry.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '999px', background: onDark ? 'rgba(255,255,255,0.1)' : theme.accentSoft, color: textColor }}>
              <span>{entry.fields.name || entry.fields.title}</span>
              {score > 0 && (
                <span style={{ display: 'inline-flex', gap: '3px' }}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} style={{ width: '5px', height: '5px', borderRadius: '999px', background: index < score ? theme.accent : lineColor }} />
                  ))}
                </span>
              )}
            </span>
          );
        })}
      </div>
    );
  }

  if (theme.skillStyle === 'bars') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {section.entries.map((entry) => {
          const score = getSkillLevelScore(entry.fields.level || '');
          return (
            <div key={entry.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '4px', color: textColor }}>
                <span>{entry.fields.name || entry.fields.title}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '4px' }}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} style={{ height: '5px', borderRadius: '999px', background: index < score ? theme.accent : lineColor }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (theme.skillStyle === 'dots') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: textColor }}>
        {section.entries.map((entry) => {
          const score = getSkillLevelScore(entry.fields.level || '');
          return (
            <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
              <span>{entry.fields.name || entry.fields.title}</span>
              <span style={{ display: 'inline-flex', gap: '4px' }}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} style={{ width: '8px', height: '8px', borderRadius: '999px', background: index < score ? theme.accent : lineColor }} />
                ))}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: textColor }}>
      {section.entries.map((entry) => (
        <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <span>{entry.fields.name || entry.fields.title}</span>
        </div>
      ))}
    </div>
  );
}

function LanguagesSection({
  onDark = false,
  section,
  theme,
}: {
  onDark?: boolean;
  section: CVSection;
  theme: TemplateTheme;
}) {
  const textColor = onDark ? theme.sidebarText ?? '#ffffff' : theme.text;
  const mutedColor = onDark ? 'rgba(255,255,255,0.72)' : theme.muted;
  const lineColor = onDark ? 'rgba(255,255,255,0.18)' : theme.line;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {section.entries.map((entry) => (
        <LanguageEntry
          key={entry.id}
          entry={entry}
          languageStyle={theme.languageStyle}
          accent={theme.accent}
          accentSoft={theme.accentSoft}
          textColor={textColor}
          mutedColor={mutedColor}
          lineColor={lineColor}
        />
      ))}
    </div>
  );
}

function LanguageEntry({
  accent,
  accentSoft,
  entry,
  languageStyle,
  lineColor,
  mutedColor,
  textColor,
}: {
  accent: string;
  accentSoft: string;
  entry: CVEntry;
  languageStyle: LanguageStyle;
  lineColor: string;
  mutedColor: string;
  textColor: string;
}) {
  const lang = useCVStore((s) => s.language);
  const name = entry.fields.language || entry.fields.name || entry.fields.title;
  const score = getLangScore(entry.fields.proficiency || '');
  const cefrLabel = getLangLevel(entry.fields.proficiency || '', 'cefr', lang) || entry.fields.proficiency || '';
  const wordLabel = getLangLevel(entry.fields.proficiency || '', 'words', lang) || entry.fields.proficiency || '';

  if (languageStyle === 'bars') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
          <span style={{ color: textColor }}>{name}</span>
          <span style={{ color: mutedColor, fontSize: '10px' }}>{cefrLabel}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '4px' }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} style={{ height: '5px', borderRadius: '999px', background: index < score ? accent : lineColor }} />
          ))}
        </div>
      </div>
    );
  }

  if (languageStyle === 'dots') {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: textColor }}>{name}</span>
        <span style={{ display: 'inline-flex', gap: '4px' }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} style={{ width: '8px', height: '8px', borderRadius: '999px', background: index < score ? accent : lineColor }} />
          ))}
        </span>
      </div>
    );
  }

  if (languageStyle === 'words') {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <span style={{ color: textColor }}>{name}</span>
        <span style={{ color: mutedColor }}>{wordLabel}</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
      <span style={{ color: textColor }}>{name}</span>
      <span style={{ padding: '3px 8px', borderRadius: '999px', background: accentSoft, color: accent, fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em' }}>
        {cefrLabel}
      </span>
    </div>
  );
}

function EntryBlock({
  borderColor,
  entry,
  onDark,
  theme,
  titleColor,
}: {
  borderColor: string;
  entry: CVEntry;
  onDark: boolean;
  theme: TemplateTheme;
  titleColor: string;
}) {
  const language = useCVStore((s) => s.language);
  const lines = getEntryDetailLines(entry);
  const subtitle = getEntrySubtitle(entry);
  const date = getEntryDate(entry, language);
  const padding =
    theme.entryStyle === 'card'
      ? '14px 16px'
      : theme.entryStyle === 'timeline'
        ? '0 0 0 14px'
        : theme.entryStyle === 'bordered'
          ? '0 0 0 12px'
          : '0';

  return (
    <div
      style={{
        position: 'relative',
        padding,
        borderRadius: theme.entryStyle === 'card' ? '14px' : 0,
        background: theme.entryStyle === 'card' ? (onDark ? 'rgba(255,255,255,0.08)' : theme.accentSoft) : 'transparent',
        borderLeft:
          theme.entryStyle === 'timeline' || theme.entryStyle === 'bordered'
            ? `2px solid ${theme.entryStyle === 'timeline' ? theme.accent : borderColor}`
            : 'none',
      }}
    >
      {theme.entryStyle === 'timeline' && (
        <span style={{ position: 'absolute', left: '-5px', top: '6px', width: '8px', height: '8px', borderRadius: '999px', background: theme.accent }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'baseline' }}>
        <span style={{ color: titleColor, fontWeight: 700, fontSize: '12px' }}>{getEntryTitle(entry)}</span>
        {date && <span style={{ color: onDark ? 'rgba(255,255,255,0.72)' : theme.muted, fontSize: '10px' }}>{date}</span>}
      </div>

      {subtitle && <div style={{ marginTop: '2px', color: theme.accent, fontWeight: 600 }}>{subtitle}</div>}

      {lines.length > 0 && (
        <ul style={{ margin: '6px 0 0 16px', padding: 0, color: onDark ? 'rgba(255,255,255,0.8)' : theme.muted }}>
          {lines.map((line) => (
            <li key={line} style={{ marginBottom: '3px' }}>{line}</li>
          ))}
        </ul>
      )}

      {entry.fields.technologies && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          {entry.fields.technologies.split(',').map((tech) => (
            <span key={tech} style={{ padding: '3px 8px', borderRadius: '999px', background: onDark ? 'rgba(255,255,255,0.1)' : theme.accentSoft, color: onDark ? titleColor : theme.accentDark, fontSize: '9.5px' }}>
              {tech.trim()}
            </span>
          ))}
        </div>
      )}

      {entry.fields.url && <div style={{ marginTop: '6px', color: theme.accent, fontSize: '10px' }}>{entry.fields.url}</div>}
    </div>
  );
}

export function SectionEyebrow({ theme, title }: { theme: TemplateTheme; title: string }) {
  return (
    <div style={{ marginBottom: '8px', color: theme.accent, fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
      {title}
    </div>
  );
}
