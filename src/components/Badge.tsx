import type { LoanStatus, DebtStatus } from '@/types';

type Status = LoanStatus | DebtStatus;

const statusStyles: Record<Status, string> = {
  pending: 'bg-finos-warning/20 text-finos-warning',
  paid: 'bg-finos-accent/20 text-finos-accent',
  late: 'bg-finos-danger/20 text-finos-danger',
};

const statusLabels: Record<Status, string> = {
  pending: 'En cours',
  paid: 'Payé',
  late: 'En retard',
};

interface BadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[status]} ${className}`}
    >
      {statusLabels[status]}
    </span>
  );
}

interface TypeBadgeProps {
  type: 'income' | 'expense';
  className?: string;
}

export function TransactionTypeBadge({ type, className = '' }: TypeBadgeProps) {
  const style =
    type === 'income'
      ? 'bg-finos-accent/20 text-finos-accent'
      : 'bg-finos-danger/20 text-finos-danger';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style} ${className}`}
    >
      {type === 'income' ? 'Revenu' : 'Dépense'}
    </span>
  );
}

interface WalletTypeBadgeProps {
  type: 'cash' | 'bank' | 'mobile';
  className?: string;
}

const walletTypeStyles: Record<string, string> = {
  cash: 'bg-finos-accent/20 text-finos-accent',
  bank: 'bg-finos-info/20 text-finos-info',
  mobile: 'bg-purple-500/20 text-purple-400',
};

const walletTypeLabels: Record<string, string> = {
  cash: 'Cash',
  bank: 'Banque',
  mobile: 'Mobile',
};

export function WalletTypeBadge({ type, className = '' }: WalletTypeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${walletTypeStyles[type]} ${className}`}
    >
      {walletTypeLabels[type]}
    </span>
  );
}
