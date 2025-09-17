export type Sex = 'Male' | 'Female';
export type SamplePriority = 'Regular' | 'Urgent';

export interface PatientInfo {
  fullName: string;
  dob: string; // ISO date (YYYY-MM-DD)
  customerCode: string;
  address: string;
  clinicalDiagnosis: string;
  nationalId: string;
  sex: Sex;
  phone: string;
  doctor: string;
  docCode: string; // default: "23209"
}

export interface TestItem {
  id: string;
  en: string;
  vi: string;
}

export interface TestCategory {
  id: string;
  order: number;
  nameEn: string;
  nameVi: string;
  items: TestItem[];
}

export interface FormData {
  patient: PatientInfo;
  priority: SamplePriority;
  selectedItemIds: Set<string>;
  otherTest: string;
  signatureDataUrl?: string; // PNG data URL
  createdAt: string; // ISO datetime
}

export interface PersistedFormData extends Omit<FormData, 'selectedItemIds'> {
  selectedItemIds: string[];
}
