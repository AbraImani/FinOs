export type WalletType = 'cash' | 'bank' | 'mobile';

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  type: WalletType;
  balance: number;
  createdAt: Date;
}
