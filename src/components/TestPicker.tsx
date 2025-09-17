import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CATALOG } from '../data/catalog';
import { useForm } from '../hooks/useForm';

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
      <h2>Select Tests</h2>
      <p className="card-lead">
        Tap to toggle. Use quick actions per category to select clusters instantly.
      </p>

      <div className="selection-pill" role="status" aria-live="polite">
        <span>{totalSelected > 0 ? `${totalSelected} test${totalSelected > 1 ? 's' : ''} queued` : 'No tests selected yet'}</span>
      </div>

      <div className="search">
        <input
          placeholder="Search tests..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {!!query && (
          <button className="x" onClick={() => setQuery('')} aria-label="Clear search" type="button">
            ×
          </button>
        )}
        {hasQuery && (
          <span className="search__meta tabular-nums">{matchCount} result{matchCount === 1 ? '' : 's'}</span>
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

          return (
            <div key={cat.id} className="category">
              <button
                className="category__header"
                onClick={() => setOpen(o => ({ ...o, [cat.id]: !o[cat.id] }))}
                aria-expanded={isOpen}
                type="button"
              >
                <span className="category__title">{cat.nameEn}</span>
                <span className="badge">{selected} / {total}</span>
              </button>

              <div className="category__actions">
                <button type="button" onClick={() => selectAllIn(cat.id)}>Select all</button>
                <button type="button" onClick={() => clearIn(cat.id)}>Clear</button>
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
                    {items.length === 0 && <li className="muted">No matching items</li>}
                    {items.map(item => {
                      const on = data.selectedItemIds.has(item.id);
                      return (
                        <li key={item.id}>
                          <button
                            className={`check ${on ? 'on' : ''}`}
                            onClick={() => toggleItem(item.id)}
                            aria-pressed={on}
                            type="button"
                          >
                            <span className="check__box">{on ? '✔' : ''}</span>
                            <span>{highlightLabel(item.en, query)}</span>
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
          <div className="category__header"><span className="category__title">Other</span></div>
          <input
            className="other"
            placeholder="Type another test..."
            value={data.otherTest}
            onChange={e => setOtherTest(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};
