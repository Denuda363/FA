import { useState } from 'react';
import { 
  INCOME_CATEGORIES, 
  EXPENSE_CASH_CATEGORIES, 
  EXPENSE_TF_CATEGORIES,
  TransactionType,
  Category
} from '../types';
import { Plus } from 'lucide-react';

interface TransactionFormProps {
  onAdd: (transaction: { type: TransactionType; category: Category; amount: number; date: string; note: string }) => void;
}

export function TransactionForm({ onAdd }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('income');
  const [category, setCategory] = useState<string>(INCOME_CATEGORIES[0]);
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    onAdd({
      type,
      category: category as Category,
      amount: Number(amount),
      date,
      note
    });

    setAmount('');
    setNote('');
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') setCategory(INCOME_CATEGORIES[0]);
    if (newType === 'expense_cash') setCategory(EXPENSE_CASH_CATEGORIES[0]);
    if (newType === 'expense_tf') setCategory(EXPENSE_TF_CATEGORIES[0]);
  };

  const getCategories = () => {
    if (type === 'income') return INCOME_CATEGORIES;
    if (type === 'expense_cash') return EXPENSE_CASH_CATEGORIES;
    if (type === 'expense_tf') return EXPENSE_TF_CATEGORIES;
    return [];
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800">Tambah Transaksi Baru</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-8 space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tipe Transaksi</label>
            <select 
              value={type} 
              onChange={(e) => handleTypeChange(e.target.value as TransactionType)}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            >
              <option value="income">Income (Pemasukan)</option>
              <option value="expense_cash">Pengeluaran Cash</option>
              <option value="expense_tf">Pengeluaran Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            >
              {getCategories().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nominal (Rp)</label>
          <input 
            type="number" 
            required 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal</label>
            <input 
              type="date" 
              required 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Catatan (Opsional)</label>
            <input 
              type="text" 
              value={note} 
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
              placeholder="Contoh: Belanja bahan..."
            />
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition-all shadow-sm shadow-indigo-600/20 active:scale-[0.99]"
          >
            <Plus size={20} />
            Simpan Transaksi
          </button>
        </div>
      </form>
    </div>
  );
}
