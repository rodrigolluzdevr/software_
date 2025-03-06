// components/logoutButton/Logout.Button.tsx
import React from "react";
import { useRouter } from "next/router";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token de localStorage
    router.replace("/login/Login"); // Redireciona para a página de login
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
