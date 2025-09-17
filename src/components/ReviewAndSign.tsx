import React from 'react';
import { useForm } from '../hooks/useForm';
import { CATALOG } from '../data/catalog';
import { SignaturePad } from './SignaturePad';
import { exportPdf } from '../utils/pdf';
import { useLocale } from '../i18n/LocaleContext';

export const ReviewAndSign: React.FC = () => {
  const { data, setSignature } = useForm();
  const { locale, t } = useLocale();

  const selectedByCategory = CATALOG.map(cat => ({
    cat,
    items: cat.items.filter(i => data.selectedItemIds.has(i.id)),
  })).filter(x => x.items.length > 0);

  return (
    <section className="card">
      <h2>{t('reviewTitle')}</h2>
      <p className="card-lead">{t('reviewLead')}</p>

      <div className="summary">
        <div className="summary__block">
          <h3>{t('patientSummaryTitle')}</h3>
          <div className="info-grid">
            <div className="info-grid__row">
              <span className="info-grid__label">{t('fullName')}</span>
              <span className="info-grid__value">{data.patient.fullName}</span>
            </div>
            <div className="info-grid__row">
              <span className="info-grid__label">{t('dob')}</span>
              <span className="info-grid__value">{data.patient.dob || '—'}</span>
            </div>
            <div className="info-grid__row">
              <span className="info-grid__label">{t('sex')}</span>
              <span className="info-grid__value">{t(data.patient.sex === 'Male' ? 'male' : 'female')}</span>
            </div>
            <div className="info-grid__row">
              <span className="info-grid__label">{t('phone')}</span>
              <span className="info-grid__value">{data.patient.phone}</span>
            </div>
            <div className="info-grid__row">
              <span className="info-grid__label">{t('address')}</span>
              <span className="info-grid__value">{data.patient.address || '—'}</span>
            </div>
            <div className="info-grid__row">
              <span className="info-grid__label">{t('customerCode')}</span>
              <span className="info-grid__value">{data.patient.customerCode || '—'}</span>
            </div>
            <div className="info-grid__row">
              <span className="info-grid__label">{t('doctor')}</span>
              <span className="info-grid__value">{data.patient.doctor || '—'}</span>
            </div>
            <div className="info-grid__row">
              <span className="info-grid__label">{t('clinicalDiagnosis')}</span>
              <span className="info-grid__value">{data.patient.clinicalDiagnosis || '—'}</span>
            </div>
            <div className="info-grid__row">
              <span className="info-grid__label">{t('docCode')}</span>
              <span className="info-grid__value">{data.patient.docCode}</span>
            </div>
            <div className="info-grid__row">
              <span className="info-grid__label">{t('samplePriority')}</span>
              <span className="info-grid__value">{data.priority === 'Regular' ? t('regular') : t('urgent')}</span>
            </div>
          </div>
        </div>

        <div className="summary__block">
          <h3>{t('selectedTestsSummaryTitle')}</h3>
          {selectedByCategory.length === 0 && <p className="muted">{t('noTestsSelected')}</p>}
          {selectedByCategory.map(({ cat, items }) => (
            <div key={cat.id} className="group">
              <h4>{locale === 'en' ? cat.nameEn : cat.nameVi}</h4>
              <div className="pill-list">
                {items.map(i => (
                  <span key={i.id} className="pill-list__item">
                    {locale === 'en' ? i.en : i.vi}
                  </span>
                ))}
                {cat.id === 'c9' && data.otherTest.trim() && (
                  <span className="pill-list__item">
                    {t('otherLabel')}: {data.otherTest.trim()}
                  </span>
                )}
              </div>
            </div>
          ))}
          {selectedByCategory.every(g => g.cat.id !== 'c9') && data.otherTest.trim() && (
            <div className="group">
              <h4>{t('otherLabel')}</h4>
              <div className="pill-list">
                <span className="pill-list__item">{data.otherTest.trim()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <h3>{t('signatureTitle')}</h3>
      <div
        className={`status-chip ${data.signatureDataUrl ? 'status-chip--ok' : 'status-chip--warn'}`}
        role="status"
        aria-live="polite"
      >
        {data.signatureDataUrl ? t('signatureCaptured') : t('signatureMissing')}
      </div>
      <SignaturePad value={data.signatureDataUrl} onChange={setSignature} />

      <div className="actions">
        <button className="btn btn--primary" onClick={() => exportPdf(data)} type="button">
          {t('exportPdf')}
        </button>
      </div>
    </section>
  );
};
