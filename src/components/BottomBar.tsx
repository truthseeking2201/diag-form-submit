import React from 'react';
import { useForm } from '../hooks/useForm';

function formatList(values: string[]) {
  if (values.length === 0) return '';
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`;
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
  } = useForm();

  const canNext = step === 0 ? canProceedFromStep0 : step === 1 ? canProceedFromStep1 : true;
  const label = step === 2 ? 'Finish' : 'Continue';

  let helperText = '';
  if (step === 0) {
    helperText = canProceedFromStep0
      ? 'All key patient details captured.'
      : `Add ${formatList(missingPatientFields)} to continue.`;
  } else if (step === 1) {
    helperText = canProceedFromStep1
      ? `${totalSelected} test${totalSelected > 1 ? 's' : ''} queued.`
      : 'Select at least one test or add an “Other” entry.';
  } else {
    helperText = data.signatureDataUrl ? 'Signed • Ready to export.' : 'Capture signature before exporting.';
  }

  return (
    <div className="bottombar" aria-live="polite">
      <div className="bottombar__status">{helperText}</div>
      <div className="bottombar__actions">
        {step > 0 && (
          <button className="btn btn--ghost" onClick={() => setStep((step - 1) as 0 | 1 | 2)}>
            Back
          </button>
        )}
        <button
          className={`btn btn--primary ${canNext ? 'btn--pulse' : 'btn--disabled'}`}
          disabled={!canNext}
          onClick={() => setStep((Math.min(2, step + 1)) as 0 | 1 | 2)}
        >
          {label}
        </button>
      </div>
    </div>
  );
};
