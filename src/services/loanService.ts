import type { Loan } from '@/types';
import { generateId } from '@/utils';

const STORAGE_KEY = 'finos_loans';

function loadLoans(): Loan[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? (JSON.parse(data) as Loan[]) : [];
}

function saveLoans(loans: Loan[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
}

export const loanService = {
  async getAll(userId: string): Promise<Loan[]> {
    return loadLoans()
      .filter((l) => l.userId === userId)
      .sort((a, b) => new Date(b.dateGiven).getTime() - new Date(a.dateGiven).getTime());
  },

  async create(loan: Omit<Loan, 'id' | 'createdAt'>): Promise<Loan> {
    const loans = loadLoans();
    const newLoan: Loan = {
      ...loan,
      id: generateId(),
      createdAt: new Date(),
    };
    loans.push(newLoan);
    saveLoans(loans);
    return newLoan;
  },

  async update(id: string, updates: Partial<Loan>): Promise<Loan> {
    const loans = loadLoans();
    const index = loans.findIndex((l) => l.id === id);
    if (index === -1) throw new Error('Loan not found');
    loans[index] = { ...loans[index], ...updates };
    saveLoans(loans);
    return loans[index];
  },

  async markAsPaid(id: string): Promise<Loan> {
    return this.update(id, { status: 'paid' });
  },

  async delete(id: string): Promise<void> {
    const loans = loadLoans().filter((l) => l.id !== id);
    saveLoans(loans);
  },
};
