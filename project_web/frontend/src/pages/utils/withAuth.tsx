// utils/withAuth.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Interface para as props do componente protegido
interface WithAuthProps {
  allowedRoles?: string[]; // Tipos de usuários permitidos (Admin, Coordenador, etc.)
}

// Função HOC para proteger as páginas com autenticação e autorização
const withAuth = (Component: React.ComponentType<WithAuthProps>, allowedRoles: string[] = []) => {
  const Wrapper = (props: WithAuthProps) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const checkAuth = () => {
        // Verifica o token no sessionStorage
        const token = sessionStorage.getItem("token");
        setIsAuthenticated(!!token);
      };

      checkAuth();

      // Adiciona um listener para o evento 'storage' (para detectar mudanças no sessionStorage)
      window.addEventListener("storage", checkAuth);
      return () => window.removeEventListener("storage", checkAuth);
    }, []);

    useEffect(() => {
      if (isAuthenticated === false) {
        const allowedRoutes = ["/login/Login", "/"];
        if (!allowedRoutes.includes(router.pathname)) {
          setTimeout(() => {
            alert("Você precisa estar logado para acessar esta página.");
            router.replace("/login/Login");
          }, 0);
        }
      }
    }, [isAuthenticated, router.pathname]);

    if (isAuthenticated === null) {
      return null; // Aguarda a verificação da autenticação
    }

    if (isAuthenticated === false && !["/login/Login", "/"].includes(router.pathname)) {
      return null; // Não renderiza nada se não estiver autenticado e a rota não for permitida
    }

    // Verifica se o usuário tem a role necessária para acessar a página
    const userRole = sessionStorage.getItem("role");
    if (allowedRoles.length && !allowedRoles.includes(userRole || "")) {
      alert("Você não tem permissão para acessar esta página.");
      router.replace("/login/Login");
      return null;
    }

    return <Component {...props} />;
  };

  return Wrapper;
};

export default withAuth;