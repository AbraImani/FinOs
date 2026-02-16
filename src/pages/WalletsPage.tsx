import { useState } from 'react';
import { Plus, Wallet, Trash2, Edit3 } from 'lucide-react';
import { Card, Button, Modal, Input, Select, WalletTypeBadge, EmptyState } from '@/components';
import { WalletIcon } from '@/components/WalletIcon';
import { useFinance } from '@/context';
import { useAuth } from '@/context';
import { useModal } from '@/hooks';
import { formatCurrency } from '@/utils';
import type { WalletType, WalletProvider } from '@/types';

const walletTypeOptions = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Banque' },
  { value: 'mobile', label: 'Mobile Money' },
];

const providerOptions: { value: WalletProvider; label: string; forType: WalletType[] }[] = [
  { value: 'mpesa', label: 'M-Pesa', forType: ['mobile'] },
  { value: 'airtel-money', label: 'Airtel Money', forType: ['mobile'] },
  { value: 'orange-money', label: 'Orange Money', forType: ['mobile'] },
  { value: 'equity', label: 'Equity Bank', forType: ['bank'] },
  { value: 'other', label: 'Autre', forType: ['cash', 'bank', 'mobile'] },
];

export function WalletsPage() {
  const { wallets, addWallet, updateWallet, deleteWallet } = useFinance();
  const { user } = useAuth();
  const { isOpen, open, close } = useModal();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', type: '' as WalletType | '', provider: '' as WalletProvider | '', balance: '' });

  const resetForm = () => {
    setForm({ name: '', type: '', provider: '', balance: '' });
    setEditId(null);
  };

  const handleOpen = () => {
    resetForm();
    open();
  };

  const handleEdit = (w: { id: string; name: string; type: WalletType; provider?: WalletProvider; balance: number }) => {
    setEditId(w.id);
    setForm({ name: w.name, type: w.type, provider: w.provider || '', balance: String(w.balance) });
    open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name || !form.type) return;

    if (editId) {
      await updateWallet(editId, {
        name: form.name,
        type: form.type as WalletType,
        provider: (form.provider || 'other') as WalletProvider,
        balance: Number(form.balance) || 0,
      });
    } else {
      await addWallet({
        userId: user.id,
        name: form.name,
        type: form.type as WalletType,
        provider: (form.provider || 'other') as WalletProvider,
        balance: Number(form.balance) || 0,
      });
    }
    close();
    resetForm();
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Wallets</h1>
        <Button icon={<Plus size={18} />} onClick={handleOpen}>
          Ajouter
        </Button>
      </div>

      {wallets.length === 0 ? (
        <EmptyState
          icon={<Wallet size={48} />}
          title="Aucun wallet"
          description="Créez votre premier wallet pour commencer à gérer vos finances."
          action={
            <Button icon={<Plus size={16} />} onClick={handleOpen}>
              Créer un wallet
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((w) => (
            <Card key={w.id} className="relative group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-finos-bg/50 overflow-hidden">
                  <WalletIcon type={w.type} provider={w.provider} size={40} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(w)}
                    className="p-1.5 text-finos-muted hover:text-finos-text rounded-lg hover:bg-finos-border/50"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => deleteWallet(w.id)}
                    className="p-1.5 text-finos-muted hover:text-finos-danger rounded-lg hover:bg-finos-border/50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm text-finos-muted">{w.name}</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(w.balance)}</p>
                <div className="mt-3">
                  <WalletTypeBadge type={w.type} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={close} title={editId ? 'Modifier le wallet' : 'Nouveau wallet'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom du wallet"
            placeholder="Ex: Compte épargne"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Select
            label="Type"
            options={walletTypeOptions}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as WalletType, provider: '' })}
            required
          />
          {form.type && (
            <Select
              label="Fournisseur"
              options={providerOptions
                .filter((p) => p.forType.includes(form.type as WalletType))
                .map((p) => ({ value: p.value, label: p.label }))}
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value as WalletProvider })}
            />
          )}
          <Input
            label="Solde initial"
            type="number"
            placeholder="0"
            value={form.balance}
            onChange={(e) => setForm({ ...form, balance: e.target.value })}
          />
          <Button type="submit" className="w-full" size="lg">
            {editId ? 'Enregistrer' : 'Créer le wallet'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
