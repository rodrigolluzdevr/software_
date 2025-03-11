import React, { useState, useEffect } from "react";
import withAuth from "../utils/withAuth"; // Importando o HOC
import LogoutButton from "@/components/logoutButton/Logout.Button";
import { useRouter } from "next/router";

// Definindo a página de Admin
const Admin = () => {
  const [users, setUsers] = useState<any[]>([]); // Inicialize como um array vazio
  const router = useRouter();

  useEffect(() => {
    // Fetch users from the backend
    async function fetchUsers() {
      try {
        const token = sessionStorage.getItem("token"); // Obtenha o token do sessionStorage
        const response = await fetch('http://localhost:4000/users', {
          headers: {
            'Authorization': `Bearer ${token}` // Adicione o cabeçalho Authorization
          }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("A resposta da API não é um array:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }
    fetchUsers();
  }, []);

  const handleEditUser = (userId: number) => {
    router.push(`/update/UpdateUser?userId=${userId}`);
  };

  return (
    <div>
      <h1>Bem-vindo ao Painel do Administrador</h1>
      <LogoutButton /> {/* Adiciona o botão de logout */}
      
      <div>
        <h2>Usuários da Organização</h2>
        <ul>
          {Array.isArray(users) && users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
              <button onClick={() => handleEditUser(user.id)}>Editar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Aplicando o HOC withAuth para proteger esta página e restringir ao tipo de usuário "Admin"
export default withAuth(Admin, ["ADMIN"]);