import { jwtDecode } from "jwt-decode";
import api from "./api"; // Importando o serviço api que criamos anteriormente

interface User {
  id: number;
  name: string;
  cpf?: string;
  email?: string;
  organizationId: number;
  role: string;
}

interface DecodedToken {
  sub: string;
  organizationId: number;
  role: string;
  exp: number;
  iat: number;
}

export async function fetchUser(): Promise<User | null> {
  const token = sessionStorage.getItem("token");
  if (token) {
    try {
      // Extrair informações diretamente do token
      const decodedToken: DecodedToken = jwtDecode(token);
      const userId = decodedToken.sub;
      
      // Usar o serviço API para garantir consistência nas chamadas
      const response = await api.get(`/users/${userId}`);
      
      // Combinar dados da API com dados do token
      const userData: User = {
        ...response.data,
        organizationId: decodedToken.organizationId,
        role: decodedToken.role
      };
      
      return userData;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return null;
    }
  }
  return null;
}

// Função auxiliar para verificar se o token está expirado
export function isTokenExpired(): boolean {
  const token = sessionStorage.getItem("token");
  if (!token) return true;
  
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return true;
  }
}

// Função para obter o organizationId diretamente do token
export function getOrganizationId(): number | null {
  const token = sessionStorage.getItem("token");
  if (!token) return null;
  
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    return decodedToken.organizationId;
  } catch (error) {
    console.error("Erro ao obter organizationId:", error);
    return null;
  }
}

// Função para obter o role diretamente do token
export function getUserRole(): string | null {
  const token = sessionStorage.getItem("token");
  if (!token) return null;
  
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    return decodedToken.role;
  } catch (error) {
    console.error("Erro ao obter role do usuário:", error);
    return null;
  }
}