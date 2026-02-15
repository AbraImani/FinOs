import type { Debt } from '@/types';
import { generateId } from '@/utils';

const STORAGE_KEY = 'finos_debts';

function loadDebts(): Debt[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? (JSON.parse(data) as Debt[]) : [];
}

function saveDebts(debts: Debt[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(debts));
}

export const debtService = {
  async getAll(userId: string): Promise<Debt[]> {
    return loadDebts()
      .filter((d) => d.userId === userId)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  },

  async create(debt: Omit<Debt, 'id' | 'createdAt'>): Promise<Debt> {
    const debts = loadDebts();
    const newDebt: Debt = {
      ...debt,
      id: generateId(),
      createdAt: new Date(),
    };
    debts.push(newDebt);
    saveDebts(debts);
    return newDebt;
  },

  async update(id: string, updates: Partial<Debt>): Promise<Debt> {
    const debts = loadDebts();
    const index = debts.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Debt not found');
    debts[index] = { ...debts[index], ...updates };
    saveDebts(debts);
    return debts[index];
  },

  async markAsPaid(id: string): Promise<Debt> {
    return this.update(id, { status: 'paid' });
  },

  async delete(id: string): Promise<void> {
    const debts = loadDebts().filter((d) => d.id !== id);
    saveDebts(debts);
  },
};
