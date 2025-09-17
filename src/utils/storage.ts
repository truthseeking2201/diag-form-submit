import { FormData, PersistedFormData } from '../types';

const KEY = 'evolve_consultation_draft_v1';

export function saveDraft(data: FormData) {
  const toPersist: PersistedFormData = {
    ...data,
    selectedItemIds: Array.from(data.selectedItemIds),
  };
  localStorage.setItem(KEY, JSON.stringify(toPersist));
}

export function loadDraft(): FormData | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PersistedFormData;
    return {
      ...parsed,
      selectedItemIds: new Set(parsed.selectedItemIds),
    };
  } catch {
    return null;
  }
}

export function clearDraft() {
  localStorage.removeItem(KEY);
}
