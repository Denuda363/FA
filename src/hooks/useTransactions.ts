import { useState, useEffect } from 'react';
import { Transaction } from './types';

const STORAGE_KEY = 'profitflow_transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const updateTransaction = (id: string, updatedData: Omit<Transaction, 'id' | 'createdAt'>) => {
    setTransactions((prev) => 
      prev.map((tx) => tx.id === id ? { ...tx, ...updatedData } : tx)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };
}
