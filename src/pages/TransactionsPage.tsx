import { useState } from 'react';
import {
  Plus,
  ArrowLeftRight,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Filter,
} from 'lucide-react';
import {
  Card,
  Button,
  Modal,
  Input,
  Select,
  TransactionTypeBadge,
  EmptyState,
} from '@/components';
import { useFinance, useAuth } from '@/context';
import { useModal } from '@/hooks';
import { formatCurrency, formatDate, capitalize } from '@/utils';
import type { TransactionType, TransactionCategory } from '@/types';

const typeOptions = [
  { value: 'income', label: 'Revenu' },
  { value: 'expense', label: 'Dépense' },
];

const categoryOptions: { value: TransactionCategory; label: string }[] = [
  { value: 'salary', label: 'Salaire' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investment', label: 'Investissement' },
  { value: 'gift', label: 'Cadeau' },
  { value: 'food', label: 'Alimentation' },
  { value: 'transport', label: 'Transport' },
  { value: 'housing', label: 'Logement' },
  { value: 'utilities', label: 'Services' },
  { value: 'entertainment', label: 'Divertissement' },
  { value: 'health', label: 'Santé' },
  { value: 'education', label: 'Éducation' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'transfer', label: 'Transfert' },
  { value: 'other', label: 'Autre' },
];

export function TransactionsPage() {
  const { transactions, wallets, addTransaction, deleteTransaction } = useFinance();
  const { user } = useAuth();
  const { isOpen, open, close } = useModal();

  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [form, setForm] = useState({
    walletId: '',
    amount: '',
    type: '' as TransactionType | '',
    category: '' as TransactionCategory | '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredTransactions =
    filterType === 'all' ? transactions : transactions.filter((t) => t.type === filterType);

  const walletOptions = wallets.map((w) => ({ value: w.id, label: w.name }));

  const getWalletName = (walletId: string) =>
    wallets.find((w) => w.id === walletId)?.name ?? 'Inconnu';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.walletId || !form.type || !form.category || !form.amount) return;

    await addTransaction({
      userId: user.id,
      walletId: form.walletId,
      amount: Number(form.amount),
      type: form.type as TransactionType,
      category: form.category as TransactionCategory,
      description: form.description || undefined,
      date: new Date(form.date),
    });

    setForm({
      walletId: '',
      amount: '',
      type: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    close();
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button icon={<Plus size={18} />} onClick={open}>
          Ajouter
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-finos-muted" />
        {(['all', 'income', 'expense'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === type
                ? 'bg-finos-accent text-finos-bg'
                : 'bg-finos-border/50 text-finos-muted hover:text-finos-text'
            }`}
          >
            {type === 'all' ? 'Tout' : type === 'income' ? 'Revenus' : 'Dépenses'}
          </button>
        ))}
      </div>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={<ArrowLeftRight size={48} />}
          title="Aucune transaction"
          description="Enregistrez votre première transaction."
          action={
            <Button icon={<Plus size={16} />} onClick={open}>
              Ajouter une transaction
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <Card key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'income'
                      ? 'bg-finos-accent/20 text-finos-accent'
                      : 'bg-finos-danger/20 text-finos-danger'
                  }`}
                >
                  {tx.type === 'income' ? (
                    <ArrowUpRight size={20} />
                  ) : (
                    <ArrowDownRight size={20} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{capitalize(tx.category)}</p>
                    <TransactionTypeBadge type={tx.type} />
                  </div>
                  <p className="text-xs text-finos-muted">
                    {getWalletName(tx.walletId)} • {formatDate(tx.date)}
                  </p>
                  {tx.description && (
                    <p className="text-xs text-finos-muted mt-0.5">{tx.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-base font-bold ${
                    tx.type === 'income' ? 'text-finos-accent' : 'text-finos-danger'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </span>
                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="p-1.5 text-finos-muted hover:text-finos-danger rounded-lg hover:bg-finos-border/50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isOpen} onClose={close} title="Nouvelle transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Wallet"
            options={walletOptions}
            value={form.walletId}
            onChange={(e) => setForm({ ...form, walletId: e.target.value })}
            required
          />
          <Select
            label="Type"
            options={typeOptions}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
            required
          />
          <Select
            label="Catégorie"
            options={categoryOptions}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as TransactionCategory })}
            required
          />
          <Input
            label="Montant"
            type="number"
            placeholder="0"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <Input
            label="Description (optionnel)"
            placeholder="Ex: Courses du mois"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" size="lg">
            Ajouter la transaction
          </Button>
        </form>
      </Modal>
    </div>
  );
}
