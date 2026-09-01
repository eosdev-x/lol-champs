import { Outlet } from '@tanstack/react-router';
import { BrandHeader } from './components/BrandHeader';

export function App() {
  return (
    <div className="app-shell">
      <div className="hex-grid" aria-hidden="true" />
      <div className="page-shell">
        <BrandHeader />
      </div>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer page-shell">
        <p>Cryptonicflux LOL Search</p>
        <p>Champion data and artwork supplied by Riot Games Data Dragon.</p>
      </footer>
    </div>
  );
}
