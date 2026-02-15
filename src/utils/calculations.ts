import type { Wallet, Loan, Debt, FinancialSummary } from '@/types';

/**
 * Calculate total wallet balances
 */
export function calculateWalletsTotal(wallets: Wallet[]): number {
  return wallets.reduce((sum, w) => sum + w.balance, 0);
}

/**
 * Calculate total pending loans (money others owe me)
 */
export function calculatePendingLoansTotal(loans: Loan[]): number {
  return loans
    .filter((l) => l.status === 'pending' || l.status === 'late')
    .reduce((sum, l) => sum + l.amount, 0);
}

/**
 * Calculate total pending debts (money I owe)
 */
export function calculatePendingDebtsTotal(debts: Debt[]): number {
  return debts
    .filter((d) => d.status === 'pending' || d.status === 'late')
    .reduce((sum, d) => sum + d.amount, 0);
}

/**
 * Calculate total assets = wallets + pending loans
 */
export function calculateTotalAssets(wallets: Wallet[], loans: Loan[]): number {
  return calculateWalletsTotal(wallets) + calculatePendingLoansTotal(loans);
}

/**
 * Calculate total real = assets - debts
 */
export function calculateTotalReal(wallets: Wallet[], loans: Loan[], debts: Debt[]): number {
  return calculateTotalAssets(wallets, loans) - calculatePendingDebtsTotal(debts);
}

/**
 * Get full financial summary
 */
export function getFinancialSummary(
  wallets: Wallet[],
  loans: Loan[],
  debts: Debt[]
): FinancialSummary {
  const walletsTotal = calculateWalletsTotal(wallets);
  const pendingLoansTotal = calculatePendingLoansTotal(loans);
  const pendingDebtsTotal = calculatePendingDebtsTotal(debts);
  const totalAssets = walletsTotal + pendingLoansTotal;
  const totalDebts = pendingDebtsTotal;
  const totalReal = totalAssets - totalDebts;

  return {
    totalAssets,
    totalDebts,
    totalReal,
    walletsTotal,
    pendingLoansTotal,
    pendingDebtsTotal,
  };
}
