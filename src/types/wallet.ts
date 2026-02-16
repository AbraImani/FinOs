export type WalletType = 'cash' | 'bank' | 'mobile';

export type WalletProvider = 'mpesa' | 'airtel-money' | 'orange-money' | 'equity' | 'other';

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  type: WalletType;
  provider?: WalletProvider;
  balance: number;
  createdAt: Date;
}
