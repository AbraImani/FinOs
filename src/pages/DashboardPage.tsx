import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import { Card, StatCard, IncomeExpenseChart, WalletPieChart, StatusBadge } from '@/components';
import { useFinance } from '@/context';
import {
  useFinancialSummary,
  useWalletBreakdown,
  useIncomeExpenseData,
  useUpcomingDeadlines,
} from '@/hooks';
import { formatCurrency, formatDate, formatRelativeDate, daysUntil } from '@/utils';

export function DashboardPage() {
  const { transactions, isLoading } = useFinance();
  const summary = useFinancialSummary();
  const walletData = useWalletBreakdown();
  const chartData = useIncomeExpenseData();
  const deadlines = useUpcomingDeadlines(14);

  const recentTransactions = transactions.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-finos-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total des biens"
          value={formatCurrency(summary.totalAssets)}
          icon={<TrendingUp size={22} />}
          trend="up"
        />
        <StatCard
          label="Total des dettes"
          value={formatCurrency(summary.totalDebts)}
          icon={<TrendingDown size={22} />}
          trend="down"
        />
        <StatCard
          label="Total réel"
          value={formatCurrency(summary.totalReal)}
          icon={<DollarSign size={22} />}
          trend={summary.totalReal >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold mb-4">Revenus vs Dépenses</h3>
          <IncomeExpenseChart data={chartData} />
        </Card>
        <Card>
          <h3 className="font-semibold mb-4">Répartition par wallet</h3>
          <WalletPieChart data={walletData} />
        </Card>
      </div>

      {/* Recent transactions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent transactions */}
        <Card>
          <h3 className="font-semibold mb-4">Transactions récentes</h3>
          {recentTransactions.length === 0 ? (
            <p className="text-finos-muted text-sm text-center py-6">
              Aucune transaction
            </p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 border-b border-finos-border/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tx.type === 'income'
                          ? 'bg-finos-accent/20 text-finos-accent'
                          : 'bg-finos-danger/20 text-finos-danger'
                      }`}
                    >
                      {tx.type === 'income' ? (
                        <ArrowUpRight size={16} />
                      ) : (
                        <ArrowDownRight size={16} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">{tx.category}</p>
                      <p className="text-xs text-finos-muted">
                        {formatRelativeDate(tx.date)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      tx.type === 'income' ? 'text-finos-accent' : 'text-finos-danger'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Alerts */}
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-finos-warning" />
            Échéances proches
          </h3>
          {deadlines.length === 0 ? (
            <p className="text-finos-muted text-sm text-center py-6">
              Aucune échéance proche
            </p>
          ) : (
            <div className="space-y-3">
              {deadlines.map((item) => {
                const days = daysUntil(item.dueDate);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-finos-border/50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-finos-warning/20 text-finos-warning flex items-center justify-center">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.personName}</p>
                        <p className="text-xs text-finos-muted">
                          {item.kind === 'loan' ? 'Prêt' : 'Dette'} •{' '}
                          {formatDate(item.dueDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(item.amount)}
                      </p>
                      <div className="flex items-center gap-1">
                        <StatusBadge status={item.status} />
                        {days < 0 && (
                          <span className="text-[10px] text-finos-danger">
                            {Math.abs(days)}j retard
                          </span>
                        )}
                        {days >= 0 && days <= 3 && (
                          <span className="text-[10px] text-finos-warning">
                            {days}j restants
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
