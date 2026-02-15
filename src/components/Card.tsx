import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-finos-card rounded-2xl border border-finos-border p-5 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-finos-card-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
  const trendColor =
    trend === 'up'
      ? 'text-finos-accent'
      : trend === 'down'
        ? 'text-finos-danger'
        : 'text-finos-muted';

  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-finos-muted text-xs font-medium uppercase tracking-wider">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${trendColor}`}>{value}</p>
        </div>
        {icon && <div className="text-finos-muted">{icon}</div>}
      </div>
    </Card>
  );
}
