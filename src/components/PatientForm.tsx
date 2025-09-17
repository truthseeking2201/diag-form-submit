import React from 'react';
import { useForm } from '../hooks/useForm';
import { SamplePriority, Sex } from '../types';
import { useToast, Toast } from './Toast';

export const PatientForm: React.FC = () => {
  const { data, setPatient, setPriority } = useForm();
  const { msg, show } = useToast();
  const fullNameRef = React.useRef<HTMLInputElement | null>(null);

  const onChange = (field: keyof typeof data.patient) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPatient({ [field]: e.target.value });

  const setSex = (sex: Sex) => setPatient({ sex });
  const setDob = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const today = new Date().toISOString().slice(0, 10);
    setPatient({ dob: val > today ? today : val });
  };

  React.useEffect(() => {
    const timer = setTimeout(() => show('Draft saved'), 600);
    return () => clearTimeout(timer);
  }, [show]);

  React.useEffect(() => {
    fullNameRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <form className="card">
      <h2>Patient Information</h2>
      <p className="card-lead">
        Fast-fill the essentials. We autosave everything, so you can hop between steps without losing context.
      </p>

      <label>
        Full name
        <input
          ref={fullNameRef}
          value={data.patient.fullName}
          onChange={onChange('fullName')}
          placeholder="Enter full name"
        />
      </label>

      <label>
        Date of birth
        <input type="date" value={data.patient.dob} onChange={setDob} />
      </label>

      <label>
        Customer code
        <input value={data.patient.customerCode} onChange={onChange('customerCode')} placeholder="e.g. C12345" />
      </label>

      <label>
        Address
        <input value={data.patient.address} onChange={onChange('address')} placeholder="Street, City" />
      </label>

      <label>
        Clinical diagnosis
        <input value={data.patient.clinicalDiagnosis} onChange={onChange('clinicalDiagnosis')} placeholder="Optional" />
      </label>

      <label>
        National ID
        <input value={data.patient.nationalId} onChange={onChange('nationalId')} placeholder="ID / Passport" />
      </label>

      <fieldset className="segmented">
        <legend>Sex</legend>
        <button type="button" className={data.patient.sex === 'Male' ? 'is-active' : ''} onClick={() => setSex('Male')}>
          Male
        </button>
        <button type="button" className={data.patient.sex === 'Female' ? 'is-active' : ''} onClick={() => setSex('Female')}>
          Female
        </button>
      </fieldset>

      <label>
        Phone
        <input inputMode="tel" value={data.patient.phone} onChange={onChange('phone')} placeholder="e.g. 09xxxxxxxx" />
      </label>

      <label>
        Doctor
        <input value={data.patient.doctor} onChange={onChange('doctor')} placeholder="Doctor's full name" />
      </label>

      <label>
        DOCCODE
        <input value={data.patient.docCode} onChange={onChange('docCode')} />
      </label>

      <fieldset className="segmented">
        <legend>Sample priority</legend>
        {(['Regular', 'Urgent'] as SamplePriority[]).map(p => (
          <button
            key={p}
            type="button"
            className={data.priority === p ? 'is-active' : ''}
            onClick={() => setPriority(p)}
          >
            {p}
          </button>
        ))}
      </fieldset>

      <details className="note">
        <summary>Service window & hotline</summary>
        <p>
          Same-day/next-day execution depends on sample receiving windows at the Cao Thắng location.
          Hotline: <strong>1900 1717</strong> • Website: <strong>diag.vn</strong>.
        </p>
      </details>

      <Toast message={msg} />
    </form>
  );
};
