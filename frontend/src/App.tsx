import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import IdentifyPage from './pages/Identify';
import Contacts from './pages/Contacts';
import ActivityPage from './pages/Activity';
import SettingsPage from './pages/Settings';

type Page = 'dashboard' | 'identify' | 'contacts' | 'activity' | 'settings';

function App() {
  const [page, setPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />;
      case 'identify': return <IdentifyPage />;
      case 'contacts': return <Contacts />;
      case 'activity': return <ActivityPage />;
      case 'settings': return <SettingsPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-void bg-grid-pattern bg-grid">
      <Sidebar activePage={page} onNavigate={(p) => setPage(p as Page)} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
