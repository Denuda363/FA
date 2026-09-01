export type TransactionType = 'income' | 'expense_cash' | 'expense_tf';

export const INCOME_CATEGORIES = ['Cash', 'TF BJB', 'TF BRI'] as const;
export const EXPENSE_CASH_CATEGORIES = [
  'ATK',
  'WiFi',
  'Token',
  'Bensin Pengiriman',
  'Pajak',
  'Bayar Distributor',
  'Gaji Karyawan',
  'Permintaan Owner Yg Lain',
] as const;
export const EXPENSE_TF_CATEGORIES = ['TF Distributor', 'TF Gajih', 'TF Lain2'] as const;

export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type ExpenseCashCategory = typeof EXPENSE_CASH_CATEGORIES[number];
export type ExpenseTFCategory = typeof EXPENSE_TF_CATEGORIES[number];

export type Category = IncomeCategory | ExpenseCashCategory | ExpenseTFCategory;

export interface CompanyProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: Category;
  amount: number;
  date: string; // ISO format YYYY-MM-DD
  note?: string;
  createdAt: number;
}

export interface MonthlyReportData {
  month: string;
  year: number;
  income: Record<IncomeCategory, number>;
  expenseCash: Record<ExpenseCashCategory, number>;
  expenseTF: Record<ExpenseTFCategory, number>;
  totalIncomeBruto: number;
  totalExpenseCash: number;
  totalExpenseTF: number;
  totalExpense: number;
  incomeNeto: number;
  profitPerusahaan: number;
  profitOwner: number;
}
