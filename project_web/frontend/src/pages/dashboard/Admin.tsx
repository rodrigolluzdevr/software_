// pages/dashboard/Admin.tsx
import React from "react";
import withAuth from "../utils/withAuth"; // Importando o HOC
import LogoutButton from "@/components/logoutButton/Logout.Button";

// Definindo a página de Admin
const Admin = () => {
  return (
    <div>
      <h1>Bem-vindo ao Painel do Administrador</h1>
      <LogoutButton /> {/* Adiciona o botão de logout */}
    </div>
  );
};

// Aplicando o HOC withAuth para proteger esta página e restringir ao tipo de usuário "Admin"
export default withAuth(Admin, ["ADMIN"]);
