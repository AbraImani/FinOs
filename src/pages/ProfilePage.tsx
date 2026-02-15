import {
  User,
  Mail,
  Calendar,
  LogOut,
  Shield,
  Database,
  Trash2,
} from 'lucide-react';
import { Card, Button } from '@/components';
import { useAuth } from '@/context';
import { useFinance } from '@/context';
import { formatDate, formatCurrency } from '@/utils';

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const { summary, wallets, transactions, loans, debts } = useFinance();

  if (!user) return null;

  const clearAllData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.')) {
      localStorage.removeItem('finos_wallets');
      localStorage.removeItem('finos_transactions');
      localStorage.removeItem('finos_loans');
      localStorage.removeItem('finos_debts');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold">Profil</h1>

      {/* User info */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-finos-accent/20 flex items-center justify-center">
            <User size={32} className="text-finos-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <div className="flex items-center gap-1 text-finos-muted text-sm mt-1">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-1 text-finos-muted text-sm mt-0.5">
              <Calendar size={14} />
              <span>Membre depuis {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Database size={18} />
          Résumé des données
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-finos-bg rounded-xl p-4">
            <p className="text-finos-muted text-xs">Wallets</p>
            <p className="text-xl font-bold">{wallets.length}</p>
          </div>
          <div className="bg-finos-bg rounded-xl p-4">
            <p className="text-finos-muted text-xs">Transactions</p>
            <p className="text-xl font-bold">{transactions.length}</p>
          </div>
          <div className="bg-finos-bg rounded-xl p-4">
            <p className="text-finos-muted text-xs">Prêts actifs</p>
            <p className="text-xl font-bold">
              {loans.filter((l) => l.status !== 'paid').length}
            </p>
          </div>
          <div className="bg-finos-bg rounded-xl p-4">
            <p className="text-finos-muted text-xs">Dettes actives</p>
            <p className="text-xl font-bold">
              {debts.filter((d) => d.status !== 'paid').length}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-finos-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-finos-muted">Total biens</span>
            <span className="font-semibold text-finos-accent">
              {formatCurrency(summary.totalAssets)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-finos-muted">Total dettes</span>
            <span className="font-semibold text-finos-danger">
              {formatCurrency(summary.totalDebts)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span>Total réel</span>
            <span className={summary.totalReal >= 0 ? 'text-finos-accent' : 'text-finos-danger'}>
              {formatCurrency(summary.totalReal)}
            </span>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Shield size={18} />
          Sécurité
        </h3>
        <p className="text-finos-muted text-sm mb-4">
          Connecté via authentification locale. L'intégration Google Firebase sera
          disponible prochainement.
        </p>
        <Button variant="secondary" icon={<LogOut size={16} />} onClick={signOut}>
          Se déconnecter
        </Button>
      </Card>

      {/* Danger zone */}
      <Card className="border-finos-danger/30">
        <h3 className="font-semibold mb-2 text-finos-danger flex items-center gap-2">
          <Trash2 size={18} />
          Zone dangereuse
        </h3>
        <p className="text-finos-muted text-sm mb-4">
          Supprimer toutes les données locales. Cette action est irréversible.
        </p>
        <Button variant="danger" icon={<Trash2 size={16} />} onClick={clearAllData}>
          Supprimer toutes les données
        </Button>
      </Card>

      {/* App info */}
      <div className="text-center text-finos-muted text-xs py-4">
        <p>FinOS v1.0.0</p>
        <p>Application PWA — Données stockées localement</p>
      </div>
    </div>
  );
}
