import React from 'react';
import { useLocale } from '../i18n/LocaleContext';
import { STRINGS } from '../i18n/strings';

export const LocaleSwitch: React.FC = () => {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="locale-switch" role="group" aria-label={t('languageLabel')}>
      <button
        type="button"
        className={`locale-switch__btn ${locale === 'en' ? 'is-active' : ''}`}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
      >
        {STRINGS.en.languageToggle}
      </button>
      <button
        type="button"
        className={`locale-switch__btn ${locale === 'vi' ? 'is-active' : ''}`}
        onClick={() => setLocale('vi')}
        aria-pressed={locale === 'vi'}
      >
        {STRINGS.vi.languageToggleVi}
      </button>
    </div>
  );
};
