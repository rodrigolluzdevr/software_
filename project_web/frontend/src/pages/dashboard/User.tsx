import LogoutButton from "@/components/logoutButton/Logout.Button";

export default function User() {
  return (
    <div>
      <h1>Bem-vindo ao Painel do Aluno</h1>
      <LogoutButton /> {/* Adiciona o botão de logout */}
    </div>
  );
}
