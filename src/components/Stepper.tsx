import React from 'react';
import { useForm } from '../hooks/useForm';

export const Stepper: React.FC = () => {
  const { step, totalSelected, data } = useForm();
  const labels = ['Patient', 'Tests', 'Review'];
  const hints: [string, string, string] = [
    data.patient.fullName ? data.patient.fullName : 'Add core details',
    totalSelected > 0 ? `${totalSelected} selected` : 'Pick at least one test',
    data.signatureDataUrl ? 'Signed' : 'Signature pending',
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
