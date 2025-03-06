import useAuth from "../hooks/useAuth";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  useAuth(); // Verifica se o usuário está logado

  return (
    <div>
      {/* Aqui você pode adicionar um cabeçalho, sidebar ou qualquer outro componente compartilhado */}
      {children}
    </div>
  );
};

export default AuthLayout;
