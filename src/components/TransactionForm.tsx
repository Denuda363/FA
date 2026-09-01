import { useState, useEffect } from 'react';
import { 
  INCOME_CATEGORIES, 
  EXPENSE_CASH_CATEGORIES, 
  EXPENSE_TF_CATEGORIES,
  TransactionType,
  Category,
  Transaction
} from '../types';
import { Plus, Save, X } from 'lucide-react';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editingTransaction: Transaction | null;
  onCancelEdit: () => void;
}

export function TransactionForm({ onAdd, onUpdate, editingTransaction, onCancelEdit }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('income');
  const [category, setCategory] = useState<string>(INCOME_CATEGORIES[0]);
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setAmount(editingTransaction.amount.toString());
      setDate(editingTransaction.date);
      setNote(editingTransaction.note || '');
    } else {
      setType('income');
      setCategory(INCOME_CATEGORIES[0]);
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    const txData = {
      type,
      category: category as Category,
      amount: Number(amount),
      date,
      note
    };

    if (editingTransaction) {
      onUpdate(editingTransaction.id, txData);
      onCancelEdit();
    } else {
      onAdd(txData);
      setAmount('');
      setNote('');
    }
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
        <h2 className="text-xl font-bold text-slate-800">
          {editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
        </h2>
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

        <div className="pt-6 flex gap-3">
          {editingTransaction && (
             <button 
               type="button" 
               onClick={onCancelEdit} 
               className="flex-1 flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-4 rounded-xl transition-all shadow-sm active:scale-[0.99]"
             >
               <X size={20} />
               Batal
             </button>
          )}
          <button 
            type="submit"
            className={`flex-[2] flex justify-center items-center gap-2 text-white font-semibold py-4 rounded-xl transition-all shadow-sm active:scale-[0.99]
              ${editingTransaction ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'}`}
          >
            {editingTransaction ? <Save size={20} /> : <Plus size={20} />}
            {editingTransaction ? 'Simpan Perubahan' : 'Simpan Transaksi'}
          </button>
        </div>
      </form>
    </div>
  );
}
