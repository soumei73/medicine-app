import { useState } from 'react';
import type { Medicine, Schedule } from '../types';

interface Props {
  onAdd: (medicine: Medicine) => void;
  onClose: () => void;
}

export default function AddMedicineModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState<Schedule>('morning_evening');
  const [totalCount, setTotalCount] = useState('');
  const [dosePerTake, setDosePerTake] = useState('1');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !totalCount) return;
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      schedule,
      totalCount: Number(totalCount),
      dosePerTake: Number(dosePerTake),
      addedAt: new Date().toISOString(),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
        <h2 className="text-lg font-bold text-gray-800 mb-4">薬を追加</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">薬の名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: ロキソニン、目薬A"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-blue-400"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">服用タイミング</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSchedule('morning_evening')}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all
                  ${schedule === 'morning_evening' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200'}`}
              >
                朝・夜
              </button>
              <button
                type="button"
                onClick={() => setSchedule('evening_only')}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all
                  ${schedule === 'evening_only' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200'}`}
              >
                夜のみ
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-500 mb-1">残り総数</label>
              <input
                type="number"
                value={totalCount}
                onChange={(e) => setTotalCount(e.target.value)}
                placeholder="例: 30"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-blue-400"
                min="1"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-500 mb-1">1回の量</label>
              <input
                type="number"
                value={dosePerTake}
                onChange={(e) => setDosePerTake(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-blue-400"
                min="1"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-xl py-4 font-bold text-base active:bg-blue-600 transition-all"
          >
            追加する
          </button>
        </form>
      </div>
    </div>
  );
}
