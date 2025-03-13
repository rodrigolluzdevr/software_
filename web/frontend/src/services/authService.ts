import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  name: string;
  cpf?: string;
  email?: string;
}

export async function fetchUser(): Promise<User | null> {
  const token = sessionStorage.getItem("token");
  if (token) {
    try {
      const decodedToken: { sub: string } = jwtDecode(token);
      const userId = decodedToken.sub;
      const response = await fetch(`http://localhost:4000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erro ao buscar usuário");
      }
      const data: User = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return null;
    }
  }
  return null;
}