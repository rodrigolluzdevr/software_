import LogoutButton from "@/components/logoutButton/Logout.Button";

export default function Admin() {
  return (
    <div>
      <h1>Bem-vindo ao Painel do Administrador</h1>
      <LogoutButton /> {/* Adiciona o botão de logout */}
    </div>
  );
}
