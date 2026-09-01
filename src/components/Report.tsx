import { Transaction, CompanyProfile } from '../types';
import { formatRupiah } from '../lib/utils';
import { generateReportData } from '../lib/reportUtils';
import { exportToPDF, exportToExcel } from '../lib/exportUtils';
import { FileText, Table as TableIcon } from 'lucide-react';
import { useMemo } from 'react';

interface ReportProps {
  transactions: Transaction[];
  targetMonth: string; // YYYY-MM
  profile: CompanyProfile;
}

export function Report({ transactions, targetMonth, profile }: ReportProps) {
  const data = useMemo(() => generateReportData(transactions, targetMonth), [transactions, targetMonth]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Laporan Keuangan</h2>
          <p className="text-slate-500 font-medium">Bulan {data.month} {data.year}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => exportToPDF(data, profile)}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-semibold rounded-xl transition-all border border-rose-200 hover:border-rose-600 active:scale-95"
          >
            <FileText size={18} />
            Export PDF
          </button>
          <button 
            onClick={() => exportToExcel(data, profile)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold rounded-xl transition-all border border-emerald-200 hover:border-emerald-600 active:scale-95"
          >
            <TableIcon size={18} />
            Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Visual Kop Surat in Preview */}
        <div className="p-8 border-b-4 border-double border-slate-200 bg-slate-50/50">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-black text-indigo-900 tracking-tight">{profile.name}</h1>
            <p className="text-slate-600 mt-1">{profile.address}</p>
            <p className="text-slate-500 text-sm mt-1">Telp: {profile.phone} &nbsp;|&nbsp; Email: {profile.email}</p>
          </div>
        </div>

        <div className="p-6 text-center border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">LAPORAN KEUANGAN</h3>
          <p className="text-slate-500 font-medium uppercase tracking-wider text-sm mt-1">{data.month} {data.year}</p>
        </div>

        <div className="overflow-x-auto p-4 sm:p-6 pt-0">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100/50 text-slate-900 font-semibold">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Deskripsi</th>
                <th className="px-6 py-4 text-right">Nominal</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Total / Sub-Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* INCOME BRUTO */}
              <tr className="bg-blue-50/30">
                <td className="px-6 py-4 font-bold text-blue-900" colSpan={3}>INCOME BRUTO</td>
              </tr>
              {Object.entries(data.income).map(([cat, amount]) => (
                <tr key={cat} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3 pl-12 flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-blue-400 before:rounded-full before:mr-3 text-slate-600 font-medium">{cat}</td>
                  <td className="px-6 py-3 text-right tabular-nums">{formatRupiah(amount)}</td>
                  <td className="px-6 py-3 text-right"></td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-y border-slate-200">
                <td className="px-6 py-4 text-slate-800">TOTAL INCOME BRUTO</td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-right text-blue-700 tabular-nums">{formatRupiah(data.totalIncomeBruto)}</td>
              </tr>

              {/* PENGELUARAN CASH */}
              <tr className="bg-rose-50/30">
                <td className="px-6 py-4 font-bold text-rose-900 mt-4 block border-none" colSpan={3}>PENGELUARAN CASH</td>
              </tr>
              {Object.entries(data.expenseCash).map(([cat, amount]) => (
                <tr key={cat} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3 pl-12 flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-rose-400 before:rounded-full before:mr-3 text-slate-600 font-medium">{cat}</td>
                  <td className="px-6 py-3 text-right tabular-nums">{formatRupiah(amount)}</td>
                  <td className="px-6 py-3 text-right"></td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-y border-slate-200">
                <td className="px-6 py-4 text-slate-800">TOTAL PENGELUARAN CASH</td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-right text-rose-700 tabular-nums">{formatRupiah(data.totalExpenseCash)}</td>
              </tr>

              {/* PENGELUARAN TF */}
              <tr className="bg-orange-50/30">
                <td className="px-6 py-4 font-bold text-orange-900 mt-4 block border-none" colSpan={3}>PENGELUARAN TF</td>
              </tr>
              {Object.entries(data.expenseTF).map(([cat, amount]) => (
                <tr key={cat} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3 pl-12 flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-orange-400 before:rounded-full before:mr-3 text-slate-600 font-medium">{cat}</td>
                  <td className="px-6 py-3 text-right tabular-nums">{formatRupiah(amount)}</td>
                  <td className="px-6 py-3 text-right"></td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-y border-slate-200">
                <td className="px-6 py-4 text-slate-800">TOTAL PENGELUARAN TF</td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-right text-orange-700 tabular-nums">{formatRupiah(data.totalExpenseTF)}</td>
              </tr>

              {/* SUMMARY */}
              <tr className="border-t-4 border-slate-200 bg-slate-50/50">
                <td className="px-6 py-5 font-bold text-slate-700">PROFIT PERUSAHAAN (15%)</td>
                <td className="px-6 py-5"></td>
                <td className="px-6 py-5 text-right font-bold text-indigo-600 tabular-nums">{formatRupiah(data.profitPerusahaan)}</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="px-6 py-5 font-bold text-slate-700">PROFIT OWNER</td>
                <td className="px-6 py-5"></td>
                <td className="px-6 py-5 text-right font-bold text-indigo-600 tabular-nums">{formatRupiah(data.profitOwner)}</td>
              </tr>
              <tr className="bg-slate-900">
                <td className="px-6 py-6 font-black text-lg text-white rounded-bl-xl">INCOME NETO</td>
                <td className="px-6 py-6"></td>
                <td className="px-6 py-6 text-right font-black text-xl text-emerald-400 tabular-nums rounded-br-xl">{formatRupiah(data.incomeNeto)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
