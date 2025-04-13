import React, { ChangeEvent } from 'react';

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  attemptedSubmit?: boolean;
  className?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
  error,
  attemptedSubmit = false,
  className = '',
}) => {
  const hasError = error && (attemptedSubmit || value);
  
  return (
    <div className={`relative ${className}`}>
      <label className="font-medium text-sm text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full mt-1 py-2 px-3 h-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
          hasError
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {hasError && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormSelect;