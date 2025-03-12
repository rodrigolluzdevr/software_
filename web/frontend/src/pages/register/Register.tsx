import { useState } from "react";

export default function Register() {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cep, setCep] = useState('');
  const [numberAdress, setNumberAdress] = useState('');
  const [organizationId, setOrganizationId] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, cpf, password, role, email, address, cep, numberAdress, organizationId }),
      });

      if (!response.ok) {
        throw new Error('Registro falhou, tente novamente');
      }

      alert('Registro bem-sucedido!');
      // Redirecionar para a página de login ou outra página
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" required />
      <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="CPF" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
      <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Cargo" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Endereço" required />
      <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="CEP" required />
      <input type="text" value={numberAdress} onChange={(e) => setNumberAdress(e.target.value)} placeholder="Número" required />
      <input type="number" value={organizationId} onChange={(e) => setOrganizationId(parseInt(e.target.value))} placeholder="ID da Organização" required />
      <button type="submit">Registrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
