import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder, 
  value, 
  onChange,
  isLoading = false 
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange({
        target: { value: localValue }
      } as React.ChangeEvent<HTMLInputElement>);
    }, 300);
    return () => clearTimeout(handler);
  }, [localValue, onChange]);

  return (
    <div className="mb-4 w-full md:w-1/4">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={e => setLocalValue(e.target.value)}
          value={localValue}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isLoading ? (
            <div className="w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin" />
          ) : (
            <FiSearch className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};