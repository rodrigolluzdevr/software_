import "@/styles/globals.css";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { useRouter } from "next/router"; // Importa o useRouter para obter a rota
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter(); // Usa o router para pegar a URL atual

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Verifica se a página é de login ou home
  const isLoginPage = router.pathname === "/login";
  const isHomePage = router.pathname === "/";

  // Condicionalmente aplica o layout de autenticação
  const Layout = isLoginPage || isHomePage ? React.Fragment : AuthLayout;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
