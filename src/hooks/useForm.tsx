import React from 'react';
import { CATALOG, DEFAULT_DOCCODE } from '../data/catalog';
import { FormData, PatientInfo, SamplePriority } from '../types';
import { loadDraft, saveDraft, clearDraft } from '../utils/storage';

type FormContextValue = {
  data: FormData;
  setPatient: (patch: Partial<PatientInfo>) => void;
  setPriority: (p: SamplePriority) => void;
  toggleItem: (id: string) => void;
  selectAllIn: (categoryId: string) => void;
  clearIn: (categoryId: string) => void;
  setOtherTest: (s: string) => void;
  setSignature: (dataUrl?: string) => void;
  reset: () => void;
  complete: () => void;
  step: 0 | 1 | 2;
  setStep: (s: 0 | 1 | 2) => void;
  canProceedFromStep0: boolean;
  canProceedFromStep1: boolean;
  totalSelected: number;
  missingPatientFields: ('fullName' | 'phone')[];
  completed: boolean;
};

const FormContext = React.createContext<FormContextValue | null>(null);

const REQUIRED_PATIENT_FIELDS: Array<{ key: keyof PatientInfo; labelKey: 'fullName' | 'phone' }> = [
  { key: 'fullName', labelKey: 'fullName' },
  { key: 'phone', labelKey: 'phone' },
];

const initPatient: PatientInfo = {
  fullName: '',
  dob: '',
  customerCode: '',
  address: '',
  clinicalDiagnosis: '',
  nationalId: '',
  sex: 'Male',
  phone: '',
  doctor: '',
  docCode: DEFAULT_DOCCODE,
};

const createInitForm = (): FormData => ({
  patient: { ...initPatient },
  priority: 'Regular',
  selectedItemIds: new Set<string>(),
  otherTest: '',
  createdAt: new Date().toISOString(),
});

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<FormData>(() => loadDraft() ?? createInitForm());
  const [step, setStepState] = React.useState<0 | 1 | 2>(0);
  const [completed, setCompleted] = React.useState(false);

  const saveRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (saveRef.current) window.clearTimeout(saveRef.current);
    saveRef.current = window.setTimeout(() => saveDraft(data), 400);
    return () => {
      if (saveRef.current) window.clearTimeout(saveRef.current);
    };
  }, [data]);

  const setPatient = (patch: Partial<PatientInfo>) =>
    setData(prev => ({ ...prev, patient: { ...prev.patient, ...patch } }));

  const setPriority = (p: SamplePriority) =>
    setData(prev => ({ ...prev, priority: p }));

  const toggleItem = (id: string) =>
    setData(prev => {
      const next = new Set(prev.selectedItemIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { ...prev, selectedItemIds: next };
    });

  const selectAllIn = (categoryId: string) =>
    setData(prev => {
      const next = new Set(prev.selectedItemIds);
      const cat = CATALOG.find(c => c.id === categoryId);
      cat?.items.forEach(i => next.add(i.id));
      return { ...prev, selectedItemIds: next };
    });

  const clearIn = (categoryId: string) =>
    setData(prev => {
      const next = new Set(prev.selectedItemIds);
      const cat = CATALOG.find(c => c.id === categoryId);
      cat?.items.forEach(i => next.delete(i.id));
      return { ...prev, selectedItemIds: next };
    });

  const setOtherTest = (s: string) =>
    setData(prev => ({ ...prev, otherTest: s }));

  const setSignature = (dataUrl?: string) =>
    setData(prev => ({ ...prev, signatureDataUrl: dataUrl }));

  const updateStep = (next: 0 | 1 | 2) => {
    setStepState(next);
    if (next !== 2) {
      setCompleted(false);
    }
  };

  const reset = () => {
    clearDraft();
    setData(createInitForm());
    setStepState(0);
    setCompleted(false);
  };

  const complete = () => {
    setCompleted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    if (!completed) return;
    setCompleted(false);
  }, [data]);

  const totalSelected =
    data.selectedItemIds.size + (data.otherTest.trim() ? 1 : 0);

  const canProceedFromStep0 =
    data.patient.fullName.trim().length > 0 &&
    data.patient.phone.trim().length > 0;

  const canProceedFromStep1 = totalSelected > 0;

  const missingPatientFields = REQUIRED_PATIENT_FIELDS.filter(({ key }) =>
    data.patient[key].trim().length === 0
  ).map(f => f.labelKey);

  const value: FormContextValue = {
    data,
    setPatient,
    setPriority,
    toggleItem,
    selectAllIn,
    clearIn,
    setOtherTest,
    setSignature,
    reset,
    complete,
    step,
    setStep: updateStep,
    canProceedFromStep0,
    canProceedFromStep1,
    totalSelected,
    missingPatientFields,
    completed,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useForm() {
  const ctx = React.useContext(FormContext);
  if (!ctx) throw new Error('useForm must be used within FormProvider');
  return ctx;
}
