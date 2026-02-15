import type { User } from '@/types';

/**
 * Auth service - prepared for Firebase Auth integration.
 * Currently uses local mock data.
 */

const MOCK_USER: User = {
  id: 'user-1',
  name: 'Utilisateur FinOS',
  email: 'user@finos.app',
  createdAt: new Date('2025-01-01'),
};

export const authService = {
  /**
   * TODO: Replace with Firebase Google sign-in
   * import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
   */
  async signInWithGoogle(): Promise<User> {
    // Simulate async auth
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_USER), 500);
    });
  },

  async signOut(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
  },

  async getCurrentUser(): Promise<User | null> {
    const stored = localStorage.getItem('finos_user');
    if (stored) {
      return JSON.parse(stored) as User;
    }
    return null;
  },

  persistUser(user: User): void {
    localStorage.setItem('finos_user', JSON.stringify(user));
  },

  clearUser(): void {
    localStorage.removeItem('finos_user');
  },
};
