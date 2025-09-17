import React from 'react';
import { useForm } from '../hooks/useForm';
import { CATALOG } from '../data/catalog';
import { SignaturePad } from './SignaturePad';
import { exportPdf } from '../utils/pdf';

export const ReviewAndSign: React.FC = () => {
  const { data, setSignature } = useForm();

  const selectedByCategory = CATALOG.map(cat => ({
    cat,
    items: cat.items.filter(i => data.selectedItemIds.has(i.id)),
  })).filter(x => x.items.length > 0);

  return (
    <section className="card">
      <h2>Review & Sign</h2>
      <p className="card-lead">
        Confirm every detail, capture the signature, then export a polished PDF summary.
      </p>

      <div className="summary">
        <div className="summary__block">
          <h3>Patient</h3>
          <ul>
            <li><strong>Name:</strong> {data.patient.fullName}</li>
            <li><strong>DOB:</strong> {data.patient.dob || '—'}</li>
            <li><strong>Sex:</strong> {data.patient.sex}</li>
            <li><strong>Phone:</strong> {data.patient.phone}</li>
            <li><strong>Address:</strong> {data.patient.address || '—'}</li>
            <li><strong>Customer code:</strong> {data.patient.customerCode || '—'}</li>
            <li><strong>Doctor:</strong> {data.patient.doctor || '—'}</li>
            <li><strong>Clinical diagnosis:</strong> {data.patient.clinicalDiagnosis || '—'}</li>
            <li><strong>DOCCODE:</strong> {data.patient.docCode}</li>
            <li><strong>Priority:</strong> {data.priority}</li>
          </ul>
        </div>

        <div className="summary__block">
          <h3>Selected tests</h3>
          {selectedByCategory.length === 0 && <p className="muted">No tests selected.</p>}
          {selectedByCategory.map(({ cat, items }) => (
            <div key={cat.id} className="group">
              <h4>{cat.nameEn}</h4>
              <ul className="bullets">
                {items.map(i => (
                  <li key={i.id}>{i.en}</li>
                ))}
                {cat.id === 'c9' && data.otherTest.trim() && <li>Other: {data.otherTest.trim()}</li>}
              </ul>
            </div>
          ))}
          {selectedByCategory.every(g => g.cat.id !== 'c9') && data.otherTest.trim() && (
            <div className="group">
              <h4>Other</h4>
              <ul className="bullets"><li>{data.otherTest.trim()}</li></ul>
            </div>
          )}
        </div>
      </div>

      <h3>Signature</h3>
      <div
        className={`status-chip ${data.signatureDataUrl ? 'status-chip--ok' : 'status-chip--warn'}`}
        role="status"
        aria-live="polite"
      >
        {data.signatureDataUrl ? 'Signature captured' : 'Signature missing'}
      </div>
      <SignaturePad value={data.signatureDataUrl} onChange={setSignature} />

      <div className="actions">
        <button className="btn btn--primary" onClick={() => exportPdf(data)} type="button">
          Export PDF & Download
        </button>
      </div>
    </section>
  );
};
