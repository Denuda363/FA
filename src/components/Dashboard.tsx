import { useMemo } from 'react';
import { Transaction } from '../types';
import { generateReportData } from '../lib/reportUtils';
import { formatRupiah } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { format, subMonths } from 'date-fns';
import { TrendingUp, TrendingDown, Landmark } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: DashboardProps) {
  
  // Get last 6 months data
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const targetDate = subMonths(now, i);
      const targetMonthStr = format(targetDate, 'yyyy-MM');
      const report = generateReportData(transactions, targetMonthStr);
      
      data.push({
        name: format(targetDate, 'MMM yy'),
        Income: report.totalIncomeBruto,
        Expense: report.totalExpense,
        Neto: report.incomeNeto,
        ProfitPerusahaan: report.profitPerusahaan,
        ProfitOwner: report.profitOwner
      });
    }
    return data;
  }, [transactions]);

  // current month summary
  const currentMonthData = useMemo(() => {
    return generateReportData(transactions, format(new Date(), 'yyyy-MM'));
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl border border-slate-100">
          <p className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm font-semibold flex justify-between gap-4 py-0.5">
              <span>{entry.name}:</span>
              <span>{formatRupiah(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={80} />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-2 tracking-wide uppercase">Income Bruto (Bulan Ini)</p>
          <p className="text-3xl font-black text-blue-600 tracking-tight">{formatRupiah(currentMonthData.totalIncomeBruto)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingDown size={80} />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-2 tracking-wide uppercase">Pengeluaran (Bulan Ini)</p>
          <p className="text-3xl font-black text-rose-600 tracking-tight">{formatRupiah(currentMonthData.totalExpense)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Landmark size={80} />
          </div>
          <p className="text-sm font-bold text-indigo-200 mb-2 tracking-wide uppercase relative z-10">Income Neto (Bulan Ini)</p>
          <p className="text-3xl font-black text-emerald-400 tracking-tight relative z-10">{formatRupiah(currentMonthData.incomeNeto)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Arus Kas (6 Bulan Terakhir)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `${value / 1000000}M`} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingTop: '20px' }} />
                <Bar dataKey="Income" name="Income Bruto" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Expense" name="Pengeluaran" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Tren Profit (6 Bulan Terakhir)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `${value / 1000000}M`} dx={-10} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingTop: '20px' }} />
                <Line type="monotone" dataKey="Neto" name="Income Neto" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6, strokeWidth: 0}} />
                <Line type="monotone" dataKey="ProfitOwner" name="Profit Owner" stroke="#8b5cf6" strokeWidth={2} dot={{r: 3, strokeWidth: 2, fill: '#fff'}} />
                <Line type="monotone" dataKey="ProfitPerusahaan" name="Profit Perusahaan" stroke="#f59e0b" strokeWidth={2} dot={{r: 3, strokeWidth: 2, fill: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
