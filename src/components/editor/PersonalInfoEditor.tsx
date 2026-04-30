import { useState } from 'react';
import ContactIcon from '../../ui/ContactIcon';
import { getSocialPlatformLabel, t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import { SOCIAL_PLATFORM_OPTIONS, type SocialPlatform } from '../../types/cv';
import FieldEditor from './FieldEditor';

export default function PersonalInfoEditor() {
  const {
    addSocialLink,
    language,
    personalInfo,
    removeSocialLink,
    updatePersonalInfo,
  } = useCVStore();
  const [draftPlatform, setDraftPlatform] = useState<SocialPlatform>('custom');
  const [draftValue, setDraftValue] = useState('');

  const handleAddSocialLink = () => {
    const value = draftValue.trim();
    if (!value) return;

    addSocialLink(draftPlatform, value);
    setDraftValue('');
    setDraftPlatform('custom');
  };

  const getPlatformLabel = (platform: SocialPlatform) => {
    return getSocialPlatformLabel(language, platform, '');
  };

  return (
    <div className="editor-card">
      <div className="editor-card__intro">
        <div className="editor-card__title">{t(language, 'contactDetails')}</div>
        <p className="editor-card__description">
          {t(language, 'contactDescription')}
        </p>
      </div>

      <div className="editor-grid">
        <FieldEditor
          label={t(language, 'fullName')}
          value={personalInfo.fullName}
          onChange={(value) => updatePersonalInfo('fullName', value)}
          placeholder={t(language, 'fullNamePlaceholder')}
        />
        <FieldEditor
          label={t(language, 'email')}
          value={personalInfo.email}
          onChange={(value) => updatePersonalInfo('email', value)}
          placeholder={t(language, 'emailPlaceholder')}
        />
        <FieldEditor
          label={t(language, 'phone')}
          value={personalInfo.phone}
          onChange={(value) => updatePersonalInfo('phone', value)}
          placeholder={t(language, 'phonePlaceholder')}
        />
        <FieldEditor
          label={t(language, 'location')}
          value={personalInfo.location}
          onChange={(value) => updatePersonalInfo('location', value)}
          placeholder={t(language, 'locationPlaceholder')}
        />
        <FieldEditor
          label={t(language, 'professionalSummary')}
          value={personalInfo.summary}
          onChange={(value) => updatePersonalInfo('summary', value)}
          type="textarea"
          placeholder={t(language, 'professionalSummaryPlaceholder')}
          className="editor-field--full"
        />
      </div>

      <div className="editor-socials">
        <div className="editor-socials__header">
          <div className="editor-card__title">{t(language, 'socialLinks')}</div>
          <p className="editor-card__description">
            {t(language, 'socialLinksDescription')}
          </p>
        </div>

        {personalInfo.socials.length > 0 && (
          <div className="editor-social-list">
            {personalInfo.socials.map((social) => {
              return (
                <div key={social.id} className="editor-social-item">
                  <span className="editor-social-item__icon" aria-hidden="true">
                    <ContactIcon name={social.platform} />
                  </span>
                  <div className="editor-social-item__content">
                    <span className="editor-social-item__label">{getPlatformLabel(social.platform)}</span>
                    <span className="editor-social-item__value">{social.value}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSocialLink(social.id)}
                    className="section-action"
                    aria-label={t(language, 'remove')}
                    title={t(language, 'remove')}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="editor-social-create">
          <div className="editor-field">
            <label>{t(language, 'socialPlatform')}</label>
            <div className="editor-social-create__platform">
              <span className="editor-social-create__platform-icon" aria-hidden="true">
                <ContactIcon name={draftPlatform} />
              </span>
              <select
                value={draftPlatform}
                onChange={(event) => setDraftPlatform(event.target.value as SocialPlatform)}
              >
                {SOCIAL_PLATFORM_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {getPlatformLabel(option.id)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <FieldEditor
            label={t(language, 'socialValue')}
            value={draftValue}
            onChange={setDraftValue}
            placeholder={t(language, 'socialValuePlaceholder')}
          />

          <button
            type="button"
            onClick={handleAddSocialLink}
            className="primary-action primary-action--nav editor-social-create__add"
          >
            {t(language, 'add')}
          </button>
        </div>
      </div>
    </div>
  );
}
