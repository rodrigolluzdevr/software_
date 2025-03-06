// pages/dashboard/User.tsx
import React from "react";
import withAuth from "../utils/withAuth"; // Importando o HOC
import LogoutButton from "@/components/logoutButton/Logout.Button";

const User = () => {
  return (
    <div>
      <h1>Bem-vindo ao Painel do Usuário</h1>
      <LogoutButton /> {/* Adiciona o botão de logout */}
    </div>
  );
};

// Aplicando o HOC withAuth para proteger esta página com o tipo de usuário User
export default withAuth(User, ["USER"]);
