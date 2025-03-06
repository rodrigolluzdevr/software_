// pages/dashboard/Coordenador.tsx
import React from "react";
import withAuth from "../utils/withAuth"; // Importando o HOC
import LogoutButton from "@/components/logoutButton/Logout.Button";

const Coordenador = () => {
  return (
    <div>
      <h1>Bem-vindo ao Painel do Coordenador</h1>
      <LogoutButton /> {/* Adiciona o botão de logout */}
    </div>
  );
};

// Aplicando o HOC withAuth para proteger esta página com o tipo de usuário Coordenador
export default withAuth(Coordenador, ["COORDENADOR"]);
