import { useState, useEffect } from 'react';
import { Plus, Pill } from 'lucide-react';
import type { Medicine, TakeRecord, Slot } from './types';
import { loadMedicines, saveMedicines, loadRecords, saveRecords } from './storage';
import { isTakenToday } from './utils';
import MedicineCard from './components/MedicineCard';
import AddMedicineModal from './components/AddMedicineModal';

function todayLabel(): string {
  return new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' });
}

export default function App() {
  const [medicines, setMedicines] = useState<Medicine[]>(() => loadMedicines());
  const [records, setRecords] = useState<TakeRecord[]>(() => loadRecords());
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { saveMedicines(medicines); }, [medicines]);
  useEffect(() => { saveRecords(records); }, [records]);

  function handleTake(medicineId: string, slot: Slot) {
    setRecords((prev) => [...prev, { medicineId, slot, takenAt: new Date().toISOString() }]);
  }

  function handleAdd(medicine: Medicine) {
    setMedicines((prev) => [...prev, medicine]);
  }

  function handleDelete(id: string) {
    if (!confirm('この薬を削除しますか？')) return;
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  }

  const morningMeds = medicines.filter((m) => m.schedule === 'morning_evening');
  const allMorningDone = morningMeds.length > 0 && morningMeds.every((m) => isTakenToday(records, m.id, 'morning'));
  const allEveningDone = medicines.length > 0 && medicines.every((m) => isTakenToday(records, m.id, 'evening'));

  return (
    <div className="min-h-svh bg-gray-50 pb-24">
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Pill size={20} className="text-blue-400" />
          <span className="font-bold text-gray-800 text-lg">おくすり手帳</span>
        </div>
        <p className="text-gray-400 text-sm">{todayLabel()}</p>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-5">
        {morningMeds.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-lg">🌅</span>
              <span className="font-semibold text-gray-600 text-sm">朝</span>
              {allMorningDone && <span className="text-xs text-green-500 font-medium">✓ 完了</span>}
            </div>
            <div className="flex flex-col gap-3">
              {morningMeds.map((m) => (
                <MedicineCard key={m.id} medicine={m} records={records} onTake={handleTake} onDelete={handleDelete} displaySlots={['morning']} />
              ))}
            </div>
          </section>
        )}

        {medicines.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-lg">🌙</span>
              <span className="font-semibold text-gray-600 text-sm">夜</span>
              {allEveningDone && <span className="text-xs text-green-500 font-medium">✓ 完了</span>}
            </div>
            <div className="flex flex-col gap-3">
              {medicines.map((m) => (
                <MedicineCard key={m.id} medicine={m} records={records} onTake={handleTake} onDelete={handleDelete} displaySlots={['evening']} />
              ))}
            </div>
          </section>
        )}

        {medicines.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Pill size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm">右下の＋ボタンから薬を追加してください</p>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-8 right-5 bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg active:bg-blue-600 active:scale-95 transition-all"
        aria-label="薬を追加"
      >
        <Plus size={28} />
      </button>

      {showAdd && <AddMedicineModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
