export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'gift'
  | 'food'
  | 'transport'
  | 'housing'
  | 'utilities'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'shopping'
  | 'transfer'
  | 'other';

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description?: string;
  date: Date;
  createdAt: Date;
}
