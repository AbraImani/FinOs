import type { Transaction } from '@/types';
import { generateId } from '@/utils';

const STORAGE_KEY = 'finos_transactions';

function loadTransactions(): Transaction[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? (JSON.parse(data) as Transaction[]) : [];
}

function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export const transactionService = {
  async getAll(userId: string): Promise<Transaction[]> {
    return loadTransactions()
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getByWallet(walletId: string): Promise<Transaction[]> {
    return loadTransactions()
      .filter((t) => t.walletId === walletId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async create(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const transactions = loadTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date(),
    };
    transactions.push(newTransaction);
    saveTransactions(transactions);
    return newTransaction;
  },

  async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const transactions = loadTransactions();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Transaction not found');
    transactions[index] = { ...transactions[index], ...updates };
    saveTransactions(transactions);
    return transactions[index];
  },

  async delete(id: string): Promise<void> {
    const transactions = loadTransactions().filter((t) => t.id !== id);
    saveTransactions(transactions);
  },

  async getRecent(userId: string, limit: number = 5): Promise<Transaction[]> {
    const all = await this.getAll(userId);
    return all.slice(0, limit);
  },
};
