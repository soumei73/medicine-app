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

export function calcRemainingDays(medicine: Medicine): number {
  const dosesPerDay = medicine.schedule === 'morning_evening' ? 2 : 1;
  return Math.floor(medicine.remainingCount / (dosesPerDay * medicine.dosePerTake));
}

export function requiredSlots(medicine: Medicine): Slot[] {
  if (medicine.schedule === 'morning_evening') return ['morning', 'evening'];
  if (medicine.schedule === 'morning_only') return ['morning'];
  return ['evening'];
}

export type DayStatus = 'done' | 'partial' | 'missed' | 'before';

// 過去7日間（古い順、最後が今日）の服用状況
export function last7DayStatuses(medicine: Medicine, records: TakeRecord[]): { label: string; status: DayStatus }[] {
  const myRecords = records.filter((r) => r.medicineId === medicine.id);
  const slots = requiredSlots(medicine);
  const addedDay = toDateStr(new Date(medicine.addedAt));
  const result: { label: string; status: DayStatus }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = toDateStr(d);
    const takenSlots = slots.filter((slot) =>
      myRecords.some((r) => r.slot === slot && toDateStr(new Date(r.takenAt)) === dayStr),
    );
    let status: DayStatus;
    if (dayStr < addedDay) status = 'before';
    else if (takenSlots.length === slots.length) status = 'done';
    else if (takenSlots.length > 0) status = 'partial';
    else status = 'missed';
    result.push({ label: '日月火水木金土'[d.getDay()], status });
  }
  return result;
}
