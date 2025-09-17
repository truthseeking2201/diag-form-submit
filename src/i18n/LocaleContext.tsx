import React from 'react';
import { STRINGS, Locale } from './strings';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = 'diag_locale';

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(() => {
    if (typeof window === 'undefined') return 'en';
    const cached = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    return cached === 'vi' ? 'vi' : 'en';
  });

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const t = React.useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const dictionary = STRINGS[locale] ?? STRINGS.en;
      const template = dictionary[key] ?? STRINGS.en[key] ?? key;
      if (!params) return template;
      return Object.entries(params).reduce((acc, [paramKey, value]) => {
        const placeholder = `{{${paramKey}}}`;
        return acc.replaceAll(placeholder, String(value));
      }, template);
    },
    [locale]
  );

  const value = React.useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
