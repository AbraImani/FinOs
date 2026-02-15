import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Wallet, Transaction, Loan, Debt, FinancialSummary } from '@/types';
import { walletService, transactionService, loanService, debtService } from '@/services';
import { getFinancialSummary, processLoanStatuses, processDebtStatuses } from '@/utils';
import { useAuth } from './AuthContext';

interface FinanceContextType {
  // Data
  wallets: Wallet[];
  transactions: Transaction[];
  loans: Loan[];
  debts: Debt[];
  summary: FinancialSummary;
  isLoading: boolean;

  // Wallet actions
  addWallet: (wallet: Omit<Wallet, 'id' | 'createdAt'>) => Promise<void>;
  updateWallet: (id: string, updates: Partial<Wallet>) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;

  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Loan actions
  addLoan: (loan: Omit<Loan, 'id' | 'createdAt'>) => Promise<void>;
  updateLoan: (id: string, updates: Partial<Loan>) => Promise<void>;
  markLoanPaid: (id: string) => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;

  // Debt actions
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt'>) => Promise<void>;
  updateDebt: (id: string, updates: Partial<Debt>) => Promise<void>;
  markDebtPaid: (id: string) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;

  // Refresh
  refresh: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const emptySummary: FinancialSummary = {
  totalAssets: 0,
  totalDebts: 0,
  totalReal: 0,
  walletsTotal: 0,
  pendingLoansTotal: 0,
  pendingDebtsTotal: 0,
};

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>(emptySummary);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [w, t, l, d] = await Promise.all([
        walletService.getAll(user.id),
        transactionService.getAll(user.id),
        loanService.getAll(user.id),
        debtService.getAll(user.id),
      ]);

      const processedLoans = processLoanStatuses(l);
      const processedDebts = processDebtStatuses(d);

      setWallets(w);
      setTransactions(t);
      setLoans(processedLoans);
      setDebts(processedDebts);
      setSummary(getFinancialSummary(w, processedLoans, processedDebts));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Wallet actions ──
  const addWallet = useCallback(
    async (wallet: Omit<Wallet, 'id' | 'createdAt'>) => {
      await walletService.create(wallet);
      await loadData();
    },
    [loadData]
  );

  const updateWallet = useCallback(
    async (id: string, updates: Partial<Wallet>) => {
      await walletService.update(id, updates);
      await loadData();
    },
    [loadData]
  );

  const deleteWallet = useCallback(
    async (id: string) => {
      await walletService.delete(id);
      await loadData();
    },
    [loadData]
  );

  // ── Transaction actions ──
  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
      await transactionService.create(transaction);
      // Update wallet balance
      const delta = transaction.type === 'income' ? transaction.amount : -transaction.amount;
      await walletService.updateBalance(transaction.walletId, delta);
      await loadData();
    },
    [loadData]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      // Find transaction to reverse wallet balance
      const tx = transactions.find((t) => t.id === id);
      if (tx) {
        const delta = tx.type === 'income' ? -tx.amount : tx.amount;
        await walletService.updateBalance(tx.walletId, delta);
      }
      await transactionService.delete(id);
      await loadData();
    },
    [loadData, transactions]
  );

  // ── Loan actions ──
  const addLoan = useCallback(
    async (loan: Omit<Loan, 'id' | 'createdAt'>) => {
      await loanService.create(loan);
      await loadData();
    },
    [loadData]
  );

  const updateLoan = useCallback(
    async (id: string, updates: Partial<Loan>) => {
      await loanService.update(id, updates);
      await loadData();
    },
    [loadData]
  );

  const markLoanPaid = useCallback(
    async (id: string) => {
      await loanService.markAsPaid(id);
      await loadData();
    },
    [loadData]
  );

  const deleteLoan = useCallback(
    async (id: string) => {
      await loanService.delete(id);
      await loadData();
    },
    [loadData]
  );

  // ── Debt actions ──
  const addDebt = useCallback(
    async (debt: Omit<Debt, 'id' | 'createdAt'>) => {
      await debtService.create(debt);
      await loadData();
    },
    [loadData]
  );

  const updateDebt = useCallback(
    async (id: string, updates: Partial<Debt>) => {
      await debtService.update(id, updates);
      await loadData();
    },
    [loadData]
  );

  const markDebtPaid = useCallback(
    async (id: string) => {
      await debtService.markAsPaid(id);
      await loadData();
    },
    [loadData]
  );

  const deleteDebt = useCallback(
    async (id: string) => {
      await debtService.delete(id);
      await loadData();
    },
    [loadData]
  );

  return (
    <FinanceContext.Provider
      value={{
        wallets,
        transactions,
        loans,
        debts,
        summary,
        isLoading,
        addWallet,
        updateWallet,
        deleteWallet,
        addTransaction,
        deleteTransaction,
        addLoan,
        updateLoan,
        markLoanPaid,
        deleteLoan,
        addDebt,
        updateDebt,
        markDebtPaid,
        deleteDebt,
        refresh: loadData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance(): FinanceContextType {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
