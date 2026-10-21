// src/components/templates/templateComponents.tsx
import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { getDropSectionLabel, getRegionDropLabel, t, type UILanguage } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import { beginSectionDrag, isRegionHovered, isZoneHovered, useHoverKey } from './sectionDrag';
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
  getResumeUrlLabel,
  getSkillLevelScore,
  toExternalHref,
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
  regionLabels?: Record<string, string>;
}

export function LinkedText({
  children,
  href,
  style,
}: {
  children: ReactNode;
  href?: string;
  style?: CSSProperties;
}) {
  if (!href) {
    return <span style={style}>{children}</span>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', ...style }}>
      {children}
    </a>
  );
}

export function ResumeUrl({
  onDark = false,
  sectionType,
  style,
  value,
}: {
  onDark?: boolean;
  sectionType: CVSection['type'];
  style?: CSSProperties;
  value: string;
}) {
  const language = useCVStore((state) => state.language);
  const href = toExternalHref(value);

  return (
    <LinkedText
      href={href || undefined}
      style={{
        color: onDark ? 'rgba(255,255,255,0.88)' : undefined,
        textDecoration: href ? 'underline' : 'none',
        overflowWrap: 'anywhere',
        ...style,
      }}
    >
      {getResumeUrlLabel(value, sectionType, language)}
    </LinkedText>
  );
}

export function PhotoFrame({
  border,
  photo,
  radius = '50%',
  size = 96,
}: {
  border?: string;
  photo?: string;
  radius?: string;
  size?: number;
}) {
  if (!photo) return null;

  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        borderRadius: radius,
        border: border ?? 'none',
      }}
    >
      <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </span>
  );
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
  photo,
  photoPlacement = 'above',
  photoRadius = '50%',
  photoSize = 118,
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
  photo?: string;
  photoPlacement?: 'above' | 'left' | 'right';
  photoRadius?: string;
  photoSize?: number;
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
  const isSideBySide = photoPlacement !== 'above';

  const photoNode = photo ? (
    <PhotoFrame
      photo={photo}
      size={photoSize}
      radius={photoRadius}
      border={`3px solid ${onDark ? 'rgba(255,255,255,0.35)' : theme.accent}`}
    />
  ) : null;

  const body = (
    <div style={{ textAlign: headerAlign, marginBottom: compact ? '10px' : 0, minWidth: 0, flex: isSideBySide ? 1 : undefined }}>
      {photoNode && !isSideBySide && (
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: headerAlign === 'center' ? 'center' : 'flex-start' }}>
          {photoNode}
        </div>
      )}
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

  if (!isSideBySide || !photoNode) {
    return body;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '26px' }}>
      {photoPlacement === 'left' && photoNode}
      {body}
      {photoPlacement === 'right' && photoNode}
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
                height: '24px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '999px',
                background: pillBg,
                color: iconColor,
              }}
            >
              <ContactIcon name={item.icon} style={{ width: '14px', height: '14px' }} />
            </span>
            <LinkedText href={item.href}>{item.value}</LinkedText>
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
          <span style={{ display: 'inline-flex', width: '14px', height: '14px', color: iconColor }}>
            <ContactIcon name={item.icon} style={{ width: '100%', height: '100%' }} />
          </span>
          <LinkedText href={item.href} style={{ color: textColor }}>
            {item.value}
          </LinkedText>
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

export function CustomSectionRegion({
  gap = '0',
  layoutEditor,
  regionKey,
  renderSection,
  sections,
}: {
  gap?: string;
  layoutEditor?: TemplateLayoutEditor;
  regionKey: string;
  renderSection: (section: CVSection, index: number) => ReactNode;
  sections: CVSection[];
}) {
  if (!layoutEditor) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap }}>
        {sections.map((section, index) => (
          <Fragment key={section.id}>{renderSection(section, index)}</Fragment>
        ))}
      </div>
    );
  }

  return (
    <RegionShell gap={gap} layoutEditor={layoutEditor} regionKey={regionKey} sectionCount={sections.length}>
      <SectionDropZone layoutEditor={layoutEditor} regionKey={regionKey} targetIndex={0} empty={sections.length === 0} />
      {sections.map((section, index) => (
        <Fragment key={section.id}>
          <div
            className={`template-preview-section ${
              layoutEditor.dragState?.regionKey === regionKey && layoutEditor.dragState?.sectionId === section.id
                ? 'is-source'
                : ''
            }`}
            onPointerDown={(event) => beginSectionDrag(event, layoutEditor, regionKey, section.id)}
          >
            {renderSection(section, index)}
          </div>
          <SectionDropZone layoutEditor={layoutEditor} regionKey={regionKey} targetIndex={index + 1} />
        </Fragment>
      ))}
    </RegionShell>
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
    <RegionShell gap={gap} layoutEditor={layoutEditor} regionKey={regionKey} sectionCount={sections.length}>
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
    </RegionShell>
  );
}

