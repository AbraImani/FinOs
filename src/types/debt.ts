export type DebtStatus = 'pending' | 'paid' | 'late';

export interface Debt {
  id: string;
  userId: string;
  personName: string;
  amount: number;
  description?: string;
  dueDate: Date;
  status: DebtStatus;
  createdAt: Date;
}
