export type LoanStatus = 'pending' | 'paid' | 'late';

export interface Loan {
  id: string;
  userId: string;
  personName: string;
  amount: number;
  description?: string;
  dateGiven: Date;
  dueDate: Date;
  status: LoanStatus;
  createdAt: Date;
}
