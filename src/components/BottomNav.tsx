import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowLeftRight, HandCoins, Receipt } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Accueil' },
  { to: '/wallets', icon: Wallet, label: 'Wallets' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/loans', icon: HandCoins, label: 'Prêts' },
  { to: '/debts', icon: Receipt, label: 'Dettes' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-finos-card/90 backdrop-blur-lg border-t border-finos-border">
      <div className="max-w-5xl mx-auto flex items-center justify-around h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
                isActive ? 'text-finos-accent' : 'text-finos-muted hover:text-finos-text'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
