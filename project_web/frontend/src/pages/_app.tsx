import "@/styles/globals.css";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { useRouter } from "next/router";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Define como true se houver token, senão false
  }, []);

  // Redirecionamento imediato se o usuário não estiver autenticado
  useEffect(() => {
    if (isAuthenticated === false) {
      const allowedRoutes = ["/login/Login", "/"];
      if (!allowedRoutes.includes(router.pathname)) {
        alert("Você precisa estar logado para acessar esta página.");
        router.replace("/login/Login"); // Redireciona sem histórico, impedindo voltar para a página anterior
      }
    }
  }, [isAuthenticated, router.pathname]);

  // Se ainda estiver verificando autenticação, não renderiza nada
  if (isAuthenticated === null) {
    return null;
  }

  // Se o usuário não estiver autenticado e estiver em uma página proibida, retorna null até ser redirecionado
  if (isAuthenticated === false && !["/login/Login", "/"].includes(router.pathname)) {
    return null;
  }

  const Layout = ["/login/Login", "/"].includes(router.pathname) ? React.Fragment : AuthLayout;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
