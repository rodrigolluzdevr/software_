import React, { useState, useEffect } from 'react';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  error?: string;
  attemptedSubmit?: boolean;
  mask?: (value: string) => string; // Add mask function option
}

/**
 * Reusable form input component with label and enhanced error handling
 * Supports input masking for fields like CPF and CEP
 */
const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  maxLength,
  error,
  attemptedSubmit = false,
  mask,
}) => {
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  
  // Validate field when touched, value changes, or form submission is attempted
  useEffect(() => {
    if ((touched || attemptedSubmit) && required && !value.trim()) {
      setInternalError(`${label} é obrigatório`);
    } else {
      setInternalError(null);
    }
  }, [value, touched, attemptedSubmit, required, label]);

  // Handler for when field loses focus
  const handleBlur = () => {
    setTouched(true);
  };
  
  // Handle masked input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Apply mask if provided
    if (mask) {
      inputValue = mask(inputValue);
      onChange({ ...e, target: { ...e.target, value: inputValue } });
    } else {
      onChange(e);
    }
  };

  // Display either the provided error or the internal validation error
  const displayError = error || internalError;

  return (
    <div>
      <label className="form-label font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        type={type}
        className={`form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border ${
          displayError ? 'border-red-500' : 'border-gray-200'
        } focus:border-blue-500 focus:ring-0 mt-2`}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
      />
      {displayError && <p className="mt-1 text-red-500 text-sm">{displayError}</p>}
    </div>
  );
};

export default FormInput;