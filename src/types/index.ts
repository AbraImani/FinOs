export type { User } from './user';
export type { Wallet, WalletType, WalletProvider } from './wallet';
export type { Transaction, TransactionType, TransactionCategory } from './transaction';
export type { Loan, LoanStatus } from './loan';
export type { Debt, DebtStatus } from './debt';

/** Aggregated financial summary */
export interface FinancialSummary {
  totalAssets: number;       // wallets balance + pending loans
  totalDebts: number;        // pending debts
  totalReal: number;         // totalAssets - totalDebts
  walletsTotal: number;
  pendingLoansTotal: number;
  pendingDebtsTotal: number;
}
