import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  return (
    <div className="ds-app-shell ds-crystal-bg">
      <Sidebar />

      <div className="ds-main-area">
        <Topbar />

        <main className="ds-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}