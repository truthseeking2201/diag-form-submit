import React from 'react';
import { useForm } from '../hooks/useForm';
import { useLocale } from '../i18n/LocaleContext';

export const Stepper: React.FC = () => {
  const { step, totalSelected, data } = useForm();
  const { t } = useLocale();
  const labels = [t('stepPatient'), t('stepTests'), t('stepReview')];
  const hints: [string, string, string] = [
    data.patient.fullName ? data.patient.fullName : t('stepPatientHintEmpty'),
    totalSelected > 0
      ? t('stepTestsSelected', {
          count: totalSelected,
          plural: totalSelected > 1 ? 's' : '',
        })
      : t('stepTestsHintEmpty'),
    data.signatureDataUrl ? t('signatureCaptured') : t('stepReviewHintEmpty'),
  ];
  return (
    <header className="stepper">
      <div className="stepper__bar">
        <div className="stepper__progress" style={{ width: `${((step + 1) / 3) * 100}%` }} />
      </div>
      <div className="stepper__labels">
        {labels.map((l, i) => (
          <div key={l} className={`stepper__label ${i <= step ? 'is-active' : ''}`}>
            <span>{l}</span>
            <small className="stepper__hint">{hints[i]}</small>
          </div>
        ))}
      </div>
    </header>
  );
};
