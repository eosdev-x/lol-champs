import { CHAMPION_ROLES, type ChampionRole } from '../types/lol';

interface RoleFiltersProps {
  selectedRole: ChampionRole | null;
  onChange: (role: ChampionRole | null) => void;
}

export function RoleFilters({ selectedRole, onChange }: RoleFiltersProps) {
  return (
    <div className="role-filters" aria-label="Filter by champion class">
      <button
        type="button"
        className={selectedRole === null ? 'active' : ''}
        aria-pressed={selectedRole === null}
        onClick={() => onChange(null)}
      >
        All
      </button>
      {CHAMPION_ROLES.map((role) => (
        <button
          key={role}
          type="button"
          className={selectedRole === role ? 'active' : ''}
          aria-pressed={selectedRole === role}
          onClick={() => onChange(role)}
        >
          {role}
        </button>
      ))}
    </div>
  );
}
