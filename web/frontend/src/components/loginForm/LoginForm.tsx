import React from "react";
import InputField from "../inputField/InputField";
import ErrorMessage from "../errorMessage/ErrorMessage";

interface LoginFormProps {
  cpf: string;
  password: string;
  error: string;
  onCpfChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ cpf, password, error, onCpfChange, onPasswordChange, onSubmit }) => {
  return (
    <form className="text-start" onSubmit={onSubmit}>
      <div className="grid grid-cols-1">
        <InputField
          id="LoginCpf"
          type="text"
          label="CPF:"
          placeholder="Digite o CPF"
          value={cpf}
          onChange={(e) => {
            let value = e.target.value;
            value = value.replace(/\D/g, "");
            if (value.length > 3) value = value.slice(0, 3) + '.' + value.slice(3);
            if (value.length > 7) value = value.slice(0, 7) + '.' + value.slice(7);
            if (value.length > 11) value = value.slice(0, 11) + '-' + value.slice(11, 13);
            onCpfChange({ ...e, target: { ...e.target, value } });
          }}
        />
        <InputField
          id="LoginPassword"
          type="password"
          label="Password:"
          placeholder="Digite a Senha"
          value={password}
          onChange={onPasswordChange}
        />
      </div>
      <div className="mb-4">
        <input
          type="submit"
          className="py-2 px-5 inline-block tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white rounded-md w-full cursor-pointer"
          value="Entrar"
        />
      </div>
      {error && <ErrorMessage message={error} />}
    </form>
  );
};

export default LoginForm;