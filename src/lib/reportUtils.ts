import {
  Transaction,
  MonthlyReportData,
  INCOME_CATEGORIES,
  EXPENSE_CASH_CATEGORIES,
  EXPENSE_TF_CATEGORIES,
} from '../types';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export function generateReportData(
  transactions: Transaction[],
  targetMonth: string, // format: YYYY-MM
): MonthlyReportData {
  const [yearStr, monthStr] = targetMonth.split('-');
  const year = parseInt(yearStr, 10);
  const monthIdx = parseInt(monthStr, 10) - 1;

  const monthLabel = format(new Date(year, monthIdx), 'MMMM', { locale: id });

  // Initialize accumulators
  const income = INCOME_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {} as Record<string, number>);
  const expenseCash = EXPENSE_CASH_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {} as Record<string, number>);
  const expenseTF = EXPENSE_TF_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {} as Record<string, number>);

  // Filter and aggregate
  transactions.forEach((tx) => {
    const txDate = parseISO(tx.date);
    if (txDate.getFullYear() === year && txDate.getMonth() === monthIdx) {
      if (tx.type === 'income') {
        income[tx.category] = (income[tx.category] || 0) + tx.amount;
      } else if (tx.type === 'expense_cash') {
        expenseCash[tx.category] = (expenseCash[tx.category] || 0) + tx.amount;
      } else if (tx.type === 'expense_tf') {
        expenseTF[tx.category] = (expenseTF[tx.category] || 0) + tx.amount;
      }
    }
  });

  const totalIncomeBruto = Object.values(income).reduce((a, b) => a + b, 0);
  const totalExpenseCash = Object.values(expenseCash).reduce((a, b) => a + b, 0);
  const totalExpenseTF = Object.values(expenseTF).reduce((a, b) => a + b, 0);
  const totalExpense = totalExpenseCash + totalExpenseTF;
  
  const incomeNeto = totalIncomeBruto - totalExpense;
  const profitPerusahaan = incomeNeto > 0 ? Math.floor(incomeNeto * 0.15) : 0;
  const profitOwner = incomeNeto > 0 ? incomeNeto - profitPerusahaan : incomeNeto;

  return {
    month: monthLabel,
    year,
    income: income as Record<string, number>,
    expenseCash: expenseCash as Record<string, number>,
    expenseTF: expenseTF as Record<string, number>,
    totalIncomeBruto,
    totalExpenseCash,
    totalExpenseTF,
    totalExpense,
    incomeNeto,
    profitPerusahaan,
    profitOwner,
  };
}
