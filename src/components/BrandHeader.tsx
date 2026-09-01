import { Link } from '@tanstack/react-router';
import { Hexagon } from 'lucide-react';

export function BrandHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="Cryptonicflux LOL Search home">
        <span className="brand-mark" aria-hidden="true">
          <Hexagon size={28} />
          <span>CF</span>
        </span>
        <span>
          <strong>Cryptonicflux</strong>
          <small>LOL Search</small>
        </span>
      </Link>
      <span className="data-badge">Data Dragon</span>
    </header>
  );
}
