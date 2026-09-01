import { useState } from 'react';
import { useTransactions } from './hooks/useTransactions';
import { useCompanyProfile } from './hooks/useCompanyProfile';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Dashboard } from './components/Dashboard';
import { Report } from './components/Report';
import { CompanyProfileForm } from './components/CompanyProfileForm';
import { LayoutDashboard, PlusCircle, FileSpreadsheet, Wallet, Building2 } from 'lucide-react';
import { format } from 'date-fns';

type Tab = 'dashboard' | 'transaction' | 'report' | 'profile';

export default function App() {
  const { transactions, addTransaction, deleteTransaction, updateTransaction, loading: txLoading } = useTransactions();
  const { profile, updateProfile, loading: profileLoading } = useCompanyProfile();
  
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [reportMonth, setReportMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  if (txLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-indigo-200 rounded-full"></div>
          <p className="text-indigo-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm shadow-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-inner">
                <Wallet size={24} />
              </div>
              <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600 tracking-tight">
                ProfitFlow
              </h1>
            </div>
            
            <nav className="hidden md:flex space-x-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2
                  ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('transaction')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2
                  ${activeTab === 'transaction' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <PlusCircle size={18} />
                Transaksi
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2
                  ${activeTab === 'report' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <FileSpreadsheet size={18} />
                Laporan
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2
                  ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <Building2 size={18} />
                Profil
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <div className="md:hidden bg-white border-b border-slate-200 flex justify-around p-2 sticky top-16 z-10 shadow-sm">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center p-2 rounded-xl text-[10px] font-bold w-full transition-colors
            ${activeTab === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={22} className="mb-1" />
          DASHBOARD
        </button>
        <button
          onClick={() => setActiveTab('transaction')}
          className={`flex flex-col items-center p-2 rounded-xl text-[10px] font-bold w-full transition-colors
            ${activeTab === 'transaction' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
        >
          <PlusCircle size={22} className="mb-1" />
          TRANSAKSI
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center p-2 rounded-xl text-[10px] font-bold w-full transition-colors
            ${activeTab === 'report' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
        >
          <FileSpreadsheet size={22} className="mb-1" />
          LAPORAN
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center p-2 rounded-xl text-[10px] font-bold w-full transition-colors
            ${activeTab === 'profile' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
        >
          <Building2 size={22} className="mb-1" />
          PROFIL
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Dashboard transactions={transactions} />
          </div>
        )}

        {activeTab === 'transaction' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <TransactionForm 
              onAdd={addTransaction} 
              onUpdate={updateTransaction}
              editingTransaction={editingTransaction}
              onCancelEdit={() => setEditingTransaction(null)}
            />
            <TransactionList 
              transactions={transactions} 
              onDelete={deleteTransaction} 
              onEdit={(tx) => {
                setEditingTransaction(tx);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeTab === 'report' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
              <label className="text-sm font-bold text-slate-700 whitespace-nowrap">Pilih Bulan Laporan:</label>
              <input 
                type="month" 
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                className="w-full sm:w-auto p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium text-slate-700 transition-all"
              />
            </div>
            
            {reportMonth ? (
              <Report transactions={transactions} targetMonth={reportMonth} profile={profile} />
            ) : (
              <div className="text-center p-12 text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
                Silakan pilih bulan laporan untuk melihat preview.
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CompanyProfileForm profile={profile} onSave={updateProfile} />
          </div>
        )}
      </main>
    </div>
  );
}
