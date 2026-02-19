import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export function Layout({ children }: { children: ReactNode }) {
  const { signOut, isAdworks } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-12 border-b border-border flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold tracking-tight">
            ADWORKS
          </Link>
          <nav className="flex gap-4 text-xs font-medium">
            {isAdworks ? (
              <>
                <Link to="/admin/pipeline">PIPELINE</Link>
                <Link to="/admin/clients">COMPANIES</Link>
                <Link to="/admin/messages">MESSAGING</Link>
              </>
            ) : (
              <>
                <Link to="/app">PROGRESS</Link>
                <Link to="/app/messages">MESSAGES</Link>
              </>
            )}
          </nav>
        </div>
        <button
          onClick={async () => {
            await signOut();
            navigate('/login');
          }}
          className="text-xs border px-2 py-1 rounded"
        >
          LOGOUT
        </button>
      </header>
      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  );
}
