import { useRouter } from "next/router";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token do usuário
    router.replace("/login/Login"); // Redireciona imediatamente para a tela de login
  };

  return <button onClick={handleLogout}>Sair</button>;
}
