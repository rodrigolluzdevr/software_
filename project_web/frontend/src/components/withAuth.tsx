import { useEffect } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function withAuth(Component: React.ComponentType, allowedRoles: string[]) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login"); // Redireciona para a página de login
        return;
      }

      const decodedToken = jwtDecode(token) as { role: string };
      const userRole = decodedToken.role;

      if (!allowedRoles.includes(userRole)) {
        router.push("/"); // Redireciona para a página inicial
      }
    }, []);

    return <Component {...props} />;
  };
}