function RegionShell({
  children,
  gap,
  layoutEditor,
  regionKey,
  sectionCount,
}: {
  children: ReactNode;
  gap: string;
  layoutEditor: TemplateLayoutEditor;
  regionKey: string;
  sectionCount: number;
}) {
  const language = useCVStore((state) => state.language);
  const hover = useHoverKey();
  const isDragging = Boolean(layoutEditor.dragState);
  const isOver = isDragging && isRegionHovered(hover, regionKey);
  const label = getRegionDropLabel(language, layoutEditor.regionLabels?.[regionKey] ?? regionKey);

  return (
    <div
      className={`template-preview-region-stack ${isDragging ? 'is-drag-active' : ''} ${isOver ? 'is-region-over' : ''}`}
      style={{ display: 'flex', flexDirection: 'column', gap }}
      data-drop-region=""
      data-region={regionKey}
      data-count={sectionCount}
    >
      {isDragging && <span className="template-preview-region-tag">{label}</span>}
      {children}
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
  const language = useCVStore((state) => state.language);
  const hover = useHoverKey();
  const isActive = Boolean(layoutEditor.dragState);
  const isOver = isActive && isZoneHovered(hover, regionKey, targetIndex);

  return (
    <div
      className={`template-preview-drop-zone ${empty ? 'is-empty' : ''} ${isActive ? 'is-active' : ''} ${isOver ? 'is-over' : ''}`}
      data-drop-zone=""
      data-region={regionKey}
      data-index={targetIndex}
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
    layoutEditor?.dragState?.regionKey === regionKey && layoutEditor?.dragState?.sectionId === section.id;

  return (
    <div
      className={`template-preview-section ${isSource ? 'is-source' : ''}`}
      onPointerDown={(event) => beginSectionDrag(event, layoutEditor, regionKey, section.id)}
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
  return (
    <section>
      <SectionHeading title={section.title} theme={theme} onDark={onDark} />
      <SectionBlockBody section={section} theme={theme} onDark={onDark} />
    </section>
  );
}

export function SectionBlockBody({
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

  if (section.type === 'skills') {
    return <SkillsSection section={section} theme={theme} onDark={onDark} />;
  }

  if (section.type === 'languages') {
    return <LanguagesSection section={section} theme={theme} onDark={onDark} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {section.entries.map((entry) => (
        <EntryBlock key={entry.id} entry={entry} sectionType={section.type} theme={theme} onDark={onDark} borderColor={borderColor} titleColor={titleColor} />
      ))}
    </div>
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

  if (theme.sectionHeading === 'xp') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ color: onDark ? '#ffffff' : theme.accent, fontSize: '12px', fontWeight: 700 }}>{title}</span>
        <span
          style={{
            flex: 1,
            height: '1px',
            background: `linear-gradient(90deg, ${onDark ? 'rgba(255,255,255,0.5)' : theme.accentAlt}, transparent)`,
          }}
        />
      </div>
    );
  }

  if (theme.sectionHeading === 'caps') {
    return (
      <div
        style={{
          marginBottom: '11px',
          color: onDark ? theme.sidebarText ?? '#ffffff' : theme.accent,
          fontSize: '13px',
          fontWeight: 800,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>
    );
  }

  if (theme.sectionHeading === 'underline') {
    return (
      <div
        style={{
          marginBottom: '12px',
          paddingBottom: '5px',
          borderBottom: `1px solid ${onDark ? 'rgba(255,255,255,0.28)' : theme.line}`,
          color: onDark ? theme.sidebarText ?? '#ffffff' : theme.text,
          fontSize: '12.5px',
          fontWeight: 700,
          letterSpacing: '0.07em',
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
  const fillColor = onDark ? '#ffffff' : theme.accent;

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
                    <span key={index} style={{ width: '5px', height: '5px', borderRadius: '999px', background: index < score ? fillColor : lineColor }} />
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
              {score > 0 && (
                <div
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={5}
                  aria-valuenow={score}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '3px' }}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      style={{
                        height: '6px',
                        background: index < score ? fillColor : lineColor,
                        clipPath: 'polygon(14% 0, 100% 0, 86% 100%, 0 100%)',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (theme.skillStyle === 'rounded-segments') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', color: textColor }}>
        {section.entries.map((entry) => {
          const score = getSkillLevelScore(entry.fields.level || '');
          const name = entry.fields.name || entry.fields.title;
          return (
            <div key={entry.id}>
              <div style={{ marginBottom: '4px' }}>{name}</div>
              {score > 0 && (
                <div
                  role="meter"
                  aria-label={`${name} proficiency`}
                  aria-valuemin={0}
                  aria-valuemax={5}
                  aria-valuenow={score}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '3px' }}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      style={{ height: '5px', borderRadius: '2px', background: index < score ? fillColor : lineColor }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (theme.skillStyle === 'solid-bar') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', color: textColor }}>
        {section.entries.map((entry) => {
          const score = getSkillLevelScore(entry.fields.level || '');
          const name = entry.fields.name || entry.fields.title;
          return (
            <div key={entry.id}>
              <div style={{ marginBottom: '4px' }}>{name}</div>
              {score > 0 && (
                <div
                  role="meter"
                  aria-label={`${name} proficiency`}
                  aria-valuemin={0}
                  aria-valuemax={5}
                  aria-valuenow={score}
                  style={{ height: '5px', background: lineColor }}
                >
                  <div style={{ width: `${(score / 5) * 100}%`, height: '100%', background: fillColor }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (theme.skillStyle === 'micro-bars') {
    const barHeights = ['3px', '4.5px', '6px', '7.5px', '9px'];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: textColor }}>
        {section.entries.map((entry) => {
          const score = getSkillLevelScore(entry.fields.level || '');
          const name = entry.fields.name || entry.fields.title;
          return (
            <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <span>{name}</span>
              {score > 0 && (
                <span role="meter" aria-label={`${name} proficiency`} aria-valuemin={0} aria-valuemax={5} aria-valuenow={score} style={{ display: 'inline-flex', flex: '0 0 auto', alignItems: 'flex-end', gap: '2px', height: '9px' }}>
                  {barHeights.map((height, index) => (
                    <span key={index} style={{ width: '3px', height, background: index < score ? fillColor : lineColor }} />
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (theme.skillStyle === 'parallelogram') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {section.entries.map((entry) => {
          const score = getSkillLevelScore(entry.fields.level || '');
          const name = entry.fields.name || entry.fields.title;
          const fill = `${(score / 5) * 100}%`;
          return (
            <div key={entry.id}>
              <div style={{ marginBottom: '4px', color: textColor }}>{name}</div>
              {score > 0 && (
                <div
                  role="meter"
                  aria-label={`${name} proficiency`}
                  aria-valuemin={0}
                  aria-valuemax={5}
                  aria-valuenow={score}
                  style={{
                    height: '6px',
                    background: `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${fill}, ${lineColor} ${fill}, ${lineColor} 100%)`,
                    clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (theme.skillStyle === 'dots' || theme.skillStyle === 'compact-dots') {
    const compact = theme.skillStyle === 'compact-dots';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '5px' : '10px', color: textColor }}>
        {section.entries.map((entry) => {
          const score = getSkillLevelScore(entry.fields.level || '');
          const name = entry.fields.name || entry.fields.title;
          return (
            <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
              <span>{name}</span>
              {score > 0 && (
                <span role="meter" aria-label={`${name} proficiency`} aria-valuemin={0} aria-valuemax={5} aria-valuenow={score} style={{ display: 'inline-flex', flex: '0 0 auto', gap: compact ? '3px' : '4px' }}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} style={{ width: compact ? '5px' : '8px', height: compact ? '5px' : '8px', borderRadius: '999px', background: index < score ? fillColor : lineColor }} />
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (theme.skillStyle === 'retro') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
        {section.entries.map((entry) => {
          const score = getSkillLevelScore(entry.fields.level || '');
          return (
            <div key={entry.id}>
              <div style={{ marginBottom: '4px', color: textColor, fontWeight: 700 }}>
                {entry.fields.name || entry.fields.title}
              </div>
              {score > 0 && <div
                style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '2px',
                  borderRadius: '3px',
                  border: '1px solid #7f9db9',
                  background: '#ffffff',
                }}
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <span
                    key={index}
                    style={{
                      flex: 1,
                      height: '9px',
                      borderRadius: '1px',
                      background:
                        index < score * 2 ? 'linear-gradient(180deg, #8ede82 0%, #3faf3f 55%, #2f8f30 100%)' : 'transparent',
                    }}
                  />
                ))}
              </div>}
            </div>
          );
        })}
      </div>
    );
  }

  if (theme.skillStyle === 'sarif') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {section.entries.map((entry) => {
          const score = getSkillLevelScore(entry.fields.level || '');
          const name = entry.fields.name || entry.fields.title;
          return (
            <div
              key={entry.id}
              style={{
                position: 'relative',
                padding: '10px 12px',
                border: '1px solid rgba(200,168,75,0.3)',
                borderRadius: '4px',
                background: onDark ? 'rgba(0,0,0,0.3)' : 'rgba(200,168,75,0.04)',
                overflow: 'hidden',
              }}
            >
              {/* Sarif corner accents */}
              <span style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '8px', borderTop: '2px solid #c8a84b', borderLeft: '2px solid #c8a84b' }} />
              <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', borderTop: '2px solid #c8a84b', borderRight: '2px solid #c8a84b' }} />
              <span style={{ position: 'absolute', bottom: 0, left: 0, width: '8px', height: '8px', borderBottom: '2px solid #c8a84b', borderLeft: '2px solid #c8a84b' }} />
              <span style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', borderBottom: '2px solid #c8a84b', borderRight: '2px solid #c8a84b' }} />
              
              {/* Skill name */}
              <div
                style={{
                  fontFamily: "'Electrolize', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                  color: onDark ? '#f8fafc' : '#1f2937',
                  letterSpacing: '0.06em',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                }}
              >
                {name}
              </div>
              
              {score > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    flex: 1,
                    height: '4px',
                    background: onDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(score / 5) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #c8a84b, #ffd700)',
                      borderRadius: '2px',
                      transition: 'width 0.6s ease-out',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "'Play', sans-serif",
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#c8a84b',
                    letterSpacing: '0.08em',
                    minWidth: '20px',
                    textAlign: 'right',
                  }}
                >
                  {score}/5
                </span>
              </div>}
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
          meterColor={onDark ? '#ffffff' : theme.accent}
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
  meterColor,
  mutedColor,
  textColor,
}: {
  accent: string;
  accentSoft: string;
  entry: CVEntry;
  languageStyle: LanguageStyle;
  lineColor: string;
  meterColor: string;
  mutedColor: string;
  textColor: string;
}) {
  const lang = useCVStore((s) => s.language);
  const name = entry.fields.language || entry.fields.name || entry.fields.title;
  const score = getLangScore(entry.fields.proficiency || '');
  const cefrLabel = getLangLevel(entry.fields.proficiency || '', 'cefr', lang) || entry.fields.proficiency || '';
  const wordLabel = getLangLevel(entry.fields.proficiency || '', 'words', lang) || entry.fields.proficiency || '';

  if (languageStyle === 'parallelogram') {
    const fill = `${(score / 6) * 100}%`;
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
          <span style={{ color: textColor }}>{name}</span>
          <span style={{ color: mutedColor, fontSize: '10px' }}>{cefrLabel}</span>
        </div>
        <div
          role="meter"
          aria-label={`${name} proficiency`}
          aria-valuemin={0}
          aria-valuemax={6}
          aria-valuenow={score}
          style={{
            height: '5px',
            background: `linear-gradient(to right, ${meterColor} 0%, ${meterColor} ${fill}, ${lineColor} ${fill}, ${lineColor} 100%)`,
            clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)',
          }}
        />
      </div>
    );
  }

  if (languageStyle === 'bars') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
          <span style={{ color: textColor }}>{name}</span>
          <span style={{ color: mutedColor, fontSize: '10px' }}>{cefrLabel}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '4px' }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} style={{ height: '5px', borderRadius: '999px', background: index < score ? meterColor : lineColor }} />
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
            <span key={index} style={{ width: '8px', height: '8px', borderRadius: '999px', background: index < score ? meterColor : lineColor }} />
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
  sectionType,
  theme,
  titleColor,
}: {
  borderColor: string;
  entry: CVEntry;
  onDark: boolean;
  sectionType: CVSection['type'];
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
        {date && <span style={{ color: onDark ? 'rgba(255,255,255,0.72)' : theme.muted, fontSize: '10px', whiteSpace: 'nowrap' }}>{date}</span>}
      </div>

      {subtitle && (
        <div style={{ marginTop: '2px', color: onDark ? 'rgba(255,255,255,0.88)' : theme.accent, fontWeight: 600 }}>
          {subtitle}
        </div>
      )}

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
            <span key={tech} style={{ padding: '3px 8px', borderRadius: theme.projectTagStyle === 'rectangles' ? 0 : '999px', background: theme.projectTagStyle === 'rectangles' ? '#111111' : onDark ? 'rgba(255,255,255,0.1)' : theme.accentSoft, color: theme.projectTagStyle === 'rectangles' ? '#ffffff' : onDark ? titleColor : theme.accentDark, fontSize: '9.5px', fontWeight: theme.projectTagStyle === 'rectangles' ? 700 : 400 }}>
              {tech.trim()}
            </span>
          ))}
        </div>
      )}

      {entry.fields.url && (
        <div style={{ marginTop: '6px', color: onDark ? 'rgba(255,255,255,0.88)' : theme.accent, fontSize: '10px' }}>
          <ResumeUrl value={entry.fields.url} sectionType={sectionType} onDark={onDark} />
        </div>
      )}
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
