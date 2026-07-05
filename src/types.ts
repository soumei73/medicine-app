export type Schedule = 'morning_evening' | 'morning_only' | 'evening_only';

export interface Medicine {
  id: string;
  name: string;
  schedule: Schedule;
  remainingCount: number;   // 残数（錠/回）
  dosePerTake: number;      // 1回あたりの量
  addedAt: string;          // ISO string
}

export interface TakeRecord {
  medicineId: string;
  takenAt: string;          // ISO string
  slot: 'morning' | 'evening';
}

export type Slot = 'morning' | 'evening';
