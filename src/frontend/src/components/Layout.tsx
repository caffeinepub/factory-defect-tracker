import { Link, useRouterState } from '@tanstack/react-router';
import { AlertTriangle, FileText, PlusCircle } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-primary" strokeWidth={2.5} />
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  Factory Defect Tracker
                </h1>
                <p className="text-sm text-muted-foreground">Quality Control System</p>
              </div>
            </div>
            <nav className="flex gap-2">
              <Link
                to="/submit"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPath === '/submit' || currentPath === '/'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                Report Defect
              </Link>
              <Link
                to="/reports"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPath === '/reports'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                <FileText className="h-4 w-4" />
                View Reports
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Factory Defect Tracker</span>
            <span>•</span>
            <span>
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'factory-defect-tracker'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
