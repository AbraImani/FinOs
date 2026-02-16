import type { WalletProvider } from '@/types';

/** Map provider keys → image paths in public/wallets/ */
const providerLogos: Record<string, string> = {
  mpesa: '/wallets/Mpesa.png',
  'airtel-money': '/wallets/airtel-money.png',
  'orange-money': '/wallets/orange_money_logo.png',
  equity: '/wallets/equity-bank-logo.png',
};

interface WalletIconProps {
  type: 'cash' | 'bank' | 'mobile';
  provider?: WalletProvider;
  size?: number;
  className?: string;
}

/**
 * Wallet icon component.
 * Shows the provider's real logo if available, otherwise a branded SVG fallback.
 */
export function WalletIcon({ type, provider, size = 40, className = '' }: WalletIconProps) {
  // If a known provider is set, show its real logo
  if (provider && provider !== 'other' && providerLogos[provider]) {
    return (
      <img
        src={providerLogos[provider]}
        alt={provider}
        width={size}
        height={size}
        className={`object-contain rounded-lg ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Fallback to type-based SVG icons
  if (type === 'cash') return <CashIcon size={size} className={className} />;
  if (type === 'bank') return <BankIcon size={size} className={className} />;
  return <MobileIcon size={size} className={className} />;
}

/* ── SVG fallback icons ── */

function CashIcon({ size, className }: { size: number; className: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none">
      <rect x="6" y="14" width="36" height="22" rx="4" fill="#1E293B" />
      <rect x="6" y="14" width="36" height="6" rx="4" fill="#0F172A" />
      <circle cx="24" cy="27" r="5" stroke="#22C55E" strokeWidth="1.5" fill="none" />
      <text x="24" y="30" textAnchor="middle" fontSize="7" fill="#22C55E" fontWeight="bold">$</text>
    </svg>
  );
}

function BankIcon({ size, className }: { size: number; className: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none">
      <polygon points="24,8 6,18 42,18" fill="#1E293B" />
      <rect x="6" y="18" width="36" height="3" rx="1" fill="#0F172A" />
      <rect x="10" y="21" width="3" height="14" rx="1" fill="#1E293B" />
      <rect x="18" y="21" width="3" height="14" rx="1" fill="#1E293B" />
      <rect x="26" y="21" width="3" height="14" rx="1" fill="#1E293B" />
      <rect x="34" y="21" width="3" height="14" rx="1" fill="#1E293B" />
      <rect x="6" y="35" width="36" height="4" rx="1" fill="#0F172A" />
      <circle cx="24" cy="14" r="2" fill="#3B82F6" opacity="0.8" />
    </svg>
  );
}

function MobileIcon({ size, className }: { size: number; className: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} fill="none">
      <rect x="14" y="6" width="20" height="36" rx="4" fill="#1E293B" />
      <rect x="16" y="10" width="16" height="24" rx="2" fill="#0F172A" />
      <rect x="19" y="16" width="3" height="6" rx="1" fill="#A855F7" opacity="0.4" />
      <rect x="23" y="14" width="3" height="8" rx="1" fill="#A855F7" opacity="0.6" />
      <rect x="27" y="12" width="3" height="10" rx="1" fill="#A855F7" opacity="0.8" />
      <circle cx="24" cy="38" r="2" fill="#334155" />
    </svg>
  );
}
