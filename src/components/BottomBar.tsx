import React from 'react';
import { useForm } from '../hooks/useForm';
import { useLocale } from '../i18n/LocaleContext';

function formatList(values: string[], locale: 'en' | 'vi') {
  if (values.length === 0) return '';
  if (values.length === 1) return values[0];
  const connector = locale === 'vi' ? ' và ' : ' and ';
  if (values.length === 2) return `${values[0]}${connector}${values[1]}`;
  const separator = locale === 'vi' ? ', ' : ', ';
  return `${values.slice(0, -1).join(separator)}${connector}${values[values.length - 1]}`;
}

export const BottomBar: React.FC = () => {
  const {
    step,
    setStep,
    canProceedFromStep0,
    canProceedFromStep1,
    missingPatientFields,
    totalSelected,
    data,
    complete,
    completed,
  } = useForm();
  const { t, locale } = useLocale();

  const canNext = step === 0 ? canProceedFromStep0 : step === 1 ? canProceedFromStep1 : Boolean(data.signatureDataUrl) && !completed;
  const label = step === 2 ? t('finish') : t('continue');

  let helperText = '';
  if (step === 0) {
    const fieldNames = missingPatientFields.map(key =>
      locale === 'vi' ? t(key).toLowerCase() : t(key)
    );
    helperText = canProceedFromStep0
      ? t('bottomBarStep0Ready')
      : t('bottomBarStep0Missing', {
          fields:
            formatList(fieldNames, locale),
        });
  } else if (step === 1) {
    helperText = canProceedFromStep1
      ? t('bottomBarStep1Ready', {
          count: totalSelected,
          plural: totalSelected > 1 ? 's' : '',
        })
      : t('bottomBarStep1Missing');
  } else {
    helperText = data.signatureDataUrl ? t('bottomBarStep2Ready') : t('bottomBarStep2Missing');
  }

  return (
    <div className="bottombar" aria-live="polite">
      <div className="bottombar__status">{helperText}</div>
      <div className="bottombar__actions">
        {step > 0 && (
          <button className="btn btn--ghost" onClick={() => setStep((step - 1) as 0 | 1 | 2)}>
            {t('back')}
          </button>
        )}
        <button
          className={`btn btn--primary ${canNext ? 'btn--pulse' : 'btn--disabled'}`}
          disabled={!canNext}
          onClick={() => {
            if (step === 2) {
              complete();
            } else {
              setStep((Math.min(2, step + 1)) as 0 | 1 | 2);
            }
          }}
        >
          {label}
        </button>
      </div>
    </div>
  );
};
