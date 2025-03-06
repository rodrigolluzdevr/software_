// pages/dashboard/Professor.tsx
import React from "react";
import withAuth from "../utils/withAuth"; // Importando o HOC
import LogoutButton from "@/components/logoutButton/Logout.Button";

const Professor = () => {
  return (
    <div>
      <h1>Bem-vindo ao Painel do Professor</h1>
      <LogoutButton /> {/* Adiciona o botão de logout */}
    </div>
  );
};

// Aplicando o HOC withAuth para proteger esta página com o tipo de usuário Professor
export default withAuth(Professor, ["PROFESSOR"]);
