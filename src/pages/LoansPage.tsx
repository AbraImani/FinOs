import { useState } from 'react';
import { Plus, HandCoins, Trash2, CheckCircle, Filter } from 'lucide-react';
import { Card, Button, Modal, Input, StatusBadge, EmptyState } from '@/components';
import { useFinance, useAuth } from '@/context';
import { useModal } from '@/hooks';
import { formatCurrency, formatDate, daysUntil } from '@/utils';
import type { LoanStatus } from '@/types';

export function LoansPage() {
  const { loans, addLoan, markLoanPaid, deleteLoan } = useFinance();
  const { user } = useAuth();
  const { isOpen, open, close } = useModal();

  const [filterStatus, setFilterStatus] = useState<LoanStatus | 'all'>('all');
  const [form, setForm] = useState({
    personName: '',
    amount: '',
    description: '',
    dateGiven: new Date().toISOString().split('T')[0],
    dueDate: '',
  });

  const filteredLoans =
    filterStatus === 'all' ? loans : loans.filter((l) => l.status === filterStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.personName || !form.amount || !form.dueDate) return;

    await addLoan({
      userId: user.id,
      personName: form.personName,
      amount: Number(form.amount),
      description: form.description || undefined,
      dateGiven: new Date(form.dateGiven),
      dueDate: new Date(form.dueDate),
      status: 'pending',
    });

    setForm({
      personName: '',
      amount: '',
      description: '',
      dateGiven: new Date().toISOString().split('T')[0],
      dueDate: '',
    });
    close();
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prêts</h1>
        <Button icon={<Plus size={18} />} onClick={open}>
          Ajouter
        </Button>
      </div>

      <p className="text-finos-muted text-sm">
        Argent que vous avez prêté à d'autres personnes.
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

      {filteredLoans.length === 0 ? (
        <EmptyState
          icon={<HandCoins size={48} />}
          title="Aucun prêt"
          description="Enregistrez les prêts que vous avez accordés."
          action={
            <Button icon={<Plus size={16} />} onClick={open}>
              Ajouter un prêt
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredLoans.map((loan) => {
            const days = daysUntil(loan.dueDate);
            return (
              <Card key={loan.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{loan.personName}</p>
                    <StatusBadge status={loan.status} />
                  </div>
                  <p className="text-sm text-finos-muted">
                    Prêté le {formatDate(loan.dateGiven)} • Échéance : {formatDate(loan.dueDate)}
                  </p>
                  {loan.description && (
                    <p className="text-xs text-finos-muted mt-1">{loan.description}</p>
                  )}
                  {loan.status !== 'paid' && (
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
                  <span className="text-lg font-bold text-finos-accent">
                    {formatCurrency(loan.amount)}
                  </span>
                  {loan.status !== 'paid' && (
                    <button
                      onClick={() => markLoanPaid(loan.id)}
                      className="p-1.5 text-finos-muted hover:text-finos-accent rounded-lg hover:bg-finos-border/50 transition-colors"
                      title="Marquer comme payé"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteLoan(loan.id)}
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
      <Modal isOpen={isOpen} onClose={close} title="Nouveau prêt">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom de la personne"
            placeholder="Ex: Jean Dupont"
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
            placeholder="Ex: Prêt pour réparation voiture"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Date du prêt"
            type="date"
            value={form.dateGiven}
            onChange={(e) => setForm({ ...form, dateGiven: e.target.value })}
            required
          />
          <Input
            label="Date d'échéance"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" size="lg">
            Ajouter le prêt
          </Button>
        </form>
      </Modal>
    </div>
  );
}
