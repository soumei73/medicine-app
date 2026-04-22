import type { Medicine, TakeRecord, Slot } from './types';

export function toDateStr(date: Date): string {
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
}

export function todayStr(): string {
  return toDateStr(new Date());
}

export function isTakenToday(records: TakeRecord[], medicineId: string, slot: Slot): boolean {
  const today = todayStr();
  return records.some(
    (r) => r.medicineId === medicineId && r.slot === slot && toDateStr(new Date(r.takenAt)) === today,
  );
}

export function calcRemainingDays(medicine: Medicine, records: TakeRecord[]): number {
  const usedDoses = records
    .filter((r) => r.medicineId === medicine.id)
    .length;
  const usedCount = usedDoses * medicine.dosePerTake;
  const remaining = Math.max(0, medicine.totalCount - usedCount);
  const dosesPerDay = medicine.schedule === 'morning_evening' ? 2 : 1;
  return Math.floor(remaining / (dosesPerDay * medicine.dosePerTake));
}
