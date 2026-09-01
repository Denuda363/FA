import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'transactions'));
    
    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const txs: Transaction[] = [];
      snapshot.forEach((doc) => {
        txs.push(doc.data() as Transaction);
      });
      
      // Sort client-side
      txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(txs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    });

    return () => unsubscribeSnapshot();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'userId'>) => {
    const newId = crypto.randomUUID();
    const newTx: Transaction = {
      ...transaction,
      id: newId,
      userId: 'public',
      createdAt: Date.now(),
    };

    try {
      await setDoc(doc(db, 'transactions', newId), newTx);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const updateTransaction = async (id: string, updatedData: Partial<Omit<Transaction, 'id' | 'createdAt' | 'userId'>>) => {
    try {
      await updateDoc(doc(db, 'transactions', id), updatedData);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    loading
  };
}
