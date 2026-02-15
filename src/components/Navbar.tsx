import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/context';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-finos-card/80 backdrop-blur-lg border-b border-finos-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-finos-accent flex items-center justify-center">
            <span className="text-finos-bg font-bold text-sm">F</span>
          </div>
          <span className="font-bold text-lg tracking-tight">FinOS</span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-finos-muted hover:text-finos-text transition-colors"
              >
                <User size={18} />
                <span className="hidden sm:inline text-sm">{user.name}</span>
              </Link>
              <button
                onClick={signOut}
                className="p-2 text-finos-muted hover:text-finos-danger transition-colors"
                title="Se déconnecter"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
