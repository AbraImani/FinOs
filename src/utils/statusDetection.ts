import type { Loan } from '@/types/loan';
import type { Debt } from '@/types/debt';

/**
 * Auto-detect if a loan is late based on dueDate
 */
export function detectLoanStatus(loan: Loan): Loan {
  if (loan.status === 'paid') return loan;
  const now = new Date();
  if (new Date(loan.dueDate) < now) {
    return { ...loan, status: 'late' };
  }
  return { ...loan, status: 'pending' };
}

/**
 * Auto-detect if a debt is late based on dueDate
 */
export function detectDebtStatus(debt: Debt): Debt {
  if (debt.status === 'paid') return debt;
  const now = new Date();
  if (new Date(debt.dueDate) < now) {
    return { ...debt, status: 'late' };
  }
  return { ...debt, status: 'pending' };
}

/**
 * Process all loans, updating their statuses
 */
export function processLoanStatuses(loans: Loan[]): Loan[] {
  return loans.map(detectLoanStatus);
}

/**
 * Process all debts, updating their statuses
 */
export function processDebtStatuses(debts: Debt[]): Debt[] {
  return debts.map(detectDebtStatus);
}

/**
 * Check if a date is within N days from now (upcoming deadline)
 */
export function isDueSoon(dueDate: Date, withinDays: number = 7): boolean {
  const now = new Date();
  const target = new Date(dueDate);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= withinDays;
}
