import { jsPDF } from 'jspdf';
import { CATALOG } from '../data/catalog';
import { FormData } from '../types';

export async function exportPdf(form: FormData) {
  const d = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = d.internal.pageSize.getWidth();
  const margin = 36;
  let y = margin;

  const H1 = 20;
  const H2 = 14;
  const P = 11;

  const text = (t: string, size: number, bold = false) => {
    d.setFont('helvetica', bold ? 'bold' : 'normal');
    d.setFontSize(size);
    const lines = d.splitTextToSize(t, pageW - margin * 2);
    d.text(lines, margin, y);
    y += lines.length * (size + 4);
  };

  text('CONSULTATION FORM', H1, true);
  text(`Created: ${new Date(form.createdAt).toLocaleString()}`, 9);

  text('Patient Information', H2, true);
  const p = form.patient;
  text(`Full name: ${p.fullName}`, P);
  text(`DOB: ${p.dob}    Sex: ${p.sex}`, P);
  text(`Phone: ${p.phone}    Customer code: ${p.customerCode}`, P);
  text(`Address: ${p.address}`, P);
  text(`Doctor: ${p.doctor}    DOCCODE: ${p.docCode}`, P);
  text(`Clinical diagnosis: ${p.clinicalDiagnosis}`, P);
  text(`Sample priority: ${form.priority}`, P);

  y += 6;
  text('Selected Tests', H2, true);

  CATALOG.forEach(cat => {
    const items = cat.items.filter(i => form.selectedItemIds.has(i.id));
    if (!items.length) return;
    text(cat.nameEn, 12, true);
    items.forEach(i => text(`• ${i.en}`, P));
  });

  if (form.otherTest.trim()) {
    text(`• Other: ${form.otherTest.trim()}`, P);
  }

  y += 8;
  text('Signature', H2, true);
  if (form.signatureDataUrl) {
    const img = form.signatureDataUrl;
    const w = 240;
    const h = 120;
    d.addImage(img, 'PNG', margin, y, w, h);
    y += h + 12;
  } else {
    text('(not signed)', P, false);
  }

  y += 8;
  d.setFontSize(9);
  d.text(
    'For service windows and support, refer to the printed notice on the original form (Cao Thang location). Hotline: 1900 1717 | diag.vn',
    margin,
    y
  );

  d.save(`consultation_${Date.now()}.pdf`);
}
