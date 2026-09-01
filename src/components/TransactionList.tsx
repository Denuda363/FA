import { Transaction } from '../types';
import { formatRupiah } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-500 border-dashed">
        Belum ada data transaksi. Silakan tambah transaksi di atas.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800">Riwayat Transaksi</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-white text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-8 py-4">Tanggal</th>
              <th className="px-6 py-4">Tipe</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Catatan</th>
              <th className="px-6 py-4 text-right">Nominal</th>
              <th className="px-8 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.slice(0, 50).map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-8 py-4 whitespace-nowrap font-medium">
                  {format(parseISO(tx.date), 'dd MMM yyyy', { locale: id })}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider
                    ${tx.type === 'income' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10 ring-inset' : 
                      tx.type === 'expense_cash' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/10 ring-inset' : 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/10 ring-inset'}`}>
                    {tx.type === 'income' ? 'Income' : tx.type === 'expense_cash' ? 'Exp. Cash' : 'Exp. TF'}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">{tx.category}</td>
                <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">{tx.note || '-'}</td>
                <td className={`px-6 py-4 text-right font-bold tabular-nums ${tx.type === 'income' ? 'text-blue-600' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                </td>
                <td className="px-8 py-4 text-center">
                  <button 
                    onClick={() => onDelete(tx.id)}
                    className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg p-2 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Hapus Transaksi"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {transactions.length > 50 && (
        <div className="p-4 text-center text-xs font-semibold text-slate-400 bg-slate-50/50 border-t border-slate-100 uppercase tracking-wider">
          Menampilkan 50 transaksi terakhir
        </div>
      )}
    </div>
  );
}
