import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-finos-bg text-finos-text">
      <Navbar />
      <main className="pb-20 pt-16 px-4 max-w-5xl mx-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
