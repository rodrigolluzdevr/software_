import { useState } from 'react';

export default function ToggleActive() {
  const [isActive, setIsActive] = useState<boolean>(true);

  const handleToggleActive = () => {
    setIsActive(!isActive);
  };
  return (
    <div className="col-span-6 sm:col-span-2 lg:col-span-1 mt-2">
      <label className="form-label font-semibold  flex justify-start">
        Status
      </label>
      <div className="mt-3 flex items-center justify-start">
        <div
          onClick={handleToggleActive}
          className={`relative inline-flex flex-shrink-0 h-6 w-12 cursor-pointer transition-colors ease-in-out duration-200 border-2 border-transparent rounded-full focus:outline-none ${
            isActive ? 'bg-blue-500' : 'bg-gray-200'
          }`}
          role="switch"
          aria-checked={isActive}
          tabIndex={0}
        >
          <span className="sr-only">Ativar aluno</span>
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
              isActive ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </div>
        <span className="ml-2 text-sm">{isActive ? 'Ativo' : 'Inativo'}</span>
      </div>
    </div>
  );
};