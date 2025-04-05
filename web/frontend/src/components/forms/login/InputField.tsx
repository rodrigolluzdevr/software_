import React from "react";

interface InputFieldProps {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ id, type, label, placeholder, value, onChange }) => (
  <div className="mb-4">
    <label className="font-semibold" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      type={type}
      className="form-input mt-3 w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-black focus:ring-0"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default InputField;