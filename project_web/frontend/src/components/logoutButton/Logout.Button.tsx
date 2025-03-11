// components/logoutButton/Logout.Button.tsx
import React from "react";
import { useRouter } from "next/router";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Remove o token do sessionStorage
    router.replace("/login"); // Redireciona para a página de login
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
