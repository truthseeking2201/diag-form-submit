import React from 'react';
import { useForm } from '../hooks/useForm';
import { SamplePriority, Sex } from '../types';
import { CONTACTS } from '../data/contacts';
import { useToast, Toast } from './Toast';
import { useLocale } from '../i18n/LocaleContext';

export const PatientForm: React.FC = () => {
  const { data, setPatient, setPriority } = useForm();
  const { msg, show } = useToast();
  const { locale, t } = useLocale();

  const fullNameRef = React.useRef<HTMLInputElement | null>(null);
  const contactRef = React.useRef<HTMLDivElement | null>(null);

  const [touched, setTouched] = React.useState<{ fullName?: boolean; phone?: boolean }>({});
  const [contactQuery, setContactQuery] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const phoneValue = data.patient.phone.trim();
  const phoneError = touched.phone && (phoneValue.length === 0 || phoneValue.length < 8);

  const onChange = (field: keyof typeof data.patient) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPatient({ [field]: e.target.value });

  const setSex = (sex: Sex) => setPatient({ sex });
  const setDob = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const today = new Date().toISOString().slice(0, 10);
    setPatient({ dob: val > today ? today : val });
  };

  React.useEffect(() => {
    const timer = setTimeout(() => show(t('draftSaved')), 600);
    return () => clearTimeout(timer);
  }, [show, t]);

  React.useEffect(() => {
    fullNameRef.current?.focus({ preventScroll: true });
  }, []);

  React.useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      if (!contactRef.current) return;
      if (!contactRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickAway);
    return () => document.removeEventListener('mousedown', handleClickAway);
  }, []);

  const suggestions = React.useMemo(() => {
    const q = contactQuery.trim().toLowerCase();
    if (!q) return CONTACTS.slice(0, 4);
    return CONTACTS.filter(contact =>
      contact.fullName.toLowerCase().includes(q) ||
      contact.phone.includes(q) ||
      contact.customerCode.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [contactQuery]);

  const applyContact = (contact: (typeof CONTACTS)[number]) => {
    setPatient(contact);
    setTouched({});
    setContactQuery(contact.fullName);
    setShowSuggestions(false);
    requestAnimationFrame(() => {
      fullNameRef.current?.focus({ preventScroll: true });
    });
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleQueryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      applyContact(suggestions[0]);
    }
  };

  const formatPlaceholder = (en: string, vi: string) => (locale === 'en' ? en : vi);

  return (
    <form className="card">
      <h2>{t('patientInformation')}</h2>

      <div className="contact-picker" ref={contactRef}>
        <label className="contact-picker__label" htmlFor="contact-search">
          {t('quickFillLabel')}
        </label>
        <div className="contact-picker__field">
          <input
            id="contact-search"
            value={contactQuery}
            onChange={handleQueryChange}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleQueryKeyDown}
            placeholder={t('quickFillPlaceholder')}
            aria-autocomplete="list"
            aria-expanded={showSuggestions && suggestions.length > 0}
          />
          <button
            type="button"
            className="contact-picker__apply"
            onClick={() => suggestions[0] && applyContact(suggestions[0])}
            disabled={suggestions.length === 0}
          >
            {t('quickFillApply')}
          </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="contact-picker__list">
            {suggestions.map(contact => (
              <li key={contact.customerCode}>
                <button
                  type="button"
                  onClick={() => applyContact(contact)}
                  className="contact-picker__item"
                >
                  <span className="contact-picker__name">{contact.fullName}</span>
                  <span className="contact-picker__meta">{contact.phone} • {contact.customerCode}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {showSuggestions && suggestions.length === 0 && (
          <div className="contact-picker__empty">{t('quickFillEmpty')}</div>
        )}
      </div>

      <label>
        {t('fullName')}
        <input
          ref={fullNameRef}
          value={data.patient.fullName}
          onChange={onChange('fullName')}
          onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
          className={touched.fullName && !data.patient.fullName.trim() ? 'input-error' : undefined}
          aria-invalid={touched.fullName && !data.patient.fullName.trim()}
          placeholder={formatPlaceholder('Enter full name', 'Nhập họ và tên')}
          list="contact-name-suggestions"
        />
        {touched.fullName && !data.patient.fullName.trim() && (
          <span className="field-error">{t('fullNameRequired')}</span>
        )}
      </label>
      <datalist id="contact-name-suggestions">
        {CONTACTS.map(contact => (
          <option key={contact.customerCode} value={contact.fullName} />
        ))}
      </datalist>

      <label>
        {t('dob')}
        <input type="date" value={data.patient.dob} onChange={setDob} />
      </label>

      <label>
        {t('customerCode')}
        <input
          value={data.patient.customerCode}
          onChange={onChange('customerCode')}
          placeholder={formatPlaceholder('e.g. C12345', 'VD: C12345')}
        />
      </label>

      <label>
        {t('address')}
        <input
          value={data.patient.address}
          onChange={onChange('address')}
          placeholder={formatPlaceholder('Street, City', 'Địa chỉ')}
        />
      </label>

      <label>
        {t('clinicalDiagnosis')}
        <input
          value={data.patient.clinicalDiagnosis}
          onChange={onChange('clinicalDiagnosis')}
          placeholder={formatPlaceholder('Optional', 'Không bắt buộc')}
        />
      </label>

      <label>
        {t('nationalId')}
        <input
          value={data.patient.nationalId}
          onChange={onChange('nationalId')}
          placeholder={formatPlaceholder('ID / Passport', 'CMND / CCCD')}
        />
      </label>

      <fieldset className="segmented">
        <legend>{t('sex')}</legend>
        <button type="button" className={data.patient.sex === 'Male' ? 'is-active' : ''} onClick={() => setSex('Male')}>
          {t('male')}
        </button>
        <button type="button" className={data.patient.sex === 'Female' ? 'is-active' : ''} onClick={() => setSex('Female')}>
          {t('female')}
        </button>
      </fieldset>

      <label>
        {t('phone')}
        <input
          inputMode="tel"
          value={data.patient.phone}
          onChange={onChange('phone')}
          onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
          className={phoneError ? 'input-error' : undefined}
          aria-invalid={phoneError}
          placeholder={formatPlaceholder('e.g. 09xxxxxxxx', 'VD: 09xxxxxxxx')}
        />
        {phoneError && <span className="field-error">{t('phoneInvalid')}</span>}
      </label>

      <label>
        {t('doctor')}
        <input
          value={data.patient.doctor}
          onChange={onChange('doctor')}
          placeholder={formatPlaceholder("Doctor's full name", 'Họ tên bác sĩ')}
        />
      </label>

      <label>
        {t('docCode')}
        <input value={data.patient.docCode} onChange={onChange('docCode')} />
      </label>

      <fieldset className="segmented">
        <legend>{t('samplePriority')}</legend>
        {(['Regular', 'Urgent'] as SamplePriority[]).map(p => (
          <button
            key={p}
            type="button"
            className={data.priority === p ? 'is-active' : ''}
            onClick={() => setPriority(p)}
          >
            {p === 'Regular' ? t('regular') : t('urgent')}
          </button>
        ))}
      </fieldset>

      <details className="note">
        <summary>{t('serviceNoteSummary')}</summary>
        <p>{t('serviceNoteCopy')}</p>
      </details>

      <Toast message={msg} />
    </form>
  );
};
