import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, FinanceProvider } from '@/context';
import { Layout, ProtectedRoute } from '@/components';
import {
  LoginPage,
  DashboardPage,
  WalletsPage,
  TransactionsPage,
  LoansPage,
  DebtsPage,
  ProfilePage,
} from '@/pages';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected */}
          <Route
            element={
              <ProtectedRoute>
                <FinanceProvider>
                  <Layout />
                </FinanceProvider>
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/wallets" element={<WalletsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/debts" element={<DebtsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
