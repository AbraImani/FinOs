import { useState } from 'react';
import { Plus, Receipt, Trash2, CheckCircle, Filter } from 'lucide-react';
import { Card, Button, Modal, Input, StatusBadge, EmptyState } from '@/components';
import { useFinance, useAuth } from '@/context';
import { useModal } from '@/hooks';
import { formatCurrency, formatDate, daysUntil } from '@/utils';
import type { DebtStatus } from '@/types';

export function DebtsPage() {
  const { debts, addDebt, markDebtPaid, deleteDebt } = useFinance();
  const { user } = useAuth();
  const { isOpen, open, close } = useModal();

  const [filterStatus, setFilterStatus] = useState<DebtStatus | 'all'>('all');
  const [form, setForm] = useState({
    personName: '',
    amount: '',
    description: '',
    dueDate: '',
  });

  const filteredDebts =
    filterStatus === 'all' ? debts : debts.filter((d) => d.status === filterStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.personName || !form.amount || !form.dueDate) return;

    await addDebt({
      userId: user.id,
      personName: form.personName,
      amount: Number(form.amount),
      description: form.description || undefined,
      dueDate: new Date(form.dueDate),
      status: 'pending',
    });

    setForm({ personName: '', amount: '', description: '', dueDate: '' });
    close();
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dettes</h1>
        <Button icon={<Plus size={18} />} onClick={open}>
          Ajouter
        </Button>
      </div>

      <p className="text-finos-muted text-sm">
        Argent que vous devez à d'autres personnes.
      </p>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-finos-muted" />
        {(['all', 'pending', 'late', 'paid'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === status
                ? 'bg-finos-accent text-finos-bg'
                : 'bg-finos-border/50 text-finos-muted hover:text-finos-text'
            }`}
          >
            {status === 'all'
              ? 'Tout'
              : status === 'pending'
                ? 'En cours'
                : status === 'late'
                  ? 'En retard'
                  : 'Payé'}
          </button>
        ))}
      </div>

      {filteredDebts.length === 0 ? (
        <EmptyState
          icon={<Receipt size={48} />}
          title="Aucune dette"
          description="Enregistrez les dettes que vous avez."
          action={
            <Button icon={<Plus size={16} />} onClick={open}>
              Ajouter une dette
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredDebts.map((debt) => {
            const days = daysUntil(debt.dueDate);
            return (
              <Card key={debt.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{debt.personName}</p>
                    <StatusBadge status={debt.status} />
                  </div>
                  <p className="text-sm text-finos-muted">
                    Échéance : {formatDate(debt.dueDate)}
                  </p>
                  {debt.description && (
                    <p className="text-xs text-finos-muted mt-1">{debt.description}</p>
                  )}
                  {debt.status !== 'paid' && (
                    <p
                      className={`text-xs mt-1 ${
                        days < 0
                          ? 'text-finos-danger'
                          : days <= 7
                            ? 'text-finos-warning'
                            : 'text-finos-muted'
                      }`}
                    >
                      {days < 0
                        ? `${Math.abs(days)} jours de retard`
                        : days === 0
                          ? "Échéance aujourd'hui"
                          : `${days} jours restants`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-lg font-bold text-finos-danger">
                    {formatCurrency(debt.amount)}
                  </span>
                  {debt.status !== 'paid' && (
                    <button
                      onClick={() => markDebtPaid(debt.id)}
                      className="p-1.5 text-finos-muted hover:text-finos-accent rounded-lg hover:bg-finos-border/50 transition-colors"
                      title="Marquer comme payé"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteDebt(debt.id)}
                    className="p-1.5 text-finos-muted hover:text-finos-danger rounded-lg hover:bg-finos-border/50 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isOpen} onClose={close} title="Nouvelle dette">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom du créancier"
            placeholder="Ex: Marie Martin"
            value={form.personName}
            onChange={(e) => setForm({ ...form, personName: e.target.value })}
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
            placeholder="Ex: Emprunt pour frais médicaux"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Date d'échéance"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" size="lg">
            Ajouter la dette
          </Button>
        </form>
      </Modal>
    </div>
  );
}
