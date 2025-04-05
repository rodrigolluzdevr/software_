import React from 'react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

/**
 * Toggle switch component with label
 */
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center mb-2">
      <label className="inline-flex relative items-center cursor-pointer mr-3">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
      <span>{label}</span>
    </div>
  );
};

export default ToggleSwitch;