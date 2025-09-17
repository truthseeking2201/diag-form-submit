import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CATALOG } from '../data/catalog';
import { useForm } from '../hooks/useForm';
import { useLocale } from '../i18n/LocaleContext';

function normalize(s: string) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightLabel(label: string, query: string): React.ReactNode {
  if (!query.trim()) return label;
  const regex = new RegExp(escapeRegExp(query), 'ig');
  const parts: Array<string | React.ReactNode> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(label)) !== null) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      parts.push(label.slice(lastIndex, start));
    }
    const matchText = label.slice(start, start + match[0].length);
    parts.push(
      <mark key={`${start}-${matchText}`}>{matchText}</mark>
    );
    lastIndex = start + match[0].length;
  }

  if (lastIndex < label.length) {
    parts.push(label.slice(lastIndex));
  }

  return parts;
}

export const TestPicker: React.FC = () => {
  const { data, toggleItem, selectAllIn, clearIn, setOtherTest, totalSelected } = useForm();
  const { locale, t } = useLocale();
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(CATALOG.map(c => [c.id, true]))
  );

  const q = normalize(query);
  const hasQuery = query.trim().length > 0;
  const matchCount = React.useMemo(() => {
    if (!hasQuery) return 0;
    return CATALOG.reduce((sum, cat) => {
      return (
        sum +
        cat.items.filter(i => normalize(i.en).includes(q) || normalize(i.vi).includes(q)).length
      );
    }, 0);
  }, [q, hasQuery]);

  return (
    <section className="card">
      <h2>{t('selectTests')}</h2>
      <p className="card-lead">{t('selectTestsLead')}</p>

      <div className="selection-pill" role="status" aria-live="polite">
        <span>
          {totalSelected > 0
            ? t('bottomBarStep1Ready', {
                count: totalSelected,
                plural: totalSelected > 1 ? 's' : '',
              })
            : t('selectionEmpty')}
        </span>
      </div>

      <div className="search">
        <input
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {!!query && (
          <button className="x" onClick={() => setQuery('')} aria-label="Clear search" type="button">
            ×
          </button>
        )}
        {hasQuery && (
          <span className="search__meta tabular-nums">
            {locale === 'en'
              ? `${matchCount} result${matchCount === 1 ? '' : 's'}`
              : `${matchCount} kết quả`}
          </span>
        )}
      </div>

      <div className="catalog">
        {CATALOG.map(cat => {
          const items = cat.items.filter(i =>
            !q || normalize(i.en).includes(q) || normalize(i.vi).includes(q)
          );
          const total = cat.items.length;
          const selected = cat.items.filter(i => data.selectedItemIds.has(i.id)).length;
          const isOpen = open[cat.id];
          const displayName = locale === 'en' ? cat.nameEn : cat.nameVi;

          return (
            <div key={cat.id} className="category">
              <button
                className="category__header"
                onClick={() => setOpen(o => ({ ...o, [cat.id]: !o[cat.id] }))}
                aria-expanded={isOpen}
                type="button"
              >
                <span className="category__title">{displayName}</span>
                <div className="category__meta">
                  <span className="badge">{selected} / {total}</span>
                  <span className={`category__chevron ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </button>
              <div className="category__toolbar" role="group" aria-label={displayName}>
                <button type="button" onClick={() => selectAllIn(cat.id)}>
                  {t('selectAll')}
                </button>
                <button type="button" onClick={() => clearIn(cat.id)}>
                  {t('clear')}
                </button>
              </div>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
                    className="items"
                  >
                    {items.length === 0 && <li className="muted">{t('searchNoResults')}</li>}
                    {items.map(item => {
                      const on = data.selectedItemIds.has(item.id);
                      const label = locale === 'en' ? item.en : item.vi;
                      return (
                        <li key={item.id}>
                          <button
                            className={`check ${on ? 'on' : ''}`}
                            onClick={() => toggleItem(item.id)}
                            aria-pressed={on}
                            type="button"
                          >
                            <span className="check__box">{on ? '✔' : ''}</span>
                            <span>{highlightLabel(label, query)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div className="category">
          <div className="category__header category__header--static">
            <span className="category__title">{t('otherLabel')}</span>
          </div>
          <input
            className="other"
            placeholder={t('otherPlaceholder')}
            value={data.otherTest}
            onChange={e => setOtherTest(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};
