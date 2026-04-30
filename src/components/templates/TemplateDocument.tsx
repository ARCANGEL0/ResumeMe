import { Fragment, useState, type CSSProperties } from 'react';
import { getDropSectionLabel, t, type UILanguage } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData, CVEntry, CVSection, TemplateId, TemplateLayoutState } from '../../types/cv';
import ContactIcon from '../../ui/ContactIcon';
import { TEMPLATE_THEMES, type ContactStyle, type LanguageStyle } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import {
  getContactItems,
  getEntryDate,
  getEntryDetailLines,
  getEntrySubtitle,
  getEntryTitle,
  getLanguageProficiencyLabel,
  getLanguageProficiencyScore,
  getSkillLevelScore,
  type ContactItem,
} from './templateUtils';

type TemplateTheme = (typeof TEMPLATE_THEMES)[TemplateId];

interface TemplateDocumentProps {
  data: CVData;
  templateId?: TemplateId;
  layoutEditor?: TemplateLayoutEditor;
}

interface TemplateRenderContext {
  activeTemplate: TemplateId;
  baseStyle: CSSProperties;
  contactItems: ContactItem[];
  displayName: string;
  language: UILanguage;
  leadRole: string;
  sections: CVSection[];
  summary: string;
  theme: TemplateTheme;
  layoutState: TemplateLayoutState;
  layoutEditor?: TemplateLayoutEditor;
}

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

export default function TemplateDocument({ data, templateId, layoutEditor }: TemplateDocumentProps) {
  const language = useCVStore((state) => state.language);
  const activeTemplate = templateId ?? data.selectedTemplate;
  const theme = TEMPLATE_THEMES[activeTemplate];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout(activeTemplate, data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo);
  const summary = personalInfo.summary.trim();
  const leadRole = getLeadRole(sections);

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '11.2px',
    lineHeight: '1.65',
    color: theme.text,
    background: theme.page,
    minHeight: '297mm',
  };

  return renderTemplateVariant({
    activeTemplate,
    baseStyle,
    contactItems,
    displayName,
    language,
    leadRole,
    layoutEditor,
    layoutState,
    sections,
    summary,
    theme,
  });
}

function renderTemplateVariant(context: TemplateRenderContext) {
  switch (context.activeTemplate) {
    case 'minimal':
      return renderMinimalLayout(context);
    case 'north':
      return renderNorthLayout(context);
    case 'modern':
      return renderModernLayout(context);
    case 'classic':
      return renderClassicLayout(context);
    case 'creative':
      return renderCreativeLayout(context);
    case 'professional':
      return renderProfessionalLayout(context);
    case 'executive':
      return renderExecutiveLayout(context);
    case 'slate':
      return renderSlateLayout(context);
    case 'ivory':
      return renderIvoryLayout(context);
    case 'summit':
      return renderSummitLayout(context);
    case 'studio':
      return renderStudioLayout(context);
    case 'atlas':
      return renderAtlasLayout(context);
    case 'dossier':
      return renderDossierLayout(context);
    case 'editorial':
      return renderEditorialLayout(context);
    case 'zenith':
      return renderZenithLayout(context);
    default:
      return renderMinimalLayout(context);
  }
}

function getRegionSections(context: TemplateRenderContext, regionKey: string): CVSection[] {
  return getSectionsForRegion(context.sections, context.layoutState, regionKey);
}

function renderMinimalLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, language, leadRole, layoutEditor, summary, theme } = context;
  const sidebarSections = getRegionSections(context, 'sidebar');
  const mainSectionsResolved = getRegionSections(context, 'main');
  const hasSidebarRegion = sidebarSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <div
        style={{
          height: '10px',
          background: `linear-gradient(90deg, ${theme.accent}, ${theme.line}, ${theme.accent})`,
        }}
      />

      <div style={{ padding: '34px 42px 42px' }}>
        <div style={{ paddingBottom: '24px', borderBottom: `1px solid ${theme.line}` }}>
          <HeaderBlock
            displayName={displayName}
            subtitle={leadRole}
            summary={summary}
            contactItems={contactItems}
            theme={theme}
            language={language}
            titleSize="29px"
            showSummaryLabel={false}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: hasSidebarRegion ? 'minmax(0, 1.55fr) minmax(190px, 0.84fr)' : '1fr',
            gap: '32px',
            marginTop: '28px',
          }}
        >
          <SectionColumn sections={mainSectionsResolved} theme={theme} regionKey="main" layoutEditor={layoutEditor} />

          {hasSidebarRegion && (
            <div style={{ paddingLeft: '10px', borderLeft: `1px solid ${theme.line}` }}>
              <SectionColumn sections={sidebarSections} theme={theme} regionKey="sidebar" layoutEditor={layoutEditor} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function renderNorthLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, language, leadRole, layoutEditor, summary, theme } = context;
  const sidebarSections = getRegionSections(context, 'sidebar');
  const mainSections = getRegionSections(context, 'main');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '34px 34px 36px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 0.82fr) minmax(0, 1.45fr)',
            gap: '28px',
          }}
        >
          <aside
            style={{
              padding: '24px',
              border: `1px solid ${theme.line}`,
              borderRadius: 0,
              background: `linear-gradient(180deg, ${theme.accentSoft}, #ffffff 58%)`,
            }}
          >
            <div
              style={{
                color: theme.accent,
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              {t(language, 'contact')}
            </div>

            <div style={{ marginTop: '16px' }}>
              <ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" />
            </div>

            {summary && (
              <div style={{ marginTop: '22px' }}>
                <SectionEyebrow title={t(language, 'profile')} theme={theme} />
                <SummaryBlock summary={summary} theme={theme} />
              </div>
            )}

            {(sidebarSections.length > 0 || layoutEditor) && (
              <div style={{ marginTop: '26px' }}>
                <SectionPanels
                  sections={sidebarSections}
                  theme={theme}
                  regionKey="sidebar"
                  layoutEditor={layoutEditor}
                  shellStyle={{
                    padding: '16px 18px',
                    borderRadius: 0,
                    background: '#ffffff',
                    border: `1px solid ${theme.line}`,
                  }}
                />
              </div>
            )}
          </aside>

          <main style={{ paddingTop: '8px' }}>
            <HeaderBlock
              displayName={displayName}
              subtitle={leadRole}
              summary=""
              contactItems={[]}
              theme={theme}
              language={language}
              titleSize="33px"
              showDivider
              hideContact
            />

            <div style={{ marginTop: '28px' }}>
              <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function renderModernLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, language, leadRole, layoutEditor, summary, theme } = context;
  const sidebarSections = getRegionSections(context, 'sidebar');
  const mainSections = getRegionSections(context, 'main');

  return (
    <div style={{ ...baseStyle, display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr)' }}>
      <aside
        style={{
          padding: '34px 22px 30px',
          background: theme.sidebarBg,
          color: theme.text,
          borderRight: `1px solid ${theme.line}`,
        }}
      >
        <HeaderBlock
          displayName={displayName}
          subtitle={leadRole}
          summary={summary}
          contactItems={contactItems}
          theme={theme}
          language={language}
          compact
          contactStyle="stack"
          titleSize="24px"
        />

        {(sidebarSections.length > 0 || layoutEditor) && (
          <div style={{ marginTop: '24px' }}>
            <SectionColumn sections={sidebarSections} theme={theme} regionKey="sidebar" layoutEditor={layoutEditor} />
          </div>
        )}
      </aside>

      <main style={{ padding: '34px 38px 36px' }}>
        <div style={{ marginBottom: '22px', paddingBottom: '16px', borderBottom: `1px solid ${theme.line}` }} />

        <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />
      </main>
    </div>
  );
}

function renderClassicLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, language, leadRole, layoutEditor, summary, theme } = context;
  const leftBottomSections = getRegionSections(context, 'bottomLeft');
  const rightBottomSections = getRegionSections(context, 'bottomRight');
  const mainSections = getRegionSections(context, 'main');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '34px 48px 38px' }}>
        <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: `1px solid ${theme.line}` }}>
          <HeaderBlock
            displayName={displayName}
            subtitle={leadRole}
            summary=""
            contactItems={contactItems}
            theme={theme}
            language={language}
            align="center"
            contactStyle="inline"
            titleSize="31px"
            hideDivider
          />
        </div>

        {summary && (
          <div style={{ marginTop: '20px', marginBottom: '28px' }}>
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}

        <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />

        {(leftBottomSections.length > 0 || rightBottomSections.length > 0 || layoutEditor) && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              gap: '28px',
              marginTop: '28px',
              paddingTop: '24px',
              borderTop: `1px solid ${theme.line}`,
            }}
          >
            <SectionColumn sections={leftBottomSections} theme={theme} regionKey="bottomLeft" layoutEditor={layoutEditor} />
            <SectionColumn sections={rightBottomSections} theme={theme} regionKey="bottomRight" layoutEditor={layoutEditor} />
          </div>
        )}
      </div>
    </div>
  );
}

function renderCreativeLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, language, layoutEditor, leadRole, summary, theme } = context;
  const topUtilitySections = getRegionSections(context, 'utility');
  const storyLeftSections = getRegionSections(context, 'storyLeft');
  const storyRightSections = getRegionSections(context, 'storyRight');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '30px 30px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.08fr) minmax(230px, 0.92fr)',
            gap: '18px',
            marginBottom: '22px',
          }}
        >
          <div
            style={{
              padding: '28px 26px',
              borderRadius: '26px',
              background: `linear-gradient(140deg, ${theme.accentSoft}, #ffffff 56%, rgba(236,72,153,0.08))`,
              border: `1px solid ${theme.line}`,
              alignSelf: 'start',
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: '31px',
                lineHeight: 1.1,
                color: theme.text,
              }}
            >
              {displayName}
            </h1>
            {leadRole && <div style={{ marginTop: '8px', color: theme.muted }}>{leadRole}</div>}
            <div style={{ marginTop: '18px' }}>
              <ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {summary && (
              <div
                style={{
                  padding: '18px 18px 18px 20px',
                  borderRadius: '22px',
                  background: '#ffffff',
                  border: `1px solid ${theme.line}`,
                  boxShadow: `0 18px 32px rgba(32, 26, 48, 0.06)`,
                }}
              >
                <SectionEyebrow title={t(language, 'professionalSummary')} theme={theme} />
                <SummaryBlock summary={summary} theme={theme} />
              </div>
            )}

            {(topUtilitySections.length > 0 || layoutEditor) && (
              <div
                style={{
                  padding: '18px 18px 16px',
                  borderRadius: '22px',
                  background: `linear-gradient(180deg, rgba(236,72,153,0.08), rgba(139,92,246,0.04))`,
                  border: `1px solid ${theme.line}`,
                }}
              >
                <SectionPanels sections={topUtilitySections} theme={theme} regionKey="utility" layoutEditor={layoutEditor} />
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '18px' }}>
          <SectionPanels
            sections={storyLeftSections}
            theme={theme}
            regionKey="storyLeft"
            layoutEditor={layoutEditor}
            shellStyle={{
              padding: '18px 18px 16px',
              borderRadius: '22px',
              background: '#ffffff',
              border: `1px solid ${theme.line}`,
              boxShadow: `0 18px 32px rgba(32, 26, 48, 0.05)`,
            }}
          />
          <SectionPanels
            sections={storyRightSections}
            theme={theme}
            regionKey="storyRight"
            layoutEditor={layoutEditor}
            shellStyle={{
              padding: '18px 18px 16px',
              borderRadius: '22px',
              background: '#ffffff',
              border: `1px solid ${theme.line}`,
              boxShadow: `0 18px 32px rgba(32, 26, 48, 0.05)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function renderProfessionalLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, language, layoutEditor, leadRole, summary, theme } = context;
  const supportingSections = getRegionSections(context, 'supporting');
  const mainSections = getRegionSections(context, 'main');
  const hasSupportingRegion = supportingSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <div
        style={{
          padding: '28px 38px 30px',
          background: theme.headerBg,
          color: theme.headerText,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: summary ? 'minmax(0, 1.3fr) minmax(220px, 0.9fr)' : '1fr',
            gap: '24px',
            alignItems: 'end',
          }}
        >
          <HeaderBlock
            displayName={displayName}
            subtitle={leadRole}
            summary=""
            contactItems={contactItems}
            theme={theme}
            language={language}
            onDark
            contactStyle="inline"
            titleSize="29px"
          />

          {summary && (
            <div
              style={{
                padding: '16px 18px',
                borderRadius: '18px',
                background: 'rgba(255,255,255,0.1)',
              }}
            >
              <SummaryBlock summary={summary} theme={theme} onDark />
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '28px 38px 34px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: hasSupportingRegion ? 'minmax(0, 1.38fr) minmax(220px, 0.82fr)' : '1fr',
            gap: '28px',
          }}
        >
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />

          {hasSupportingRegion && (
            <SectionPanels
              sections={supportingSections}
              theme={theme}
              regionKey="supporting"
              layoutEditor={layoutEditor}
              shellStyle={{
                padding: '16px 18px',
                borderRadius: '18px',
                background: theme.accentSoft,
                border: `1px solid ${theme.line}`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function renderExecutiveLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, language, layoutEditor, leadRole, summary, theme } = context;
  const leftSections = getRegionSections(context, 'left');
  const rightSections = getRegionSections(context, 'right');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '30px 34px 34px' }}>
        <div
          style={{
            marginBottom: '24px',
            padding: '22px 24px 18px',
            borderBottom: `2px solid ${theme.accent}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '24px',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ flex: 1 }}>
              <HeaderBlock
                displayName={displayName}
                subtitle={leadRole}
                summary=""
                contactItems={contactItems}
                theme={theme}
                language={language}
                contactStyle="inline"
                titleSize="31px"
                hideDivider
              />
            </div>

            {summary && (
              <div
                style={{
                  maxWidth: '250px',
                  paddingLeft: '18px',
                  borderLeft: `1px solid ${theme.line}`,
                }}
              >
                <SummaryBlock summary={summary} theme={theme} />
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.26fr) 236px',
            gap: '24px',
          }}
        >
          <SectionColumn sections={leftSections} theme={theme} regionKey="left" layoutEditor={layoutEditor} />
          <SectionPanels
            sections={rightSections}
            theme={theme}
            regionKey="right"
            layoutEditor={layoutEditor}
            shellStyle={{
              padding: '16px 16px 14px',
              borderRadius: '14px',
              background: theme.accentSoft,
              border: `1px solid ${theme.line}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function renderSlateLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, language, layoutEditor, leadRole, summary, theme } = context;
  const sidebarSections = getRegionSections(context, 'sidebar');
  const mainSections = getRegionSections(context, 'main');

  return (
    <div style={{ ...baseStyle, display: 'grid', gridTemplateColumns: 'minmax(0, 1.44fr) 224px' }}>
      <main style={{ padding: '34px 36px 36px' }}>
        <HeaderBlock
          displayName={displayName}
          subtitle={leadRole}
          summary={summary}
          contactItems={[]}
          theme={theme}
          language={language}
          titleSize="30px"
          hideContact
        />

        <div style={{ marginTop: '26px' }}>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />
        </div>
      </main>

      <aside
        style={{
          padding: '30px 18px 28px',
          background: theme.sidebarBg,
          color: theme.sidebarText,
        }}
      >
        <SectionEyebrow title={t(language, 'contact')} theme={theme} />
        <ContactPanel contactItems={contactItems} theme={theme} onDark contactStyle="stack" />
        <div style={{ marginTop: '22px' }}>
          <SectionColumn sections={sidebarSections} theme={theme} onDark regionKey="sidebar" layoutEditor={layoutEditor} />
        </div>
      </aside>
    </div>
  );
}

function renderIvoryLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, language, layoutEditor, leadRole, summary, theme } = context;
  const sideSections = getRegionSections(context, 'side');
  const mainSections = getRegionSections(context, 'main');
  const hasSideRegion = sideSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={{ ...baseStyle, padding: '22px' }}>
      <div
        style={{
          minHeight: 'calc(297mm - 44px)',
          border: `1px solid ${theme.line}`,
          padding: '28px 34px 30px',
          boxShadow: `inset 0 0 0 5px ${theme.accentSoft}`,
        }}
      >
          <div style={{ textAlign: 'center', paddingBottom: '18px', borderBottom: `1px solid ${theme.line}` }}>
            <HeaderBlock
              displayName={displayName}
              subtitle={leadRole}
              summary=""
              contactItems={contactItems}
              theme={theme}
              language={language}
              align="center"
              contactStyle="inline"
              titleSize="30px"
              hideDivider
            />
          </div>

          {summary && (
            <div style={{ margin: '18px auto 24px', maxWidth: '86%' }}>
              <SummaryBlock summary={summary} theme={theme} />
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: hasSideRegion ? 'minmax(0, 1.28fr) minmax(210px, 0.78fr)' : '1fr',
              gap: '30px',
            }}
          >
            <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />
            {hasSideRegion && <SectionColumn sections={sideSections} theme={theme} regionKey="side" layoutEditor={layoutEditor} />}
          </div>
      </div>
    </div>
  );
}

function renderSummitLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, language, layoutEditor, leadRole, summary, theme } = context;
  const sideSections = getRegionSections(context, 'side');
  const mainSections = getRegionSections(context, 'main');
  const hasSideRegion = sideSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <div style={{ padding: '26px 30px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.08fr) minmax(220px, 0.92fr)',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              padding: '22px 24px',
              borderRadius: '24px',
              background: '#ffffff',
              border: `1px solid ${theme.line}`,
            }}
          >
            <h1 style={{ margin: 0, fontSize: '30px', lineHeight: 1.08, color: theme.accentDark }}>{displayName}</h1>
            {leadRole && <div style={{ marginTop: '8px', color: theme.muted }}>{leadRole}</div>}
            <div style={{ marginTop: '18px' }}>
              <ContactPanel contactItems={contactItems} theme={theme} contactStyle="pills" />
            </div>
          </div>

          {summary && (
            <div
              style={{
                padding: '20px 20px 18px',
                borderRadius: '24px',
                background: `linear-gradient(180deg, ${theme.accentSoft}, rgba(255,255,255,0.96))`,
                border: `1px solid ${theme.line}`,
              }}
            >
              <SectionEyebrow title={t(language, 'professionalSummary')} theme={theme} />
              <SummaryBlock summary={summary} theme={theme} />
            </div>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: hasSideRegion ? 'minmax(0, 1.34fr) minmax(220px, 0.82fr)' : '1fr',
            gap: '22px',
          }}
        >
          <SectionPanels
            sections={mainSections}
            theme={theme}
            regionKey="main"
            layoutEditor={layoutEditor}
            shellStyle={{
              padding: '18px 18px 16px',
              borderRadius: '20px',
              background: '#ffffff',
              border: `1px solid ${theme.line}`,
            }}
          />

          {hasSideRegion && (
            <SectionPanels
              sections={sideSections}
              theme={theme}
              regionKey="side"
              layoutEditor={layoutEditor}
              shellStyle={{
                padding: '16px 18px',
                borderRadius: '20px',
                background: theme.accentSoft,
                border: `1px solid ${theme.line}`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function renderStudioLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, language, layoutEditor, leadRole, summary, theme } = context;
  const mainSections = getRegionSections(context, 'main');
  const sideSections = getRegionSections(context, 'side');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '30px 30px 32px' }}>
        <div
          style={{
            padding: '26px 28px 24px',
            borderRadius: '28px',
            background: `linear-gradient(145deg, rgba(219,39,119,0.1), rgba(255,255,255,0.98) 45%, rgba(124,58,237,0.08))`,
            border: `1px solid ${theme.line}`,
            marginBottom: '22px',
          }}
        >
          <HeaderBlock
            displayName={displayName}
            subtitle={leadRole}
            summary=""
            contactItems={contactItems}
            theme={theme}
            language={language}
            contactStyle="pills"
            titleSize="31px"
            hideDivider
          />
          {summary && <div style={{ marginTop: '18px', maxWidth: '620px' }}><SummaryBlock summary={summary} theme={theme} /></div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.28fr) 230px', gap: '22px' }}>
          <SectionPanels
            sections={mainSections}
            theme={theme}
            regionKey="main"
            layoutEditor={layoutEditor}
            shellStyle={{
              padding: '18px 18px 16px',
              borderRadius: '22px',
              background: '#ffffff',
              border: `1px solid ${theme.line}`,
              boxShadow: `0 16px 30px rgba(31,26,36,0.06)`,
            }}
          />
          <SectionPanels
            sections={sideSections}
            theme={theme}
            regionKey="side"
            layoutEditor={layoutEditor}
            shellStyle={{
              padding: '16px',
              borderRadius: '22px',
              background: theme.accentSoft,
              border: `1px solid ${theme.line}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function renderAtlasLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, layoutEditor, leadRole, summary, theme } = context;
  const leftSections = getRegionSections(context, 'left');
  const rightSections = getRegionSections(context, 'right');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '28px 30px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.24fr) 218px',
            gap: '22px',
            marginBottom: '22px',
          }}
        >
          <div
            style={{
              padding: '22px 24px 20px',
              background: '#ffffff',
              borderLeft: `8px solid ${theme.accent}`,
            }}
          >
            <h1 style={{ margin: 0, fontSize: '31px', lineHeight: 1.08, color: theme.accentDark, fontWeight: 800 }}>{displayName}</h1>
            {leadRole && <div style={{ marginTop: '8px', color: theme.muted }}>{leadRole}</div>}
            <div style={{ marginTop: '16px' }}>
              <ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" />
            </div>
          </div>

          <div
            style={{
              padding: '18px 18px 16px',
              background: `linear-gradient(180deg, ${theme.accentSoft}, #ffffff)`,
              border: `1px solid ${theme.line}`,
            }}
          >
            {summary && <div style={{ marginTop: '16px' }}><SummaryBlock summary={summary} theme={theme} /></div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) 218px', gap: '22px' }}>
          <SectionColumn sections={leftSections} theme={theme} regionKey="left" layoutEditor={layoutEditor} />
          <SectionPanels
            sections={rightSections}
            theme={theme}
            regionKey="right"
            layoutEditor={layoutEditor}
            shellStyle={{
              padding: '16px 16px 14px',
              background: '#ffffff',
              border: `1px solid ${theme.line}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function renderDossierLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, layoutEditor, leadRole, summary, theme } = context;
  const mainSections = getRegionSections(context, 'main');
  const sideSections = getRegionSections(context, 'side');
  const hasSideRegion = sideSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <div style={{ padding: '28px 30px 28px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.12fr) minmax(240px, 0.88fr)',
            gap: '18px',
            marginBottom: '18px',
            padding: '18px 20px',
            border: `1px solid ${theme.line}`,
            background: '#ffffff',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '29px', lineHeight: 1.12, color: '#111111', fontWeight: 800 }}>{displayName}</h1>
            {leadRole && <div style={{ marginTop: '6px', color: theme.accent }}>{leadRole}</div>}
          </div>

          <div>
            <ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" />
          </div>
        </div>

        {summary && (
          <div
            style={{
              marginBottom: '22px',
              padding: '14px 16px',
              borderLeft: `3px solid ${theme.accent}`,
              background: theme.accentSoft,
            }}
          >
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: hasSideRegion ? 'minmax(0, 1.46fr) minmax(210px, 0.78fr)' : '1fr',
            gap: '24px',
          }}
        >
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />
          {hasSideRegion && <SectionColumn sections={sideSections} theme={theme} regionKey="side" layoutEditor={layoutEditor} />}
        </div>
      </div>
    </div>
  );
}

function renderEditorialLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, layoutEditor, leadRole, summary, theme } = context;
  const leftSections = getRegionSections(context, 'left');
  const middleSections = getRegionSections(context, 'middle');
  const rightSections = getRegionSections(context, 'right');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '28px 34px 30px' }}>
        <div style={{ textAlign: 'center', paddingBottom: '18px', borderBottom: `1px solid ${theme.line}` }}>
          <h1 style={{ margin: 0, fontSize: '31px', letterSpacing: '0.08em', textTransform: 'uppercase', color: theme.text }}>{displayName}</h1>
          {leadRole && <div style={{ marginTop: '8px', color: theme.accent }}>{leadRole}</div>}
          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center' }}>
            <ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" align="center" />
          </div>
        </div>

        {summary && (
          <div style={{ margin: '20px auto 24px', maxWidth: '82%' }}>
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '0.88fr 1.2fr 0.88fr',
            gap: '24px',
          }}
        >
          <div style={{ paddingRight: '20px', borderRight: `1px solid ${theme.line}` }}>
            <SectionColumn sections={leftSections} theme={theme} regionKey="left" layoutEditor={layoutEditor} />
          </div>
          <div>
            <SectionColumn sections={middleSections} theme={theme} regionKey="middle" layoutEditor={layoutEditor} />
          </div>
          <div style={{ paddingLeft: '20px', borderLeft: `1px solid ${theme.line}` }}>
            <SectionColumn sections={rightSections} theme={theme} regionKey="right" layoutEditor={layoutEditor} />
          </div>
        </div>
      </div>
    </div>
  );
}

function renderZenithLayout(context: TemplateRenderContext) {
  const { baseStyle, contactItems, displayName, language, layoutEditor, leadRole, summary, theme } = context;
  const leadSections = getRegionSections(context, 'lead');
  const supportSections = getRegionSections(context, 'support');

  return (
    <div style={baseStyle}>
      <div
        style={{
          padding: '28px 34px 24px',
          borderBottom: `6px solid ${theme.accentAlt}`,
        }}
      >
        <HeaderBlock
          displayName={displayName}
          subtitle={leadRole}
          summary=""
          contactItems={contactItems}
          theme={theme}
          language={language}
          contactStyle="inline"
          titleSize="31px"
          hideDivider
        />

        {summary && (
          <div
            style={{
              marginTop: '18px',
              maxWidth: '580px',
              paddingLeft: '14px',
              borderLeft: `2px solid ${theme.accent}`,
            }}
          >
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}
      </div>

      <div style={{ padding: '28px 34px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.3fr) 236px',
            gap: '24px',
          }}
        >
          <SectionPanels
            sections={leadSections}
            theme={theme}
            regionKey="lead"
            layoutEditor={layoutEditor}
            shellStyle={{
              padding: '18px 18px 16px',
              borderRadius: '20px',
              background: '#ffffff',
              border: `1px solid ${theme.line}`,
            }}
          />
          <SectionPanels
            sections={supportSections}
            theme={theme}
            regionKey="support"
            layoutEditor={layoutEditor}
            shellStyle={{
              padding: '16px 18px',
              borderRadius: '20px',
              background: theme.accentSoft,
              border: `1px solid ${theme.line}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function HeaderBlock({
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

function ContactPanel({
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

function SummaryBlock({
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

function SectionColumn({
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

function SectionPanels({
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
      <SectionDropZone
        layoutEditor={layoutEditor}
        regionKey={regionKey}
        targetIndex={0}
        empty={sections.length === 0}
      />
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
          <SectionDropZone
            layoutEditor={layoutEditor}
            regionKey={regionKey}
            targetIndex={index + 1}
          />
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
        if (layoutEditor.dragState) {
          setIsOver(true);
        }
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

  const content = <SectionBlock section={section} theme={theme} onDark={onDark} />;

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
      onDragEnd={() => {
        layoutEditor.onDragEnd();
      }}
    >
      <div style={shellStyle}>{content}</div>
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
            <EntryBlock
              key={entry.id}
              entry={entry}
              theme={theme}
              onDark={onDark}
              borderColor={borderColor}
              titleColor={titleColor}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SectionHeading({
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
      <span
        style={{
          color: baseColor,
          fontSize: '12px',
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </span>
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
    const labels = section.entries
      .map((entry) => entry.fields.name || entry.fields.title)
      .filter(Boolean);

    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          textAlign: 'center',
          color: textColor,
        }}
      >
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
            <span
              key={entry.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                borderRadius: '999px',
                background: onDark ? 'rgba(255,255,255,0.1)' : theme.accentSoft,
                color: textColor,
              }}
            >
              <span>{entry.fields.name || entry.fields.title}</span>
              {score > 0 && (
                <span style={{ display: 'inline-flex', gap: '3px' }}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '999px',
                        background: index < score ? theme.accent : lineColor,
                      }}
                    />
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
                  <span
                    key={index}
                    style={{
                      height: '5px',
                      borderRadius: '999px',
                      background: index < score ? theme.accent : lineColor,
                    }}
                  />
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
                  <span
                    key={index}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '999px',
                      background: index < score ? theme.accent : lineColor,
                    }}
                  />
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
  const name = entry.fields.language || entry.fields.name || entry.fields.title;
  const score = getLanguageProficiencyScore(entry.fields.proficiency || '');
  const cefrLabel = getLanguageProficiencyLabel(entry.fields.proficiency || '', 'cefr') || entry.fields.proficiency || '';
  const wordLabel = getLanguageProficiencyLabel(entry.fields.proficiency || '', 'words') || entry.fields.proficiency || '';

  if (languageStyle === 'bars') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
          <span style={{ color: textColor }}>{name}</span>
          <span style={{ color: mutedColor, fontSize: '10px' }}>{cefrLabel}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '4px' }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              style={{
                height: '5px',
                borderRadius: '999px',
                background: index < score ? accent : lineColor,
              }}
            />
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
            <span
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '999px',
                background: index < score ? accent : lineColor,
              }}
            />
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
      <span
        style={{
          padding: '3px 8px',
          borderRadius: '999px',
          background: accentSoft,
          color: accent,
          fontWeight: 700,
          fontSize: '10px',
          letterSpacing: '0.08em',
        }}
      >
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
  const lines = getEntryDetailLines(entry);
  const subtitle = getEntrySubtitle(entry);
  const date = getEntryDate(entry);
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
        <span
          style={{
            position: 'absolute',
            left: '-5px',
            top: '6px',
            width: '8px',
            height: '8px',
            borderRadius: '999px',
            background: theme.accent,
          }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'baseline' }}>
        <span style={{ color: titleColor, fontWeight: 700, fontSize: '12px' }}>{getEntryTitle(entry)}</span>
        {date && <span style={{ color: onDark ? 'rgba(255,255,255,0.72)' : theme.muted, fontSize: '10px' }}>{date}</span>}
      </div>

      {subtitle && <div style={{ marginTop: '2px', color: theme.accent, fontWeight: 600 }}>{subtitle}</div>}

      {lines.length > 0 && (
        <ul style={{ margin: '6px 0 0 16px', padding: 0, color: onDark ? 'rgba(255,255,255,0.8)' : theme.muted }}>
          {lines.map((line) => (
            <li key={line} style={{ marginBottom: '3px' }}>
              {line}
            </li>
          ))}
        </ul>
      )}

      {entry.fields.technologies && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          {entry.fields.technologies.split(',').map((tech) => (
            <span
              key={tech}
              style={{
                padding: '3px 8px',
                borderRadius: '999px',
                background: onDark ? 'rgba(255,255,255,0.1)' : theme.accentSoft,
                color: onDark ? titleColor : theme.accentDark,
                fontSize: '9.5px',
              }}
            >
              {tech.trim()}
            </span>
          ))}
        </div>
      )}

      {entry.fields.url && <div style={{ marginTop: '6px', color: theme.accent, fontSize: '10px' }}>{entry.fields.url}</div>}
    </div>
  );
}

function SectionEyebrow({ theme, title }: { theme: TemplateTheme; title: string }) {
  return (
    <div
      style={{
        marginBottom: '8px',
        color: theme.accent,
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
      }}
    >
      {title}
    </div>
  );
}

function getLeadRole(sections: CVSection[]): string {
  const experienceSection = sections.find((section) => section.type === 'experience');
  const leadEntry = experienceSection?.entries.find(
    (entry) => entry.fields.position?.trim() || entry.fields.company?.trim(),
  );

  if (!leadEntry) return '';

  return [leadEntry.fields.position, leadEntry.fields.company].filter(Boolean).join(' · ');
}
