import { useState, useEffect } from 'react';
import { Plus, Pill } from 'lucide-react';
import type { Medicine, TakeRecord, Slot } from './types';
import { loadMedicines, saveMedicines, loadRecords, saveRecords } from './storage';
import { isTakenToday, toDateStr, todayStr } from './utils';
import MedicineCard from './components/MedicineCard';
import AddMedicineModal from './components/AddMedicineModal';

function todayLabel(): string {
  return new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' });
}

export default function App() {
  const [medicines, setMedicines] = useState<Medicine[]>(() => loadMedicines());
  const [records, setRecords] = useState<TakeRecord[]>(() => loadRecords());
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Medicine | null>(null);

  useEffect(() => { saveMedicines(medicines); }, [medicines]);
  useEffect(() => { saveRecords(records); }, [records]);

  function handleTake(medicineId: string, slot: Slot) {
    setRecords((prev) => [...prev, { medicineId, slot, takenAt: new Date().toISOString() }]);
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === medicineId ? { ...m, remainingCount: Math.max(0, m.remainingCount - m.dosePerTake) } : m,
      ),
    );
  }

  function handleUntake(medicineId: string, slot: Slot) {
    if (!confirm('今日の記録を取り消しますか？')) return;
    const today = todayStr();
    setRecords((prev) => {
      // 今日の該当記録を1件だけ削除
      const idx = prev.findIndex(
        (r) => r.medicineId === medicineId && r.slot === slot && toDateStr(new Date(r.takenAt)) === today,
      );
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
    setMedicines((prev) =>
      prev.map((m) => (m.id === medicineId ? { ...m, remainingCount: m.remainingCount + m.dosePerTake } : m)),
    );
  }

  function handleRefill(medicineId: string) {
    const input = prompt('補充する数量を入力してください');
    if (input === null) return;
    const amount = Number(input);
    if (!Number.isFinite(amount) || amount <= 0) return;
    setMedicines((prev) =>
      prev.map((m) => (m.id === medicineId ? { ...m, remainingCount: m.remainingCount + amount } : m)),
    );
  }

  function handleAdd(medicine: Medicine) {
    setMedicines((prev) => [...prev, medicine]);
  }

  function handleUpdate(updated: Medicine) {
    setMedicines((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  }

  function handleDelete(id: string) {
    if (!confirm('この薬を削除しますか？')) return;
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  }

  const morningMeds = medicines.filter((m) => m.schedule === 'morning_evening' || m.schedule === 'morning_only');
  const eveningMeds = medicines.filter((m) => m.schedule === 'morning_evening' || m.schedule === 'evening_only');
  const allMorningDone = morningMeds.length > 0 && morningMeds.every((m) => isTakenToday(records, m.id, 'morning'));
  const allEveningDone = eveningMeds.length > 0 && eveningMeds.every((m) => isTakenToday(records, m.id, 'evening'));

  const cardProps = {
    records,
    onTake: handleTake,
    onUntake: handleUntake,
    onDelete: handleDelete,
    onRefill: handleRefill,
    onEdit: setEditTarget,
  };

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
                <MedicineCard key={m.id} medicine={m} {...cardProps} displaySlots={['morning']} />
              ))}
            </div>
          </section>
        )}

        {eveningMeds.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-lg">🌙</span>
              <span className="font-semibold text-gray-600 text-sm">夜</span>
              {allEveningDone && <span className="text-xs text-green-500 font-medium">✓ 完了</span>}
            </div>
            <div className="flex flex-col gap-3">
              {eveningMeds.map((m) => (
                <MedicineCard key={m.id} medicine={m} {...cardProps} displaySlots={['evening']} />
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

      {showAdd && <AddMedicineModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editTarget && (
        <AddMedicineModal initial={editTarget} onSave={handleUpdate} onClose={() => setEditTarget(null)} />
      )}
    </div>
  );
}
