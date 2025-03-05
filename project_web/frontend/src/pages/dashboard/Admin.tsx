import withAuth from "../../components/withAuth";

function Admin() {
  return (
    <div>
      <h1>Painel de Administração</h1>
      <p>Bem-vindo, Admin!</p>
    </div>
  );
}

export default withAuth(Admin, ["ADMIN"]);