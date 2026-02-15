import type { Wallet } from '@/types';
import { generateId } from '@/utils';

const STORAGE_KEY = 'finos_wallets';

function loadWallets(): Wallet[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? (JSON.parse(data) as Wallet[]) : [];
}

function saveWallets(wallets: Wallet[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
}

/**
 * Wallet service - prepared for Firebase Firestore integration.
 * Currently uses localStorage.
 */
export const walletService = {
  async getAll(userId: string): Promise<Wallet[]> {
    return loadWallets().filter((w) => w.userId === userId);
  },

  async create(wallet: Omit<Wallet, 'id' | 'createdAt'>): Promise<Wallet> {
    const wallets = loadWallets();
    const newWallet: Wallet = {
      ...wallet,
      id: generateId(),
      createdAt: new Date(),
    };
    wallets.push(newWallet);
    saveWallets(wallets);
    return newWallet;
  },

  async update(id: string, updates: Partial<Wallet>): Promise<Wallet> {
    const wallets = loadWallets();
    const index = wallets.findIndex((w) => w.id === id);
    if (index === -1) throw new Error('Wallet not found');
    wallets[index] = { ...wallets[index], ...updates };
    saveWallets(wallets);
    return wallets[index];
  },

  async delete(id: string): Promise<void> {
    const wallets = loadWallets().filter((w) => w.id !== id);
    saveWallets(wallets);
  },

  async updateBalance(id: string, amount: number): Promise<Wallet> {
    const wallets = loadWallets();
    const index = wallets.findIndex((w) => w.id === id);
    if (index === -1) throw new Error('Wallet not found');
    wallets[index].balance += amount;
    saveWallets(wallets);
    return wallets[index];
  },
};
