import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from '../hooks/useForm';
import { useLocale } from '../i18n/LocaleContext';
import { exportPdf } from '../utils/pdf';

export const CompletionBanner: React.FC = () => {
  const { completed, data, reset, step } = useForm();
  const { t } = useLocale();

  return (
    <AnimatePresence>
      {completed && step === 2 && (
        <motion.div
          className="completion-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className="completion-card__icon" aria-hidden="true">
            <span>🎉</span>
          </div>
          <div className="completion-card__copy">
            <h2>{t('completionTitle')}</h2>
            <p>{t('completionMessage')}</p>
          </div>
          <div className="completion-card__actions">
            <button className="btn" onClick={() => exportPdf(data)} type="button">
              {t('exportPdf')}
            </button>
            <button className="btn btn--ghost" onClick={reset} type="button">
              {t('startNewForm')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
