import { Search, X } from 'lucide-react';
import type { RefObject } from 'react';

interface SearchBarProps {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ inputRef, value, onChange }: SearchBarProps) {
  return (
    <div className="search-field">
      <Search aria-hidden="true" size={20} />
      <label className="sr-only" htmlFor="champion-search">
        Search champions
      </label>
      <input
        id="champion-search"
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by champion, title, or class"
        autoComplete="off"
      />
      {value ? (
        <button
          type="button"
          className="icon-button"
          onClick={() => onChange('')}
          aria-label="Clear champion search"
        >
          <X aria-hidden="true" size={18} />
        </button>
      ) : (
        <kbd aria-label="Press slash to focus search">/</kbd>
      )}
    </div>
  );
}
