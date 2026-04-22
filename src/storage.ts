import type { Medicine, TakeRecord } from './types';

const MEDICINES_KEY = 'medicines';
const RECORDS_KEY = 'take_records';

export function loadMedicines(): Medicine[] {
  try {
    return JSON.parse(localStorage.getItem(MEDICINES_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveMedicines(medicines: Medicine[]): void {
  localStorage.setItem(MEDICINES_KEY, JSON.stringify(medicines));
}

export function loadRecords(): TakeRecord[] {
  try {
    return JSON.parse(localStorage.getItem(RECORDS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveRecords(records: TakeRecord[]): void {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}
