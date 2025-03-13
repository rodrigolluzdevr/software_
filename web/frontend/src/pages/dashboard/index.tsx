import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "../utils/withAuth"; // Protege a página
import LogoutButton from "@/components/logoutButton/Logout.Button";
import Wrapper from "@/components/wrapper/Wrapper";

const Dashboard = () => {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const [users, setUsers] = useState<any[]>([]); // Inicialize como um array vazio

  useEffect(() => {
    // Fetch users from the backend
    async function fetchUsers() {
      try {
        const token = sessionStorage.getItem("token"); // Obtenha o token do sessionStorage
        const response = await fetch("http://localhost:4000/users", {
          headers: {
            Authorization: `Bearer ${token}`, // Adicione o cabeçalho Authorization
          },
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
    <Wrapper>
      <div>
        {role === "ADMIN" && (
          <div>
            <ul>
              {Array.isArray(users) &&
                users.map((user) => (
                  <li key={user.id}>
                    {user.name} - {user.email}
                    <button>Editar</button>
                  </li>
                ))}
            </ul>
            <h2>Administração</h2>
            <button onClick={() => router.push("/dashboard/users")}>
              Gerenciar Usuários
            </button>
            <button onClick={() => router.push("/dashboard/reports")}>
              Relatórios
            </button>
          </div>
        )}

        {role === "PROFESSOR" && (
          <div>
            <h2>Painel do Professor</h2>
            <button onClick={() => router.push("/dashboard/alunos")}>
              Ver Alunos
            </button>
            <button onClick={() => router.push("/dashboard/notas")}>
              Lançar Notas
            </button>
          </div>
        )}

        {role === "SECRETARIO" && (
          <div>
            <h2>Painel do Secretário</h2>
            <button onClick={() => router.push("/dashboard/matriculas")}>
              Gerenciar Matrículas
            </button>
          </div>
        )}

        {role === "COORDENADOR" && (
          <div>
            <h2>Painel do Coordenador</h2>
            <button onClick={() => router.push("/dashboard/planejamento")}>
              Planejamento Escolar
            </button>
          </div>
        )}

        {role === "DIRETOR" && (
          <div>
            <h2>Painel do Diretor</h2>
            <button onClick={() => router.push("/dashboard/financeiro")}>
              Relatórios Financeiros
            </button>
          </div>
        )}

        {role === "USER" && (
          <div>
            <h2>Área do Aluno</h2>
            <button onClick={() => router.push("/dashboard/boletim")}>
              Ver Boletim
            </button>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default withAuth(Dashboard); // Protege a rota
