import { useMemo } from 'react';
import { useFinance } from '@/context';
import type { FinancialSummary } from '@/types';

/**
 * Hook for accessing financial summary data
 */
export function useFinancialSummary(): FinancialSummary & { isLoading: boolean } {
  const { summary, isLoading } = useFinance();
  return { ...summary, isLoading };
}

/**
 * Hook for getting wallet breakdown data for charts
 */
export function useWalletBreakdown() {
  const { wallets } = useFinance();

  return useMemo(() => {
    return wallets.map((w) => ({
      name: w.name,
      value: w.balance,
      type: w.type,
    }));
  }, [wallets]);
}

/**
 * Hook for income vs expense chart data
 */
export function useIncomeExpenseData() {
  const { transactions } = useFinance();

  return useMemo(() => {
    const monthlyData = new Map<string, { month: string; income: number; expense: number }>();

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = new Intl.DateTimeFormat('fr-FR', { month: 'short', year: '2-digit' }).format(d);

      if (!monthlyData.has(key)) {
        monthlyData.set(key, { month: label, income: 0, expense: 0 });
      }

      const entry = monthlyData.get(key)!;
      if (t.type === 'income') {
        entry.income += t.amount;
      } else {
        entry.expense += t.amount;
      }
    });

    return Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, v]) => v);
  }, [transactions]);
}

/**
 * Hook for upcoming deadlines (loans & debts due soon)
 */
export function useUpcomingDeadlines(withinDays: number = 7) {
  const { loans, debts } = useFinance();

  return useMemo(() => {
    const now = new Date();
    const threshold = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000);

    const upcomingLoans = loans
      .filter((l) => l.status !== 'paid' && new Date(l.dueDate) <= threshold)
      .map((l) => ({ ...l, kind: 'loan' as const }));

    const upcomingDebts = debts
      .filter((d) => d.status !== 'paid' && new Date(d.dueDate) <= threshold)
      .map((d) => ({ ...d, kind: 'debt' as const }));

    return [...upcomingLoans, ...upcomingDebts].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [loans, debts, withinDays]);
}
