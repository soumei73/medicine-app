import { CheckCircle2, Circle, Pill } from 'lucide-react';
import type { Medicine, TakeRecord, Slot } from '../types';
import { isTakenToday, calcRemainingDays } from '../utils';

interface Props {
  medicine: Medicine;
  records: TakeRecord[];
  onTake: (id: string, slot: Slot) => void;
  onDelete: (id: string) => void;
  displaySlots: Slot[];
}

const SLOT_LABEL: Record<Slot, string> = {
  morning: '朝',
  evening: '夜',
};

export default function MedicineCard({ medicine, records, onTake, onDelete, displaySlots }: Props) {
  const slots = displaySlots;
  const remainingDays = calcRemainingDays(medicine, records);
  const isLow = remainingDays <= 3;
  const isEmpty = remainingDays === 0;

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-4 border-l-4 ${isEmpty ? 'border-red-500' : isLow ? 'border-orange-400' : 'border-blue-400'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Pill size={18} className="text-blue-400 shrink-0" />
          <span className="font-bold text-gray-800 text-base">{medicine.name}</span>
        </div>
        <button
          onClick={() => onDelete(medicine.id)}
          className="text-gray-300 hover:text-red-400 text-xl leading-none px-1"
          aria-label="削除"
        >
          ×
        </button>
      </div>

      <div className="flex gap-2 mb-3">
        {slots.map((slot) => {
          const taken = isTakenToday(records, medicine.id, slot);
          return (
            <button
              key={slot}
              onClick={() => !taken && onTake(medicine.id, slot)}
              disabled={taken}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all active:scale-95
                ${taken
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'bg-blue-500 text-white active:bg-blue-600'
                }`}
            >
              {taken ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              {SLOT_LABEL[slot]}
            </button>
          );
        })}
      </div>

      <div className={`text-xs font-medium ${isEmpty ? 'text-red-500' : isLow ? 'text-orange-500' : 'text-gray-400'}`}>
        {isEmpty ? '残りなし！補充が必要です' : isLow ? `残り約 ${remainingDays} 日分 ⚠️` : `残り約 ${remainingDays} 日分`}
      </div>
    </div>
  );
}
